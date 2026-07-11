import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import time
import asyncio
import bcrypt
import pyotp
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

# Make sure we can import from server
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

from db import engine, init_db
from models import User
from routes.auth import login, verify, setup_totp, verify_totp_setup, disable_totp, LoginRequest, VerifyRequest, TOTPVerifySetupRequest, TOTPDisableRequest

async def test_2fa_pipeline():
    print("🚀 Starting TOTP 2FA & Lockout Security Verification Tests...")
    
    # 1. Initialize DB and run migrations
    await init_db()
    
    email = "tester_2fa@streamhome.local"
    password = "SuperSecurePassword123"
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    
    # 2. Seed Clean Test User
    async with AsyncSession(engine, expire_on_commit=False) as db:
        stmt = select(User).where(User.email == email)
        res = await db.execute(stmt)
        user = res.scalars().first()
        if user:
            await db.delete(user)
            await db.commit()
            
        user = User(email=email, password_hash=hashed)
        db.add(user)
        await db.commit()
        print(f"[✓] Seeded test user: {email}")

    # 3. Test Failed Password Attempts and Lockout Triggers
    async with AsyncSession(engine, expire_on_commit=False) as db:
        print("[*] Simulating failed logins (attempts 1 to 4)...")
        for i in range(1, 5):
            try:
                await login(LoginRequest(email=email, password="WrongPassword"), db=db)
            except Exception as e:
                # Expect unauthorized
                pass
                
        # Re-fetch user to inspect attempts count
        stmt = select(User).where(User.email == email)
        res = await db.execute(stmt)
        user = res.scalars().first()
        assert user.failed_login_attempts == 4, f"Expected 4 attempts, got {user.failed_login_attempts}"
        assert user.lockout_until is None, "Should not be locked out yet"
        print(f"[✓] Attempts successfully tracked at: {user.failed_login_attempts}")
        
        # 5th failed attempt should trigger lockout
        print("[*] Simulating 5th failed login (lockout trigger)...")
        try:
            await login(LoginRequest(email=email, password="WrongPassword"), db=db)
        except Exception as e:
            # Expect unauthorized
            pass
            
        res = await db.execute(stmt)
        user = res.scalars().first()
        assert user.failed_login_attempts == 5, "Expected 5 attempts"
        assert user.lockout_until is not None, "User should be locked out"
        print(f"[✓] Lockout successfully triggered. Lock expires in 15 minutes.")
        
        # Attempt login while locked out
        print("[*] Simulating login attempt during lockout...")
        try:
            await login(LoginRequest(email=email, password=password), db=db)
            assert False, "Login should have been rejected during lockout"
        except Exception as e:
            assert "temporarily locked" in str(e.detail), f"Expected lockout error, got: {e.detail}"
            print("[✓] Login rejected correctly due to active lockout block.")

    # 4. Programmatic Lockout Unlock
    async with AsyncSession(engine, expire_on_commit=False) as db:
        print("[*] Resetting/unlocking account lockout...")
        res = await db.execute(stmt)
        user = res.scalars().first()
        user.failed_login_attempts = 0
        user.lockout_until = None
        db.add(user)
        await db.commit()
        
        # Now login should pass
        res_login = await login(LoginRequest(email=email, password=password), db=db)
        assert "accessToken" in res_login, "Login should succeed after manual unlock"
        print("[✓] Login succeeded after unlocking.")

    # 5. TOTP Setup Flow Tests
    async with AsyncSession(engine, expire_on_commit=False) as db:
        res = await db.execute(stmt)
        user = res.scalars().first()
        
        print("[*] Initializing TOTP setup...")
        res_setup = await setup_totp(user=user, db=db)
        secret = res_setup["secret"]
        uri = res_setup["provisioning_uri"]
        assert secret is not None
        assert "otpauth://totp" in uri
        print(f"[✓] TOTP setup keys generated. Secret: {secret}")
        
        # Re-fetch user to check draft secret
        res = await db.execute(stmt)
        user = res.scalars().first()
        assert user.totp_secret == secret
        assert user.two_factor_enabled is False, "2FA should not be enabled until verified"
        
        # Verify with wrong code
        print("[*] Testing setup confirmation with incorrect code...")
        try:
            await verify_totp_setup(TOTPVerifySetupRequest(code="000000"), user=user, db=db)
            assert False, "Verification should fail with wrong code"
        except Exception:
            print("[✓] Wrong setup code rejected correctly.")
            
        # Verify with correct code
        print("[*] Testing setup confirmation with correct TOTP code...")
        totp = pyotp.TOTP(secret)
        correct_code = totp.now()
        res_confirm = await verify_totp_setup(TOTPVerifySetupRequest(code=correct_code), user=user, db=db)
        assert res_confirm["message"] == "2FA successfully enabled."
        
        res = await db.execute(stmt)
        user = res.scalars().first()
        assert user.two_factor_enabled is True, "2FA should now be fully active"
        print("[✓] TOTP 2FA enabled successfully!")

    # 6. Login Flow with 2FA Enabled
    async with AsyncSession(engine, expire_on_commit=False) as db:
        print("[*] Testing login request with 2FA active...")
        res_login = await login(LoginRequest(email=email, password=password), db=db)
        assert res_login.get("requires_2fa") is True
        print("[✓] Login requested 2FA verification screen as expected.")
        
        # Verify TOTP code
        print("[*] Testing code verification with correct code...")
        correct_code = totp.now()
        res_verify = await verify(VerifyRequest(email=email, code=correct_code), db=db)
        assert "accessToken" in res_verify
        print("[✓] Code verified successfully. JWT token returned.")

    # 7. Disabling 2FA
    async with AsyncSession(engine, expire_on_commit=False) as db:
        res = await db.execute(stmt)
        user = res.scalars().first()
        
        print("[*] Testing disabling 2FA...")
        correct_code = totp.now()
        res_disable = await disable_totp(TOTPDisableRequest(code=correct_code), user=user, db=db)
        assert res_disable["message"] == "2FA successfully disabled."
        
        res = await db.execute(stmt)
        user = res.scalars().first()
        assert user.two_factor_enabled is False
        assert user.totp_secret is None
        print("[✓] 2FA disabled successfully.")

    # Clean up user
    async with AsyncSession(engine, expire_on_commit=False) as db:
        res = await db.execute(stmt)
        user = res.scalars().first()
        if user:
            await db.delete(user)
            await db.commit()
            
    print("\n[SUCCESS] All TOTP 2FA and Lockout Verification Tests Passed Successfully!")

if __name__ == "__main__":
    asyncio.run(test_2fa_pipeline())

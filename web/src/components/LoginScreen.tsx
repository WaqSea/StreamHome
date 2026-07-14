import React, { useState, useEffect, useRef } from "react";
import { Shield, Lock, Mail, AlertTriangle } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (token: string, email: string) => void;
  apiBaseUrl: string;
}

export default function LoginScreen({ onLoginSuccess, apiBaseUrl }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [requires2fa, setRequires2fa] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // For passcode digit blocks
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.requires_2fa) {
          setRequires2fa(true);
          setOtpDigits(["", "", "", "", "", ""]);
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
        } else {
          onLoginSuccess(data.accessToken, data.email);
        }
      } else {
        setErrorMsg(data.detail || "Authentication failed");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to backend");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (code: string) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${apiBaseUrl}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data.accessToken, data.email);
      } else {
        setErrorMsg(data.detail || "Invalid code");
        // Reset code on failure
        setOtpDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setErrorMsg("Network error connecting to backend");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    const numeric = val.replace(/\D/g, "");
    if (!numeric) return;

    const newDigits = [...otpDigits];
    newDigits[index] = numeric.slice(-1);
    setOtpDigits(newDigits);

    // Focus next
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else {
      // Trigger verify
      const fullCode = newDigits.join("");
      if (fullCode.length === 6) {
        handleOtpSubmit(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newDigits = [...otpDigits];
      if (otpDigits[index]) {
        newDigits[index] = "";
        setOtpDigits(newDigits);
      } else if (index > 0) {
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Immersive background decoration */}
      <div className="absolute inset-0 bg-radial-gradient from-red-600/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-red-600/10 border border-red-500/20 text-[#E50914] rounded-full mb-2">
            {requires2fa ? <Shield className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-white font-title">
            {requires2fa ? "Verification Code" : "Account Sign In"}
          </h2>
          <p className="text-zinc-500 text-xs">
            {requires2fa
              ? "Enter the 6-digit code from your authenticator app."
              : "Access the StreamHome self-hosted media server console."}
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start space-x-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-left font-medium leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {!requires2fa ? (
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@streamhome.local"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E50914] focus:outline-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#E50914] focus:outline-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E50914] hover:bg-[#C10712] disabled:bg-zinc-800 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-wider transition duration-200 cursor-pointer mt-4 flex items-center justify-center space-x-2"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center space-x-2 font-mono">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={isLoading}
                  className="w-12 h-14 bg-zinc-900 border border-zinc-800 focus:border-[#E50914] focus:outline-none rounded-lg text-center text-xl font-bold text-white transition"
                />
              ))}
            </div>

            <div className="flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => setRequires2fa(false)}
                className="text-zinc-500 hover:text-zinc-300 transition cursor-pointer font-bold uppercase tracking-wider text-[10px]"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

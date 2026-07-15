import { apiGet, apiPost } from "./client";
import type { 
  LoginRequest, 
  AuthResponse, 
  VerifyRequest, 
  LoginResponse, 
  TwoFAStatusResponse, 
  TwoFASetupResponse 
} from "../types/api";

export const login = (data: LoginRequest) => apiPost<AuthResponse>("/api/auth/login", data);
export const verify2FA = (data: VerifyRequest) => apiPost<LoginResponse>("/api/auth/verify", data);
export const get2FAStatus = () => apiGet<TwoFAStatusResponse>("/api/auth/2fa/status");
export const setup2FA = () => apiPost<TwoFASetupResponse>("/api/auth/2fa/setup");
export const verifySetup2FA = (code: string) => apiPost<{ message: string }>("/api/auth/2fa/verify-setup", { code });
export const disable2FA = (code: string) => apiPost<{ message: string }>("/api/auth/2fa/disable", { code });

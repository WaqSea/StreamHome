import { apiGet, apiPost, apiDelete } from "./client";
import type { Profile, CreateProfileRequest, SaveProfileRequest } from "../types/api";

export const getProfiles = () => apiGet<Profile[]>("/api/profiles");
export const createProfile = (data: CreateProfileRequest) => apiPost<Profile>("/api/profiles", data);
export const saveProfile = (data: SaveProfileRequest) => apiPost<Profile>("/api/profiles", data);
export const deleteProfile = (id: string) => apiDelete<{ status: string }>(`/api/profiles/${encodeURIComponent(id)}`);

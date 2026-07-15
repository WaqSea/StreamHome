import { apiGet, apiPost } from "./client";
import type { UpdateStatus } from "../types/api";

export const getUpdateStatus = () => apiGet<UpdateStatus>("/api/update/status");
export const triggerUpdate = () => apiPost<{ status: string; message: string }>("/api/update/trigger");

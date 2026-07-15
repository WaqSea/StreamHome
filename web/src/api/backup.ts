import { apiGet, apiPost, apiDelete } from "./client";
import type { BackupEntry } from "../types/api";

export const runBackup = () => apiPost<{ status: string; message: string; backupFile: string; cloudSynced: boolean }>("/api/backup/run");
export const listBackups = () => apiGet<BackupEntry[]>("/api/backup/list");
export const restoreBackup = (filename: string) => apiPost<{ status: string; message: string }>(`/api/backup/restore/${encodeURIComponent(filename)}`);
export const deleteBackup = (filename: string) => apiDelete<{ status: string; message: string }>(`/api/backup/${encodeURIComponent(filename)}`);

import { apiPost } from "./client";

export interface TelemetryEventPayload {
  event_type: string;
  movie_id?: string;
  tmdb_id?: number;
  metadata_json?: Record<string, unknown>;
}

export async function sendTelemetryEvent(profileId: string, payload: TelemetryEventPayload): Promise<void> {
  await apiPost(`/api/telemetry?profile_id=${profileId}`, payload);
}

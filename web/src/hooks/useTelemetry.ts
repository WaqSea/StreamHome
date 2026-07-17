import { useCallback } from "react";
import { sendTelemetryEvent, TelemetryEventPayload } from "../api/telemetry";
import { useAuthStore } from "../stores/authStore";

export function useTelemetry() {
  const profileId = useAuthStore((state: any) => state.activeProfileId);

  const trackEvent = useCallback(
    (payload: TelemetryEventPayload) => {
      if (!profileId) return;
      // Fire and forget
      sendTelemetryEvent(profileId, payload).catch((err) => {
        console.error("Failed to send telemetry event:", err);
      });
    },
    [profileId]
  );

  return { trackEvent };
}

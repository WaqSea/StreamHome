import { useCallback } from "react";
import { sendTelemetryEvent, TelemetryEventPayload } from "../api/telemetry";
import { useProfileStore } from "../stores/profileStore";

export function useTelemetry() {
  const profileId = useProfileStore((state) => state.activeProfile?.id);

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

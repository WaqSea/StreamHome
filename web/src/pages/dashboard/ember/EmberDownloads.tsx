import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../../stores/authStore";
import type { DownloadEvent } from "../../../types/api";
import { downloadFraction } from "../../../utils/media";
import { ProgressBar } from "../../../components/ui/ProgressBar";

export function EmberDownloads() {
  const token = useAuthStore((state) => state.token);
  const [downloads, setDownloads] = useState<DownloadEvent[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;
    const source = new EventSource(`/api/downloads/stream?token=${encodeURIComponent(token)}`);
    source.onopen = () => setConnected(true);
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as DownloadEvent[] | DownloadEvent;
        setDownloads(Array.isArray(data) ? data : [data]);
      } catch { setConnected(false); }
    };
    source.onerror = () => setConnected(false);
    return () => source.close();
  }, [token]);

  return <section className="ember-downloads"><header className="ember-page-heading"><div><p>SERVER QUEUE / LIVE</p><h1>Server downloads</h1><small>Live ingestion progress reported by the server.</small></div><span data-connected={connected}>{connected ? "Connected" : "Reconnecting"}</span></header>{downloads.length ? <div className="ember-downloads__list">{downloads.map((download) => <article key={download.id}><header><div><small>{download.status}</small><h2>{download.title}</h2></div><strong>{Math.round(download.progress)}%</strong></header><p>{download.speed} · ETA {download.eta}</p><ProgressBar progress={downloadFraction(download.progress)} /></article>)}</div> : <div className="ember-state-panel ember-downloads__empty"><p>{connected ? "QUEUE IDLE" : "QUEUE LINK"}</p><h2>{connected ? "No download activity" : "Reconnecting to the server"}</h2><span>{connected ? "The server has not reported an active ingestion task." : "Waiting for the authenticated download event stream."}</span></div>}</section>;
}

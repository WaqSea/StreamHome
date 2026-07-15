export function formatDuration(seconds: number | string): string {
  if (typeof seconds === "string") return seconds;
  if (isNaN(seconds) || seconds < 0) return "0:00";
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;

  if (secondsPast < 60) {
    return 'just now';
  }
  if (secondsPast < 3600) {
    const m = Math.floor(secondsPast / 60);
    return `${m} minute${m === 1 ? '' : 's'} ago`;
  }
  if (secondsPast < 86400) {
    const h = Math.floor(secondsPast / 3600);
    return `${h} hour${h === 1 ? '' : 's'} ago`;
  }
  if (secondsPast < 2592000) {
    const d = Math.floor(secondsPast / 86400);
    return `${d} day${d === 1 ? '' : 's'} ago`;
  }
  if (secondsPast < 31536000) {
    const m = Math.floor(secondsPast / 2592000);
    return `${m} month${m === 1 ? '' : 's'} ago`;
  }
  const y = Math.floor(secondsPast / 31536000);
  return `${y} year${y === 1 ? '' : 's'} ago`;
}

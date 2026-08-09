export function fallbackImg(): string {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDQiIGhlaWdodD0iNDQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRleHQgeT0iMzIiIGZvbnQtc2l6ZT0iMzIiPvCfjooiPC90ZXh0Pjwvc3ZnPg==";
}

export function sanitizeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return fallbackImg();
  const trimmed = url.trim();
  // Check if it's a valid http, https, or data URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
    // Watch out for typos like hhttth
    if (trimmed.startsWith('http://http') || trimmed.startsWith('https://http') || trimmed.includes('hhttth')) {
      return fallbackImg();
    }
    return trimmed;
  }
  return fallbackImg();
}

export function ago(ts: any): string {
  if (!ts) return "just now";
  let dateObj: Date;
  if (typeof ts === 'number') {
    dateObj = new Date(ts);
  } else if (ts && typeof ts.toDate === 'function') {
    dateObj = ts.toDate();
  } else if (ts && ts.seconds) {
    dateObj = new Date(ts.seconds * 1000);
  } else {
    dateObj = new Date(ts);
  }

  const s = Math.floor((Date.now() - dateObj.getTime()) / 1000);
  if (isNaN(s) || s < 0 || s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function rc(rarity?: string): string {
  return (rarity || "common").toLowerCase();
}

export const ADMIN_EMAILS = [
  "jakelordclash@gmail.com",
  "calvinthomasvinosh@gmail.com"
];

export function checkIsAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

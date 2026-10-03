export interface GuestTracking {
  id: string;
  name: string;
  slug: string;
  url: string;
  opened: boolean;
  openCount: number;
  lastOpenedAt?: string;
  createdAt: string;
}

export interface TrackingData {
  generalViews: number;
  guests: GuestTracking[];
}

const LOCAL_STORAGE_TRACKING_KEY = 'wedding_guest_tracking_hieuthuy_v5';
const PRIMARY_NETLIFY_FUNCTION = '/.netlify/functions/tracking';
const BACKUP_CLOUD_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0ffa97d3b675b';

const INITIAL_TRACKING_DATA: TrackingData = {
  generalViews: 0,
  guests: []
};

// Converts Vietnamese string to url-friendly slug (e.g. "Bạn Linh" -> "BanLinh")
export const slugifyGuestName = (name: string): string => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim();
};

export const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  let cleanPath = pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
  return origin + cleanPath;
};

export const generateGuestLinks = (guestName: string) => {
  const baseUrl = getBaseUrl();
  const trimmed = guestName.trim();
  const slug = slugifyGuestName(trimmed) || 'KhachMoi';
  const encodedName = encodeURIComponent(trimmed);

  return {
    slug,
    prettyUrl: `${baseUrl}/${slug}`,
    queryUrl: `${baseUrl}?to=${encodedName}`,
    slugQueryUrl: `${baseUrl}?to=${slug}`
  };
};

// Synchronously parses URL on initial load to avoid flash of Admin page on guest links
const IGNORED_ROUTE_SEGMENTS = [
  'thewedding_hieuthuy',
  'thewedding-hieuthuy',
  'thiepcuoi_hieuthuy',
  'thiepcuoi-hieuthuy',
  'index.html',
  '404.html',
  'assets',
  'images',
  'audio',
  'api',
  'favicon.ico',
  'src',
  '.netlify',
  'admin',
  'gh-pages'
];

export const parseGuestFromUrlSynchronous = (fallbackName?: string): {
  guestName: string;
  isPersonalizedLink: boolean;
} => {
  if (typeof window === 'undefined') {
    return { guestName: fallbackName || '', isPersonalizedLink: !!fallbackName };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const queryGuest = searchParams.get('to') || searchParams.get('guest') || searchParams.get('name') || searchParams.get('u');

  const pathname = window.location.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const potentialPathGuest = pathSegments.find(
    seg => !IGNORED_ROUTE_SEGMENTS.includes(seg.toLowerCase()) && !seg.includes('.')
  );

  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  const potentialHashGuest = hash && !IGNORED_ROUTE_SEGMENTS.includes(hash.toLowerCase()) ? hash : '';

  const rawCandidate = queryGuest || potentialPathGuest || potentialHashGuest;

  if (!rawCandidate) {
    return { guestName: fallbackName || '', isPersonalizedLink: !!fallbackName };
  }

  const decodedCandidate = decodeURIComponent(rawCandidate).trim();
  let formattedName = decodedCandidate;

  if (formattedName.includes('-') || formattedName.includes('_')) {
    formattedName = formattedName.replace(/[-_]/g, ' ');
  } else if (/^[A-Z][a-z]+([A-Z][a-z]+)+$/.test(formattedName)) {
    formattedName = formattedName.replace(/([A-Z])/g, ' $1').trim();
  }

  return {
    guestName: formattedName,
    isPersonalizedLink: true
  };
};

// Merges local and cloud tracking data seamlessly so no guests or stats are lost
export const mergeTrackingData = (local: TrackingData, cloud: TrackingData): TrackingData => {
  const mergedViews = Math.max(local.generalViews || 0, cloud.generalViews || 0);
  const guestMap = new Map<string, GuestTracking>();

  (cloud.guests || []).forEach(g => {
    if (g && g.id) {
      guestMap.set(g.id, { ...g });
    }
  });

  (local.guests || []).forEach(g => {
    if (g && g.id) {
      const existing = guestMap.get(g.id);
      if (!existing) {
        guestMap.set(g.id, { ...g });
      } else {
        guestMap.set(g.id, {
          ...existing,
          ...g,
          opened: existing.opened || g.opened,
          openCount: Math.max(existing.openCount || 0, g.openCount || 0),
          lastOpenedAt: g.lastOpenedAt || existing.lastOpenedAt
        });
      }
    }
  });

  return {
    generalViews: mergedViews,
    guests: Array.from(guestMap.values())
  };
};

// Read local storage data
const getLocalData = (): TrackingData => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_TRACKING_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.generalViews === 'number' && Array.isArray(parsed.guests)) {
        return parsed;
      }
    }
  } catch (e) {
    /* ignore */
  }
  return INITIAL_TRACKING_DATA;
};

// Fetch current tracking data from Netlify Function, Backup Cloud API, or LocalStorage
export const getTrackingData = async (): Promise<TrackingData> => {
  const localData = getLocalData();
  let cloudData: TrackingData | null = null;

  // 1. Try Netlify Function
  try {
    const res = await fetch(PRIMARY_NETLIFY_FUNCTION);
    if (res.ok) {
      const json = await res.json();
      if (json && typeof json.generalViews === 'number' && Array.isArray(json.guests)) {
        cloudData = json;
      }
    }
  } catch (e) {
    /* ignore */
  }

  // 2. Try Backup Cloud DB
  if (!cloudData) {
    try {
      const res = await fetch(BACKUP_CLOUD_URL);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && typeof json.data.generalViews === 'number' && Array.isArray(json.data.guests)) {
          cloudData = json.data;
        }
      }
    } catch (e) {
      /* ignore */
    }
  }

  // 3. Merge local + cloud data
  if (cloudData) {
    const merged = mergeTrackingData(localData, cloudData);
    try {
      localStorage.setItem(LOCAL_STORAGE_TRACKING_KEY, JSON.stringify(merged));
    } catch (e) {
      /* ignore */
    }
    return merged;
  }

  return localData;
};

// Save tracking data to LocalStorage, Netlify Function, & Backup Cloud DB
export const saveTrackingData = async (data: TrackingData): Promise<void> => {
  try {
    localStorage.setItem(LOCAL_STORAGE_TRACKING_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tracking_data_updated', { detail: data }));
  }

  try {
    await fetch(PRIMARY_NETLIFY_FUNCTION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (e) {
    /* fallback */
  }

  try {
    await fetch(BACKUP_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'wedding_hieuthuy_tracking_v1',
        data: data
      })
    });
  } catch (e) {
    /* fallback */
  }
};

// Parses URL to determine if visitor opened via a guest invitation link
export const parseGuestFromUrl = (guestsList: GuestTracking[] = []): {
  guestName: string;
  isPersonalizedLink: boolean;
  matchedGuestId?: string;
  matchedGuestSlug?: string;
} => {
  if (typeof window === 'undefined') {
    return { guestName: '', isPersonalizedLink: false };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const queryGuest = searchParams.get('to') || searchParams.get('guest') || searchParams.get('name') || searchParams.get('u');

  const pathname = window.location.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);
  
  const potentialPathGuest = pathSegments.find(
    seg => !IGNORED_ROUTE_SEGMENTS.includes(seg.toLowerCase()) && !seg.includes('.')
  );

  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  const potentialHashGuest = hash && !IGNORED_ROUTE_SEGMENTS.includes(hash.toLowerCase()) ? hash : '';

  const rawCandidate = queryGuest || potentialPathGuest || potentialHashGuest;

  if (!rawCandidate) {
    return { guestName: '', isPersonalizedLink: false };
  }

  const decodedCandidate = decodeURIComponent(rawCandidate).trim();
  const normalizedCandidate = slugifyGuestName(decodedCandidate).toLowerCase();

  // Try matching with existing guests list
  const foundGuest = (guestsList || []).find(g => 
    g.id === rawCandidate ||
    g.slug.toLowerCase() === normalizedCandidate ||
    g.name.toLowerCase() === decodedCandidate.toLowerCase() ||
    slugifyGuestName(g.name).toLowerCase() === normalizedCandidate
  );

  if (foundGuest) {
    return {
      guestName: foundGuest.name,
      isPersonalizedLink: true,
      matchedGuestId: foundGuest.id,
      matchedGuestSlug: foundGuest.slug
    };
  }

  let formattedName = decodedCandidate;
  if (formattedName.includes('-') || formattedName.includes('_')) {
    formattedName = formattedName.replace(/[-_]/g, ' ');
  } else if (/^[A-Z][a-z]+([A-Z][a-z]+)+$/.test(formattedName)) {
    formattedName = formattedName.replace(/([A-Z])/g, ' $1').trim();
  }

  return {
    guestName: formattedName,
    isPersonalizedLink: true,
    matchedGuestSlug: normalizedCandidate
  };
};

export const recordVisitorSession = async (
  currentGuests: GuestTracking[],
  isPersonalized: boolean,
  matchedGuestId?: string,
  guestNameFromUrl?: string
): Promise<TrackingData> => {
  const data = await getTrackingData();

  const nowStr = new Date().toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (isPersonalized) {
    let targetGuestIndex = -1;

    if (matchedGuestId) {
      targetGuestIndex = data.guests.findIndex(g => g.id === matchedGuestId);
    } else if (guestNameFromUrl) {
      const slugCandidate = slugifyGuestName(guestNameFromUrl).toLowerCase();
      targetGuestIndex = data.guests.findIndex(
        g => g.slug.toLowerCase() === slugCandidate || g.name.toLowerCase() === guestNameFromUrl.toLowerCase()
      );
    }

    if (targetGuestIndex !== -1) {
      data.guests[targetGuestIndex].opened = true;
      data.guests[targetGuestIndex].openCount = (data.guests[targetGuestIndex].openCount || 0) + 1;
      data.guests[targetGuestIndex].lastOpenedAt = nowStr;
    } else if (guestNameFromUrl) {
      const links = generateGuestLinks(guestNameFromUrl);
      const newGuest: GuestTracking = {
        id: 'guest-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: guestNameFromUrl.trim(),
        slug: links.slug,
        url: links.queryUrl,
        opened: true,
        openCount: 1,
        lastOpenedAt: nowStr,
        createdAt: nowStr
      };
      data.guests.unshift(newGuest);
    }
  } else {
    data.generalViews = (data.generalViews || 0) + 1;
  }

  await saveTrackingData(data);
  return data;
};

export const addInvitedGuest = async (guestName: string): Promise<{ data: TrackingData; newGuest: GuestTracking }> => {
  const data = await getTrackingData();
  const trimmedName = guestName.trim();
  const links = generateGuestLinks(trimmedName);

  const nowStr = new Date().toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const existing = data.guests.find(
    g => g.slug.toLowerCase() === links.slug.toLowerCase() || g.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (existing) {
    return { data, newGuest: existing };
  }

  const newGuest: GuestTracking = {
    id: 'guest-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: trimmedName,
    slug: links.slug,
    url: links.queryUrl,
    opened: false,
    openCount: 0,
    createdAt: nowStr
  };

  data.guests.unshift(newGuest);
  await saveTrackingData(data);
  return { data, newGuest };
};

export const deleteInvitedGuest = async (guestId: string): Promise<TrackingData> => {
  const data = await getTrackingData();
  data.guests = data.guests.filter(g => g.id !== guestId);
  await saveTrackingData(data);
  return data;
};

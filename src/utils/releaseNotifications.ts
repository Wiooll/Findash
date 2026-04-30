const LAST_SEEN_VERSION_KEY = 'findash:lastSeenVersion';

export const getLastSeenVersion = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(LAST_SEEN_VERSION_KEY);
};

export const setLastSeenVersion = (version: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LAST_SEEN_VERSION_KEY, version);
};

export const hasUnseenRelease = (currentVersion: string, lastSeenVersion: string | null) =>
  lastSeenVersion !== currentVersion;

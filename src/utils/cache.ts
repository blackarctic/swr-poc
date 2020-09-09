import { cache as swrCache } from "swr";
import { memoize } from "lodash";

export const calcCacheKey = memoize((key: string) => {
  if (!key.startsWith("CACHE ")) {
    return `CACHE ${swrCache.serializeKey(key)[0]}`;
  }
  return key;
});

export const persistInCache = (key: string | null, value: any) => {
  if (!key) {
    return null;
  }
  const cacheKey = calcCacheKey(key);
  localStorage.setItem(cacheKey, JSON.stringify(value));
};

export const retrieveFromCache = (key: string | null) => {
  if (!key) {
    return null;
  }
  const cacheKey = calcCacheKey(key);
  const rawResult = localStorage.getItem(cacheKey);
  if (rawResult) {
    return JSON.parse(rawResult);
  } else {
    return null;
  }
};

export const retrieveFromCacheMemoized = memoize(retrieveFromCache);

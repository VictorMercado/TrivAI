import { useState } from "react";

const useLRUCachedFetch = (maxSize: number) => {
  const [cache, setCache] = useState(new Map());

  return async (url: string) => {
    const cached = cache.get(url);
    console.log(cached);
    console.log(cache.size);

    if (cached) {
      return cached;
    }
    const res = await fetch(url);
    const data = await res.json();

    cache.set(url, data);
    if (cache.size >= maxSize) {
      cache.delete(cache.keys().next().value);
    }
    return data;
  };
};

export { useLRUCachedFetch };
import { useState, useEffect } from 'react';

const useQueryParams = (): { [key: string]: string; } => {
  const [queryParams, setQueryParams] = useState<{ [key: string]: string; }>({});

  useEffect(() => {
    // Function to parse search params from URL
    const parseQueryParams = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const params: { [key: string]: string; } = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    };

    // Update query parameters on mount
    setQueryParams(parseQueryParams());

    // Function to handle URL changes and update query parameters
    const handlePopState = () => {
      setQueryParams(parseQueryParams());
    };

    window.addEventListener('popstate', handlePopState);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Run effect only once on mount

  return queryParams;
};

export { useQueryParams };
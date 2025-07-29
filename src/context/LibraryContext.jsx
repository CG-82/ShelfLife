import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const LibraryContext = createContext();
export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem('myLibrary');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse library from localStorage:', e);
      return [];
    }
  });

  const [summaries, setSummaries] = useState({});
  const [summaryLoading, setSummaryLoading] = useState({});
  const [openSummaries, setOpenSummaries] = useState({});

  useEffect(() => {
    localStorage.setItem('myLibrary', JSON.stringify(library));
  }, [library]);

  const fetchSummary = useCallback(async (workKey) => {
    setSummaryLoading(prev => ({ ...prev, [workKey]: true }));
    try {
      const response = await fetch(`https://openlibrary.org/works/${workKey}.json`);
      const data = await response.json();
      const summaryText =
        typeof data.description === 'string'
          ? data.description
          : data.description?.value || 'No summary available.';

      setSummaries(prev => ({ ...prev, [workKey]: summaryText }));
    } catch {
      setSummaries(prev => ({ ...prev, [workKey]: 'Failed to load summary.' }));
    } finally {
      setSummaryLoading(prev => ({ ...prev, [workKey]: false }));
    }
  }, []);

  const addToLibrary = useCallback((book) => {
    setLibrary(prev => {
      const exists = prev.some(b => b.key === book.key);
      if (!exists) {
        // Fetch summary as soon as book is added
        fetchSummary(book.workKey);
        return [...prev, book];
      }
      return prev;
    });
  }, [fetchSummary]);

  const removeFromLibrary = useCallback((key) => {
    setLibrary(prev => prev.filter(book => book.key !== key));
    setOpenSummaries(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, []);

  const toggleSummary = useCallback((workKey) => {
    setOpenSummaries(prev => {
      const isOpen = !!prev[workKey];
      // If opening and no summary exists, fetch it
      if (!isOpen && !summaries[workKey]) {
        fetchSummary(workKey);
      }
      return { ...prev, [workKey]: !isOpen };
    });
  }, [summaries, fetchSummary]);

  const value = useMemo(() => ({
    library,
    addToLibrary,
    removeFromLibrary,
    summaries,
    summaryLoading,
    openSummaries,
    toggleSummary
  }), [library, summaries, summaryLoading, openSummaries, addToLibrary, removeFromLibrary, toggleSummary]);

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

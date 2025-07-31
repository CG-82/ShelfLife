import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const LibraryContext = createContext();
export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  // Library books with status and rating
  const [library, setLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem('myLibrary');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse library from localStorage:', e);
      return [];
    }
  });

  //  Persist summaries and UI state
  const [summaries, setSummaries] = useState(() => {
    try {
      const saved = localStorage.getItem('librarySummaries');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [summaryLoading, setSummaryLoading] = useState({});
  const [openSummaries, setOpenSummaries] = useState(() => {
    try {
      const saved = localStorage.getItem('libraryOpenSummaries');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('myLibrary', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('librarySummaries', JSON.stringify(summaries));
  }, [summaries]);

  useEffect(() => {
    localStorage.setItem('libraryOpenSummaries', JSON.stringify(openSummaries));
  }, [openSummaries]);

  // Fetch summary if not loaded
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

  // Add book to library with default status and rating
  const addToLibrary = useCallback((book) => {
    setLibrary(prev => {
      const exists = prev.some(b => b.key === book.key);
      if (!exists) {
        const newBook = { ...book, status: 'owned', rating: 0 };
        if (!summaries[book.workKey]) fetchSummary(book.workKey);
        return [...prev, newBook];
      }
      return prev;
    });
  }, [summaries, fetchSummary]);

  // Remove a book and cleanup its summary and open state
  const removeFromLibrary = useCallback((key) => {
    const removedBook = library.find(book => book.key === key);
    setLibrary(prev => prev.filter(book => book.key !== key));

    if (removedBook) {
      const workKey = removedBook.workKey;

      // Remove its summary and open state from memory
      setSummaries(prev => {
        const updated = { ...prev };
        delete updated[workKey];
        return updated;
      });

      setOpenSummaries(prev => {
        const updated = { ...prev };
        delete updated[workKey];
        return updated;
      });

      setSummaryLoading(prev => {
        const updated = { ...prev };
        delete updated[workKey];
        return updated;
      });

      // Update localStorage cleanup
      setTimeout(() => {
        localStorage.setItem('librarySummaries', JSON.stringify(summaries));
        localStorage.setItem('libraryOpenSummaries', JSON.stringify(openSummaries));
      }, 0);
    }
  }, [library, summaries, openSummaries]);

  // Toggle summary display
  const toggleSummary = useCallback((workKey) => {
    setOpenSummaries(prev => {
      const isOpen = !!prev[workKey];
      // Fetch if opening and not loaded yet
      if (!isOpen && !summaries[workKey]) {
        fetchSummary(workKey);
      }
      return { ...prev, [workKey]: !isOpen };
    });
  }, [summaries, fetchSummary]);

  //  Update book status
  const updateBookStatus = useCallback((key, newStatus) => {
    setLibrary(prev => prev.map(book =>
      book.key === key ? { ...book, status: newStatus } : book
    ));
  }, []);

  //  Update book rating (1–5)
  const updateBookRating = useCallback((key, newRating) => {
    setLibrary(prev => prev.map(book =>
      book.key === key ? { ...book, rating: newRating } : book
    ));
  }, []);

  const value = useMemo(() => ({
    library,
    addToLibrary,
    removeFromLibrary,
    updateBookStatus,
    updateBookRating,
    summaries,
    summaryLoading,
    openSummaries,
    toggleSummary
  }), [
    library, summaries, summaryLoading, openSummaries,
    addToLibrary, removeFromLibrary,
    updateBookStatus, updateBookRating,
    toggleSummary
  ]);

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

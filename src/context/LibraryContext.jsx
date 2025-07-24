import { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the library
const LibraryContext = createContext();

// Custom hook to use the LibraryContext
export const useLibrary = () => useContext(LibraryContext);

// Provider component to wrap around parts of the app that need access to the library
export const LibraryProvider = ({ children }) => {
  // Initialize library state from localStorage, or as an empty array if not present
  const [library, setLibrary] = useState(() => {
    const saved = localStorage.getItem('myLibrary');
    return saved ? JSON.parse(saved) : [];
  });

  // Whenever the library changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem('myLibrary', JSON.stringify(library));
  }, [library]);

  // Add a book to the library if it doesn't already exist
  const addToLibrary = (book) => {
    setLibrary(prev => {
      const exists = prev.some(b => b.key === book.key);
      return exists ? prev : [...prev, book];
    });
  };

  // Remove a book from the library by its key
  const removeFromLibrary = (key) => {
    setLibrary(prev => prev.filter(book => book.key !== key));
  };

  // Provide the library state and functions to children components
  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

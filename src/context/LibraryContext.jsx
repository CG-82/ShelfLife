import { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState(() => {
    const saved = localStorage.getItem('myLibrary');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('myLibrary', JSON.stringify(library));
  }, [library]);

  const addToLibrary = (book) => {
    setLibrary(prev => {
      const exists = prev.some(b => b.key === book.key);
      return exists ? prev : [...prev, book];
    });
  };

  const removeFromLibrary = (key) => {
    setLibrary(prev => prev.filter(book => book.key !== key));
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

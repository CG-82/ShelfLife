import React, { useState, useEffect } from 'react';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [library, setLibrary] = useState(() => {
    const saved = localStorage.getItem('myLibrary');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Persist library to localStorage
  useEffect(() => {
    localStorage.setItem('myLibrary', JSON.stringify(library));
  }, [library]);

  const searchBooks = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      const books = data.docs.slice(0, 10).map(book => ({
        key: book.key,
        title: book.title,
        author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
        coverId: book.cover_i,
      }));

      setResults(books);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError('Something went wrong while fetching books.');
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = (book) => {
    setLibrary(prev => {
      const alreadyAdded = prev.some(b => b.key === book.key);
      return alreadyAdded ? prev : [...prev, book];
    });
  };

  const getCoverURL = (coverId) => {
    return coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : 'https://via.placeholder.com/128x193.png?text=No+Cover';
  };

  return (
    <div>
      <h1>Book Search</h1>

      <input
        type="text"
        placeholder="Enter book title or author"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={searchBooks} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Results</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 && query ? (
        <p>No results found.</p>
      ) : (
        <div className="search-results">
          {results.map(book => (
            <div key={book.key} className="search-card">
              <img
                src={getCoverURL(book.coverId)}
                alt={`${book.title} cover`}
                width="128"
                height="193"
              />
              <strong>{book.title}</strong>
              <div>by {book.author}</div>
              <button onClick={() => addToLibrary(book)}>Add</button>
            </div>
          ))}
        </div>
      )}

      <h2>Your Library</h2>
      {library.length === 0 ? (
        <p>Your library is empty.</p>
      ) : (
        <ul>
          {library.map(book => (
            <li key={book.key}>
              <img
                src={getCoverURL(book.coverId)}
                alt={`${book.title} cover`}
                width="64"
                height="96"
                style={{ verticalAlign: 'middle', marginRight: '8px' }}
              />
              {book.title} by {book.author}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;

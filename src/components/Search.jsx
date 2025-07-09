import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { addToLibrary } = useLibrary();

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
        author: book.author_name?.join(', ') || 'Unknown Author',
        coverId: book.cover_i,
      }));

      setResults(books);
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const getCoverURL = (coverId) =>
    coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : 'https://via.placeholder.com/128x193.png?text=No+Cover';

  return (
    <div>
      <h1>Book Search</h1>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Enter book title or author"
      />
      <button onClick={searchBooks} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="search-results">
        {results.map(book => (
          <div key={book.key}>
            <img src={getCoverURL(book.coverId)} alt={book.title} />
            <div>{book.title}</div>
            <div>by {book.author}</div>
            <button onClick={() => addToLibrary(book)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;

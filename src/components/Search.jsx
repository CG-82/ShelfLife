import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searched, setSearched] = useState(false);

  const { addToLibrary } = useLibrary();

  const searchBooks = async (searchQuery = query, searchPage = page) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&page=${searchPage}`
      );
      const data = await response.json();

      const books = data.docs.slice(0, 10).map(book => ({
        key: book.key,
        title: book.title,
        author: book.author_name?.join(', ') || 'Unknown Author',
        coverId: book.cover_i,
      }));

      setResults(books);
      setTotalPages(Math.ceil(data.numFound / 100));
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

  const handleSearch = () => {
    setPage(1);
    searchBooks(query, 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    searchBooks(query, newPage);
  };

  return (
    <div>
      <h1>Book Search</h1>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Enter book title or author"
        onKeyDown={e => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="search-results">
        {searched && results.map(book => (
          <div className="search-card" key={book.key}>
            <img src={getCoverURL(book.coverId)} alt={book.title} />
            <div className='search-title'>{book.title}</div>
            <div className='search-author'>by {book.author}</div>
            <button className="add-library-btn" onClick={() => addToLibrary(book)}>Add</button>
          </div>
        ))}
      </div>

      {searched && results.length > 0 && (
        <div className="pagination-controls">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(Math.max(page - 1, 1))}
          >
            ◀ Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default Search;

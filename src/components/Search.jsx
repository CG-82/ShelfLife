import { useState, useCallback } from 'react';
import { useLibrary } from '../context/LibraryContext';

// Search component handles searching for books and adding them to the user's library
function Search() {
  // State for search input, results, loading, errors, pagination, and UI feedback
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searched, setSearched] = useState(false);
  const [addError, setAddError] = useState('');

  // Pull context values for library management and summaries
  const { 
    library, 
    addToLibrary,
    summaries,
    summaryLoading,
    openSummaries,
    toggleSummary
  } = useLibrary();

  // Reset state before a new search
  const resetSearchState = () => {
    setLoading(true);
    setError('');
    setResults([]);
    setSearched(true);
  };

  // Fetch books from OpenLibrary API
  const searchBooks = async (searchQuery = query, searchPage = page) => {
    if (!searchQuery.trim()) return;

    resetSearchState();

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&page=${searchPage}`
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      // Map API results to book objects
      const books = data.docs.slice(0, 12).map(book => ({
        key: book.key,
        workKey: book.key.split('/').pop(),
        title: book.title,
        author: book.author_name?.join(', ') || 'Unknown Author',
        coverId: book.cover_i,
      }));

      setResults(books);
      setTotalPages(Math.ceil(data.numFound / 100));
    } catch (err) {
      // Handle and display errors
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      console.error('Search error:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get cover image URL or fallback
  const getCoverURL = (coverId) =>
    coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : 'https://via.placeholder.com/128x193.png?text=No+Cover';

  // Handler for search button or Enter key
  const handleSearch = useCallback(() => {
    setPage(1);
    searchBooks(query, 1);
  }, [query]);

  // Handler for pagination controls
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    searchBooks(query, newPage);
  }, [query]);

  // Handler for adding a book to the library, with duplicate check
  const handleAddToLibrary = useCallback((book) => {
    setAddError('');
    const exists = library.some(b => b.key === book.key);
    if (exists) {
      setAddError('This book is already in your library.');
      setTimeout(() => setAddError(''), 3000); // auto-clear after 3s
    } else {
      addToLibrary(book);
      setAddError('');
    }
  }, [library, addToLibrary]);

  return (
    <section aria-labelledby="search-heading">
      <h1 id="search-heading">Book Search</h1>
      {/* Search form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSearch();
        }}
        role="search"
        aria-label="Book search form"
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter book title or author"
          aria-label="Search books"
        />
        <button className="search-api-btn" type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Error messages for search and add-to-library */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {addError && <p style={{ color: 'red' }}>{addError}</p>}

      {/* Search results section */}
      <section aria-live="polite" aria-label="Search results">
        <div className="search-results">
          {/* Show message if no results */}
          {searched && results.length === 0 && !loading && (
            <p>No books found. Try a different search term.</p>
          )}

          {/* Render each search result as a card */}
          {searched && results.map(book => {
            const isInLibrary = library.some(b => b.key === book.key);
            const isOpen = openSummaries[book.workKey];

            return (
              <article className="search-card" key={book.key}>
                <img src={getCoverURL(book.coverId)} alt={book.title} />
                <div className='search-title'>{book.title}</div>
                <div className='search-author'>by {book.author}</div>
                
                {/* Add to library button, disabled if already added */}
                <button
                  className="add-library-btn"
                  onClick={() => handleAddToLibrary(book)}
                  disabled={isInLibrary}
                >
                  {isInLibrary ? 'Added' : 'Add'}
                </button>

                {/* Show/Hide summary button */}
                <button
                  className="summary-btn"
                  onClick={() => toggleSummary(book.workKey)}
                  disabled={summaryLoading[book.workKey]}
                >
                  {summaryLoading[book.workKey]
                    ? 'Loading Summary...'
                    : isOpen
                    ? 'Hide Summary'
                    : 'Show Summary'}
                </button>

                {/* Display summary if open */}
                {isOpen && summaries[book.workKey] && (
                  <p className="summary-text">{summaries[book.workKey]}</p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Pagination controls, shown only if there are results */}
      {searched && results.length > 0 && (
        <nav className="pagination-controls" aria-label="Pagination">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(Math.max(page - 1, 1))}
            aria-label="Previous page"
          >
            ◀ Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
            aria-label="Next page"
          >
            Next ▶
          </button>
        </nav>
      )}
    </section>
  );
}

export default Search;

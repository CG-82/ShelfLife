import { useLibrary } from '../context/LibraryContext';

const getCoverURL = (coverId) =>
  coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : 'https://via.placeholder.com/128x193.png?text=No+Cover';

function Collection() {
  const { library, removeFromLibrary } = useLibrary();

  return (
    <div className='library'>
      <h2>Your Library</h2>
      {library.length === 0 ? (
        <p>Your library is empty.</p>
      ) : (
        <div className="library-cards-container">
          {library.map(book => (
            <div className='library-card' key={book.key}>
              <img
                src={getCoverURL(book.coverId)}
                alt={book.title}
              />
              <div className="library-title">{book.title}</div>
              <div className="library-author">by {book.author}</div>

              <button
                className="remove-library-btn"
                onClick={() => removeFromLibrary(book.key)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Collection;

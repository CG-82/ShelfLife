import { useLibrary } from '../context/LibraryContext';

const getCoverURL = (coverId) =>
  coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : 'https://via.placeholder.com/128x193.png?text=No+Cover';

function Collection() {
  const { library, removeFromLibrary } = useLibrary();

  return (
    <div>
      <h2>Your Library</h2>
      {library.length === 0 ? (
        <p>Your library is empty.</p>
      ) : (
        <ul>
          {library.map(book => (
            <li key={book.key}>
              <img
                src={getCoverURL(book.coverId)}
                alt={book.title}
                width="64"
                height="96"
                style={{ marginRight: '8px', verticalAlign: 'middle' }}
              />
              {book.title} by {book.author}
              <button onClick={() => removeFromLibrary(book.key)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Collection;
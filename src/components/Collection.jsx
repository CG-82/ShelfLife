import { useLibrary } from '../context/LibraryContext';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const getCoverURL = (coverId) =>
  coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : 'https://via.placeholder.com/128x193.png?text=No+Cover';

function Collection() {
  const {
    library,
    removeFromLibrary,
    updateBookStatus,
    updateBookRating,
    summaries,
    openSummaries,
    toggleSummary,
    summaryLoading
  } = useLibrary();

  // --- Chart Data ---
  const finishedCount = library.filter(b => b.status === 'finished').length;
  const unfinishedCount = library.length - finishedCount;

  const statusData = [
    { name: 'Finished', value: finishedCount },
    { name: 'Unfinished', value: unfinishedCount }
  ];

  const COLORS = ['#4caf50', '#f44336']; // green & red

  const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: library.filter(b => b.rating === rating).length,
  }));

  return (
    <div className='library'>
      

      {/* --- LIBRARY STATS CHARTS --- */}
      {library.length > 0 && (
        <div className="library-stats" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {/* Pie Chart: Finished vs Unfinished */}
          <div>
            <h3>Books Finished vs Unfinished</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Bar Chart: Ratings */}
          <div>
            <h3>Books by Rating</h3>
            <BarChart width={400} height={300} data={ratingCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2196f3" />
            </BarChart>
          </div>
        </div>
      )}

      {/* --- LIBRARY BOOK CARDS --- */}
      <h2>Your Library</h2>
      {library.length === 0 ? (
        <p>Your library is empty.</p>
      ) : (
        <div className="library-cards-container">
          {library.map(book => {
            const isOpen = openSummaries[book.workKey];
            return (
              <div className='library-card' key={book.key}>
                <img
                  src={getCoverURL(book.coverId)}
                  alt={book.title}
                />
                <div className="library-title">{book.title}</div>
                <div className="library-author">by {book.author}</div>

                {/* --- STATUS DROPDOWN --- */}
                <label>
                  Status:
                  <select
                    value={book.status || 'owned'}
                    onChange={(e) => updateBookStatus(book.key, e.target.value)}
                  >
                    <option value="owned">Owned</option>
                    <option value="started">Started</option>
                    <option value="finished">Finished</option>
                  </select>
                </label>

                {/* --- RATING STARS --- */}
                <div className="rating" style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      style={{
                        cursor: 'pointer',
                        color: star <= (book.rating || 0) ? 'gold' : 'gray',
                        marginRight: '3px'
                      }}
                      onClick={() => updateBookRating(book.key, star)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* --- SUMMARY TOGGLE BUTTON --- */}
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

                {isOpen && summaries[book.workKey] && (
                  <p className="summary-text">{summaries[book.workKey]}</p>
                )}

                {/* --- REMOVE BUTTON --- */}
                <button
                  className="remove-library-btn"
                  onClick={() => removeFromLibrary(book.key)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Collection;

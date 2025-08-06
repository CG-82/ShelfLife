# Shelf Life

Shelf Life is a React-based web app for managing your personal home library. Search for books, add them to your collection, track reading status, rate your books, and visualize your library with charts.

## Features

- **Search:** Find books using the OpenLibrary API. View book covers, authors, and summaries.
- **Personal Library:** Add books to your collection, update their reading status (Owned, Started, Finished), and give personal ratings.
- **Charts:** Visualize your reading progress and ratings with interactive charts.
- **Summaries:** View brief summaries for books (when available).
- **Persistent Storage:** Your library and settings are saved in your browser's local storage.
- **Responsive Design:** Works well on desktop and mobile devices.
- **About Page:** Learn more about Shelf Life and future plans.

## Components Overview

- **Header:** Displays the site title.
- **Footer:** Shows copyright, links to about page.
- **Content:** Handles navigation between Home, Collection, and Search.
- **Home:** Welcome page and app overview.
- **Search:** Search for books, view details, add to library, and see summaries.
- **Collection:** View and manage your library, update status/rating, see charts.
- **LibraryContext:** Provides global state for library management and persistence.

## Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## File Structure

```
shelflife/
├── public/
│   ├── about.html
│   ├── brooke-balentine-tR5lEkWTkg8-unsplash.jpg
│   └── css/
│       └── index.css
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Content.jsx
│   │   ├── Home.jsx
│   │   ├── Search.jsx
│   │   └── Collection.jsx
│   └── context/
│       └── LibraryContext.jsx
├── README.md
└── ...
```

## Future Improvements

- Move to React Router for true multi-page navigation.
- Add sorting and filtering to the collection.
- Use a backend for secure, persistent storage.
- Add authentication for privacy and security.

## License

MIT



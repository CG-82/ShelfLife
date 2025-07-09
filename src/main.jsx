import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'
import { LibraryProvider } from './context/LibraryContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LibraryProvider>
       <App />
    </LibraryProvider>
   
  </StrictMode>,
)

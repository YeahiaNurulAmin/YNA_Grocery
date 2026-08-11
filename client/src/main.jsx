import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from './context/AppContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LanguageProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </LanguageProvider>
  </BrowserRouter>,
)

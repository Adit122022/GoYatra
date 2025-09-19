
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import App from './App';
import './index.css';
import ThemeProvider, { useTheme } from './components/context/ThemeContext';
import TripProvider from './components/context/TripContext';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

// Component to wrap ClerkProvider and apply theme
const ClerkWithTheme = () => {
  const { theme } = useTheme();

  const darkThemes = ['dark', 'synthwave', 'retro', 'cyberpunk', 'halloween', 'forest', 'black', 'luxury', 'dracula', 'night', 'coffee'];
  const isDarkTheme = darkThemes.includes(theme);

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: isDarkTheme ? dark : undefined,
        variables: isDarkTheme ? {
          colorPrimary: '#654734',
          colorBackground: '#2d211b',
          colorText: '#c8bfae',
          colorInputBackground: '#403029',
          colorInputText: '#c8bfae',
        } : {},
      }}
    >
      <TripProvider>
        <App />
      </TripProvider>
    </ClerkProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <ClerkWithTheme />
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);

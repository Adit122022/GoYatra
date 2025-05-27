import { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("Chat_theme") || "coffee");

  // Set the theme in localStorage and state
  const changeTheme = (newTheme) => {
    localStorage.setItem("Chat_theme", newTheme);
    setTheme(newTheme);
  };

  // You can add logic here for side effects (e.g., applying the theme to the body)
  useEffect(() => {
    document.body.className = theme; // Just an example if you want to apply a class to the body
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;

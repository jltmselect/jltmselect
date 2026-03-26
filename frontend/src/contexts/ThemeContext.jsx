import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Check for saved preference or system preference on mount
        const savedTheme = localStorage.getItem('theme');

        let initialTheme;
        if (savedTheme) {
            initialTheme = savedTheme;
        } else {
            initialTheme = 'light';
        }

        setTheme(initialTheme);
        setIsDark(initialTheme === 'dark');

        // Apply theme to HTML element
        if (initialTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
        setIsDark(!isDark);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const setLightTheme = () => {
        setTheme('light');
        setIsDark(false);
        localStorage.setItem('theme', 'light');
        document.documentElement.classList.remove('dark');
    };

    const setDarkTheme = () => {
        setTheme('dark');
        setIsDark(true);
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
    };

    return (
        <ThemeContext.Provider value={{
            isDark,
            theme,
            toggleTheme,
            setLightTheme,
            setDarkTheme,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for using theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
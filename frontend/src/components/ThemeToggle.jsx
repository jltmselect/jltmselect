// components/ThemeToggle.jsx
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
    const { isDark, theme, toggleTheme, setLightTheme, setDarkTheme } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={toggleTheme}
                className="py-2 px-2.5 rounded-lg bg-light dark:bg-primary hover:bg-light/90 dark:hover:bg-primary/90 transition-colors"
                aria-label="Toggle theme"
            >
                {isDark ? '🌞' : '🌙'}
            </button>
        </div>
    );
};

export default ThemeToggle;
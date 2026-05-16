import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, BookOpen, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-4 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 text-xl font-black text-slate-950 dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-primary-400 dark:bg-primary-500 dark:text-slate-950">
            <BookOpen size={23} />
          </span>
          <span>JavaOOP<span className="text-primary-600"> Master</span></span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:border-primary-300 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-primary-700 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-bold hover:text-primary-600">
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 dark:text-slate-300"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:inline text-sm font-bold hover:text-primary-600">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

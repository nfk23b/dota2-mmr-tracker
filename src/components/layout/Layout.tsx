import React, { ReactNode } from 'react';
import Header from './Header';
import { useTheme } from '../../hooks/useTheme';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-100 text-gray-900'
    }`}>
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="container mx-auto p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Dota MMR Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;
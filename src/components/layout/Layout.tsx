import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        {children}
      </main>
      <footer className="bg-gray-800 border-t border-gray-700 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          Dota 2 MMR Tracker &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
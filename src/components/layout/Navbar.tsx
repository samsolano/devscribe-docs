import React from 'react';
import { Moon, Search } from 'lucide-react';
// import SearchBar from '../ui/SearchBar';

const Navbar = () => {
  return (
    <header className="w-full h-16 border-b border-devscribe-border flex items-center px-6 bg-devscribe-dark-gray z-50 fixed top-0 left-0 right-0">
      <div className="flex items-center justify-between w-full">
        <div className="w-64 flex items-center pl-5">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-auto h-8" />
          </div>
        </div>
        
        <div className="flex-1 max-w-xl mx-8">
          {/* <SearchBar /> */}
          <Search />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-devscribe-text-secondary hover:text-white transition-colors">
            
          </span>
          
          <span className="bg-white text-black font-medium px-4 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-white/90 transition-colors">
            Dashboard
          </span>
          
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-devscribe-hover-bg transition-colors">
            <Moon size={18} className="text-devscribe-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import ConnectLink from '@/components/connect/ConnectLink';

interface HeaderProps {
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ logo = '/qubic.svg' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-10 flex w-full flex-wrap items-center justify-between border-b border-solid border-card-border bg-card px-4 sm:px-12 h-[78px]">
      <div className="flex items-center justify-between w-full lg:w-auto">
        <Link to="/">
          <img src={logo} alt="logo" className="h-8" />
        </Link>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      <nav className={`${isMenuOpen ? 'flex' : 'hidden'} w-full lg:flex flex-col lg:flex-row items-center justify-center gap-6 lg:w-auto`}>
        <Link to="/home" className="hover:text-primary-30 text-sm py-2">
          Locking
        </Link>
        <Link to="/dashboard" className="hover:text-gray-300 text-sm py-2">
          Dashboard
        </Link>
        <Link to="/faq" className="hover:text-gray-300 text-sm py-2">
          FAQ
        </Link>
        <Link to="/helpers" className="hover:text-gray-300 text-sm py-2">
          DevTools
        </Link>
      </nav>

      <div className={`${isMenuOpen ? 'flex' : 'hidden'} w-full lg:flex justify-center lg:w-auto mt-4 lg:mt-0`}>
        <ConnectLink />
      </div>
    </header>
  );
};

export default Header;

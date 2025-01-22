import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ConnectLink from '@/components/connect/ConnectLink';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import * as Collapsible from '@radix-ui/react-collapsible';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ logo = '/qubic.svg' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 z-10 flex w-full flex-wrap items-center justify-between bg-background/80 border-b border-solid border-card-border px-4 sm:px-12 h-[78px]"
    >
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }} src={logo} alt="logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <NavigationMenu.Root>
            <NavigationMenu.List className="flex items-center gap-8">
              {[
                { path: '/home', label: 'Locking' },
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/faq', label: 'FAQ' },
                { path: '/helpers', label: 'Helpers' },
              ].map(({ path, label }) => (
                <NavigationMenu.Item key={path}>
                  <NavigationMenu.Link asChild>
                    <Link to={path} className={`text-foreground hover:text-primary-40 relative py-2 font-medium transition-colors ${isActiveRoute(path) ? 'text-primary-40' : ''}`}>
                      {label}
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>

        <div className="hidden md:flex justify-center md:w-auto mt-4 md:mt-0">
          <ConnectLink />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Collapsible.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Collapsible.Trigger asChild>
              <motion.button whileTap={{ scale: 0.95 }} className="p-2 rounded-lg bg-transparent transition-colors" aria-label="Toggle menu">
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                      <IoClose size={24} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} transition={{ duration: 0.2 }}>
                      <RxHamburgerMenu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </Collapsible.Trigger>

            <Collapsible.Content className="absolute top-[78px] left-0 right-0 bg-background border-b border-card-border">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-4 py-6 flex flex-col items-center gap-6">
                <NavigationMenu.Root>
                  <NavigationMenu.List className="flex flex-col items-center gap-6">
                    {[
                      { path: '/home', label: 'Locking' },
                      { path: '/dashboard', label: 'Dashboard' },
                      { path: '/faq', label: 'FAQ' },
                      { path: '/helpers', label: 'Helpers' },
                    ].map(({ path, label }) => (
                      <NavigationMenu.Item key={path}>
                        <NavigationMenu.Link asChild>
                          <Link
                            to={path}
                            className={`text-foreground hover:text-primary-40 relative py-2 font-medium transition-colors ${isActiveRoute(path) ? 'text-primary-40' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {label}
                          </Link>
                        </NavigationMenu.Link>
                      </NavigationMenu.Item>
                    ))}
                  </NavigationMenu.List>
                </NavigationMenu.Root>
                <ConnectLink />
              </motion.div>
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

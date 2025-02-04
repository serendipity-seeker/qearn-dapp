import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ConnectLink from "@/components/connect/ConnectLink";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Collapsible from "@radix-ui/react-collapsible";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/qearn.svg";
import darkLogo from "@/assets/qearn-dark.svg";
import { useAtom } from "jotai";
import { settingsAtom } from "@/store/settings";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  logo?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useAtom(settingsAtom);
  const { t } = useTranslation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const toggleTheme = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 z-10 flex h-[78px] w-full flex-wrap items-center justify-between border-b border-solid border-card-border bg-background px-4 sm:px-12"
    >
      <div className="flex w-full items-center justify-between">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            src={settings.darkMode ? logo : darkLogo}
            alt="logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <NavigationMenu.Root>
            <NavigationMenu.List className="flex items-center gap-8">
              {[
                { path: "/home", label: t("header.Locking") },
                { path: "/dashboard", label: t("header.Dashboard") },
                { path: "/faq", label: t("header.FAQ") },
                // { path: '/helpers', label: 'Helpers' },
              ].map(({ path, label }) => (
                <NavigationMenu.Item key={path}>
                  <NavigationMenu.Link asChild>
                    <Link
                      to={path}
                      className={`relative py-2 font-medium text-foreground transition-colors hover:text-primary-40 ${isActiveRoute(path) ? "text-primary-40" : ""}`}
                    >
                      {label}
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>

        <div className="mt-4 hidden items-center justify-center gap-4 md:mt-0 md:flex md:w-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="rounded-lg border-none bg-transparent p-2 transition-colors"
            aria-label="Toggle theme"
          >
            {settings.darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </motion.button>
          <ConnectLink darkMode={settings.darkMode} />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Collapsible.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Collapsible.Trigger asChild>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-transparent p-2 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IoClose size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90 }}
                      animate={{ rotate: 0 }}
                      exit={{ rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RxHamburgerMenu size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </Collapsible.Trigger>

            <Collapsible.Content className="absolute left-0 right-0 top-[78px] border-b border-card-border bg-background">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-6 px-4 py-6"
              >
                <NavigationMenu.Root>
                  <NavigationMenu.List className="flex flex-col items-center gap-6">
                    {[
                      { path: "/home", label: "Locking" },
                      { path: "/dashboard", label: "Dashboard" },
                      { path: "/faq", label: "FAQ" },
                      // { path: '/helpers', label: 'Helpers' },
                    ].map(({ path, label }) => (
                      <NavigationMenu.Item key={path}>
                        <NavigationMenu.Link asChild>
                          <Link
                            to={path}
                            className={`relative py-2 font-medium text-foreground transition-colors hover:text-primary-40 ${isActiveRoute(path) ? "text-primary-40" : ""}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {label}
                          </Link>
                        </NavigationMenu.Link>
                      </NavigationMenu.Item>
                    ))}
                  </NavigationMenu.List>
                </NavigationMenu.Root>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="rounded-lg border-none bg-transparent p-2 transition-colors"
                  aria-label="Toggle theme"
                >
                  {settings.darkMode ? (
                    <div className="flex items-center gap-2">
                      <MdLightMode size={20} />
                      <span>{t("header.Light")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MdDarkMode size={20} />
                      <span>{t("header.Dark")}</span>
                    </div>
                  )}
                </motion.button>
                <ConnectLink darkMode={settings.darkMode} />
              </motion.div>
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

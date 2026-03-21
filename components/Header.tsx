// Header.tsx
// Main navigation header with sidebar and mobile menu

'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Home, Tag, Building2, Upload, ChevronRight, LayoutDashboard, LogOut, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/spaces', icon: Home, label: 'Spaces' },
  { to: '/homes-for-sale', icon: Tag, label: 'Homes for Sale' },
  { to: '/our-homes', icon: Building2, label: 'Our Homes for Sale' },
  { to: '/upload', icon: Upload, label: 'Upload' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to);

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-60 flex-col z-50 bg-sidebar shadow-lg">
        {/* Brand Section */}
        <div className="px-5 py-5 border-b border-white/15">
          <span className="heading text-white text-base leading-none">RMHP Dashboard</span>
          <p className="text-xs mt-1 text-white/60">
            Riviera Mobile Home Park
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                href={item.to}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                  ${active 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-white/85 hover:bg-white/10'
                  }
                `}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        {/* Import Section */}
        <div className="p-3">
          <Link
            href="/import"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/85 hover:bg-white/10"
          >
            <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Import</span>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-white/15">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/85 hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/15">
          <p className="text-[10px] text-center tracking-wide text-white/50">
            © 2026 Riviera Mobile Home Park
          </p>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 z-50 bg-sidebar shadow-md">
        <div className="h-full flex items-center justify-between px-6">
          <span className="heading text-white text-lg leading-none">RMHP Dashboard</span>

          {/* Menu Toggle Button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-xl text-white transition-colors
              ${open ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}
            `}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span className="text-sm hidden sm:block">Menu</span>
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden fixed inset-0 top-14 z-40 bg-sidebar/25"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown Panel */}
            <motion.nav
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 340 }}
              className="lg:hidden fixed top-[58px] right-4 w-64 rounded-xl overflow-hidden z-50 bg-sidebar shadow-lg"
            >
              {/* Panel Header */}
              <div className="px-4 py-3 bg-sidebar border-b border-white/15">
                <p className="text-sm text-white leading-tight">Riviera Mobile Home Park</p>
              </div>

              {/* Navigation Items */}
              <div className="p-2 space-y-0.5">
                {navItems.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                        ${active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-white/85 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className={`
                        w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                        ${active ? 'bg-white/25' : 'bg-white/10'}
                      `}>
                        <item.icon className={`w-3.5 h-3.5 ${active ? 'text-primary-foreground' : 'text-white/85'}`} />
                      </div>
                      <span className="text-sm">{item.label}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
                    </Link>
                  );
                })}
              </div>

              {/* Import Section */}
              <div className="p-2 pt-0">
                <Link
                  href="/import"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/85 hover:bg-white/10"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/10">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-white/85" />
                  </div>
                  <span className="text-sm">Import</span>
                </Link>
              </div>

              {/* Logout Button */}
              <div className="p-2 pt-0">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-white/85 hover:bg-white/10"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/10">
                    <LogOut className="w-3.5 h-3.5 text-white/85" />
                  </div>
                  <span className="text-sm">Logout</span>
                </button>
              </div>

              {/* Panel Footer */}
              <div className="px-4 py-2.5 border-t border-white/15">
                <p className="text-[10px] text-center tracking-wide text-white/50">
                  © 2026 Riviera Mobile Home Park
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

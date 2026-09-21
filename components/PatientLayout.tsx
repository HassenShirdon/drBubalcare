"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/stores/ui-store';
import {
  Plus,
  LayoutDashboard,
  FlaskConical,
  UserSearch,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Bell,
  Stethoscope,
  Dna,
  FileText,
  Briefcase,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/patient', label: 'Overview', icon: LayoutDashboard },
  { href: '/patient/cases', label: 'My cases', icon: Briefcase },
  { href: '/patient/labs', label: 'Lab portal', icon: FlaskConical },
  { href: '/directory', label: 'Find a physician', icon: UserSearch },
];

const MOBILE_NAV = [
  { href: '/directory', label: 'Find', icon: Search },
  { href: '/patient', label: 'Overview', icon: Stethoscope },
  { href: '/patient/cases', label: 'Cases', icon: FileText },
  { href: '/patient/labs', label: 'Labs', icon: Dna },
];

function isActive(pathname: string, href: string) {
  return href === '/patient' ? pathname === '/patient' : pathname.startsWith(href);
}

function sectionTitle(pathname: string) {
  if (pathname.startsWith('/patient/cases/new')) return 'New case';
  if (pathname.startsWith('/patient/cases')) return 'My cases';
  if (pathname.startsWith('/patient/labs')) return 'Lab portal';
  if (pathname.startsWith('/patient/settings')) return 'Settings';
  return 'Overview';
}

export function PatientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const navList = (onNavigate?: () => void) => (
    <ul className="flex-1 space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40 ${
                active
                  ? 'border-pulse-info bg-pulse-info-light font-semibold text-pulse-navy'
                  : 'border-transparent font-medium text-pulse-text-secondary hover:bg-pulse-surface-elevated hover:text-pulse-text-primary'
              }`}
            >
              <item.icon
                size={18}
                className={active ? 'text-pulse-info' : 'text-pulse-text-muted'}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="pulsepoint flex min-h-[100dvh] bg-pulse-bg text-pulse-text-primary antialiased">
      <nav className="fixed left-0 top-0 z-50 hidden h-[100dvh] w-64 flex-col border-r border-pulse-border bg-pulse-surface px-3 py-4 md:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <Image src="/logo.png" alt="Dr. Bubal Care logo" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-pulse-navy">Dr. Bubal Care</p>
            <p className="mt-1 text-xs text-pulse-text-muted">Patient portal</p>
          </div>
        </div>

        <Link
          href="/patient/cases/new"
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-lg bg-pulse-navy px-4 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-pulse-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-navy/40 focus-visible:ring-offset-2"
        >
          <Plus className="size-4" aria-hidden="true" />
          Start a case
        </Link>

        {navList()}

        <div className="mt-auto space-y-1 border-t border-pulse-border pt-4">
          <Link
            href="/#contact"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-pulse-text-secondary transition-colors hover:bg-pulse-surface-elevated hover:text-pulse-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
          >
            <HelpCircle size={18} className="text-pulse-text-muted" aria-hidden="true" />
            <span>Help and support</span>
          </Link>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-pulse-text-secondary transition-colors hover:bg-pulse-red-light hover:text-pulse-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-red/30"
          >
            <LogOut size={18} className="text-pulse-text-muted" aria-hidden="true" />
            <span>Log out</span>
          </Link>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-pulse-navy/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-pulse-surface shadow-lift">
            <div className="flex items-center justify-between border-b border-pulse-border px-3 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  <Image src="/logo.png" alt="Dr. Bubal Care logo" width={36} height={36} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none text-pulse-navy">Dr. Bubal Care</p>
                  <p className="mt-1 text-xs text-pulse-text-muted">Patient portal</p>
                </div>
              </div>
              <button
            onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 text-pulse-text-muted transition-colors hover:bg-pulse-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
              {navList(() => setSidebarOpen(false))}
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-[100dvh] w-full flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-pulse-border bg-pulse-surface px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              className="rounded-lg p-1.5 text-pulse-text-muted transition-colors hover:bg-pulse-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40 md:hidden"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <h1 className="text-base font-semibold text-pulse-navy">{sectionTitle(pathname)}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center rounded-lg border border-pulse-border bg-pulse-bg px-3 py-2 md:flex">
              <Search className="mr-2 size-4 text-pulse-text-muted" aria-hidden="true" />
              <label htmlFor="patient-search" className="sr-only">
                Search records and messages
              </label>
              <input
                id="patient-search"
                type="text"
                placeholder="Search records, messages"
                className="w-48 border-none bg-transparent text-sm text-pulse-text-primary outline-none placeholder:text-pulse-text-muted focus:ring-0"
              />
            </div>
            <button
              className="relative rounded-lg p-2 text-pulse-text-secondary transition-colors hover:bg-pulse-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
              aria-label="Notifications"
            >
              <Bell size={20} aria-hidden="true" />
              <span
                className="absolute right-1.5 top-1.5 size-2 rounded-full bg-pulse-red"
                aria-hidden="true"
              />
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-pulse-text-primary md:inline">
                {user?.name ?? 'Patient'}
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-pulse-navy text-sm font-semibold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-pulse-border bg-pulse-surface px-4 py-2 md:hidden">
        {MOBILE_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors ${
                active ? 'font-semibold text-pulse-info' : 'text-pulse-text-muted'
              }`}
            >
              <item.icon className="mb-1" size={20} aria-hidden="true" />
              <span className="text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

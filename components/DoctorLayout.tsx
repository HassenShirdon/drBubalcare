"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/stores/ui-store';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FlaskConical,
  HelpCircle,
  LogOut,
  Menu,
  Bell,
  Briefcase,
  X,
} from 'lucide-react';

const MAIN_ITEMS = [
  { href: '/doctor', label: 'Overview', icon: LayoutDashboard },
  { href: '/doctor/cases', label: 'My cases', icon: Briefcase },
  { href: '/doctor/patients', label: 'Patients', icon: Users },
  { href: '/doctor/schedule', label: 'Schedule', icon: Calendar },
];

const CLINICAL_ITEMS = [
  { href: '/doctor/labs/review', label: 'Lab reviews', icon: FlaskConical },
];

const SUPPORT_ITEMS = [
  { href: '/#contact', label: 'Help and support', icon: HelpCircle, danger: false },
  { href: '/api/auth/signout', label: 'Log out', icon: LogOut, danger: true },
];

function isActive(pathname: string, href: string) {
  return href === '/doctor' ? pathname === '/doctor' : pathname.startsWith(href);
}

function sectionTitle(pathname: string) {
  if (pathname.startsWith('/doctor/cases/')) return 'Case detail';
  if (pathname.startsWith('/doctor/cases')) return 'My cases';
  if (pathname.startsWith('/doctor/patients')) return 'Patients';
  if (pathname.startsWith('/doctor/schedule')) return 'Schedule';
  if (pathname.startsWith('/doctor/labs')) return 'Lab reviews';
  return 'Overview';
}

export function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40 ${
      active
        ? 'border-pulse-info bg-pulse-info-light font-semibold text-pulse-navy'
        : 'border-transparent font-medium text-pulse-text-secondary hover:bg-pulse-surface-elevated hover:text-pulse-text-primary'
    }`;

  const NavGroup = ({
    items,
    onNavigate,
  }: {
    items: { href: string; label: string; icon: typeof LayoutDashboard; danger?: boolean }[];
    onNavigate?: () => void;
  }) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={
                item.danger
                  ? 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-pulse-text-secondary transition-colors hover:bg-pulse-red-light hover:text-pulse-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-red/30'
                  : linkClass(active)
              }
            >
              <item.icon
                className={`size-[18px] ${
                  active ? 'text-pulse-info' : 'text-pulse-text-muted'
                }`}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const SidebarContent = ({ showLogo = true, onNavigate }: { showLogo?: boolean; onNavigate?: () => void }) => (
    <nav className="flex h-full w-full flex-col bg-pulse-surface px-3 py-4">
      {showLogo && (
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
            <Image src="/logo.png" alt="Dr. Bubal Care logo" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-pulse-navy">Dr. Bubal Care</p>
            <p className="mt-1 text-xs text-pulse-text-muted">Clinical portal</p>
          </div>
        </div>
      )}

      <NavGroup items={MAIN_ITEMS} onNavigate={onNavigate} />

      <div className="mt-6">
        <p className="mb-2 px-3 text-xs font-medium text-pulse-text-muted">Clinical</p>
        <NavGroup items={CLINICAL_ITEMS} onNavigate={onNavigate} />
      </div>

      <div className="mt-auto border-t border-pulse-border pt-4">
        <p className="mb-2 px-3 text-xs font-medium text-pulse-text-muted">Support</p>
        <NavGroup items={SUPPORT_ITEMS} onNavigate={onNavigate} />
      </div>
    </nav>
  );

  return (
    <div className="pulsepoint flex min-h-[100dvh] bg-pulse-bg text-pulse-text-primary antialiased">
      <aside className="fixed left-0 top-0 z-50 hidden h-[100dvh] w-64 flex-col border-r border-pulse-border bg-pulse-surface md:flex">
        <SidebarContent />
      </aside>

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
                <div className="flex size-9 items-center justify-center overflow-hidden rounded-full">
                  <Image src="/logo.png" alt="Dr. Bubal Care logo" width={36} height={36} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none text-pulse-navy">Dr. Bubal Care</p>
                  <p className="mt-1 text-xs text-pulse-text-muted">Clinical portal</p>
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
            <div className="flex-1 overflow-y-auto">
              <SidebarContent showLogo={false} onNavigate={() => setSidebarOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-[100dvh] w-full flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-pulse-border bg-pulse-surface px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-1.5 text-pulse-text-muted transition-colors hover:bg-pulse-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40 md:hidden"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              aria-expanded={sidebarOpen}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <h1 className="text-base font-semibold text-pulse-navy">{sectionTitle(pathname)}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative rounded-lg p-1.5 text-pulse-text-secondary transition-colors hover:bg-pulse-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
              aria-label="Notifications"
            >
              <Bell className="size-5" aria-hidden="true" />
              <span
                className="absolute right-1 top-1 size-2 rounded-full bg-pulse-red"
                aria-hidden="true"
              />
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-pulse-text-primary lg:block">
                {user?.name ?? 'Doctor'}
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-pulse-navy text-sm font-semibold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

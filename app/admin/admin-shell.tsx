'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/stores/ui-store';
import {
  LayoutDashboard,
  Briefcase,
  Shield,
  Newspaper,
  MessageSquareWarning,
  AlertTriangle,
  ClipboardList,
  Database,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { AdminUserButton } from '@/components/admin-user-button';

interface AdminShellProps {
  children: React.ReactNode;
  name: string | null;
  email: string | null;
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/cases', label: 'Cases', icon: Briefcase },
  { href: '/admin/specialists', label: 'Specialists', icon: Shield },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/disputes', label: 'Disputes', icon: MessageSquareWarning },
  { href: '/admin/edge-cases', label: 'Edge cases', icon: AlertTriangle },
  { href: '/admin/audit-logs', label: 'Audit logs', icon: ClipboardList },
  { href: '/admin/data-requests', label: 'Data requests', icon: Database },
];

function sectionTitle(pathname: string) {
  const match = navItems.find(
    (item) => item.href !== '/admin' && pathname.startsWith(item.href)
  );
  return match?.label ?? 'Overview';
}

export function AdminShell({ children, name, email }: AdminShellProps) {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const navList = (onNavigate?: () => void) => (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {navItems.map((item) => {
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40 ${
              isActive
                ? 'border-admin-sidebar-icon-active bg-admin-sidebar-bg-active font-semibold text-admin-sidebar-text-active'
                : 'border-transparent font-medium text-admin-sidebar-text hover:bg-admin-surface-hover hover:text-admin-text'
            }`}
          >
            <item.icon
              className={`size-4 shrink-0 ${
                isActive ? 'text-admin-sidebar-icon-active' : 'text-admin-text-faint'
              }`}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-[100dvh] bg-admin-bg text-admin-text antialiased">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-admin-brand/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-admin-sidebar-border bg-admin-sidebar-bg transition-transform duration-200 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center gap-3 border-b border-admin-sidebar-border px-5">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40"
          >
            <Image
              src="/logo.png"
              alt="Dr. Bubal Care logo"
              width={28}
              height={28}
              className="size-7 rounded-full object-cover"
            />
            <span className="text-sm font-semibold text-admin-brand">Dr. Bubal Care</span>
          </Link>
          <button
            className="ml-auto rounded-md p-1 text-admin-text-faint transition-colors hover:bg-admin-surface-hover md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {navList(() => setSidebarOpen(false))}

        <div className="border-t border-admin-sidebar-border px-3 py-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-admin-text-faint transition-colors hover:bg-admin-surface-hover hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            View site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-admin-header-border bg-admin-header-bg px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-1.5 text-admin-text-faint transition-colors hover:bg-admin-surface-hover md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <h1 className="text-sm font-semibold text-admin-text">{sectionTitle(pathname)}</h1>
            <span className="hidden rounded-md bg-admin-surface-elevated px-2 py-0.5 text-[11px] font-medium text-admin-text-faint md:inline">
              Admin
            </span>
          </div>
          <AdminUserButton name={name} email={email} />
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

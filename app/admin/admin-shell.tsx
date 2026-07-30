'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/cases', label: 'Cases', icon: Briefcase },
  { href: '/admin/specialists', label: 'Specialists', icon: Shield },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/disputes', label: 'Disputes', icon: MessageSquareWarning },
  { href: '/admin/edge-cases', label: 'Edge Cases', icon: AlertTriangle },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: ClipboardList },
  { href: '/admin/data-requests', label: 'Data Requests', icon: Database },
];

export function AdminShell({ children, name, email }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-admin-bg text-admin-text antialiased">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-admin-sidebar-bg border-r border-admin-sidebar-border transition-transform duration-200 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-14 items-center gap-3 px-5 border-b border-admin-sidebar-border">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-admin-brand flex items-center justify-center text-white text-xs font-bold">
              DB
            </div>
            <span className="text-sm font-semibold text-admin-brand">Dr Bubal Care</span>
          </Link>
          <button
            className="ml-auto md:hidden p-1 rounded-md hover:bg-admin-surface-hover text-admin-text-faint"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-admin-sidebar-bg-active text-admin-sidebar-text-active'
                    : 'text-admin-sidebar-text hover:bg-admin-surface-hover hover:text-admin-text'
                }`}
              >
                <item.icon
                  className={`size-4 shrink-0 ${
                    isActive ? 'text-admin-sidebar-icon-active' : 'text-admin-text-faint'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-3 border-t border-admin-sidebar-border">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-admin-text-faint hover:bg-admin-surface-hover hover:text-admin-text transition-colors duration-150"
          >
            <ExternalLink className="size-4" />
            View Site
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top header */}
        <header className="flex h-14 items-center justify-between gap-4 px-4 md:px-6 bg-admin-header-bg border-b border-admin-header-border">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-md hover:bg-admin-surface-hover text-admin-text-faint"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden md:block text-xs text-admin-text-faint font-medium tracking-wide uppercase">
              Admin Portal
            </div>
          </div>
          <AdminUserButton name={name} email={email} />
        </header>

        {/* Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

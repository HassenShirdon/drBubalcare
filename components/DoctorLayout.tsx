"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Stethoscope, LayoutDashboard, Users, Calendar, FlaskConical, Plus, HelpCircle, LogOut, Menu, Bell, Briefcase, X } from 'lucide-react';

export function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/doctor/cases', label: 'My Cases', icon: Briefcase },
    { href: '/doctor/patients', label: 'Patients', icon: Users },
    { href: '/doctor/schedule', label: 'Schedule', icon: Calendar },
  ];

  const clinicalItems = [
    { href: '/doctor/labs/review', label: 'Lab Reviews', icon: FlaskConical },
  ];

  const supportItems = [
    { href: '#', label: 'Help Center', icon: HelpCircle },
    { href: '/api/auth/signout', label: 'Logout', icon: LogOut, danger: true },
  ];

  const SidebarContent = ({ showLogo = true }: { showLogo?: boolean }) => (
    <nav className="h-full w-full flex flex-col py-4 px-3" style={{ background: '#FFFFFF' }}>
      {showLogo && (
        <div className="mb-6 px-2 flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: '#1E3A5F' }}>
            <Stethoscope className="size-4" />
          </div>
          <div>
            <h1 className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>Dr Bubal Care</h1>
            <p className="text-[11px]" style={{ color: '#8D99AE' }}>Clinical Portal</p>
          </div>
        </div>
      )}
      
      <div className="mb-2">
        <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-widest" style={{ color: '#64748B' }}>Main</p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/doctor' 
              ? pathname === '/doctor'
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="flex items-center space-x-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors duration-150"
                  style={{
                    background: isActive ? 'rgba(30, 58, 95, 0.08)' : 'transparent',
                    color: isActive ? '#3B82F6' : '#64748B',
                    borderLeft: isActive ? '2px solid #3B82F6' : '2px solid transparent',
                  }}
                >
                  <item.icon className="size-[18px]" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="mb-2">
        <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-widest" style={{ color: '#64748B' }}>Clinical</p>
        <ul className="space-y-1">
          {clinicalItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="flex items-center space-x-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors duration-150"
                  style={{
                    background: isActive ? 'rgba(30, 58, 95, 0.08)' : 'transparent',
                    color: isActive ? '#3B82F6' : '#64748B',
                    borderLeft: isActive ? '2px solid #3B82F6' : '2px solid transparent',
                  }}
                >
                  <item.icon className="size-[18px]" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="mt-auto mb-4 px-1">
        <button 
          type="button" 
          className="w-full text-white py-2.5 px-3 rounded-md text-[13px] font-medium hover:opacity-90 transition-colors flex items-center justify-center space-x-2"
          style={{ background: '#1E3A5F', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        >
          <Plus className="size-3.5" aria-hidden="true" />
          <span>New Consultation</span>
        </button>
      </div>
      
      <div>
        <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-widest" style={{ color: '#64748B' }}>Support</p>
        <ul className="space-y-1">
          {supportItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className="flex items-center space-x-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors duration-150"
                style={{
                  color: item.danger ? '#E63946' : '#64748B',
                }}
              >
                <item.icon className="size-[18px]" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );

  return (
    <div className="pulsepoint min-h-screen flex antialiased" style={{ background: '#F8FAFC', color: '#0F172A' }}>
      {/* Desktop Sidebar */}
      <aside className="h-screen w-60 fixed left-0 top-0 z-50 hidden md:flex flex-col border-r" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 shadow-xl flex flex-col" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center justify-between px-3 py-4 border-b" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: '#1E3A5F' }}>
                  <Stethoscope className="size-4" />
                </div>
                <div>
                  <h1 className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>Dr Bubal Care</h1>
                  <p className="text-[11px]" style={{ color: '#8D99AE' }}>Clinical Portal</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-1.5 transition-colors"
                style={{ color: '#8D99AE' }}
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
        <SidebarContent showLogo={false} />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-60 w-full min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex justify-between items-center h-14 px-4 md:px-6 border-b" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
          <button 
            className="md:hidden p-1.5 transition-colors" 
            style={{ color: '#8D99AE' }}
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          
          <div className="flex items-center">
            <h2 className="font-semibold text-base" style={{ color: '#1E3A5F' }}>Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="transition-colors relative p-1.5" style={{ color: '#8D99AE' }} aria-label="Notifications">
              <Bell className="size-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#E63946' }}></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: '#1E3A5F' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
              </div>
              <span className="hidden lg:block text-sm" style={{ color: '#0F172A' }}>{user?.name ?? 'Doctor'}</span>
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
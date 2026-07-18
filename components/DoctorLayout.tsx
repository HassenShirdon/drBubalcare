"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Stethoscope, LayoutDashboard, Users, Calendar, FlaskConical, Plus, HelpCircle, LogOut, Menu, Bell, Briefcase, X } from 'lucide-react';

export function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const SidebarContent = () => (
    <nav className="bg-white h-full w-64 flex flex-col py-4 px-3">
      {/* Logo */}
      <div className="mb-6 px-2 flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-lg bg-clinical-navy flex items-center justify-center text-white shrink-0">
          <Stethoscope className="size-4" />
        </div>
        <div>
          <h1 className="font-headline-md text-clinical-navy font-semibold text-sm">Dr Bubal Care</h1>
          <p className="font-label-md text-on-surface-variant text-[11px]">Clinical Portal</p>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="mb-2">
        <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">Main</p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/doctor' 
              ? true // Dashboard is active by default when on /doctor
              : false; // Will be handled by active state logic
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-[13px] font-medium hover:bg-surface-container-low hover:text-clinical-navy rounded-lg transition-colors duration-150"
                >
                  <item.icon className="size-[18px]" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Clinical Navigation */}
      <div className="mb-2">
        <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">Clinical</p>
        <ul className="space-y-1">
          {clinicalItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-[13px] font-medium hover:bg-surface-container-low hover:text-clinical-navy rounded-lg transition-colors duration-150"
              >
                <item.icon className="size-[18px]" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* New Consultation Button */}
      <div className="mt-auto mb-4 px-1">
        <button className="w-full bg-clinical-navy text-white py-2.5 px-3 rounded-lg font-label-md text-[13px] font-medium hover:bg-primary-container transition-colors flex items-center justify-center space-x-2 shadow-sm">
          <Plus className="size-3.5" />
          <span>New Consultation</span>
        </button>
      </div>
      
      {/* Support Navigation */}
      <div>
        <p className="px-3 mb-2 text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">Support</p>
        <ul className="space-y-1">
          {supportItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`flex items-center space-x-2.5 px-3 py-2 font-label-md text-[13px] font-medium rounded-lg transition-colors duration-150 ${
                  item.danger 
                    ? 'text-on-surface-variant hover:bg-surface-container-low hover:text-error'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-clinical-navy'
                }`}
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
    <div className="bg-white text-on-surface font-body-md min-h-screen flex antialiased">
      {/* Desktop Sidebar */}
      <aside className="bg-white h-screen w-60 fixed left-0 top-0 border-r border-surface-gray z-50 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-3 py-4 border-b border-surface-gray">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-clinical-navy flex items-center justify-center text-white">
                  <Stethoscope className="size-4" />
                </div>
                <div>
                  <h1 className="font-headline-md text-clinical-navy font-semibold text-sm">Dr Bubal Care</h1>
                  <p className="font-label-md text-on-surface-variant text-[11px]">Clinical Portal</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-on-surface-variant hover:text-clinical-navy"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-60 w-full min-h-screen">
        {/* Top Bar */}
        <header className="bg-white sticky top-0 z-40 border-b border-surface-gray flex justify-between items-center h-14 px-4 md:px-6">
          <button 
            className="md:hidden text-on-surface-variant p-1.5" 
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          
          <div className="flex items-center">
            <h2 className="font-headline-md text-clinical-navy font-semibold text-base">Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="text-on-surface-variant hover:text-clinical-navy transition-colors relative p-1.5" aria-label="Notifications">
              <Bell className="size-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-clinical-navy flex items-center justify-center text-white text-xs font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
              </div>
              <span className="hidden lg:block font-label-md text-sm text-on-surface">{user?.name ?? 'Doctor'}</span>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Stethoscope, LayoutDashboard, Users, Calendar, FlaskConical, Plus, HelpCircle, LogOut, Menu, Bell, Briefcase } from 'lucide-react';

export function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="bg-white text-on-surface font-body-md min-h-screen flex antialiased">
      {/* SideNavBar */}
      <nav className="bg-white h-screen w-64 fixed left-0 top-0 border-r border-surface-gray flex-col py-4 px-3 z-50 hidden md:flex">
        <div className="mb-6 px-2 flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-clinical-navy flex items-center justify-center text-white shrink-0">
            <Stethoscope className="size-4" />
          </div>
          <div>
            <h1 className="font-headline-md text-clinical-navy font-semibold text-sm">Dr Bubal Care</h1>
            <p className="font-label-md text-on-surface-variant text-[11px]">Clinical Portal</p>
          </div>
        </div>
        
        <ul className="flex-1 space-y-0.5">
          <li>
            <Link href="/doctor" className="flex items-center space-x-2.5 px-3 py-2 text-clinical-navy font-semibold border-r-2 border-clinical-navy font-label-md text-sm bg-evidence-blue-light/50 rounded-l-lg transition-all">
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/doctor/cases" className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-sm hover:bg-surface-container-low hover:text-clinical-navy rounded-lg transition-colors">
              <Briefcase className="size-4" />
              <span>My Cases</span>
            </Link>
          </li>
          <li>
            <Link href="/doctor/patients" className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-sm hover:bg-surface-container-low hover:text-clinical-navy rounded-lg transition-colors">
              <Users className="size-4" />
              <span>Patients</span>
            </Link>
          </li>
          <li>
            <Link href="/doctor/schedule" className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-sm hover:bg-surface-container-low hover:text-clinical-navy rounded-lg transition-colors">
              <Calendar className="size-4" />
              <span>Schedule</span>
            </Link>
          </li>
          <li>
            <Link href="/doctor/labs/review" className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-sm hover:bg-surface-container-low hover:text-clinical-navy rounded-lg transition-colors">
              <FlaskConical className="size-4" />
              <span>Lab Reviews</span>
            </Link>
          </li>
        </ul>
        
        <div className="mt-auto mb-4 px-1">
          <button className="w-full bg-clinical-navy text-white py-2 px-3 rounded-lg font-label-md text-sm hover:bg-primary-container transition-colors flex items-center justify-center space-x-2">
            <Plus className="size-3.5" />
            <span>New Consultation</span>
          </button>
        </div>
        
        <ul className="space-y-0.5">
          <li>
            <Link href="#" className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-sm hover:bg-surface-container-low hover:text-clinical-navy rounded-lg transition-colors">
              <HelpCircle className="size-4" />
              <span>Help Center</span>
            </Link>
          </li>
          <li>
            <Link href="/api/auth/signout" className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-sm hover:bg-surface-container-low hover:text-error rounded-lg transition-colors">
              <LogOut className="size-4" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 flex flex-col md:ml-64 w-full min-h-screen">
        {/* TopAppBar */}
        <header className="bg-white sticky top-0 z-40 border-b border-surface-gray flex justify-between items-center h-14 px-4 md:px-6">
          <button className="md:hidden text-on-surface-variant p-1.5" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          
          <div className="flex items-center space-x-3">
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

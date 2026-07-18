"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Plus, LayoutDashboard, Calendar, FlaskConical, UserSearch, HelpCircle, LogOut, Menu, Search, Bell, Stethoscope, Dna, FileText } from 'lucide-react';

export function PatientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface border-r border-surface-gray flex-col py-stack-md px-4 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded bg-clinical-navy flex items-center justify-center text-white font-bold">TB</div>
          <div>
            <h1 className="font-headline-md text-clinical-navy font-bold text-lg leading-none">TeleHealth Pro</h1>
            <p className="font-caption text-caption text-on-surface-variant mt-1">Digital Sanctuary</p>
          </div>
        </div>
        
        <Link href="/patient" className="w-full bg-clinical-navy text-on-primary font-label-md text-sm rounded-lg py-3 px-4 flex items-center justify-center gap-2 mb-8 hover:bg-primary-container transition-colors shadow-sm">
          <Plus className="text-base" />
          New Consultation
        </Link>
        
        <ul className="flex-1 space-y-2">
          <li>
            <Link href="/patient" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-clinical-navy font-bold border-r-4 border-clinical-navy bg-evidence-blue-light/50 transition-colors">
              <LayoutDashboard />
              <span className="font-label-md text-sm">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80 transition-all">
              <Calendar />
              <span className="font-label-md text-sm">Appointments</span>
            </Link>
          </li>
          <li>
            <Link href="/patient/cases" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80 transition-all">
              <FileText />
              <span className="font-label-md text-sm">My Cases</span>
            </Link>
          </li>
          <li>
            <Link href="/patient/labs" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80 transition-all">
              <FlaskConical />
              <span className="font-label-md text-sm">Lab Portal</span>
            </Link>
          </li>
          <li>
            <Link href="/directory" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer active:opacity-80 transition-all">
              <UserSearch />
              <span className="font-label-md text-sm">Directory</span>
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-4 border-t border-surface-gray space-y-2">
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors">
            <HelpCircle />
            <span className="font-label-md text-sm">Help Center</span>
          </Link>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors">
            <LogOut />
            <span className="font-label-md text-sm">Logout</span>
          </Link>
        </div>
      </nav>

      {/* TopAppBar */}
      <header className="docked full-width top-0 sticky z-40 border-b border-surface-gray bg-surface/80 backdrop-blur-md flex justify-between items-center h-16 px-4 md:px-margin-desktop md:ml-64">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-on-surface-variant">
            <Menu />
          </button>
          <h2 className="font-headline-md text-clinical-navy font-bold text-xl">Patient Portal</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-surface-gray focus-within:border-clinical-navy transition-colors">
            <Search className="text-on-surface-variant mr-2 text-sm" />
            <input type="text" placeholder="Search records, messages..." className="bg-transparent border-none focus:ring-0 text-sm placeholder-on-surface-variant/60 w-48 outline-none" />
          </div>
          <button className="text-clinical-navy hover:text-healing-teal transition-colors scale-95 active:scale-90 relative p-2">
            <Bell />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 text-clinical-navy">
            <span className="font-label-md text-sm hidden md:inline">{user?.name ?? 'Patient'}</span>
            <div className="w-8 h-8 rounded-full bg-clinical-navy flex items-center justify-center text-white text-sm font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="md:ml-64">
        {children}
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-surface/90 backdrop-blur-lg border-t border-surface-gray shadow-sm md:hidden rounded-t-xl">
        <Link href="/directory" className="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-lg">
          <Search className="mb-1" />
          <span className="font-caption text-xs">Find Doc</span>
        </Link>
        <Link href="/patient" className="flex flex-col items-center justify-center text-clinical-navy font-bold p-2 rounded-lg">
          <Stethoscope className="mb-1" />
          <span className="font-caption text-xs">My Care</span>
        </Link>
        <Link href="/patient/cases" className="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-lg">
          <FileText className="mb-1" />
          <span className="font-caption text-xs">Cases</span>
        </Link>
        <Link href="/patient/labs" className="flex flex-col items-center justify-center text-on-surface-variant p-2 rounded-lg">
          <Dna className="mb-1" />
          <span className="font-caption text-xs">Labs</span>
        </Link>
      </nav>
    </div>
  );
}

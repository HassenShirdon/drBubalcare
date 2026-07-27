"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Plus, LayoutDashboard, Calendar, FlaskConical, UserSearch, HelpCircle, LogOut, Menu, Search, Bell, Stethoscope, Dna, FileText, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { X } from 'lucide-react';

export function PatientLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="pulsepoint min-h-screen flex antialiased" style={{ background: '#F8FAFC', color: '#0F172A' }}>
      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 z-50 flex-col py-4 px-3 border-r" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm" style={{ background: '#1E3A5F' }}>TB</div>
          <div>
            <h1 className="font-bold text-lg leading-none" style={{ color: '#1E3A5F' }}>Dr Bubal Care</h1>
            <p className="text-[11px] mt-1" style={{ color: '#8D99AE' }}>Patient Portal</p>
          </div>
        </div>
        
        <Link 
          href="/patient/cases/new" 
          className="w-full text-white text-sm rounded-md py-3 px-4 flex items-center justify-center gap-2 mb-8 hover:opacity-90 transition-colors"
          style={{ background: '#1E3A5F', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        >
          <Plus className="text-base" />
          New Consultation
        </Link>
        
        <ul className="flex-1 space-y-1">
          <li>
            <Link 
              href="/patient" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-md font-bold transition-colors"
              style={{ 
                color: '#3B82F6', 
                background: 'rgba(30, 58, 95, 0.08)',
                borderLeft: '2px solid #3B82F6'
              }}
            >
              <LayoutDashboard size={18} />
              <span className="text-sm">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors" style={{ color: '#64748B' }}>
              <Calendar size={18} />
              <span className="text-sm">Appointments</span>
            </Link>
          </li>
          <li>
            <Link href="/patient/cases" className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors" style={{ color: '#64748B' }}>
              <Briefcase size={18} />
              <span className="text-sm">My Cases</span>
            </Link>
          </li>
          <li>
            <Link href="/patient/labs" className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors" style={{ color: '#64748B' }}>
              <FlaskConical size={18} />
              <span className="text-sm">Lab Portal</span>
            </Link>
          </li>
          <li>
            <Link href="/directory" className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors" style={{ color: '#64748B' }}>
              <UserSearch size={18} />
              <span className="text-sm">Directory</span>
            </Link>
          </li>
        </ul>
        <div className="mt-auto pt-4 border-t space-y-1" style={{ borderColor: '#E2E8F0' }}>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors" style={{ color: '#64748B' }}>
            <HelpCircle size={18} />
            <span className="text-sm">Help Center</span>
          </Link>
          <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors" style={{ color: '#64748B' }}>
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 shadow-xl flex flex-col" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center justify-between px-3 py-4 border-b" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm" style={{ background: '#1E3A5F' }}>TB</div>
                <div>
                  <h1 className="font-bold text-sm leading-none" style={{ color: '#1E3A5F' }}>Dr Bubal Care</h1>
                  <p className="text-[11px] mt-1" style={{ color: '#8D99AE' }}>Patient Portal</p>
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
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <ul className="space-y-1">
                <li><Link href="/patient" className="flex items-center gap-3 px-3 py-2.5 rounded-md" style={{ color: '#3B82F6' }}><LayoutDashboard size={18} /><span className="text-sm font-medium">Dashboard</span></Link></li>
                <li><Link href="/patient/cases" className="flex items-center gap-3 px-3 py-2.5 rounded-md" style={{ color: '#64748B' }}><Briefcase size={18} /><span className="text-sm font-medium">My Cases</span></Link></li>
                <li><Link href="/patient/labs" className="flex items-center gap-3 px-3 py-2.5 rounded-md" style={{ color: '#64748B' }}><FlaskConical size={18} /><span className="text-sm font-medium">Lab Portal</span></Link></li>
                <li><Link href="/directory" className="flex items-center gap-3 px-3 py-2.5 rounded-md" style={{ color: '#64748B' }}><UserSearch size={18} /><span className="text-sm font-medium">Directory</span></Link></li>
              </ul>
            </div>
          </aside>
        </div>
      )}

      {/* TopAppBar */}
      <header className="sticky top-0 z-40 flex justify-between items-center h-14 px-4 md:px-6 md:ml-64 border-b" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-1.5 transition-colors" 
            style={{ color: '#8D99AE' }}
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h2 className="font-bold text-xl" style={{ color: '#1E3A5F' }}>Patient Portal</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center rounded-full px-4 py-2 border" style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <Search className="mr-2 text-sm" style={{ color: '#8D99AE' }} aria-hidden="true" />
            <label htmlFor="patient-search" className="sr-only">Search records, messages</label>
            <input id="patient-search" type="text" placeholder="Search records, messages…" className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none" style={{ color: '#0F172A' }} />
          </div>
          <button className="transition-colors relative p-2" style={{ color: '#3B82F6' }} aria-label="Notifications">
            <Bell size={20} aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#E63946' }} aria-hidden="true"></span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline" style={{ color: '#0F172A' }}>{user?.name ?? 'Patient'}</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#1E3A5F' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 md:ml-64">
        {children}
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe border-t md:hidden" style={{ background: '#FFFFFF', borderColor: '#E2E8F0' }}>
        <Link href="/directory" className="flex flex-col items-center justify-center p-2 rounded-lg" style={{ color: '#8D99AE' }}>
          <Search className="mb-1" size={20} />
          <span className="text-[11px]">Find Doc</span>
        </Link>
        <Link href="/patient" className="flex flex-col items-center justify-center font-bold p-2 rounded-lg" style={{ color: '#3B82F6' }}>
          <Stethoscope className="mb-1" size={20} />
          <span className="text-[11px]">My Care</span>
        </Link>
        <Link href="/patient/cases" className="flex flex-col items-center justify-center p-2 rounded-lg" style={{ color: '#8D99AE' }}>
          <FileText className="mb-1" size={20} />
          <span className="text-[11px]">Cases</span>
        </Link>
        <Link href="/patient/labs" className="flex flex-col items-center justify-center p-2 rounded-lg" style={{ color: '#8D99AE' }}>
          <Dna className="mb-1" size={20} />
          <span className="text-[11px]">Labs</span>
        </Link>
      </nav>
    </div>
  );
}
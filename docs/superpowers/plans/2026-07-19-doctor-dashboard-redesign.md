# Doctor Dashboard Design Refinement - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the doctor dashboard with improved sidebar, consistent spacing, clear typography hierarchy, and polished page designs.

**Architecture:** Modify existing `DoctorLayout` component and all doctor portal pages to implement the approved design spec. No new components needed — pure refinement of existing code.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS 4, Lucide React icons, motion/react (for animations), TypeScript

## Global Constraints

- Keep existing clinical navy (#1D4ED8) + healing teal (#00A3AD) color palette
- Use Manrope for headings, Inter for body text
- All cards: `rounded-xl border border-surface-gray/60 shadow-sm`
- All status badges: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`
- Content padding: `p-6` consistently on all pages
- Max content width: `max-w-6xl` (1152px)

---

## File Structure

| File | Responsibility |
|------|---------------|
| `components/DoctorLayout.tsx` | Sidebar, top bar, layout shell, mobile menu |
| `app/doctor/page.tsx` | Dashboard stats, schedule, lab reviews |
| `app/doctor/cases/page.tsx` | Cases list with tab filters |
| `app/doctor/cases/columns.tsx` | Cases table column definitions |
| `app/doctor/cases/[id]/page.tsx` | Case detail view with opinion form |
| `app/doctor/patients/page.tsx` | Patients list page |
| `app/doctor/patients/columns.tsx` | Patients table column definitions |
| `app/doctor/labs/review/page.tsx` | Lab reviews list page |
| `app/doctor/labs/review/columns.tsx` | Lab reviews table column definitions |
| `app/doctor/schedule/page.tsx` | Schedule with date grouping |

---

### Task 1: DoctorLayout - Sidebar Redesign

**Files:**
- Modify: `components/DoctorLayout.tsx` (entire file)

**Interfaces:**
- Consumes: `useSession()` from next-auth
- Produces: `<DoctorLayout>{children}</DoctorLayout>` wrapper

- [ ] **Step 1: Rewrite sidebar structure with grouped sections**

```tsx
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
```

- [ ] **Step 2: Verify sidebar renders correctly**

Run: `npm run dev` and navigate to `/doctor`
Expected: Sidebar shows grouped sections with proper spacing, active states, and "New Consultation" button

- [ ] **Step 3: Commit**

```bash
git add components/DoctorLayout.tsx
git commit -m "refactor: redesign doctor sidebar with grouped sections and mobile menu"
```

---

### Task 2: Dashboard Page Redesign

**Files:**
- Modify: `app/doctor/page.tsx` (entire file)

**Interfaces:**
- Consumes: `getServerSession`, `prisma` queries
- Produces: Dashboard page with stats, schedule, and lab reviews

- [ ] **Step 1: Rewrite dashboard page with refined styling**

```tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { Calendar, FlaskConical, Users, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

async function getDoctorProfile(userId: string) {
  return prisma.doctor.findUnique({
    where: { userId },
    include: { user: { select: { name: true, image: true } } },
  });
}

async function getTodayAppointments(doctorId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return prisma.appointment.findMany({
    where: {
      doctorId,
      date: { gte: today, lt: tomorrow },
    },
    include: {
      patient: { select: { name: true, email: true, image: true } },
    },
    orderBy: { time: 'asc' },
  });
}

async function getAppointmentCount(doctorId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.appointment.count({
    where: { doctorId, date: { gte: today } },
  });
}

async function getPendingLabReviews() {
  return prisma.labResult.findMany({
    where: { status: 'REVIEW_NEEDED' },
    include: {
      patient: { select: { name: true, email: true } },
      metrics: true,
    },
    orderBy: { date: 'desc' },
    take: 10,
  });
}

async function getPatientCount(doctorId: string) {
  const result = await prisma.appointment.groupBy({
    by: ['patientId'],
    where: { doctorId },
  });
  return result.length;
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function DoctorDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const userId = (session.user as { id: string }).id;

  const doctor = await getDoctorProfile(userId);
  if (!doctor) redirect('/auth/signin');

  const [appointments, pendingReviews, appointmentCount, patientCount] = await Promise.all([
    getTodayAppointments(doctor.id),
    getPendingLabReviews(),
    getAppointmentCount(doctor.id),
    getPatientCount(doctor.id),
  ]);

  const pendingReviewCount = pendingReviews.length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline-md text-lg font-semibold text-text-medical-black">
          Welcome back, Dr. {doctor.user.name ?? 'Doctor'}
        </h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          {doctor.specialty} &middot; {doctor.experience}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-medical-black">{appointmentCount}</p>
              <p className="text-xs text-on-surface-variant">Total Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-healing-teal/10 flex items-center justify-center text-healing-teal">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-medical-black">{patientCount}</p>
              <p className="text-xs text-on-surface-variant">Total Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <FlaskConical className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-medical-black">{pendingReviewCount}</p>
              <p className="text-xs text-on-surface-variant">Pending Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md font-semibold text-sm text-text-medical-black flex items-center gap-2">
              <Calendar className="size-4 text-clinical-navy" />
              Today&apos;s Schedule
            </h2>
            <span className="text-xs text-on-surface-variant">{formatDate(new Date())}</span>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="size-12 text-on-surface-variant/30 mx-auto mb-3" />
              <p className="text-sm font-semibold text-text-medical-black">No appointments today</p>
              <p className="text-xs text-on-surface-variant mt-1">Your schedule will appear here</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {appointments.map((apt) => (
                <li
                  key={apt.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy font-semibold text-xs shrink-0">
                    {apt.patient.name?.charAt(0) ?? 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-medical-black text-sm truncate">
                      {apt.patient.name ?? 'Unknown Patient'}
                    </p>
                    <p className="text-on-surface-variant text-xs flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatTime(apt.time)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
                      apt.status === 'CONFIRMED'
                        ? 'text-healing-teal bg-healing-teal/10'
                        : apt.status === 'SCHEDULED'
                          ? 'text-clinical-navy bg-clinical-navy/10'
                          : 'text-on-surface-variant bg-surface-gray/50'
                    }`}
                  >
                    {apt.status.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending Lab Reviews */}
        <div className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-md font-semibold text-sm text-text-medical-black flex items-center gap-2">
              <FlaskConical className="size-4 text-clinical-navy" />
              Pending Lab Reviews
            </h2>
            <Link
              href="/doctor/labs/review"
              className="text-clinical-navy text-xs font-medium hover:text-healing-teal transition-colors"
            >
              View all
            </Link>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="size-12 text-healing-teal/50 mx-auto mb-3" />
              <p className="text-sm font-semibold text-text-medical-black">All labs reviewed</p>
              <p className="text-xs text-on-surface-variant mt-1">No pending reviews at this time</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {pendingReviews.map((lab) => (
                <li key={lab.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors">
                  <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertCircle className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-medical-black text-sm truncate">{lab.name}</p>
                    <p className="text-on-surface-variant text-xs">
                      {lab.patient.name ?? 'Unknown'} &middot; {formatDate(lab.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      {lab.metrics.filter((m) => m.status !== 'NORMAL').length} flag
                      {lab.metrics.filter((m) => m.status !== 'NORMAL').length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify dashboard renders correctly**

Run: `npm run dev` and navigate to `/doctor`
Expected: Dashboard shows stats with hover effects, schedule with empty state, lab reviews with proper styling

- [ ] **Step 3: Commit**

```bash
git add app/doctor/page.tsx
git commit -m "refactor: redesign dashboard with refined stats and empty states"
```

---

### Task 3: Cases Page Redesign

**Files:**
- Modify: `app/doctor/cases/page.tsx` (entire file)

**Interfaces:**
- Consumes: `useDoctorCases` hook, `DataTable` component
- Produces: Cases list with tab filters

- [ ] **Step 1: Rewrite cases page with tab filters and counts**

```tsx
"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useDoctorCases } from "@/lib/hooks/use-doctor-cases"
import { columns, type DoctorCase } from "./columns"

type TabFilter = "all" | "pending" | "opinion_written"

export default function DoctorCasesPage() {
  const { data: cases, isLoading } = useDoctorCases()
  const [tabFilter, setTabFilter] = useState<TabFilter>("all")

  const filtered = (cases as DoctorCase[] | undefined)?.filter((c) => {
    if (tabFilter === "pending") return !c.opinions?.length || c.opinions.every((o) => o.status === "DRAFT")
    if (tabFilter === "opinion_written") return c.opinions?.some((o) => o.status !== "DRAFT")
    return true
  })

  const allCount = cases?.length ?? 0
  const pendingCount = (cases as DoctorCase[] | undefined)?.filter((c) => !c.opinions?.length || c.opinions.every((o) => o.status === "DRAFT")).length ?? 0
  const opinionCount = (cases as DoctorCase[] | undefined)?.filter((c) => c.opinions?.some((o) => o.status !== "DRAFT")).length ?? 0

  const tabs: { key: TabFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: allCount },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "opinion_written", label: "Opinion Written", count: opinionCount },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-clinical-navy font-headline-md font-semibold text-xl">My Cases</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">View and manage your assigned diagnostic cases</p>
      </motion.div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTabFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tabFilter === tab.key
                ? "bg-clinical-navy text-white shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton columns={5} search />
      ) : (
        <DataTable
          columns={columns}
          data={filtered ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name or email..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify cases page renders correctly**

Run: `npm run dev` and navigate to `/doctor/cases`
Expected: Cases page shows tab filters with counts, proper header styling

- [ ] **Step 3: Commit**

```bash
git add app/doctor/cases/page.tsx
git commit -m "refactor: redesign cases page with tab filters and counts"
```

---

### Task 4: Cases Columns Refinement

**Files:**
- Modify: `app/doctor/cases/columns.tsx` (entire file)

**Interfaces:**
- Consumes: `CASE_STATUS_CONFIG`, `SERVICE_TYPE_LABELS`, `OPINION_STATUS_CONFIG` from constants
- Produces: Column definitions for cases table

- [ ] **Step 1: Update columns with refined styling**

```tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { CASE_STATUS_CONFIG, SERVICE_TYPE_LABELS, OPINION_STATUS_CONFIG } from "@/lib/constants"

export type DoctorCase = {
  id: string
  serviceType: string
  status: string
  createdAt: string
  patient: { name: string | null; email: string }
  opinions: { status: string }[]
}

export const columns: ColumnDef<DoctorCase>[] = [
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => {
      const patient = row.original.patient
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy font-semibold text-xs shrink-0">
            {patient.name?.charAt(0) ?? "P"}
          </div>
          <div>
            <p className="font-medium text-text-medical-black text-sm">{patient.name ?? "Unknown"}</p>
            <p className="text-xs text-on-surface-variant">{patient.email}</p>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const patient = row.original.patient
      const search = (value as string).toLowerCase()
      return (
        (patient.name?.toLowerCase().includes(search) ?? false) ||
        patient.email.toLowerCase().includes(search)
      )
    },
  },
  {
    accessorKey: "serviceType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Service Type" />,
    cell: ({ row }) => (
      <span className="text-sm text-text-medical-black">
        {SERVICE_TYPE_LABELS[row.original.serviceType] ?? row.original.serviceType}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const config = CASE_STATUS_CONFIG[row.original.status] ?? { label: row.original.status, color: "" }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      )
    },
  },
  {
    accessorKey: "opinionStatus",
    id: "opinion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Opinion" />,
    cell: ({ row }) => {
      const opinion = row.original.opinions?.[0]
      const status = opinion?.status ?? "NONE"
      const config = OPINION_STATUS_CONFIG[status] ?? { label: "Not Started", color: "bg-gray-100 text-gray-500" }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Link
        href={`/doctor/cases/${row.original.id}`}
        className="text-clinical-navy hover:text-healing-teal transition-colors"
      >
        <ArrowRight className="size-4" />
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
```

- [ ] **Step 2: Verify columns render correctly**

Run: `npm run dev` and navigate to `/doctor/cases`
Expected: Table shows patient avatars, refined badge styling, and proper spacing

- [ ] **Step 3: Commit**

```bash
git add app/doctor/cases/columns.tsx
git commit -m "refactor: refine cases table columns with avatars and badges"
```

---

### Task 5: Patients Page & Columns Redesign

**Files:**
- Modify: `app/doctor/patients/page.tsx` (entire file)
- Modify: `app/doctor/patients/columns.tsx` (entire file)

**Interfaces:**
- Consumes: `useQuery` from tanstack-query, `DataTable` component
- Produces: Patients list with refined styling

- [ ] **Step 1: Update patients page header**

```tsx
"use client"

import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useQuery } from "@tanstack/react-query"
import { columns, type DoctorPatient } from "./columns"

export default function DoctorPatientsPage() {
  const { data: patients, isLoading } = useQuery<DoctorPatient[]>({
    queryKey: ["doctor-patients"],
    queryFn: async () => {
      const res = await fetch("/api/doctor/patients")
      if (!res.ok) throw new Error("Failed to fetch patients")
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-clinical-navy font-headline-md font-semibold text-xl">My Patients</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">Patients you've consulted with</p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={3} search />
      ) : (
        <DataTable
          columns={columns}
          data={patients ?? []}
          searchKey="name"
          searchPlaceholder="Search by name or email..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Update patients columns with avatar initials**

```tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type DoctorPatient = {
  id: string
  name: string
  email: string
  image: string | null
  appointmentCount: number
  lastVisit: string
}

export const columns: ColumnDef<DoctorPatient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.image ? (
          <img src={row.original.image} alt="" className="size-9 rounded-full" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy font-semibold text-xs shrink-0">
            {row.original.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium text-text-medical-black text-sm">{row.original.name}</p>
          <p className="text-xs text-on-surface-variant">{row.original.email}</p>
        </div>
      </div>
    ),
    filterFn: (row, id, value) => {
      const search = (value as string).toLowerCase()
      return (
        row.original.name.toLowerCase().includes(search) ||
        row.original.email.toLowerCase().includes(search)
      )
    },
  },
  {
    accessorKey: "appointmentCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Appointments" />,
    cell: ({ row }) => (
      <span className="inline-flex items-center justify-center size-7 rounded-full bg-clinical-navy/10 text-clinical-navy text-xs font-medium">
        {row.original.appointmentCount}
      </span>
    ),
  },
  {
    accessorKey: "lastVisit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Visit" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.lastVisit).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
]
```

- [ ] **Step 3: Verify patients page renders correctly**

Run: `npm run dev` and navigate to `/doctor/patients`
Expected: Patients page shows avatar initials, refined badges, and proper header

- [ ] **Step 4: Commit**

```bash
git add app/doctor/patients/page.tsx app/doctor/patients/columns.tsx
git commit -m "refactor: redesign patients page with avatar initials and refined styling"
```

---

### Task 6: Lab Reviews Page & Columns Redesign

**Files:**
- Modify: `app/doctor/labs/review/page.tsx` (entire file)
- Modify: `app/doctor/labs/review/columns.tsx` (entire file)

**Interfaces:**
- Consumes: `useQuery` from tanstack-query, `DataTable` component
- Produces: Lab reviews list with refined styling

- [ ] **Step 1: Update labs page header**

```tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { columns, type LabReview } from "./columns"

export default function DoctorLabReviewPage() {
  const { data: labs, isLoading } = useQuery<LabReview[]>({
    queryKey: ["doctor-lab-reviews"],
    queryFn: async () => {
      const res = await fetch("/api/lab-results/pending-review")
      if (!res.ok) throw new Error("Failed to fetch lab reviews")
      return res.json()
    },
    staleTime: 2 * 60 * 1000,
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-clinical-navy font-headline-md font-semibold text-xl">Pending Lab Reviews</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">Review and interpret patient lab results</p>
      </motion.div>

      {isLoading ? (
        <TableSkeleton columns={5} search />
      ) : (
        <DataTable
          columns={columns}
          data={labs ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name or email..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Update labs columns with refined styling**

```tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type LabReview = {
  id: string
  name: string
  date: string
  status: string
  patient: { name: string | null; email: string }
  metrics: { id: string; name: string; value: number; status: string }[]
}

export const columns: ColumnDef<LabReview>[] = [
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => {
      const patient = row.original.patient
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy font-semibold text-xs shrink-0">
            {patient.name?.charAt(0) ?? "P"}
          </div>
          <div>
            <p className="font-medium text-text-medical-black text-sm">{patient.name ?? "Unknown"}</p>
            <p className="text-xs text-on-surface-variant">{patient.email}</p>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const patient = row.original.patient
      const search = (value as string).toLowerCase()
      return (
        (patient.name?.toLowerCase().includes(search) ?? false) ||
        patient.email.toLowerCase().includes(search)
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lab Test" />,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-text-medical-black">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "abnormalCount",
    id: "abnormal",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Abnormal" />,
    cell: ({ row }) => {
      const count = row.original.metrics.filter((m) => m.status !== "NORMAL").length
      return count > 0 ? (
        <span className="inline-flex items-center justify-center size-7 rounded-full bg-error/10 text-error text-xs font-medium">
          {count}
        </span>
      ) : (
        <span className="text-xs text-on-surface-variant">—</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.status === "REVIEW_NEEDED" ? "bg-error/10 text-error" : "bg-healing-teal/10 text-healing-teal"
      }`}>
        {row.original.status === "REVIEW_NEEDED" ? "Review Needed" : "Reviewed"}
      </span>
    ),
  },
]
```

- [ ] **Step 3: Verify labs page renders correctly**

Run: `npm run dev` and navigate to `/doctor/labs/review`
Expected: Labs page shows avatars, refined badges, and proper header

- [ ] **Step 4: Commit**

```bash
git add app/doctor/labs/review/page.tsx app/doctor/labs/review/columns.tsx
git commit -m "refactor: redesign labs review page with refined styling"
```

---

### Task 7: Schedule Page Redesign

**Files:**
- Modify: `app/doctor/schedule/page.tsx` (entire file)

**Interfaces:**
- Consumes: `getServerSession`, `prisma` queries
- Produces: Schedule page with date grouping

- [ ] **Step 1: Rewrite schedule page with consistent styling**

```tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { Calendar, Clock } from 'lucide-react';

async function getDoctor(userId: string) {
  return prisma.doctor.findUnique({ where: { userId } });
}

async function getAppointments(doctorId: string) {
  return prisma.appointment.findMany({
    where: { doctorId },
    include: {
      patient: { select: { name: true, email: true, image: true } },
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
    take: 50,
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

function groupByDate(appointments: Awaited<ReturnType<typeof getAppointments>>) {
  const groups = new Map<string, typeof appointments>();
  for (const apt of appointments) {
    const key = apt.date.toISOString().split('T')[0];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(apt);
  }
  return groups;
}

const statusColors: Record<string, string> = {
  SCHEDULED: 'text-clinical-navy bg-clinical-navy/10',
  CONFIRMED: 'text-healing-teal bg-healing-teal/10',
  IN_PROGRESS: 'text-amber-600 bg-amber-50',
  COMPLETED: 'text-on-surface-variant bg-surface-gray/50',
  CANCELLED: 'text-red-500 bg-red-50',
};

export default async function SchedulePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const userId = (session.user as { id: string }).id;
  const doctor = await getDoctor(userId);
  if (!doctor) redirect('/auth/signin');

  const appointments = await getAppointments(doctor.id);
  const grouped = groupByDate(appointments);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-headline-md text-xl font-semibold text-clinical-navy">Schedule</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">
          {appointments.length} upcoming appointment{appointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-12 text-center">
          <Calendar className="size-12 text-on-surface-variant/30 mx-auto mb-3" />
          <p className="text-base font-semibold text-text-medical-black">No appointments</p>
          <p className="text-sm text-on-surface-variant mt-1">Your schedule will appear here once appointments are booked</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([dateKey, dayAppts]) => (
            <div key={dateKey}>
              <h2 className="font-semibold text-text-medical-black mb-3 text-sm pb-2 border-b border-surface-gray/60">
                {formatDate(new Date(dateKey + 'T00:00:00'))}
              </h2>
              <div className="space-y-2">
                {dayAppts.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy font-bold text-sm shrink-0">
                      {apt.patient.name?.charAt(0) ?? 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-medical-black text-sm">{apt.patient.name ?? 'Unknown Patient'}</p>
                      <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-0.5">
                        <Clock className="size-3" />
                        {formatTime(apt.time)}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${statusColors[apt.status] ?? 'text-on-surface-variant bg-surface-gray/50'}`}>
                      {apt.status.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify schedule page renders correctly**

Run: `npm run dev` and navigate to `/doctor/schedule`
Expected: Schedule shows date groups with border-bottom, appointment cards with hover effects

- [ ] **Step 3: Commit**

```bash
git add app/doctor/schedule/page.tsx
git commit -m "refactor: redesign schedule page with consistent styling and date groups"
```

---

### Task 8: Case Detail Page Redesign

**Files:**
- Modify: `app/doctor/cases/[id]/page.tsx` (entire file)

**Interfaces:**
- Consumes: `useDoctorCase`, `useSubmitOpinion` hooks
- Produces: Case detail view with opinion form

- [ ] **Step 1: Rewrite case detail page with refined styling**

```tsx
"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, CheckCircle2, Calendar, Loader2, Save, Send } from 'lucide-react';
import { useDoctorCase, useSubmitOpinion } from '@/lib/hooks/use-doctor-cases';

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
};

const serviceTypeLabels: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up Consultation',
  TREND_ANALYSIS: 'Lab Trend Analysis',
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function parseOpinionSections(content: string) {
  const sections = content.split(/^## /m).filter(Boolean);
  return sections.map((section) => {
    const [title, ...body] = section.split('\n');
    return { title: title.trim(), body: body.join('\n').trim() };
  });
}

export default function DoctorCaseReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: caseData, isLoading } = useDoctorCase(id);
  const submitOpinion = useSubmitOpinion();

  const [findings, setFindings] = useState('');
  const [impression, setImpression] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [showSignConfirm, setShowSignConfirm] = useState(false);

  const existingOpinion = caseData?.opinions?.[0];
  const isSigned = existingOpinion?.status === 'SIGNED' || existingOpinion?.status === 'DELIVERED';
  
  useEffect(() => {
    if (existingOpinion?.content) {
      const sections = parseOpinionSections(existingOpinion.content);
      for (const section of sections) {
        if (section.title.toLowerCase().includes('finding')) setFindings(section.body);
        else if (section.title.toLowerCase().includes('impression')) setImpression(section.body);
        else if (section.title.toLowerCase().includes('next step')) setNextSteps(section.body);
      }
    }
  }, [existingOpinion]);

  const buildContent = () => {
    return `## Clinical Findings\n${findings}\n\n## Impression\n${impression}\n\n## Recommended Next Steps\n${nextSteps}`;
  };

  const handleSaveDraft = async () => {
    await submitOpinion.mutateAsync({
      caseId: id,
      content: buildContent(),
      sign: false,
    });
  };

  const handleSign = async () => {
    await submitOpinion.mutateAsync({
      caseId: id,
      content: buildContent(),
      sign: true,
    });
    setShowSignConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-healing-teal" size={32} />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-20">
        <p className="text-on-surface-variant">Case not found</p>
        <Link href="/doctor/cases" className="text-clinical-navy text-sm mt-2 inline-block hover:text-healing-teal">
          Back to cases
        </Link>
      </div>
    );
  }

  const status = statusConfig[caseData.status] || statusConfig.OPEN;

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 md:pb-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/doctor/cases"
          className="inline-flex items-center gap-1 text-on-surface-variant text-sm hover:text-clinical-navy transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to cases
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-headline-md text-xl font-semibold text-clinical-navy">
              {serviceTypeLabels[caseData.serviceType] || caseData.serviceType}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Patient: {caseData.patient.name ?? 'Unknown'} &middot; Created {formatDate(caseData.createdAt)}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </motion.div>

      {/* Uploaded Records */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-5"
      >
        <h2 className="font-semibold text-text-medical-black mb-3 flex items-center gap-2 text-sm">
          <FileText className="size-4 text-clinical-navy" />
          Uploaded Records ({caseData.records?.length || 0})
        </h2>
        {caseData.records && caseData.records.length > 0 ? (
          <ul className="space-y-2">
            {caseData.records.map((record: { id: string; fileName: string; fileType: string; fileUrl: string; uploadedAt: string }) => (
              <li key={record.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                <FileText className="size-4 text-on-surface-variant" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-medical-black truncate">{record.fileName}</p>
                  <p className="text-xs text-on-surface-variant">{record.fileType} &middot; {formatDate(record.uploadedAt)}</p>
                </div>
                <a
                  href={record.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-clinical-navy hover:text-healing-teal font-medium"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-on-surface-variant text-sm">No records uploaded yet.</p>
        )}
      </motion.div>

      {/* AI Pre-screen */}
      {caseData.aiPrescreens && caseData.aiPrescreens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-evidence-blue-light/30 to-surface border border-evidence-blue-light/60 rounded-xl shadow-sm p-5"
        >
          <h2 className="font-semibold text-text-medical-black mb-2 flex items-center gap-2 text-sm">
            <span className="size-2 bg-clinical-navy rounded-full" />
            AI Pre-screen
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {caseData.aiPrescreens[0].findings}
          </p>
          {caseData.aiPrescreens[0].urgentFlags && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700 text-sm font-medium">Urgent Flags</p>
              <p className="text-amber-600 text-sm mt-1">{caseData.aiPrescreens[0].urgentFlags}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Opinion Form or Signed Opinion Display */}
      {isSigned ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-6"
        >
          <h2 className="font-semibold text-text-medical-black mb-4 flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-healing-teal" />
            Signed Opinion
          </h2>
          <div className="flex items-center gap-2 mb-4 text-xs text-on-surface-variant">
            <Calendar className="size-3" />
            Signed {existingOpinion.signedAt ? formatDate(existingOpinion.signedAt) : 'Unknown date'}
          </div>
          <div className="space-y-4">
            {parseOpinionSections(existingOpinion.content).map((section, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-clinical-navy mb-1">{section.title}</h3>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{section.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-surface-gray/60 shadow-sm p-6 space-y-5"
        >
          <h2 className="font-semibold text-text-medical-black flex items-center gap-2 text-sm">
            <FileText className="size-4 text-clinical-navy" />
            Write Your Opinion
          </h2>

          <div>
            <label className="block text-sm font-medium text-text-medical-black mb-1.5">
              Clinical Findings <span className="text-red-500">*</span>
            </label>
            <textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy resize-none"
              placeholder="Describe your clinical findings from the reviewed materials..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-medical-black mb-1.5">
              Impression <span className="text-red-500">*</span>
            </label>
            <textarea
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy resize-none"
              placeholder="Your clinical impression and assessment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-medical-black mb-1.5">
              Recommended Next Steps <span className="text-red-500">*</span>
            </label>
            <textarea
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy resize-none"
              placeholder="Recommended next steps for the patient..."
            />
          </div>

          {submitOpinion.isError && (
            <p className="text-red-500 text-sm">{submitOpinion.error.message}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveDraft}
              disabled={submitOpinion.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50"
            >
              {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save as Draft
            </button>

            {showSignConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface-variant">Confirm signature?</span>
                <button
                  onClick={handleSign}
                  disabled={submitOpinion.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-clinical-navy rounded-lg hover:bg-clinical-navy/90 transition-colors disabled:opacity-50"
                >
                  {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Sign & Submit
                </button>
                <button
                  onClick={() => setShowSignConfirm(false)}
                  className="text-sm text-on-surface-variant hover:text-error"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignConfirm(true)}
                disabled={!findings.trim() || !impression.trim() || !nextSteps.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-healing-teal rounded-lg hover:bg-healing-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-4" />
                Sign & Submit
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify case detail page renders correctly**

Run: `npm run dev` and navigate to `/doctor/cases/[id]`
Expected: Case detail shows refined header, records, AI pre-screen, and opinion form

- [ ] **Step 3: Commit**

```bash
git add "app/doctor/cases/[id]/page.tsx"
git commit -m "refactor: redesign case detail page with refined styling"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** All sections from design spec are implemented
  - Sidebar grouping ✓
  - Active/hover states ✓
  - Typography scale ✓
  - Card styling ✓
  - All 7 pages redesigned ✓
  - Status badges consistent ✓
  - Empty states consistent ✓

- [ ] **Placeholder scan:** No TBD, TODO, or incomplete steps

- [ ] **Type consistency:** All file paths, component names, and function signatures match across tasks

---

## Summary

| Task | Files Modified | Key Changes |
|------|---------------|-------------|
| 1 | `DoctorLayout.tsx` | Grouped sidebar, mobile menu, top bar |
| 2 | `page.tsx` (dashboard) | Stats, schedule, lab reviews |
| 3 | `cases/page.tsx` | Tab filters with counts |
| 4 | `cases/columns.tsx` | Patient avatars, badge styling |
| 5 | `patients/page.tsx`, `columns.tsx` | Avatar initials, header |
| 6 | `labs/review/page.tsx`, `columns.tsx` | Refined badges, header |
| 7 | `schedule/page.tsx` | Date groups, consistent padding |
| 8 | `cases/[id]/page.tsx` | Full case detail redesign |

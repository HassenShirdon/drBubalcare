"use client"

import { signOut } from "next-auth/react"
import { LogOut, User, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface AdminUserButtonProps {
  name: string | null
  email: string | null
}

export function AdminUserButton({ name, email }: AdminUserButtonProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = (name ?? email ?? "A")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-[#64748B] hover:text-[#1E3A5F] transition-colors"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: '#1E3A5F' }}>
          {initials}
        </div>
        <span className="hidden sm:inline max-w-[120px] truncate text-[#64748B]">{name ?? email}</span>
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-lg z-50 overflow-hidden bg-white" style={{ borderColor: '#E2E8F0' }}>
          <div className="px-4 py-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-[#DBEAFE] text-[#3B82F6]">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate text-[#0F172A]">{name ?? "Admin"}</p>
                <p className="text-[11px] truncate text-[#64748B]">{email}</p>
              </div>
            </div>
          </div>

          <div className="py-1.5">
            <button
              onClick={() => {
                window.location.href = "/admin"
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
              <User className="size-4 text-[#64748B]" />
              Profile
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#E63946] hover:bg-[#FEF2F2] transition-colors"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

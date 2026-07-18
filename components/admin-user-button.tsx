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
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-[11px] font-bold text-white">
          {initials}
        </div>
        <span className="hidden sm:inline max-w-[120px] truncate">{name ?? email}</span>
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-surface-gray bg-white shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-gray/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy text-sm font-bold">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-medical-black truncate">{name ?? "Admin"}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{email}</p>
              </div>
            </div>
          </div>

          <div className="py-1.5">
            <button
              onClick={() => {
                window.location.href = "/admin"
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-text-medical-black hover:bg-surface transition-colors"
            >
              <User className="size-4 text-on-surface-variant" />
              Profile
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-error hover:bg-red-50 transition-colors"
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

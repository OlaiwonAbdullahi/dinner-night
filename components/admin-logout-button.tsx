"use client"

import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Logout01Icon } from "@hugeicons/core-free-icons"

export function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/30 hover:bg-white/5 hover:text-white transition-colors"
    >
      <HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" />
      Logout
    </button>
  )
}

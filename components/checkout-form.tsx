"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export type CheckoutValues = {
  name: string
  email: string
  phone: string
  department: string
}

type Props = {
  onSubmit: (values: CheckoutValues) => void
  onBack: () => void
  isLoading?: boolean
  totalLabel: string
}

export function CheckoutForm({ onSubmit, onBack, isLoading, totalLabel }: Props) {
  const [values, setValues] = useState<CheckoutValues>({ name: "", email: "", phone: "", department: "" })
  const [departmentSelect, setDepartmentSelect] = useState("")
  const [errors, setErrors] = useState<Partial<CheckoutValues>>({})

  function handleDepartmentSelectChange(val: string) {
    setDepartmentSelect(val)
    if (val !== "Other") {
      setValues((prev) => ({ ...prev, department: val }))
    } else {
      setValues((prev) => ({ ...prev, department: "" }))
    }
  }

  function validate(): boolean {
    const e: Partial<CheckoutValues> = {}
    if (!values.name.trim()) e.name = "Name is required"
    if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      e.email = "Valid email is required"
    if (!values.phone.trim() || values.phone.replace(/\D/g, "").length < 10)
      e.phone = "Valid phone number is required"
    if (!values.department.trim()) e.department = "Please select your department"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-[11px] font-semibold tracking-wider text-white/30 uppercase">
        Your details
      </p>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/50">Full Name</label>
        <input
          type="text"
          placeholder="e.g. John Doe"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors"
        />
        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/50">Department</label>
        <div className="grid grid-cols-3 gap-2">
          {["Cyber Security", "Computer Science", "Other"].map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => handleDepartmentSelectChange(dept)}
              className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition
                ${
                  departmentSelect === dept
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-primary/40 hover:text-white"
                }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {departmentSelect === "Other" && (
          <input
            type="text"
            placeholder="Enter your department"
            value={values.department}
            onChange={(e) => setValues({ ...values, department: e.target.value })}
            className="mt-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors"
          />
        )}

        {errors.department && <p className="text-xs text-red-400">{errors.department}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/50">Email Address</label>
        <input
          type="email"
          placeholder="e.g. john@email.com"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors"
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/50">Phone Number</label>
        <input
          type="tel"
          placeholder="e.g. 08012345678"
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors"
        />
        {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
      </div>

      <div className="mt-2 flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 border-white/15 text-white/50 hover:text-white"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="submit"
          size="sm"
          className="flex-1 bg-primary text-black hover:bg-primary/80 font-extrabold tracking-wide"
          disabled={isLoading}
        >
          {isLoading ? "Processing…" : `Pay ${totalLabel}`}
        </Button>
      </div>
    </form>
  )
}
import React from 'react'
export default function Shell({ children }:{ children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] text-[var(--text)]">
      <header className="h-16 border-b border-border bg-white flex items-center px-4 justify-between">
        <div className="flex items-center gap-3">
          <img src="/public/anyai-logo.png" alt="AnyAI" className="h-7" />
          <span className="sr-only">AnyAI</span>
        </div>
        <div className="flex items-center gap-2">{/* actions */}</div>
      </header>
      <div className="flex">
        <aside className="hidden lg:block w-64 border-r border-border bg-white"></aside>

        <main className="flex-1 p-6 max-w-container mx-auto">{children}</main>
      </div>

    </div>

  )

}

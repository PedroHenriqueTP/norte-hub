export default function SystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-norte-graphite text-white flex">
      <aside className="w-64 border-r border-white/5 p-6 glass-card rounded-none">
        {/* Sidebar comum para todos os sistemas */}
        <nav className="space-y-4">
          <div className="h-2 w-12 bg-norte-accent rounded mb-8" />
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-3/4 bg-white/5 rounded" />
        </nav>
      </aside>
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}

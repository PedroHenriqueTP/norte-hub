export default function PersonalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-norte-graphite text-white">
      <main className="w-full min-h-screen">
        {children}
      </main>
    </div>
  );
}

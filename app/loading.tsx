export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,61,46,0.15) 0%, transparent 60%)" }} />
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-white/5" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-2 w-12 h-12 rounded-full border-2 border-transparent border-b-accent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="label text-text-muted">SKILLVERSE</p>
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer({ onGoto }) {
  return (
    <footer className="w-full px-4 py-10 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-full max-w-md mx-auto">
        <div className="text-lg font-black tracking-[0.15em] leading-tight text-white mb-1">
          BUSINESS<br />BEAST
        </div>
        <div className="text-sm text-muted tracking-[0.1em] mb-6">Coffee Club</div>

        <button onClick={() => onGoto("#buy")}
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-200 active:scale-90 touch-action-manipulation"
          style={{ background: "rgba(200,146,43,0.15)", color: "#c8922b" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>

        <div className="flex flex-col gap-1 text-xs text-muted">
          <span className="text-[10px] tracking-[0.15em] uppercase mb-1" style={{ color: "#f5d68e" }}>Kontakt</span>
          <span>kontakt@businessbeast.pl</span>
          <span>+48 500 100 200</span>
        </div>

        <div className="mt-8 text-[11px] text-muted/50">
          &copy; {new Date().getFullYear()} Business Beast Coffee Club
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Header({ onGoto }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const st1 = ScrollTrigger.create({
      start: 80, end: 99999,
      onToggle: (self) => document.body.classList.toggle("scrolled", self.isActive),
    });
    const st2 = ScrollTrigger.create({
      trigger: "#buy", start: "top 65%",
      onToggle: (self) => document.body.classList.toggle("hide-brand", self.isActive),
    });
    return () => { st1.kill(); st2.kill(); };
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".brand-mark .wordmark, .brand-mark .sub",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.3 }
    );
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (toggleRef.current && !toggleRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const go = (id) => {
    onGoto(id);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
      style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        ref={toggleRef}
        className={`relative flex flex-col gap-[5px] cursor-pointer min-w-[48px] min-h-[48px] items-center justify-center ${open ? "open" : ""}`}
        onClick={(e) => {
          if (e.target.closest("button[data-goto]")) return;
          setOpen((v) => !v);
        }}
      >
        <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${open ? "rotate-45 translate-y-[3.5px]" : ""}`} style={{ background: "#f5d68e" }}></span>
        <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${open ? "opacity-0" : ""}`} style={{ background: "#f5d68e" }}></span>
        <span className={`block w-5 h-[2px] rounded-full transition-all duration-300 ${open ? "-rotate-45 -translate-y-[3.5px]" : ""}`} style={{ background: "#f5d68e" }}></span>

        <nav className={`absolute top-full left-0 mt-2 flex flex-col gap-1 p-2 rounded-xl transition-all duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          style={{ background: "rgba(20,20,20,0.95)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", minWidth: "200px", transform: open ? "translateY(0)" : "translateY(-8px)" }}>
          <button data-goto onClick={() => go("#buy")} className="w-full text-left px-4 py-3 rounded-lg text-sm text-muted hover:text-white transition-colors">Zakup Kawy</button>
          <button data-goto onClick={() => go("#mission")} className="w-full text-left px-4 py-3 rounded-lg text-sm text-muted hover:text-white transition-colors">Informacje o Grupie</button>
          <button data-goto onClick={() => go("#faq")} className="w-full text-left px-4 py-3 rounded-lg text-sm text-muted hover:text-white transition-colors">FAQ</button>
        </nav>
      </div>

      <button className="flex flex-col items-center cursor-pointer select-none" onClick={() => go("#buy")}>
        <span className="text-xs font-bold tracking-[0.15em]" style={{ color: "#f5d68e" }}>BUSINESS BEAST</span>
        <span className="text-[10px] tracking-[0.15em] text-muted">Coffee Club</span>
      </button>

      <span className="w-[48px]"></span>
    </header>
  );
}

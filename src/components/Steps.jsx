import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const STEPS = [
  { num: "01", emoji: "🧍", title: "Zeskanuj kod", side: "left", text: "Znajdź kod QR na wieczku opakowania (zaznaczony czerwoną obwódką) i zeskanuj go telefonem." },
  { num: "02", emoji: "🕴️", title: "Dołącz do grupy", side: "right", text: "Link przekieruje Cię prosto do zamkniętej grupy Business Beast — potwierdź dołączenie jednym kliknięciem." },
  { num: "03", emoji: "💼", title: "Potwierdź kod z paczki", side: "left", text: "Wpisz unikalny kod z opakowania w wyznaczonym polu, aby zweryfikować swój zakup." },
  { num: "04", emoji: "👑", title: "Odbierz status Bestii", side: "right", text: "Masz dostęp do rabatów, dropów limitowanych i społeczności, która gra o wyższą stawkę." },
];

export default function Steps() {
  const pathRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: pathRef.current, start: "top 70%", end: "bottom 70%", scrub: 0.4 } }
      );
      gsap.utils.toArray(".step").forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: step, start: "top 82%", toggleActions: "play reverse play reverse" } }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full px-4 py-16 md:py-24" id="how">
      <div className="w-full max-w-md mx-auto md:max-w-2xl text-center mb-10">
        <span className="inline-block text-[11px] tracking-[0.2em] uppercase mb-2 text-brand">Instrukcja</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">Wejdź do środka<br />w 4 krokach</h2>
      </div>

      <div className="relative w-full max-w-md mx-auto" ref={pathRef}>
        <div className="steps-line" ref={lineRef} style={{ willChange: "transform" }}></div>
        {STEPS.map((s, i) => (
          <div className={`step flex items-start gap-4 mb-10 last:mb-0 ${i % 2 === 0 ? "" : "flex-row-reverse"}`} key={s.num}>
            <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full z-10" style={{ background: "rgba(200,146,43,0.12)" }}>
              <span className="sr-only">{s.num}</span>
              <span className="text-lg">{s.emoji}</span>
              <div className="ring"></div>
            </div>
            <div className={`flex-1 min-w-0 ${i % 2 === 0 ? "text-left" : "text-right"}`}>
              <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
              <p className="text-xs leading-relaxed text-muted">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

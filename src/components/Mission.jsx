import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const MISSION_TEXT =
  "Nie robimy kawy dla wszystkich. Robimy ją dla tych, którzy budują coś swojego — nie śpiąc, nie czekając na pozwolenie. Business Beast to nie tylko blend. To wejściówka do grupy ludzi, którzy wymieniają się kontaktami zamiast plotkami, i okazjami zamiast wymówkami.";

export default function Mission() {
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: textRef.current, start: "top 75%", end: "bottom 55%", scrub: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full px-4 py-16 md:py-24" id="mission">
      <div className="w-full max-w-md mx-auto md:max-w-2xl text-center">
        <span className="inline-block text-[11px] tracking-[0.2em] uppercase mb-3 text-brand">Misja</span>
        <p ref={textRef} className="text-base md:text-lg leading-relaxed text-muted" style={{ willChange: "clip-path" }}>
          {MISSION_TEXT}
        </p>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaLeaf, FaFire, FaCube } from "react-icons/fa6";

export default function Buy({ onBuy }) {
  const bagRef = useRef(null);
  const wrapRef = useRef(null);
  const ctaRef = useRef(null);
  const chompRef = useRef(null);
  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bagRef.current,
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: wrapRef.current, start: "top 85%" } }
      );
      gsap.fromTo(
        bagRef.current,
        { rotateY: 0 },
        { rotateY: 180, ease: "none", scrollTrigger: { trigger: wrapRef.current, start: "top bottom", end: "bottom top", scrub: 0.4 } }
      );
      gsap.fromTo(
        chompRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power2.inOut", scrollTrigger: { trigger: ctaRef.current, start: "top 90%", once: true } }
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const progress = self.progress;
          const scale = 1 + progress * 0.15;
          if (pinWrapRef.current) {
            gsap.set(pinWrapRef.current, { scale });
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full px-4 py-16 md:py-24 overflow-hidden" id="buy" ref={sectionRef}>
      <div className="w-full max-w-md mx-auto md:max-w-2xl pinned-zoom" ref={pinWrapRef}>
        <div className="flex flex-col md:flex-row md:items-center md:gap-10">
          <div ref={wrapRef} className="flex justify-center mb-8 md:mb-0 md:flex-1 buy-bag-wrap">
            <div className="buy-bag" ref={bagRef}>
              <div className="bag-qr" />
              <div className="bag-label">BUSINESS<br />BEAST</div>
            </div>
          </div>

          <div className="md:flex-1">
            <span className="inline-block text-[11px] tracking-[0.15em] uppercase mb-3 px-3 py-1 text-brand" style={{ border: "1px solid rgba(200,146,43,0.3)" }}>
              Business Beast — Signature Blend
            </span>

            <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 text-white">
              Pierwszy łyk to<br />dopiero początek.
            </h3>

            <p className="text-sm leading-relaxed mb-5 text-muted">
              Ciemno palona arabica z nuta kakao i palonego drewna. Na wieczku kod,
              który otwiera Ci drzwi do zamkniętej grupy Bestii — rabaty, dropy
              limitowane, kontakty które się liczą.
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5" style={{ background: "rgba(200,146,43,0.1)", color: "#f5d68e" }}>
                <FaLeaf className="w-3 h-3" /> Kakao
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5" style={{ background: "rgba(200,146,43,0.1)", color: "#f5d68e" }}>
                <FaFire className="w-3 h-3" /> Palone Drewno
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5" style={{ background: "rgba(200,146,43,0.1)", color: "#f5d68e" }}>
                <FaCube className="w-3 h-3" /> Ciemna Czekolada
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="flex flex-col items-center py-3 px-2 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                <b className="text-sm text-white">250g</b>
                <span className="text-[11px] text-muted mt-0.5">Ziarno / mielona</span>
              </div>
              <div className="flex flex-col items-center py-3 px-2 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                <b className="text-sm text-white">4.9</b>
                <span className="text-[11px] text-muted mt-0.5">Ocena klubu</span>
              </div>
              <div className="flex flex-col items-center py-3 px-2 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                <b className="text-sm text-white">24h</b>
                <span className="text-[11px] text-muted mt-0.5">Wysyłka</span>
              </div>
            </div>

            <button ref={ctaRef} onClick={onBuy}
              className="relative w-full h-12 overflow-hidden font-bold text-sm tracking-wider touch-action-manipulation active:scale-[0.97] transition-transform duration-150"
              style={{ background: "linear-gradient(135deg, #c8922b, #a67a1e)", color: "#fff" }}>
              <span ref={chompRef} className="chomp-clip" />
              <span className="relative z-10">Kup Kawę</span>
            </button>

            <p className="text-[11px] text-center text-muted mt-3">
              Bezpieczna płatność przez PayU · Wysyłka w 24h
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

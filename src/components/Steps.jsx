import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaQrcode, FaUsers, FaFileCode, FaCrown,
  FaArrowRight, FaCheck, FaMobileScreen, FaUserPlus,
} from "react-icons/fa6";

const STEPS = [
  {
    icon: FaQrcode,
    title: "Zeskanuj kod",
    text: "Znajdz kod QR na wieczku opakowania i zeskanuj go telefonem, aby rozpoczac proces weryfikacji.",
    preview: {
      icon: FaMobileScreen,
      title: "Zeskanuj kod QR",
      desc: "Przyloz aparat telefonu do kodu QR na wieczku opakowania. To Twoj pierwszy krok do srodka.",
    },
  },
  {
    icon: FaUsers,
    title: "Dolacz do grupy",
    text: "Link przekieruje Cie do zamknietej grupy Business Beast, gdzie czeka spolecznosc.",
    preview: {
      icon: FaUserPlus,
      title: "Dolacz do grupy",
      desc: "Kliknij w link i potwierdz dołączenie. Grupa jest zamknieta — tylko prawdziwe Bestie maja wstep.",
    },
  },
  {
    icon: FaFileCode,
    title: "Potwierdz kod",
    text: "Wpisz unikalny kod z opakowania w wyznaczonym polu, aby zweryfikowac swoj zakup.",
    preview: {
      icon: FaCheck,
      title: "Zweryfikuj zakup",
      desc: "Kod z opakowania to Twoj jednorazowy klucz. Wpisz go, aby odblokowac pelen dostep.",
    },
  },
  {
    icon: FaCrown,
    title: "Odbierz status Bestii",
    text: "Masz dostep do rabatow, dropow limitowanych i spolecznosci, ktora gra o wyzsza stawke.",
    preview: {
      icon: FaCrown,
      title: "Status Bestii",
      desc: "Gotowe! Od teraz nalezysz do elity. Rabaty, dropy i kontakty — to wszystko czeka na Ciebie.",
    },
  },
];

const PREVIEW_DATA = [
  ...STEPS.map((s) => s.preview),
  {
    icon: FaCrown,
    title: "Gotowe!",
    desc: "To juz koniec — dolacz do nas! Masz wszystko, czego potrzebujesz.",
    cta: "Kup kawe i wejdz do srodka",
  },
];

const SECTION_HEIGHT = 500;

export default function Steps() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const onUpdate = useCallback((self) => {
    const p = self.progress;
    const idx = p < 0.05 ? -1 : p < 0.25 ? 0 : p < 0.45 ? 1 : p < 0.65 ? 2 : p < 0.82 ? 3 : 4;
    setActiveIdx(idx);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    if (!section || !pinEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: pinEl,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate,
      });
    });

    return () => ctx.revert();
  }, [onUpdate]);

  const preview = PREVIEW_DATA[activeIdx >= 0 && activeIdx < 5 ? activeIdx : -1];
  const PreviewIcon = preview?.icon || null;

  return (
    <section ref={sectionRef} className="relative" id="steps" style={{ height: `${SECTION_HEIGHT}vh` }}>
      <div
        ref={pinRef}
        className="w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        <div className="w-full h-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col md:grid md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="flex flex-col justify-center mt-6 md:mt-0">
            <span className="inline-block text-[11px] tracking-[0.2em] uppercase mb-2 text-brand">Instrukcja</span>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-6 md:mb-10">
              Wejdz do srodka w 4 krokach
            </h2>

            <div className="flex flex-col gap-4 md:gap-5">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = activeIdx === i;
                const isPast = activeIdx > i;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 transition-all duration-500"
                    style={{
                      opacity: isActive ? 1 : isPast ? 0.5 : 0.35,
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-12 h-12 flex-shrink-0 transition-all duration-500"
                      style={{
                        background: isActive ? "rgba(200,146,43,0.18)" : "rgba(255,255,255,0.04)",
                        borderLeft: isActive ? "3px solid #c8922b" : "3px solid transparent",
                      }}
                    >
                      <Icon
                        className="w-5 h-5 transition-colors duration-500"
                        style={{ color: isActive ? "#f5d68e" : "#6b7280" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h4
                        className="text-sm font-bold transition-colors duration-500"
                        style={{ color: isActive ? "#ffffff" : "#6b7280" }}
                      >
                        {s.title}
                      </h4>
                      <p
                        className="text-xs leading-relaxed transition-colors duration-500 mt-0.5"
                        style={{ color: isActive ? "#9ca3af" : "#4b5563" }}
                      >
                        {s.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div
              className="w-full transition-all duration-500"
              style={{
                minHeight: "280px",
                background: activeIdx >= 0 ? "rgba(200,146,43,0.04)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${activeIdx >= 0 ? "rgba(200,146,43,0.15)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              {preview && PreviewIcon ? (
                <div className="flex flex-col items-center justify-center text-center p-8 md:p-10 h-full min-h-[280px]">
                  <div
                    className="flex items-center justify-center w-20 h-20 mb-5 transition-all duration-500"
                    style={{
                      background: activeIdx === 4 ? "rgba(200,146,43,0.15)" : "rgba(200,146,43,0.1)",
                      transform: activeIdx === 4 ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <PreviewIcon
                      className="w-8 h-8"
                      style={{ color: activeIdx === 4 ? "#f5d68e" : "#c8922b" }}
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{preview.title}</h3>
                  <p className="text-sm text-muted max-w-xs">{preview.desc}</p>
                  {preview.cta && (
                    <button
                      className="mt-6 h-12 px-8 font-bold text-sm tracking-wider text-white transition-transform duration-150 active:scale-[0.97]"
                      style={{ background: "linear-gradient(135deg, #c8922b, #a67a1e)" }}
                      onClick={() => {
                        document.querySelector("#buy")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {preview.cta}
                      <FaArrowRight className="inline-block ml-2 w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[280px]">
                  <p className="text-sm text-muted">Przewin aby zobaczyc kolejne kroki...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

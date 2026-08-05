import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaQrcode, FaUsers, FaFileCode, FaCrown,
  FaLeaf, FaFire, FaCube,
} from "react-icons/fa6";
import CoffeeCup from "./CoffeeCup";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    icon: FaQrcode,
    title: "Zeskanuj kod",
    text: "Znajdz kod QR na wieczku opakowania i zeskanuj go telefonem.",
  },
  {
    icon: FaUsers,
    title: "Dolacz do grupy",
    text: "Link przekieruje Cie do zamknietej grupy Business Beast.",
  },
  {
    icon: FaFileCode,
    title: "Potwierdz kod",
    text: "Wpisz unikalny kod z opakowania, aby zweryfikowac swoj zakup.",
  },
  {
    icon: FaCrown,
    title: "Odbierz status Bestii",
    text: "Dostep do rabatow, dropow limitowanych i spolecznosci.",
  },
];

const SECTION_HEIGHT = 700;
const PAD = 32;
const TILT = -30;

// Timeline phase boundaries (fractions of the pinned scroll progress)
const ENTRY_END = 0.05;
const PRODUCT_OUT = 0.25;
const TILT_START = 0.1;
const STREAM_START = 0.2;
const STREAM_DUR = 0.72;

const round = (v) => Math.round(v * 10) / 10;

function catmullRomPath(points) {
  if (!points || points.length < 2) return "";
  const n = points.length;
  let d = `M ${round(points[0].x)} ${round(points[0].y)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(n - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(p2.x)} ${round(p2.y)}`;
  }
  return d;
}

export default function Steps({ onBuy }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const svgRef = useRef(null);
  const streamPathRef = useRef(null);
  const tiltRef = useRef(null);
  const productRef = useRef(null);
  const productTagRef = useRef(null);
  const stepsHeaderRef = useRef(null);
  const stepsRef = useRef(null);
  const thresholdsRef = useRef([0.25, 0.5, 0.75, 0.95]);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Build the stream path after layout so its very first point is the cup's pour point.
  const buildPath = useCallback(() => {
    const pin = pinRef.current;
    const svg = svgRef.current;
    const path = streamPathRef.current;
    const tiltGroup = tiltRef.current;
    if (!pin || !svg || !path || !tiltGroup) return;

    const area = pin.getBoundingClientRect();
    const W = area.width;
    const H = area.height;
    if (!W || !H) return;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const toLocal = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - area.left, y: r.top - area.top, w: r.width, h: r.height };
    };

    // Measure the pour point with the cup at its final tilt, then reset.
    const pourEl = tiltGroup.querySelector("[data-pour-point]");
    let P0 = { x: Math.max(20, W * 0.1), y: 140 };
    if (pourEl) {
      gsap.set(tiltGroup, { rotation: TILT, svgOrigin: "110 150" });
      const pp = pourEl.getBoundingClientRect();
      gsap.set(tiltGroup, { rotation: 0, svgOrigin: "110 150" });
      P0 = { x: pp.left - area.left + pp.width / 2, y: pp.top - area.top + pp.height / 2 };
    }

    const cards = [...pin.querySelectorAll("[data-card]")].map(toLocal);
    if (!cards.length) return;

    // Even card sits on the RIGHT -> stream runs on its LEFT.
    // Odd  card sits on the LEFT  -> stream runs on its RIGHT.
    const sideX = (c, i) => {
      if (i % 2 === 0) return Math.max(c.x - PAD, 14);
      return Math.min(c.x + c.w + PAD, W - 14);
    };

    const points = [];

    // 1) Pour point — the true origin of the stream.
    points.push({ x: P0.x, y: P0.y });

    // 2) Gravity: fall downward from the cup before the snake begins.
    const node0 = { x: sideX(cards[0], 0), y: cards[0].y + cards[0].h / 2 };
    const fallLen = Math.max(90, node0.y - P0.y - 60);
    points.push({ x: P0.x, y: P0.y + fallLen * 0.5 });
    points.push({ x: P0.x + (node0.x - P0.x) * 0.6, y: P0.y + fallLen * 0.92 });
    points.push(node0);

    // 3) Snake between the alternating cards.
    cards.forEach((c, i) => {
      const cy = c.y + c.h / 2;
      const x = sideX(c, i);
      if (i > 0) points.push({ x, y: cy });
      if (i < cards.length - 1) {
        const next = cards[i + 1];
        const nextX = sideX(next, i + 1);
        const midY = (cy + next.y + next.h / 2) / 2;
        points.push({ x, y: midY });
        points.push({ x: nextX, y: midY });
      }
    });

    // 4) Exit below the last card.
    const last = cards[cards.length - 1];
    const exitY = Math.min(last.y + last.h + 90, H - 12);
    points.push({ x: sideX(last, cards.length - 1), y: exitY });

    const d = catmullRomPath(points);
    path.setAttribute("d", d);

    // Thresholds: path-length fraction at each card node (polyline approximation).
    const nodeIdx = [0, 1, 2, 3].map((i) => 3 + 3 * i);
    let cum = 0;
    const lens = [0];
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      cum += Math.hypot(b.x - a.x, b.y - a.y);
      lens.push(cum);
    }
    thresholdsRef.current = nodeIdx.map((idx) => lens[idx] / (cum || 1));
  }, []);

  useEffect(() => {
    let ctx;

    const init = () => {
      ctx?.revert();
      ctx = gsap.context(() => {
        buildPath();

        // Canonical draw-on: dash = full length, offset = full length (hidden),
        // animate offset -> 0 so the line draws FORWARD from the cup.
        const path = streamPathRef.current;
        const totalLen = path.getTotalLength();
        if (totalLen > 0) {
          path.style.strokeDasharray = `${totalLen} ${totalLen}`;
          path.style.strokeDashoffset = `${totalLen}`;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: pinRef.current,
            pinSpacing: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const sp = Math.min(1, Math.max(0, (p - STREAM_START) / STREAM_DUR));
              const th = thresholdsRef.current;
              let idx = -1;
              for (let i = 0; i < th.length; i++) {
                if (sp >= th[i]) idx = i;
              }
              setActiveIdx(idx);
            },
          },
        });

        // Entry micro-animations for the product screen.
        tl.fromTo(
          "[data-product-item]",
          { opacity: 0, x: (i) => (i % 2 === 0 ? -26 : 26) },
          { opacity: 1, x: 0, duration: 0.05, ease: "power3.out", stagger: 0.012 },
          0
        );

        // Product screen lifts and fades out.
        tl.fromTo(
          productRef.current,
          { yPercent: 0, opacity: 1 },
          { yPercent: -14, opacity: 0, duration: PRODUCT_OUT, ease: "power1.in" },
          ENTRY_END
        );

        // Product tag fades, steps header fades in.
        tl.fromTo(productTagRef.current, { opacity: 1 }, { opacity: 0, duration: 0.08, ease: "power1.in" }, 0.1);
        tl.fromTo(
          stepsHeaderRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" },
          0.14
        );

        // Cup tilts as the transition begins.
        tl.fromTo(
          tiltRef.current,
          { rotation: 0, svgOrigin: "110 150" },
          { rotation: TILT, svgOrigin: "110 150", duration: 0.14, ease: "power2.out" },
          TILT_START
        );

        // Onboarding cards slide up.
        tl.fromTo(
          stepsRef.current,
          { yPercent: 100, opacity: 0.4 },
          { yPercent: 0, opacity: 1, duration: 0.18, ease: "power2.out" },
          0.18
        );

        // Stream draws forward from the cup — starts AFTER the tilt begins.
        tl.fromTo(
          streamPathRef.current,
          { strokeDashoffset: totalLen },
          { strokeDashoffset: 0, duration: STREAM_DUR, ease: "none" },
          STREAM_START
        );
      }, sectionRef.current);
    };

    init();

    let t = null;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        init();
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      ctx?.revert();
    };
  }, [buildPath]);

  return (
    <section ref={sectionRef} id="steps" className="relative" style={{ height: `${SECTION_HEIGHT}vh` }}>
      <div ref={pinRef} id="buy" className="pin-screen relative w-full overflow-hidden">
        {/* Single continuous coffee stream — painted UNDER the cup and cards */}
        <svg
          ref={svgRef}
          className="absolute inset-0 z-10 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={streamPathRef}
            fill="none"
            stroke="#7a4a24"
            strokeWidth="9"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ filter: "drop-shadow(0 0 6px rgba(122,74,36,0.55))" }}
          />
        </svg>

        <div className="relative z-20 w-full h-full flex flex-col">
          {/* Top bar: the cup (true origin) + product tag / steps header */}
          <div className="flex items-start justify-between gap-3 px-4 pt-3 md:px-8 md:pt-5">
            <div className="w-[38%] md:w-[26%] flex-shrink-0">
              <CoffeeCup ref={tiltRef} />
            </div>
            <div className="flex-1 flex flex-col items-end pt-1 min-w-0">
              <span
                ref={productTagRef}
                data-product-item
                className="inline-block text-[10px] md:text-[11px] tracking-[0.15em] uppercase px-3 py-1 text-brand text-right"
                style={{ border: "1px solid rgba(200,146,43,0.3)" }}
              >
                Business Beast — Signature Blend
              </span>
              <div ref={stepsHeaderRef} className="text-right opacity-0 mt-1 md:mt-2">
                <span className="inline-block text-[10px] md:text-[11px] tracking-[0.2em] uppercase mb-1 text-brand">Instrukcja</span>
                <h2 className="text-base md:text-2xl font-bold text-white leading-tight">Wejdz do srodka w 4 krokach</h2>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="relative flex-1 overflow-hidden">
            {/* Product screen (phase 1) */}
            <div ref={productRef} className="absolute inset-0 flex flex-col justify-center px-4 md:px-8">
              <div className="w-full max-w-md mx-auto md:max-w-xl text-center">
                <h3 data-product-item className="text-2xl md:text-3xl font-bold leading-tight mb-3 text-white">
                  Pierwszy lyk to<br />dopiero poczatek.
                </h3>
                <p data-product-item className="text-sm leading-relaxed mb-4 text-muted">
                  Ciemno palona arabica z nuta kakao i palonego drewna. Na wieczku kod,
                  ktory otwiera Ci drzwi do zamknietej grupy Bestii.
                </p>
                <div data-product-item className="flex flex-wrap justify-center gap-2 mb-4">
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
                <div data-product-item className="grid grid-cols-3 gap-2 mb-5">
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
                    <span className="text-[11px] text-muted mt-0.5">Wysylka</span>
                  </div>
                </div>
                <button
                  data-product-item
                  onClick={onBuy}
                  className="relative w-full h-12 overflow-hidden font-bold text-sm tracking-wider touch-action-manipulation active:scale-[0.97] transition-transform duration-150"
                  style={{ background: "linear-gradient(135deg, #c8922b, #a67a1e)", color: "#fff" }}
                >
                  <span className="relative z-10">Kup Kawe</span>
                </button>
                <p data-product-item className="text-[11px] text-center text-muted mt-3">
                  Bezpieczna platnosc przez PayU · Wysylka w 24h
                </p>
              </div>
            </div>

            {/* Onboarding steps (phase 2) */}
            <div ref={stepsRef} className="absolute inset-0">
              <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-center gap-4 md:gap-10 px-4 md:px-8">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const onRight = i % 2 === 0;
                  const isActive = activeIdx === i;
                  const isPast = activeIdx > i;
                  return (
                    <div key={i} className={`w-[72%] md:w-[44%] ${onRight ? "ml-auto" : "mr-auto"}`}>
                      <div
                        data-card
                        className="p-3 md:p-4 flex items-center gap-3 transition-all duration-500"
                        style={{
                          opacity: isPast ? 0.5 : isActive ? 1 : 0.35,
                          transform: isActive ? "scale(1.03)" : "scale(1)",
                          border: `1px solid ${isActive ? "rgba(200,146,43,0.55)" : "rgba(255,255,255,0.06)"}`,
                          background: isActive ? "rgba(200,146,43,0.1)" : "rgba(255,255,255,0.03)",
                          boxShadow: isActive ? "0 0 28px rgba(200,146,43,0.22)" : "none",
                        }}
                      >
                        <div
                          className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 flex-shrink-0 transition-all duration-500"
                          style={{
                            background: isActive ? "rgba(200,146,43,0.2)" : "rgba(255,255,255,0.05)",
                            border: `1px solid ${isActive ? "rgba(200,146,43,0.5)" : "rgba(255,255,255,0.08)"}`,
                          }}
                        >
                          <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: isActive ? "#f5d68e" : "#6b7280" }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold tracking-widest" style={{ color: isActive ? "#c8922b" : "#4b5563" }}>
                              0{i + 1}
                            </span>
                            <h4 className="text-sm md:text-base font-bold leading-tight" style={{ color: isActive ? "#ffffff" : "#9ca3af" }}>
                              {s.title}
                            </h4>
                          </div>
                          <p className="text-[11px] md:text-xs leading-snug mt-1" style={{ color: isActive ? "#9ca3af" : "#6b7280" }}>
                            {s.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

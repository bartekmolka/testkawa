import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const ITEMS = [
  { q: "Ile trwa dostawa?", a: "Standardowo wysylamy w 24h od zamowienia. Paczka dociera zwykle w 1–3 dni robocze." },
  { q: "Czy moge zmienic rodzaj kawy w abonamencie?", a: "Tak, forme (ziarnista / mielona) mozesz zmienic przed kazda kolejna wysylka z poziomu grupy." },
  { q: "Co jesli chce wiecej niz 4 paczki miesiecznie?", a: "Napisz do nas bezposrednio — dla wiekszych zamowien ustalamy warunki indywidualnie." },
  { q: "Jak dziala kod z opakowania?", a: "To Twoj jednorazowy klucz do grupy Business Beast — bez niego dostep nie jest mozliwy." },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="w-full px-4 py-16 md:py-24" id="faq">
      <div className="w-full max-w-md mx-auto md:max-w-2xl">
        <div className="text-center mb-8">
          <span className="inline-block text-[11px] tracking-[0.2em] uppercase mb-2 text-brand">FAQ</span>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Pytania</h2>
        </div>
        {ITEMS.map((item, i) => {
          const open = openIdx === i;
          return (
            <div
              key={item.q}
              className={`mb-2 overflow-hidden transition-colors duration-300 ${open ? "" : ""}`}
              style={{ background: open ? "rgba(200,146,43,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${open ? "rgba(200,146,43,0.2)" : "rgba(255,255,255,0.06)"}` }}>
              <button
                onClick={() => setOpenIdx(open ? null : i)}
                className="flex items-center justify-between w-full min-h-[48px] px-4 py-3 text-left text-sm font-medium text-white touch-action-manipulation">
                {item.q}
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-2 text-lg leading-none"
                  style={{ color: "#c8922b" }}>+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}>
                    <div className="px-4 pb-4">
                      <p className="text-sm leading-relaxed text-muted">{item.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

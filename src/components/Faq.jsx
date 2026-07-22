import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const ITEMS = [
  { q: "Ile trwa dostawa?", a: "Standardowo wysyłamy w 24h od zamówienia. Paczka dociera zwykle w 1–3 dni robocze." },
  { q: "Czy mogę zmienić rodzaj kawy w abonamencie?", a: "Tak, formę (ziarnista / mielona) możesz zmienić przed każdą kolejną wysyłką z poziomu grupy." },
  { q: "Co jeśli chcę więcej niż 4 paczki miesięcznie?", a: "Napisz do nas bezpośrednio — dla większych zamówień ustalamy warunki indywidualnie." },
  { q: "Jak działa kod z opakowania?", a: "To Twój jednorazowy klucz do grupy Business Beast — bez niego dostęp nie jest możliwy." },
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
              className={`rounded-xl mb-2 overflow-hidden transition-colors duration-300 ${open ? "" : ""}`}
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

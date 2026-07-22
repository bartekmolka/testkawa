import { useState } from "react";
import { motion } from "motion/react";

function getVariant() {
  return 1 + Math.floor(Math.random() * 3);
}

export default function Hero({ onGoto }) {
  const [variant] = useState(getVariant);

  return (
    <section className="relative min-h-dvh flex items-center justify-center overflow-hidden pt-14">
      <div className={`hero-bg variant-${variant}`}>
        <div className="orb" />
        <div className="orb-2" />
        <div className="grain" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center w-full max-w-md mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs tracking-[0.2em] uppercase mb-5 px-3 py-1.5 rounded-full"
          style={{ color: "#f5d68e", border: "1px solid rgba(245,214,142,0.2)" }}>
          Nie dla każdego
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-5xl md:text-6xl font-black leading-[1.1] mb-4 tracking-[-0.03em] text-white">
          KAWA<br />DLA <span style={{ color: "#f5d68e" }}>BESTII</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm md:text-base leading-relaxed mb-8 text-muted max-w-sm">
          Palona w małych partiach, pita przez tych, którzy nie stoją w miejscu.
          Jedno opakowanie — jeden bilet do środka.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col gap-3 w-full">
          <button
            onClick={() => onGoto("#buy")}
            className="w-full h-12 rounded-xl font-bold text-sm tracking-wider text-white shadow-lg transition-transform duration-150 active:scale-[0.97] touch-action-manipulation"
            style={{ background: "linear-gradient(135deg, #c8922b, #a67a1e)", boxShadow: "0 4px 20px rgba(200,146,43,0.3)" }}>
            Zamów Teraz
          </button>
          <button
            onClick={() => onGoto("#how")}
            className="h-12 rounded-xl text-sm font-medium transition-colors"
            style={{ color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}>
            Jak to działa
          </button>
        </motion.div>
      </div>
    </section>
  );
}

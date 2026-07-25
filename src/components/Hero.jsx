import { useState } from "react";
import { motion } from "motion/react";
import CoffeeBag3D from "./CoffeeBag3D";

function getVariant() {
  return 1 + Math.floor(Math.random() * 3);
}

export default function Hero({ onGoto }) {
  const [variant] = useState(getVariant);

  return (
    <section className="relative min-h-dvh flex items-center justify-center overflow-hidden pt-14">
      <div className={`hero-bg variant-${variant}`}>
        <div className="grain" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center w-full max-w-md mx-auto md:max-w-5xl md:flex-row md:text-left md:items-center md:gap-12">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="md:flex-1 md:order-2 flex justify-center mb-6 md:mb-0"
        >
          <CoffeeBag3D className="max-w-[320px]" />
        </motion.div>

        <div className="md:flex-1 md:order-1">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block text-[11px] tracking-[0.2em] uppercase mb-5 px-3 py-1.5"
            style={{ color: "#f5d68e", border: "1px solid rgba(245,214,142,0.2)" }}
          >
            Nie dla kazdego
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-5xl md:text-6xl font-black leading-[1.1] mb-4 tracking-[-0.03em] text-white"
          >
            KAWA<br />DLA <span style={{ color: "#f5d68e" }}>BESTII</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm md:text-base leading-relaxed mb-8 text-muted max-w-sm"
          >
            Palona w malych partiach, pita przez tych, którzy nie stoja w miejscu.
            Jedno opakowanie — jeden bilet do srodka.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col gap-3 w-full"
          >
            <button
              onClick={() => onGoto("#buy")}
              className="w-full h-12 font-bold text-sm tracking-wider text-white transition-transform duration-150 active:scale-[0.97] touch-action-manipulation"
              style={{ background: "linear-gradient(135deg, #c8922b, #a67a1e)" }}
            >
              Zamów Teraz
            </button>
            <button
              onClick={() => onGoto("#steps")}
              className="h-12 text-sm font-medium transition-colors"
              style={{ color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Jak to dziala
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaUser, FaUserTie, FaCrown, FaArrowLeft, FaXmark } from "react-icons/fa6";
import { initiatePayUPayment } from "../api/payment";

const AVATAR_STAGES = [
  { icon: FaUser, label: "Status: Plebs" },
  { icon: FaUserTie, label: "Status: Gracz" },
  { icon: FaCrown, label: "Status: Bestia" },
];

const PRICE_PLN = 42;

export default function OrderFlow({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState("ziarnista");
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [done, setDone] = useState(false);

  const stage = AVATAR_STAGES[step - 1];
  const total = PRICE_PLN * qty;
  const StageIcon = stage.icon;

  const reset = () => {
    setStep(1); setForm("ziarnista"); setQty(1); setEmail("");
    setPaying(false); setPayError(""); setDone(false);
  };

  const close = () => { onClose(); setTimeout(reset, 400); };

  const goPay = async () => {
    setPayError("");
    if (!email || !email.includes("@")) {
      setPayError("Podaj poprawny adres e-mail.");
      return;
    }
    setPaying(true);
    try {
      const data = await initiatePayUPayment({
        email,
        form,
        qty,
        total,
      });
      if (data.redirectUri) {
        window.location.href = data.redirectUri;
      } else {
        setDone(true);
      }
    } catch (err) {
      setPayError("Nie udalo sie połączyć z PayU. Spróbuj ponownie.");
      setPaying(false);
    }
  };

  return (
    <div className={`order-view${open ? " open" : ""}`}>
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={close} className="flex items-center gap-1 min-h-[48px] text-sm touch-action-manipulation" style={{ color: "#c8922b" }}>
          <FaArrowLeft className="w-4 h-4" />
          Wróc
        </button>
        <button onClick={close} className="flex items-center justify-center min-h-[48px] min-w-[48px] ml-auto touch-action-manipulation" style={{ color: "#9ca3af" }}>
          <FaXmark className="w-5 h-5" />
        </button>
        <div className="flex-1 h-1 overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%`, background: "linear-gradient(90deg, #c8922b, #f5d68e)" }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center mb-6">
            <StageIcon className="text-4xl mb-2" style={{ color: "#f5d68e" }} />
            <span className="text-xs text-muted">{stage.label}</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h3 className="text-lg font-bold text-white text-center mb-5">Wybierz formę</h3>
                <div className="order-bag-preview bean mb-5" />
                <div className="flex flex-col gap-2 mb-6">
                  <div
                    onClick={() => setForm("ziarnista")}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all min-h-[48px]"
                    style={{ background: form === "ziarnista" ? "rgba(200,146,43,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${form === "ziarnista" ? "rgba(200,146,43,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                    <div className="w-4 h-4 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: "#c8922b" }}>
                      {form === "ziarnista" && <div className="w-2 h-2" style={{ background: "#c8922b" }} />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Kawa ziarnista</div>
                      <div className="text-xs text-muted">Świeżo palone ziarno, mielesz sam</div>
                    </div>
                  </div>
                  <div
                    onClick={() => setForm("mielona")}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all min-h-[48px]"
                    style={{ background: form === "mielona" ? "rgba(200,146,43,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${form === "mielona" ? "rgba(200,146,43,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                    <div className="w-4 h-4 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: "#c8922b" }}>
                      {form === "mielona" && <div className="w-2 h-2" style={{ background: "#c8922b" }} />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Kawa mielona</div>
                      <div className="text-xs text-muted">Gotowa do parzenia od razu</div>
                    </div>
                  </div>
                </div>
                <button className="w-full h-12 font-bold text-sm tracking-wider text-white touch-action-manipulation" style={{ background: "linear-gradient(135deg, #c8922b, #a67a1e)" }} onClick={() => setStep(2)}>
                  Dalej →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h3 className="text-lg font-bold text-white text-center mb-6">Ile paczek miesięcznie?</h3>
                <div className="flex items-center justify-center gap-5 mb-4">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center text-xl font-medium text-white touch-action-manipulation" style={{ background: "rgba(255,255,255,0.08)" }}>–</button>
                  <span className="text-3xl font-bold text-white min-w-[48px] text-center">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(4, q + 1))} className="w-12 h-12 flex items-center justify-center text-xl font-medium text-white touch-action-manipulation" style={{ background: "rgba(255,255,255,0.08)" }}>+</button>
                </div>
                <p className="text-xs text-center text-muted mb-8">Maksymalnie 4 / mies. Więcej? Napisz do nas indywidualnie.</p>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 h-12 text-sm font-medium touch-action-manipulation" style={{ color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}>← Wstecz</button>
                  <button onClick={() => setStep(3)} className="flex-1 h-12 font-bold text-sm tracking-wider text-white touch-action-manipulation" style={{ background: "linear-gradient(135deg, #c8922b, #a67a1e)" }}>Dalej →</button>
                </div>
              </motion.div>
            )}

            {step === 3 && !done && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h3 className="text-lg font-bold text-white text-center mb-5">Podsumowanie i płatność</h3>
                <div className="p-4 mb-5 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="flex justify-between text-sm text-muted">Forma <b className="text-white">{form === "ziarnista" ? "Ziarnista" : "Mielona"}</b></div>
                  <div className="flex justify-between text-sm text-muted"> Ilość / mies. <b className="text-white">{qty}</b></div>
                  <div className="flex justify-between text-sm pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>Razem <b className="text-lg" style={{ color: "#f5d68e" }}>{total} zl</b></div>
                </div>
                <div className="mb-5">
                  <label className="text-xs text-muted block mb-1.5">Adres e-mail</label>
                  <input type="email" placeholder="ty@przykład.pl" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 text-sm text-white outline-none touch-action-manipulation"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>
                {payError && <p className="text-xs mb-3" style={{ color: "#ef4444" }}>{payError}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} disabled={paying} className="flex-1 h-12 text-sm font-medium touch-action-manipulation" style={{ color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}>← Wstecz</button>
                  <button onClick={goPay} disabled={paying}
                    className="flex-1 h-12 font-bold text-sm tracking-wider text-white touch-action-manipulation disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #c8922b, #a67a1e)" }}>
                    {paying ? "Łączenie…" : "Zapłać przez PayU"}
                  </button>
                </div>
              </motion.div>
            )}

            {done && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <h3 className="text-lg font-bold text-white text-center mb-4">Dziękujemy!</h3>
                <p className="text-sm text-muted text-center leading-relaxed mb-8">
                  Sprawdz maila — wysłaliśmy Ci kod dostepu do grupy Business Beast oraz szczegóły dostawy.
                </p>
                <button onClick={close} className="w-full h-12 font-bold text-sm tracking-wider text-white touch-action-manipulation" style={{ background: "linear-gradient(135deg, #c8922b, #a67a1e)" }}>
                  Zamknij
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Buy from "./components/Buy";
import Mission from "./components/Mission";
import Steps from "./components/Steps";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import OrderFlow from "./components/OrderFlow";

export default function App() {
  const [orderOpen, setOrderOpen] = useState(false);

  const goto = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden max-w-md mx-auto md:max-w-3xl lg:max-w-5xl">
      <Header onGoto={goto} />
      <Hero onGoto={goto} />
      <Buy onBuy={() => setOrderOpen(true)} />
      <Mission />
      <Steps />
      <Faq />
      <Footer onGoto={goto} />

      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 md:hidden">
        <button
          onClick={() => setOrderOpen(true)}
          className="relative w-full h-12 overflow-hidden rounded-xl font-bold text-sm tracking-wider bg-brand text-white shadow-lg shadow-brand/30 active:scale-[0.97] transition-transform duration-150 touch-action-manipulation"
        >
          <span className="cta-shimmer" />
          <span className="relative z-10">Kup Kawę</span>
        </button>
      </div>

      <OrderFlow open={orderOpen} onClose={() => setOrderOpen(false)} />
    </div>
  );
}

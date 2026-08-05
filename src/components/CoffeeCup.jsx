import { forwardRef } from "react";

const CoffeeCup = forwardRef(function CoffeeCup({ className }, tiltRef) {
  return (
    <div className={className} style={{ position: "relative", width: "100%" }}>
      <svg viewBox="0 0 240 240" width="100%" height="auto" role="img" aria-label="Kubek kawy">
        <defs>
          <linearGradient id="bbCupBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8b84b" />
            <stop offset="60%" stopColor="#c8922b" />
            <stop offset="110%" stopColor="#a67a1e" />
          </linearGradient>
          <linearGradient id="bbCupShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Steam */}
        <path d="M 96 32 C 101 40 91 48 97 56" stroke="#9ca3af" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.3" />
        <path d="M 124 30 C 129 40 118 48 125 58" stroke="#9ca3af" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.18" />

        {/* Tiltable cup group — rotation driven externally by the pinned timeline */}
        <g ref={tiltRef}>
          {/* handle */}
          <path d="M 128 90 A 30 30 0 1 1 130 138" stroke="#c8922b" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 128 90 A 30 30 0 1 1 130 138" stroke="#e8b84b" strokeWidth="3" fill="none" opacity="0.6" />

          {/* metallic body */}
          <path d="M 78 70 L 140 70 L 134 148 L 84 148 Z" fill="url(#bbCupBody)" />
          <path d="M 78 70 L 140 70 L 134 148 L 84 148 Z" fill="url(#bbCupShade)" />

          {/* rim */}
          <ellipse cx="109" cy="70" rx="31" ry="12" fill="#e8b84b" />
          <ellipse cx="109" cy="70" rx="24" ry="8" fill="#2b1a10" />

          {/* base */}
          <ellipse cx="109" cy="150" rx="46" ry="10" fill="#141414" stroke="#000000" />

          {/* Pour point (left rim lip) — measured at full tilt to anchor the stream */}
          <circle data-pour-point cx="78" cy="72" r="2" fill="none" stroke="none" />
        </g>
      </svg>
    </div>
  );
});

export default CoffeeCup;

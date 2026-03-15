import React from "react";

export default function SplashScreen() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh bg-background"
      style={{ background: "oklch(0.15 0.04 245)" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.38 0.16 25 / 0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 px-8">
        {/* Logo */}
        <div className="splash-logo">
          <img
            src="/assets/uploads/New-logo-1536x500-3-1.png"
            alt="Varun Engineers"
            className="w-64 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Divider line */}
        <div
          className="splash-subtitle w-32 h-0.5 rounded-full"
          style={{ background: "oklch(0.38 0.16 25 / 0.7)" }}
        />

        {/* Title */}
        <div className="splash-subtitle text-center">
          <p
            className="text-2xl font-bold tracking-wider uppercase"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: "oklch(0.97 0.005 245)",
            }}
          >
            Sales Agent Portal
          </p>
          <p
            className="mt-1 text-sm tracking-widest uppercase splash-tagline"
            style={{ color: "oklch(0.65 0.025 245)" }}
          >
            Field Operations Suite
          </p>
        </div>

        {/* Loading dots */}
        <div className="splash-tagline flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: "oklch(0.38 0.16 25)",
                animation: `splashSubtitle 0.6s ease-out ${0.9 + i * 0.15}s both`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

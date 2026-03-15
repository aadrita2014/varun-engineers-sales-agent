import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setSendingOtp(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSendingOtp(false);
    setOtpSent(true);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setError("");
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1000));
    setVerifying(false);
    onLoginSuccess();
  };

  return (
    <div
      className="flex flex-col min-h-dvh bg-background"
      style={{ background: "oklch(0.15 0.04 245)" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 30% at 50% 0%, oklch(0.38 0.16 25 / 0.12) 0%, transparent 60%)",
        }}
      />

      {/* Top logo area */}
      <div className="flex flex-col items-center pt-14 pb-8 px-6 relative">
        <img
          src="/assets/uploads/New-logo-1536x500-3-1.png"
          alt="Varun Engineers"
          className="w-44 object-contain mb-6"
        />
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            color: "oklch(0.97 0.005 245)",
          }}
        >
          Welcome Back
        </h1>
        <p className="text-sm mt-1" style={{ color: "oklch(0.65 0.025 245)" }}>
          Sign in to continue to your portal
        </p>
      </div>

      {/* Form card */}
      <div className="flex-1 px-5 pb-10">
        <div
          className="rounded-2xl p-6 shadow-card"
          style={{
            background: "oklch(0.22 0.035 245)",
            border: "1px solid oklch(0.28 0.04 245)",
          }}
        >
          {!otpSent ? (
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="mobile-input"
                  className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "oklch(0.65 0.025 245)" }}
                >
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div
                    className="flex items-center px-3 rounded-lg text-sm font-semibold"
                    style={{
                      background: "oklch(0.26 0.04 245)",
                      border: "1px solid oklch(0.28 0.04 245)",
                      color: "oklch(0.85 0.02 245)",
                    }}
                  >
                    +91
                  </div>
                  <Input
                    id="mobile-input"
                    data-ocid="login.mobile_input"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, ""))
                    }
                    className="flex-1 text-base h-12"
                    style={{
                      background: "oklch(0.26 0.04 245)",
                      border: "1px solid oklch(0.28 0.04 245)",
                      color: "oklch(0.97 0.005 245)",
                    }}
                  />
                </div>
              </div>

              {error && (
                <p
                  data-ocid="login.error_state"
                  className="text-sm"
                  style={{ color: "oklch(0.65 0.18 25)" }}
                >
                  {error}
                </p>
              )}

              <Button
                data-ocid="login.send_otp_button"
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full h-12 text-base font-bold rounded-xl shadow-glow"
                style={{
                  background: "oklch(0.38 0.16 25)",
                  color: "oklch(0.97 0.005 0)",
                }}
              >
                {sendingOtp ? (
                  <>
                    <Loader2
                      data-ocid="login.loading_state"
                      className="mr-2 h-4 w-4 animate-spin"
                    />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p
                    className="block text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.65 0.025 245)" }}
                  >
                    Enter OTP
                  </p>
                  <button
                    type="button"
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.12 25)" }}
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                  >
                    Change number
                  </button>
                </div>
                <p
                  className="text-sm mb-4"
                  style={{ color: "oklch(0.75 0.02 245)" }}
                >
                  OTP sent to +91 {mobile}
                </p>
                <div
                  data-ocid="login.otp_input"
                  className="flex justify-center"
                >
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-11 h-12 text-lg font-bold rounded-lg"
                          style={{
                            background: "oklch(0.26 0.04 245)",
                            border: "1px solid oklch(0.28 0.04 245)",
                            color: "oklch(0.97 0.005 245)",
                          }}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p
                  className="text-xs mt-2 text-center"
                  style={{ color: "oklch(0.55 0.02 245)" }}
                >
                  Enter any 6 digits to continue (demo)
                </p>
              </div>

              {error && (
                <p
                  data-ocid="login.error_state"
                  className="text-sm"
                  style={{ color: "oklch(0.65 0.18 25)" }}
                >
                  {error}
                </p>
              )}

              <Button
                data-ocid="login.verify_button"
                onClick={handleVerify}
                disabled={verifying || otp.length !== 6}
                className="w-full h-12 text-base font-bold rounded-xl shadow-glow"
                style={{
                  background: "oklch(0.38 0.16 25)",
                  color: "oklch(0.97 0.005 0)",
                }}
              >
                {verifying ? (
                  <>
                    <Loader2
                      data-ocid="login.loading_state"
                      className="mr-2 h-4 w-4 animate-spin"
                    />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>
            </div>
          )}
        </div>

        <p
          className="text-center text-xs mt-6"
          style={{ color: "oklch(0.45 0.02 245)" }}
        >
          By continuing, you agree to the Terms of Service
        </p>
      </div>
    </div>
  );
}

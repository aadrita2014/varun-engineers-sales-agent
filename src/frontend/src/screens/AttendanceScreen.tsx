import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import React, { useState } from "react";

interface Props {
  onBack: () => void;
}

type AttendanceStatus = "present" | "absent" | "leave" | "pending";

const WEEK_DAYS: { day: string; date: string; status: AttendanceStatus }[] = [
  { day: "Mon", date: "9 Mar", status: "present" },
  { day: "Tue", date: "10 Mar", status: "present" },
  { day: "Wed", date: "11 Mar", status: "present" },
  { day: "Thu", date: "12 Mar", status: "leave" },
  { day: "Fri", date: "13 Mar", status: "present" },
  { day: "Sat", date: "14 Mar", status: "pending" },
];

const statusConfig: Record<
  AttendanceStatus,
  { label: string; bg: string; color: string }
> = {
  present: {
    label: "Present",
    bg: "oklch(0.35 0.12 145 / 0.15)",
    color: "oklch(0.6 0.15 145)",
  },
  absent: {
    label: "Absent",
    bg: "oklch(0.38 0.16 25 / 0.15)",
    color: "oklch(0.55 0.14 25)",
  },
  leave: {
    label: "Leave",
    bg: "oklch(0.6 0.15 80 / 0.15)",
    color: "oklch(0.6 0.15 80)",
  },
  pending: {
    label: "Pending",
    bg: "oklch(0.28 0.04 245 / 0.5)",
    color: "oklch(0.55 0.02 245)",
  },
};

export default function AttendanceScreen({ onBack }: Props) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState("");

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    );
    setCheckedIn(true);
  };

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const navBg = {
    background: "oklch(0.13 0.04 245)",
    borderBottom: "1px solid oklch(0.24 0.04 245)",
  };
  const cardBg = {
    background: "oklch(0.22 0.035 245)",
    border: "1px solid oklch(0.28 0.04 245)",
  };
  const textPrimary = { color: "oklch(0.97 0.005 245)" };
  const textMuted = { color: "oklch(0.55 0.02 245)" };

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ background: "oklch(0.15 0.04 245)" }}
    >
      <header className="flex items-center gap-3 px-4 py-3" style={navBg}>
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl"
          style={{ background: "oklch(0.22 0.035 245)" }}
        >
          <ArrowLeft size={20} style={{ color: "oklch(0.85 0.02 245)" }} />
        </button>
        <h1
          className="text-lg font-bold"
          style={{
            ...textPrimary,
            fontFamily: "'Bricolage Grotesque', sans-serif",
          }}
        >
          Attendance
        </h1>
      </header>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Today date */}
        <div className="rounded-2xl p-4" style={cardBg}>
          <p
            className="text-xs font-bold uppercase tracking-wider mb-1"
            style={textMuted}
          >
            Today
          </p>
          <p className="text-base font-semibold" style={textPrimary}>
            {todayStr}
          </p>
          <div className="flex items-center gap-1 mt-1" style={textMuted}>
            <MapPin size={12} />
            <span className="text-xs">Mumbai North Territory</span>
          </div>
        </div>

        {/* Check-in card */}
        <div className="rounded-2xl p-5" style={cardBg}>
          {!checkedIn ? (
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.38 0.16 25 / 0.15)" }}
              >
                <Clock size={32} style={{ color: "oklch(0.55 0.14 25)" }} />
              </div>
              <div className="text-center">
                <p className="font-bold text-base" style={textPrimary}>
                  Not Checked In Yet
                </p>
                <p className="text-xs mt-1" style={textMuted}>
                  Tap below to mark your attendance
                </p>
              </div>
              <Button
                data-ocid="attendance.checkin_button"
                onClick={handleCheckIn}
                className="w-full h-12 text-base font-bold rounded-xl"
                style={{
                  background: "oklch(0.38 0.16 25)",
                  color: "oklch(0.97 0.005 0)",
                }}
              >
                Check In Now
              </Button>
            </div>
          ) : (
            <div
              data-ocid="attendance.success_state"
              className="flex flex-col items-center gap-3"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.35 0.12 145 / 0.2)" }}
              >
                <Clock size={32} style={{ color: "oklch(0.6 0.15 145)" }} />
              </div>
              <div className="text-center">
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: "oklch(0.35 0.12 145 / 0.15)",
                    color: "oklch(0.6 0.15 145)",
                  }}
                >
                  ✓ Checked In
                </span>
                <p className="text-lg font-bold mt-2" style={textPrimary}>
                  {checkInTime}
                </p>
                <p className="text-xs" style={textMuted}>
                  Check-in recorded successfully
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Weekly attendance */}
        <div className="rounded-2xl p-4" style={cardBg}>
          <p
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={textMuted}
          >
            This Week
          </p>
          <div data-ocid="attendance.list" className="space-y-2">
            {WEEK_DAYS.map((entry, idx) => {
              const cfg = statusConfig[entry.status];
              return (
                <div
                  key={entry.day}
                  className="flex items-center justify-between py-2"
                  style={{
                    borderBottom:
                      idx < WEEK_DAYS.length - 1
                        ? "1px solid oklch(0.28 0.04 245)"
                        : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex flex-col items-center justify-center"
                      style={{ background: "oklch(0.26 0.04 245)" }}
                    >
                      <span className="text-xs font-bold" style={textPrimary}>
                        {entry.day}
                      </span>
                      <span className="text-xs" style={textMuted}>
                        {entry.date.split(" ")[0]}
                      </span>
                    </div>
                    <span className="text-sm" style={textPrimary}>
                      {entry.date}
                    </span>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { getScoreTone } from "@/lib/placemate";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subtext?: string;
  showPercent?: boolean;
}

export default function ScoreRing({
  score,
  size = 180,
  strokeWidth = 12,
  label,
  subtext,
  showPercent = true,
}: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (displayScore / 100) * circumference;
  const tone = getScoreTone(score);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    let frame = 0;
    const totalFrames = 24;
    const interval = window.setInterval(() => {
      frame += 1;
      setDisplayScore(Math.round((clamped * frame) / totalFrames));
      if (frame >= totalFrames) {
        window.clearInterval(interval);
      }
    }, 20);

    return () => window.clearInterval(interval);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={cn("transition-all duration-300", tone.ring)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono text-4xl font-semibold", tone.text)}>
            {displayScore}
            {showPercent ? "%" : ""}
          </span>
          {label ? <span className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">{label}</span> : null}
        </div>
      </div>
      {subtext ? <p className="text-sm text-slate-400">{subtext}</p> : null}
    </div>
  );
}

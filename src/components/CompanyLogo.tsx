import { useMemo, useState } from "react";
import { getInitials } from "@/lib/placemate";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string | null;
  className?: string;
}

export default function CompanyLogo({ name, logoUrl, className = "" }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const initials = getInitials(name);
  const hue = useMemo(
    () =>
      name
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360,
    [name],
  );

  if (failed || !logoUrl) {
    return (
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 font-mono text-sm font-semibold text-white ${className}`}
        style={{
          background: `linear-gradient(135deg, hsla(${hue}, 80%, 55%, 0.8), hsla(${(hue + 45) % 360}, 75%, 40%, 0.85))`,
        }}
      >
        {initials || "PM"}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className={`h-12 w-12 rounded-2xl border border-white/10 bg-slate-900/60 object-contain p-2 ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

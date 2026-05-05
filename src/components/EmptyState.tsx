import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="card flex min-h-64 flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
        <Icon className="h-7 w-7" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="max-w-md text-sm text-slate-400">{description}</p>
      </div>
      {ctaLabel && ctaHref ? (
        <Button asChild variant="outline">
          <Link to={ctaHref}>{ctaLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}

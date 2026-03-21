// dashboard-cards.tsx
// Reusable card components for dashboard stats and content

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Base Card Container
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat Card - Displays a single statistic with icon
// ─────────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: 'default' | 'primary';
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  variant = 'default',
}: StatCardProps) {
  const isPrimary = variant === 'primary';

  return (
    <Card className="p-3 sm:p-4 md:p-5 flex flex-col gap-2 sm:gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-xs text-secondary leading-tight">{label}</span>
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isPrimary ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <Icon
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPrimary ? 'text-primary-foreground' : 'text-secondary'}`}
          />
        </div>
      </div>
      <div>
        <p className="heading text-xl sm:text-2xl md:text-3xl text-foreground break-words">{value}</p>
        {subtitle && <p className="text-[10px] sm:text-xs mt-0.5 text-secondary leading-tight">{subtitle}</p>}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon Badge - Small icon container
// ─────────────────────────────────────────────────────────────────────────────

interface IconBadgeProps {
  icon: LucideIcon;
  variant?: 'default' | 'primary';
  className?: string;
}

export function IconBadge({ icon: Icon, variant = 'default', className = '' }: IconBadgeProps) {
  const isPrimary = variant === 'primary';

  return (
    <div
      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
        isPrimary ? 'bg-primary' : 'bg-muted'
      } ${className}`}
    >
      <Icon className={`w-4 h-4 ${isPrimary ? 'text-primary-foreground' : 'text-secondary'}`} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card Header - Reusable header for data cards
// ─────────────────────────────────────────────────────────────────────────────

interface CardHeaderProps {
  icon?: LucideIcon;
  title: string;
  badge?: string | number;
  className?: string;
}

export function CardHeader({ icon: Icon, title, badge, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-4 py-3 flex items-center gap-2 border-b border-border bg-muted/30 ${className}`}>
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {badge !== undefined && (
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
          {badge}
        </span>
      )}
    </div>
  );
}

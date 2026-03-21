// Dashboard.tsx
// Main dashboard page with stats and recent activity

'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Home,
  ChevronRight,
  Calendar,
  Bed,
  Bath,
  Maximize2,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { Space, SoldRecord } from '@/data/spaces';
import { Card, StatCard, CardHeader } from '@/components/ui/dashboard-cards';
import { 
  getGreeting, 
  formatPrice, 
  formatDate, 
  getFormattedToday 
} from '@/lib/utils/dashboard';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardProps {
  spaces: Space[];
  soldHistory: SoldRecord[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────────────────────────

function PriceRangeCard({ high, low }: { high: number; low: number }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-foreground">Current Price Range</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted">
          <BarChart3 className="w-4 h-4 text-secondary" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3 bg-background border border-border">
          <div className="flex items-center gap-1 mb-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] uppercase tracking-wide text-secondary">High</span>
          </div>
          <p className="heading text-lg text-foreground">{formatPrice(high)}</p>
        </div>
        <div className="rounded-xl p-3 bg-background border border-border">
          <div className="flex items-center gap-1 mb-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-secondary" />
            <span className="text-[10px] uppercase tracking-wide text-secondary">Low</span>
          </div>
          <p className="heading text-lg text-foreground">{formatPrice(low)}</p>
        </div>
      </div>
    </Card>
  );
}

function LastSoldCard({ record }: { record: SoldRecord }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border">
        <p className="text-sm text-foreground">Last Home Sold</p>
        <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 className="w-3 h-3" />
          Sold
        </span>
      </div>

      <div className="flex gap-4 p-5">
        {record.image ? (
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-border">
            <img
              src={record.image}
              alt={`Space ${record.spaceNumber}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl flex-shrink-0 flex items-center justify-center bg-muted border border-border">
            <Home className="w-8 h-8 text-primary" />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="heading text-xl text-foreground">Space {record.spaceNumber}</h3>
            <p className="heading text-2xl mt-0.5 text-secondary">{formatPrice(record.salePrice)}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { icon: Calendar, text: formatDate(record.soldDate) },
              { icon: Bed, text: `${record.bedrooms} bd` },
              { icon: Bath, text: `${record.bathrooms} ba` },
              { icon: Maximize2, text: record.lotSize },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1 text-[11px] text-secondary">
                <Icon className="w-3 h-3" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function QuickLink({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) {
  return (
    <Link
      href={to}
      className="bg-card rounded-xl p-4 flex items-center gap-3 group transition-all border border-border hover:border-primary hover:shadow-md"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-muted group-hover:bg-primary transition-colors">
        <Icon className="w-4 h-4 text-secondary group-hover:text-primary-foreground transition-colors" />
      </div>
      <span className="text-sm text-foreground">{label}</span>
      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-secondary" />
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard Component
// ─────────────────────────────────────────────────────────────────────────────

export function Dashboard({ spaces, soldHistory }: DashboardProps) {
  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const rmhpSpaces = spaces.filter((s) => s.forSale && s.byRmhp);
    const salePrices = rmhpSpaces.map((s) => s.salePrice!).filter(Boolean);

    const now = new Date();
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const recentSold = soldHistory.filter((r) => new Date(r.soldDate) >= twelveMonthsAgo);
    const lastSold = [...soldHistory].sort(
      (a, b) => new Date(b.soldDate).getTime() - new Date(a.soldDate).getTime()
    )[0] ?? null;

    const availableLots = spaces.filter((s) => s.status === 'Available' && !s.forSale).length;

    return {
      forSaleCount: rmhpSpaces.length,
      soldCount: recentSold.length,
      highPrice: salePrices.length ? Math.max(...salePrices) : 0,
      lowPrice: salePrices.length ? Math.min(...salePrices) : 0,
      availableLots,
      lastSold,
    };
  }, [spaces, soldHistory]);

  const today = getFormattedToday();

  return (
    <div className="flex flex-col space-y-4 md:space-y-6 w-full max-w-[1600px] mx-auto">
      {/* Welcome Section */}
      <Card className="bg-muted border border-border">
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div>
            <h1 className="heading text-2xl md:text-3xl leading-tight text-foreground">
              {getGreeting()}!
            </h1>
            <span className="inline-block mt-2 md:mt-3 text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">
              {today}
            </span>
          </div>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <StatCard 
          icon={Home} 
          label="Our Homes for Sale" 
          value={stats.forSaleCount} 
          subtitle="RMHP-owned listings" 
          variant="primary" 
        />
        <StatCard 
          icon={Home} 
          label="Sold (12 mo)" 
          value={stats.soldCount} 
          subtitle="Closed transactions" 
          variant="primary" 
        />
        <StatCard 
          icon={ArrowUpRight} 
          label="Highest Listed" 
          value={stats.highPrice ? formatPrice(stats.highPrice) : '—'} 
          subtitle="RMHP listing" 
        />
        <StatCard 
          icon={ArrowDownRight} 
          label="Lowest Listed" 
          value={stats.lowPrice ? formatPrice(stats.lowPrice) : '—'} 
          subtitle="RMHP listing" 
        />
        <StatCard 
          icon={MapPin} 
          label="Available Lots" 
          value={stats.availableLots} 
          subtitle="Open & not for sale" 
        />
      </div>

      {/* Data Tables Section */}
      {(() => {
        const rmhpForSale = spaces.filter((s) => s.forSale && s.byRmhp);
        const vacantLots = spaces.filter((s) => s.status === 'Available' && !s.forSale);

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* RMHP Homes for Sale Table */}
            <Card className="overflow-hidden">
              <CardHeader 
                icon={Home} 
                title="RMHP Homes for Sale" 
                badge={rmhpForSale.length} 
              />
              {rmhpForSale.length === 0 ? (
                <p className="px-4 py-6 text-sm text-center text-secondary">
                  No RMHP homes currently listed
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {['Space', 'Price/mo', 'Home Size', 'Lot Size', 'Bed', 'Bath'].map(h => (
                          <th 
                            key={h} 
                            className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap text-secondary border-b border-border bg-muted/30"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rmhpForSale.map((s) => (
                        <tr key={s.id}>
                          <td className="px-3 py-2 font-medium whitespace-nowrap text-foreground border-b border-border">{s.spaceNumber}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-foreground border-b border-border">${s.pricePerMonth}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-foreground border-b border-border">{s.homeSize}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-foreground border-b border-border">{s.lotSize}</td>
                          <td className="px-3 py-2 text-foreground border-b border-border">{s.bedrooms}</td>
                          <td className="px-3 py-2 text-foreground border-b border-border">{s.bathrooms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Vacant Lots Table */}
            <Card className="overflow-hidden">
              <CardHeader 
                icon={MapPin} 
                title="Vacant Lots" 
                badge={vacantLots.length} 
              />
              {vacantLots.length === 0 ? (
                <p className="px-4 py-6 text-sm text-center text-secondary">
                  No vacant lots available
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {['Space', 'Price/mo', 'Home Size', 'Lot Size', 'Bed', 'Bath'].map(h => (
                          <th 
                            key={h} 
                            className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap text-secondary border-b border-border bg-muted/30"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {vacantLots.map((s) => (
                        <tr key={s.id}>
                          <td className="px-3 py-2 font-medium whitespace-nowrap text-foreground border-b border-border">{s.spaceNumber}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-foreground border-b border-border">${s.pricePerMonth}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-foreground border-b border-border">{s.homeSize}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-foreground border-b border-border">{s.lotSize}</td>
                          <td className="px-3 py-2 text-foreground border-b border-border">{s.bedrooms}</td>
                          <td className="px-3 py-2 text-foreground border-b border-border">{s.bathrooms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        );
      })()}

      {/* Last Sold Section */}
      {stats.lastSold && <LastSoldCard record={stats.lastSold} />}
    </div>
  );
}

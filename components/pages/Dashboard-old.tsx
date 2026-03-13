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

const CARD_SHADOW = '0 6px 18px rgba(0,0,0,0.06)';

interface DashboardProps {
  spaces: Space[];
  soldHistory: SoldRecord[];
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  seafoam = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  seafoam?: boolean;
}) {
  return (
    <div
      className="bg-white rounded-xl p-5 flex flex-col gap-3"
      style={{ border: '1px solid #D7E3E7', boxShadow: CARD_SHADOW }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: '#2F6F8F' }}>{label}</span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: seafoam ? '#7FD1C2' : '#E8F6F3' }}
        >
          <Icon className="w-4 h-4" style={{ color: seafoam ? '#FFFFFF' : '#2F6F8F' }} />
        </div>
      </div>
      <div>
        <p className="heading text-3xl" style={{ color: '#24323A' }}>{value}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: '#2F6F8F' }}>{sub}</p>}
      </div>
    </div>
  );
}

function PriceRangeCard({ high, low }: { high: number; low: number }) {
  return (
    <div
      className="bg-white rounded-xl p-5"
      style={{ border: '1px solid #D7E3E7', boxShadow: CARD_SHADOW }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm" style={{ color: '#24323A' }}>Current Price Range</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#E8F6F3' }}>
          <BarChart3 className="w-4 h-4" style={{ color: '#2F6F8F' }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{ background: '#F7FAFB', border: '1px solid #D7E3E7' }}>
          <div className="flex items-center gap-1 mb-1">
            <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#7FD1C2' }} />
            <span className="text-[10px] uppercase tracking-wide" style={{ color: '#2F6F8F' }}>High</span>
          </div>
          <p className="heading text-lg" style={{ color: '#24323A' }}>{formatPrice(high)}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: '#F7FAFB', border: '1px solid #D7E3E7' }}>
          <div className="flex items-center gap-1 mb-1">
            <ArrowDownRight className="w-3.5 h-3.5" style={{ color: '#2F6F8F' }} />
            <span className="text-[10px] uppercase tracking-wide" style={{ color: '#2F6F8F' }}>Low</span>
          </div>
          <p className="heading text-lg" style={{ color: '#24323A' }}>{formatPrice(low)}</p>
        </div>
      </div>
    </div>
  );
}

function LastSoldCard({ record }: { record: SoldRecord }) {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden"
      style={{ border: '1px solid #D7E3E7', boxShadow: CARD_SHADOW }}
    >
      <div
        className="flex items-center justify-between px-5 pt-4 pb-3"
        style={{ borderBottom: '1px solid #D7E3E7' }}
      >
        <p className="text-sm" style={{ color: '#24323A' }}>Last Home Sold</p>
        <span
          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full text-white"
          style={{ background: '#7FD1C2' }}
        >
          <CheckCircle2 className="w-3 h-3" />
          Sold
        </span>
      </div>

      <div className="flex gap-4 p-5">
        {record.image ? (
          <div
            className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
            style={{ border: '1px solid #D7E3E7' }}
          >
            <img
              src={record.image}
              alt={`Space ${record.spaceNumber}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="w-24 h-24 rounded-xl flex-shrink-0 flex items-center justify-center"
            style={{ background: '#E8F6F3', border: '1px solid #D7E3E7' }}
          >
            <Home className="w-8 h-8" style={{ color: '#7FD1C2' }} />
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="heading text-xl" style={{ color: '#24323A' }}>Space {record.spaceNumber}</h3>
            <p className="heading text-2xl mt-0.5" style={{ color: '#2F6F8F' }}>{formatPrice(record.salePrice)}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { icon: Calendar, text: formatDate(record.soldDate) },
              { icon: Bed, text: `${record.bedrooms} bd` },
              { icon: Bath, text: `${record.bathrooms} ba` },
              { icon: Maximize2, text: record.lotSize },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1 text-[11px]" style={{ color: '#2F6F8F' }}>
                <Icon className="w-3 h-3" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) {
  return (
    <Link
      href={to}
      className="bg-white rounded-xl p-4 flex items-center gap-3 group transition-all"
      style={{ border: '1px solid #D7E3E7', boxShadow: CARD_SHADOW }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#7FD1C2';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(127,209,194,0.2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#D7E3E7';
        (e.currentTarget as HTMLElement).style.boxShadow = CARD_SHADOW;
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
        style={{ background: '#E8F6F3' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#7FD1C2')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#E8F6F3')}
      >
        <Icon className="w-4 h-4" style={{ color: '#2F6F8F' }} />
      </div>
      <span className="text-sm" style={{ color: '#24323A' }}>{label}</span>
      <ChevronRight
        className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: '#2F6F8F' }}
      />
    </Link>
  );
}

export function Dashboard({ spaces, soldHistory }: DashboardProps) {
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

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="space-y-6 max-w-[1600px]">

      {/* ── Welcome Card ─────────────────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#E8F6F3', border: '1px solid #D7E3E7', boxShadow: CARD_SHADOW }}
      >
        <div className="px-6 py-6">
          <div>
            <h1 className="heading text-3xl leading-tight" style={{ color: '#24323A' }}>
              {greeting()}!
            </h1>
            <span
              className="inline-block mt-3 text-xs px-3 py-1.5 rounded-full text-white"
              style={{ background: '#2F6F8F' }}
            >
              {today}
            </span>
          </div>
        </div>
      </div>

      {/* ── Stat Grid — 2 cols mobile, 5 cols lg ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Home}           label="Our Homes for Sale" value={stats.forSaleCount} sub="RMHP-owned listings"    seafoam />
        <StatCard icon={Home}           label="Sold (12 mo)"        value={stats.soldCount}    sub="Closed transactions" seafoam />
        <StatCard icon={ArrowUpRight}   label="Highest Listed"      value={stats.highPrice ? formatPrice(stats.highPrice) : '—'} sub="RMHP listing" />
        <StatCard icon={ArrowDownRight} label="Lowest Listed"       value={stats.lowPrice  ? formatPrice(stats.lowPrice)  : '—'} sub="RMHP listing" />
        <StatCard icon={MapPin}         label="Available Lots"      value={stats.availableLots} sub="Open &amp; not for sale" />
      </div>

      {/* ── RMHP For Sale + Vacant Lots — side by side ───────────────────── */}
      {(() => {
        const rmhpForSale = spaces.filter((s) => s.forSale && s.byRmhp);
        const vacantLots  = spaces.filter((s) => s.status === 'Available' && !s.forSale);

        const thStyle: React.CSSProperties = { color: '#2F6F8F', borderBottom: '1px solid #D7E3E7', background: '#F7FAFB' };
        const tdStyle: React.CSSProperties = { color: '#24323A', borderBottom: '1px solid #D7E3E7' };

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* RMHP Homes for Sale */}
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #D7E3E7', boxShadow: CARD_SHADOW }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #D7E3E7', background: '#F7FAFB' }}>
                <Home className="w-4 h-4" style={{ color: '#7FD1C2' }} />
                <p className="text-sm font-medium" style={{ color: '#24323A' }}>RMHP Homes for Sale</p>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-white" style={{ background: '#7FD1C2' }}>{rmhpForSale.length}</span>
              </div>
              {rmhpForSale.length === 0 ? (
                <p className="px-4 py-6 text-sm text-center" style={{ color: '#2F6F8F' }}>No RMHP homes currently listed</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {['Space', 'Price/mo', 'Home Size', 'Lot Size', 'Bed', 'Bath'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap" style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rmhpForSale.map((s) => (
                        <tr key={s.id}>
                          <td className="px-3 py-2 font-medium whitespace-nowrap" style={tdStyle}>{s.spaceNumber}</td>
                          <td className="px-3 py-2 whitespace-nowrap" style={tdStyle}>${s.pricePerMonth}</td>
                          <td className="px-3 py-2 whitespace-nowrap" style={tdStyle}>{s.homeSize}</td>
                          <td className="px-3 py-2 whitespace-nowrap" style={tdStyle}>{s.lotSize}</td>
                          <td className="px-3 py-2" style={tdStyle}>{s.bedrooms}</td>
                          <td className="px-3 py-2" style={tdStyle}>{s.bathrooms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Vacant Lots */}
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #D7E3E7', boxShadow: CARD_SHADOW }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #D7E3E7', background: '#F7FAFB' }}>
                <MapPin className="w-4 h-4" style={{ color: '#2F6F8F' }} />
                <p className="text-sm font-medium" style={{ color: '#24323A' }}>Vacant Lots</p>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-white" style={{ background: '#2F6F8F' }}>{vacantLots.length}</span>
              </div>
              {vacantLots.length === 0 ? (
                <p className="px-4 py-6 text-sm text-center" style={{ color: '#2F6F8F' }}>No vacant lots available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {['Space', 'Price/mo', 'Home Size', 'Lot Size', 'Bed', 'Bath'].map(h => (
                          <th key={h} className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap" style={thStyle}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {vacantLots.map((s) => (
                        <tr key={s.id}>
                          <td className="px-3 py-2 font-medium whitespace-nowrap" style={tdStyle}>{s.spaceNumber}</td>
                          <td className="px-3 py-2 whitespace-nowrap" style={tdStyle}>${s.pricePerMonth}</td>
                          <td className="px-3 py-2 whitespace-nowrap" style={tdStyle}>{s.homeSize}</td>
                          <td className="px-3 py-2 whitespace-nowrap" style={tdStyle}>{s.lotSize}</td>
                          <td className="px-3 py-2" style={tdStyle}>{s.bedrooms}</td>
                          <td className="px-3 py-2" style={tdStyle}>{s.bathrooms}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* ── Last Home Sold ────────────────────────────────────────────────── */}
      {stats.lastSold && <LastSoldCard record={stats.lastSold} />}

    </div>
  );
}

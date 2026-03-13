// SpaceCard.tsx
// Mobile card view for individual spaces

'use client';

import { Edit2 } from 'lucide-react';
import { Space } from '@/data/spaces';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface SpaceCardProps {
  space: Space;
  onEdit: (space: Space) => void;
  onPreview?: (space: Space) => void;
  onToggleForSale?: (id: string, value: boolean) => void;
  onToggleByRmhp?: (id: string, value: boolean) => void;
  showCheckboxes?: boolean;
}

export function SpaceCard({
  space,
  onEdit,
  onPreview,
  onToggleForSale,
  onToggleByRmhp,
  showCheckboxes = true,
}: SpaceCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-3 cursor-pointer transition-all"
      style={{ border: '1px solid #D7E3E7', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}
      onClick={() => onPreview?.(space)}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#7FD1C2')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#D7E3E7')}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="heading text-base" style={{ color: '#24323A' }}>{space.spaceNumber}</h3>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(space); }}
              className="p-1.5 rounded-lg transition-colors flex-shrink-0"
              style={{ color: '#2F6F8F' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#E8F6F3')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              aria-label="Edit space"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs px-2 py-0.5"
              style={{ background: '#E8F6F3', color: '#24323A', border: 'none' }}>
              ${space.pricePerMonth}/mo
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0.5"
              style={{ background: '#E8F6F3', color: '#24323A', border: 'none' }}>
              {space.homeSize}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0.5"
              style={{ background: '#E8F6F3', color: '#24323A', border: 'none' }}>
              {space.lotSize}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0.5"
              style={{ background: '#E8F6F3', color: '#24323A', border: 'none' }}>
              {space.bedrooms} bed
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0.5"
              style={{ background: '#E8F6F3', color: '#24323A', border: 'none' }}>
              {space.bathrooms} bath
            </Badge>
            {space.storage && (
              <Badge className="text-xs px-2 py-0.5 text-white" style={{ background: '#7FD1C2', border: 'none' }}>
                Storage
              </Badge>
            )}
            <Badge variant="outline" className="text-xs px-2 py-0.5"
              style={{ borderColor: '#D7E3E7', color: '#2F6F8F' }}>
              {space.parkingType}
            </Badge>
          </div>

          {/* For Sale + RMHP always on their own line, side by side */}
          {(space.forSale || space.byRmhp) && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {space.forSale && (
                <Badge className="text-xs px-2 py-0.5" style={{ background: '#7FD1C2', color: '#1F4E63', border: 'none' }}>For Sale</Badge>
              )}
              {space.byRmhp && (
                <Badge className="text-xs px-2 py-0.5 text-white" style={{ background: '#1F4E63', border: 'none' }}>RMHP</Badge>
              )}
            </div>
          )}
          {showCheckboxes && (
            <div
              className="flex items-center gap-3 mt-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={space.forSale}
                  onCheckedChange={(checked) => onToggleForSale?.(space.id, checked as boolean)}
                  id={`for-sale-${space.id}`}
                />
                <label
                  htmlFor={`for-sale-${space.id}`}
                  className="text-[10px] whitespace-nowrap cursor-pointer leading-tight"
                  style={{ color: '#2F6F8F' }}
                >
                  For Sale
                </label>
              </div>
              <div className="flex items-center gap-1">
                <Checkbox
                  checked={space.byRmhp}
                  onCheckedChange={(checked) => onToggleByRmhp?.(space.id, checked as boolean)}
                  disabled={!space.forSale}
                  id={`by-rmhp-${space.id}`}
                />
                <label
                  htmlFor={`by-rmhp-${space.id}`}
                  className="text-[10px] whitespace-nowrap cursor-pointer leading-tight"
                  style={{ color: '#2F6F8F' }}
                >
                  RMHP
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
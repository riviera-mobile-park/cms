// SpaceTable.tsx
// Flexbox-based responsive table view with sortable columns

'use client';

import { Edit2 } from 'lucide-react';
import { Space } from '@/data/spaces';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface SpaceTableProps {
  spaces: Space[];
  onEdit: (space: Space) => void;
  onPreview?: (space: Space) => void;
  onToggleForSale?: (id: string, value: boolean) => void;
  onToggleByRmhp?: (id: string, value: boolean) => void;
  showCheckboxes?: boolean;
  showRmhpBadge?: boolean;
}

export function SpaceTable({
  spaces,
  onEdit,
  onPreview,
  onToggleForSale,
  onToggleByRmhp,
  showCheckboxes = true,
  showRmhpBadge = true,
}: SpaceTableProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Header Row */}
      <div 
        className="hidden md:flex items-center px-3 py-2.5 text-xs font-medium gap-2"
        style={{ borderBottom: '1px solid #D7E3E7', color: '#2F6F8F' }}
      >
        {showCheckboxes && <div className="flex-shrink-0 w-32">For Sale / RMHP</div>}
        <div className="flex-shrink-0 w-20">Space</div>
        <div className="flex-shrink-0 w-32">Listed</div>
        <div className="flex-shrink-0 w-24">Price/Month</div>
        <div className="flex-shrink-0 w-24">Home Size</div>
        <div className="flex-shrink-0 w-24">Lot Size</div>
        <div className="flex-shrink-0 w-16">Bed</div>
        <div className="flex-shrink-0 w-16">Bath</div>
        <div className="flex-shrink-0 w-20">Storage</div>
        <div className="flex-shrink-0 w-24">Parking</div>
        <div className="flex-1 text-right min-w-[80px]">Actions</div>
      </div>

      {/* Body Rows */}
      <div className="flex flex-col">
        {spaces.map((space) => (
          <div
            key={space.id}
            className="flex flex-row items-center px-3 py-2.5 gap-2 transition-colors cursor-pointer"
            style={{ borderBottom: '1px solid #D7E3E7' }}
            onClick={() => onPreview?.(space)}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F7FAFB')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}
          >
            {showCheckboxes && (
              <div className="flex-shrink-0 w-32" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={space.forSale}
                      onCheckedChange={(checked) =>
                        onToggleForSale?.(space.id, checked as boolean)
                      }
                      id={`table-for-sale-${space.id}`}
                    />
                    <label
                      htmlFor={`table-for-sale-${space.id}`}
                      className="text-[10px] cursor-pointer whitespace-nowrap"
                      style={{ color: '#2F6F8F' }}
                    >
                      For Sale
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox
                      checked={space.byRmhp}
                      onCheckedChange={(checked) =>
                        onToggleByRmhp?.(space.id, checked as boolean)
                      }
                      disabled={!space.forSale}
                      id={`table-by-rmhp-${space.id}`}
                    />
                    <label
                      htmlFor={`table-by-rmhp-${space.id}`}
                      className="text-[10px] cursor-pointer whitespace-nowrap"
                      style={{ color: '#2F6F8F' }}
                    >
                      RMHP
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-nowrap gap-2 flex-1 items-center">
              <div className="flex-shrink-0 w-20">
                <span className="text-sm font-medium" style={{ color: '#24323A' }}>{space.spaceNumber}</span>
              </div>
              
              <div className="flex-shrink-0 w-32">
                <div className="flex items-center gap-1 flex-nowrap">
                  {space.forSale && (
                    <Badge className="text-xs px-2 py-0.5 whitespace-nowrap bg-primary text-sidebar-accent border-none">For Sale</Badge>
                  )}
                  {showRmhpBadge && space.byRmhp && (
                    <Badge className="text-xs px-2 py-0.5 text-white whitespace-nowrap bg-sidebar-accent border-none">
                      RMHP
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0 w-24 text-sm" style={{ color: '#24323A' }}>
                ${space.pricePerMonth}
              </div>
              
              <div className="flex-shrink-0 w-24 text-sm" style={{ color: '#24323A' }}>
                {space.homeSize}
              </div>
              
              <div className="flex-shrink-0 w-24 text-sm" style={{ color: '#24323A' }}>
                {space.lotSize}
              </div>
              
              <div className="flex-shrink-0 w-16 text-sm" style={{ color: '#24323A' }}>
                {space.bedrooms}
              </div>
              
              <div className="flex-shrink-0 w-16 text-sm" style={{ color: '#24323A' }}>
                {space.bathrooms}
              </div>
              
              <div className="flex-shrink-0 w-20">
                {space.storage ? (
                  <Badge className="text-xs px-2 py-0.5 text-white bg-primary border-none">Yes</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-border text-secondary">No</Badge>
                )}
              </div>
              
              <div className="flex-shrink-0 w-24">
                <Badge variant="secondary" className="text-xs px-2 py-0.5"
                  style={{ background: '#E8F6F3', color: '#24323A', border: 'none' }}>
                  {space.parkingType.replace(' Parking', '')}
                </Badge>
              </div>
              
              <div className="flex-1 flex justify-end min-w-[80px]" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(space)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-sm rounded-lg transition-colors bg-secondary hover:bg-secondary/85"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

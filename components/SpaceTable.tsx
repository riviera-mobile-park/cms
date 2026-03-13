// SpaceTable.tsx
// Desktop table view with sortable columns

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
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid #D7E3E7' }}>
            {showCheckboxes && (
              <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>
                For Sale / RMHP
              </th>
            )}
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Space</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Listed</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Price/Month</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Home Size</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Lot Size</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Bed</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Bath</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Storage</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Parking</th>
            <th className="text-right px-3 py-2.5 text-xs font-medium" style={{ color: '#2F6F8F' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr
              key={space.id}
              className="transition-colors cursor-pointer"
              style={{ borderBottom: '1px solid #D7E3E7' }}
              onClick={() => onPreview?.(space)}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F7FAFB')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}
            >
              {showCheckboxes && (
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
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
                </td>
              )}
              <td className="px-3 py-2.5">
                <span className="text-sm font-medium" style={{ color: '#24323A' }}>{space.spaceNumber}</span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-1 flex-nowrap">
                  {space.forSale && (
                    <Badge className="text-xs px-2 py-0.5 whitespace-nowrap" style={{ background: '#7FD1C2', color: '#1F4E63', border: 'none' }}>For Sale</Badge>
                  )}
                  {showRmhpBadge && space.byRmhp && (
                    <Badge className="text-xs px-2 py-0.5 text-white whitespace-nowrap" style={{ background: '#1F4E63', border: 'none' }}>
                      RMHP
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-3 py-2.5 text-sm" style={{ color: '#24323A' }}>${space.pricePerMonth}</td>
              <td className="px-3 py-2.5 text-sm" style={{ color: '#24323A' }}>{space.homeSize}</td>
              <td className="px-3 py-2.5 text-sm" style={{ color: '#24323A' }}>{space.lotSize}</td>
              <td className="px-3 py-2.5 text-sm" style={{ color: '#24323A' }}>{space.bedrooms}</td>
              <td className="px-3 py-2.5 text-sm" style={{ color: '#24323A' }}>{space.bathrooms}</td>
              <td className="px-3 py-2.5">
                {space.storage ? (
                  <Badge className="text-xs px-2 py-0.5 text-white" style={{ background: '#7FD1C2', border: 'none' }}>Yes</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs px-2 py-0.5" style={{ borderColor: '#D7E3E7', color: '#2F6F8F' }}>No</Badge>
                )}
              </td>
              <td className="px-3 py-2.5">
                <Badge variant="secondary" className="text-xs px-2 py-0.5"
                  style={{ background: '#E8F6F3', color: '#24323A', border: 'none' }}>
                  {space.parkingType.replace(' Parking', '')}
                </Badge>
              </td>
              <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(space)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-sm rounded-lg transition-colors"
                  style={{ background: '#2F6F8F' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#295E7A')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#2F6F8F')}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
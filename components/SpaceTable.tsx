// SpaceTable.tsx
// Table view with sortable columns

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
          <tr className="border-b border-border">
            {showCheckboxes && (
              <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">
                For Sale / RMHP
              </th>
            )}
            <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">Space</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">Listed</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">Price/Month</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">Home Size</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">Lot Size</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">Bed</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">Bath</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">Storage</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-secondary">Parking</th>
            <th className="text-right px-3 py-2.5 text-xs font-medium text-secondary">Actions</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr
              key={space.id}
              className="border-b border-border transition-colors cursor-pointer hover:bg-background"
              onClick={() => onPreview?.(space)}
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
                        className="text-[10px] cursor-pointer whitespace-nowrap text-secondary"
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
                        className="text-[10px] cursor-pointer whitespace-nowrap text-secondary"
                      >
                        RMHP
                      </label>
                    </div>
                  </div>
                </td>
              )}
              <td className="px-3 py-2.5">
                <span className="text-sm font-medium text-foreground">{space.spaceNumber}</span>
              </td>
              <td className="px-3 py-2.5">
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
              </td>
              <td className="px-3 py-2.5 text-sm text-foreground">${space.pricePerMonth}</td>
              <td className="px-3 py-2.5 text-sm text-foreground">{space.homeSize}</td>
              <td className="px-3 py-2.5 text-sm text-foreground">{space.lotSize}</td>
              <td className="px-3 py-2.5 text-sm text-foreground">{space.bedrooms}</td>
              <td className="px-3 py-2.5 text-sm text-foreground">{space.bathrooms}</td>
              <td className="px-3 py-2.5">
                {space.storage ? (
                  <Badge className="text-xs px-2 py-0.5 text-white bg-primary border-none">Yes</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-border text-secondary">No</Badge>
                )}
              </td>
              <td className="px-3 py-2.5">
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-muted text-foreground border-none">
                  {space.parkingType.replace(' Parking', '')}
                </Badge>
              </td>
              <td className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(space)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-sm rounded-lg transition-colors bg-secondary hover:bg-secondary/85"
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

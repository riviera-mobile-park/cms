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
              <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary whitespace-nowrap">
                Sale / RMHP
              </th>
            )}
            <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary">#</th>
            <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary">Listed</th>
            <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary whitespace-nowrap">$/mo</th>
            <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary whitespace-nowrap">Home</th>
            <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary whitespace-nowrap">Lot</th>
            <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary">Bd</th>
            <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary">Ba</th>
            <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary">Stor</th>
            <th className="text-left px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary">Park</th>
            <th className="text-right px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs font-medium text-secondary"></th>
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
                <td className="px-1.5 py-2 sm:px-3 sm:py-2.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <Checkbox
                        checked={space.forSale}
                        onCheckedChange={(checked) =>
                          onToggleForSale?.(space.id, checked as boolean)
                        }
                        id={`table-for-sale-${space.id}`}
                      />
                      <label
                        htmlFor={`table-for-sale-${space.id}`}
                        className="text-[9px] sm:text-[10px] cursor-pointer whitespace-nowrap text-secondary"
                      >
                        Sale
                      </label>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
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
                        className="text-[9px] sm:text-[10px] cursor-pointer whitespace-nowrap text-secondary"
                      >
                        RMHP
                      </label>
                    </div>
                  </div>
                </td>
              )}
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5">
                <span className="text-xs sm:text-sm font-medium text-foreground">{space.spaceNumber}</span>
              </td>
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5">
                <div className="flex items-center gap-0.5 flex-nowrap">
                  {space.forSale && (
                    <Badge className="text-[9px] sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5 whitespace-nowrap bg-primary text-sidebar-accent border-none">Sale</Badge>
                  )}
                  {showRmhpBadge && space.byRmhp && (
                    <Badge className="text-[9px] sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5 text-white whitespace-nowrap bg-sidebar-accent border-none">
                      RMHP
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-foreground whitespace-nowrap">${space.pricePerMonth}</td>
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-foreground whitespace-nowrap">{space.homeSize}</td>
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-foreground whitespace-nowrap">{space.lotSize}</td>
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-foreground">{space.bedrooms}</td>
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-foreground">{space.bathrooms}</td>
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5">
                {space.storage ? (
                  <Badge className="text-[9px] sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5 text-white bg-primary border-none">Yes</Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5 border-border text-secondary">No</Badge>
                )}
              </td>
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5">
                <Badge variant="secondary" className="text-[9px] sm:text-xs px-1 sm:px-2 py-0 sm:py-0.5 bg-muted text-foreground border-none whitespace-nowrap">
                  {space.parkingType.replace(' Parking', '')}
                </Badge>
              </td>
              <td className="px-1.5 py-2 sm:px-3 sm:py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(space)}
                  className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 sm:px-3 text-white text-sm rounded-lg transition-colors bg-secondary hover:bg-secondary/85"
                >
                  <Edit2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

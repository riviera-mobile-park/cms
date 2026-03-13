// route.ts (import API)
// Handle CSV import for homes data

import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';
import { getSpaces, createSpace, updateSpace } from '@/lib/strapi/client';
import { Space } from '@/data/spaces';

interface ImportRow {
  spaceNumber: string;
  status?: string;
  lotSize?: string;
  homeSize?: string;
  pricePerMonth?: number;
  salePrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  storage?: boolean;
  parkingType?: string;
  parkingSpaces?: number;
  aboutHome?: string;
  forSale?: boolean;
  byRmhp?: boolean;
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return lower === 'true' || lower === 'yes' || lower === '1';
  }
  if (typeof value === 'number') return value !== 0;
  return false;
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''));
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function normalizeStatus(value: unknown): Space['status'] {
  const str = String(value || '').trim();
  if (str === 'Occupied' || str === 'Pending' || str === 'Available') {
    return str;
  }
  return 'Available';
}

function normalizeParkingType(value: unknown): Space['parkingType'] {
  const str = String(value || '').trim();
  return str === 'Covered Parking' ? 'Covered Parking' : 'Street Parking';
}

function parseCsv(text: string): ImportRow[] {
  const result = Papa.parse<Record<string, any>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    console.warn('CSV parsing warnings:', result.errors);
  }

  return result.data.map((row) => {
    // Handle different column name variations
    const getField = (names: string[]) => {
      for (const name of names) {
        if (row[name] !== undefined && row[name] !== '') {
          return row[name];
        }
      }
      return undefined;
    };

    return {
      spaceNumber: String(getField(['spaceNumber', 'space_number', 'Space Number', 'Space']) || '').trim(),
      status: getField(['status', 'Status']),
      lotSize: getField(['lotSize', 'lot_size', 'Lot Size']),
      homeSize: getField(['homeSize', 'home_size', 'Home Size']),
      pricePerMonth: getField(['pricePerMonth', 'price_per_month', 'Price Per Month', 'rent']),
      salePrice: getField(['salePrice', 'sale_price', 'Sale Price', 'price']),
      bedrooms: getField(['bedrooms', 'Bedrooms', 'beds']),
      bathrooms: getField(['bathrooms', 'Bathrooms', 'baths']),
      storage: getField(['storage', 'Storage']),
      parkingType: getField(['parkingType', 'parking_type', 'Parking Type', 'parking']),
      parkingSpaces: getField(['parkingSpaces', 'parking_spaces', 'Parking Spaces']),
      aboutHome: getField(['aboutHome', 'about_home', 'About Home', 'description', 'Description']),
      forSale: getField(['forSale', 'for_sale', 'For Sale', 'forsale']),
      byRmhp: getField(['byRmhp', 'by_rmhp', 'By RMHP', 'rmhp', 'RMHP']),
    };
  });
}

function validateRow(row: ImportRow): string | null {
  if (!row.spaceNumber) {
    return 'Missing required field: spaceNumber';
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Parse the CSV
    const text = await file.text();
    const rows = parseCsv(text);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'CSV is empty or invalid' },
        { status: 400 }
      );
    }

    // Get existing spaces from Strapi
    const existingSpaces = await getSpaces('all');
    const spaceMap = new Map(
      existingSpaces.map(space => [space.spaceNumber.toLowerCase().trim(), space])
    );

    let added = 0;
    let updated = 0;
    const errors: string[] = [];

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because CSV rows are 1-indexed and first row is header

      try {
        // Validate row
        const validationError = validateRow(row);
        if (validationError) {
          errors.push(`Row ${rowNum}: ${validationError}`);
          continue;
        }

        // Build space data
        const spaceData: Partial<Space> = {
          spaceNumber: row.spaceNumber,
        };

        if (row.status !== undefined) {
          spaceData.status = normalizeStatus(row.status);
        }
        if (row.lotSize !== undefined) {
          spaceData.lotSize = String(row.lotSize);
        }
        if (row.homeSize !== undefined) {
          spaceData.homeSize = String(row.homeSize);
        }
        if (row.pricePerMonth !== undefined) {
          spaceData.pricePerMonth = parseNumber(row.pricePerMonth);
        }
        if (row.salePrice !== undefined) {
          const parsed = parseNumber(row.salePrice);
          if (parsed > 0) {
            spaceData.salePrice = parsed;
          }
        }
        if (row.bedrooms !== undefined) {
          spaceData.bedrooms = parseNumber(row.bedrooms);
        }
        if (row.bathrooms !== undefined) {
          spaceData.bathrooms = parseNumber(row.bathrooms);
        }
        if (row.storage !== undefined) {
          spaceData.storage = parseBoolean(row.storage);
        }
        if (row.parkingType !== undefined) {
          spaceData.parkingType = normalizeParkingType(row.parkingType);
        }
        if (row.parkingSpaces !== undefined) {
          const parsed = parseNumber(row.parkingSpaces);
          if (parsed > 0) {
            spaceData.parkingSpaces = parsed;
          }
        }
        if (row.aboutHome !== undefined) {
          spaceData.aboutHome = String(row.aboutHome);
        }
        if (row.forSale !== undefined) {
          spaceData.forSale = parseBoolean(row.forSale);
        }
        if (row.byRmhp !== undefined) {
          spaceData.byRmhp = parseBoolean(row.byRmhp);
        }

        // Check if space exists
        const existingSpace = spaceMap.get(row.spaceNumber.toLowerCase().trim());

        if (existingSpace) {
          // Update existing space
          await updateSpace(existingSpace.id, spaceData);
          updated++;
        } else {
          // Create new space with defaults
          const newSpace: Omit<Space, 'id'> = {
            spaceNumber: row.spaceNumber,
            status: spaceData.status || 'Available',
            lotSize: spaceData.lotSize || '',
            homeSize: spaceData.homeSize || '',
            pricePerMonth: spaceData.pricePerMonth || 0,
            salePrice: spaceData.salePrice,
            bedrooms: spaceData.bedrooms || 0,
            bathrooms: spaceData.bathrooms || 0,
            storage: spaceData.storage || false,
            parkingType: spaceData.parkingType || 'Street Parking',
            parkingSpaces: spaceData.parkingSpaces,
            aboutHome: spaceData.aboutHome || '',
            forSale: spaceData.forSale || false,
            byRmhp: spaceData.byRmhp || false,
            images: [],
          };
          await createSpace(newSpace);
          added++;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`Row ${rowNum} (${row.spaceNumber}): ${message}`);
      }
    }

    // Return results
    const totalProcessed = added + updated;
    const hasErrors = errors.length > 0;

    return NextResponse.json({
      success: !hasErrors || totalProcessed > 0,
      message: hasErrors
        ? `Processed ${totalProcessed} homes with ${errors.length} error(s)`
        : `Successfully imported ${totalProcessed} homes`,
      added,
      updated,
      errors: hasErrors ? errors : undefined,
    });

  } catch (error) {
    console.error('Import error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: message,
        message: `Import failed: ${message}`,
      },
      { status: 500 }
    );
  }
}

// spaces.ts
// Type definitions for space data

export interface Space {
  id: string;
  spaceNumber: string;
  status: 'Available' | 'Occupied' | 'Pending';
  lotSize: string;
  homeSize: string;
  pricePerMonth: number;
  salePrice?: number;
  bedrooms: number;
  bathrooms: number;
  storage: boolean;
  parkingType: 'Street Parking' | 'Covered Parking';
  parkingSpaces?: number;
  aboutHome: string;
  forSale: boolean;
  byRmhp: boolean;
  images: string[];
}

export interface SoldRecord {
  id: string;
  spaceNumber: string;
  salePrice: number;
  soldDate: string; // ISO date format
  bedrooms: number;
  bathrooms: number;
  lotSize: string;
  image?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────────────────────────

const makeImgs = (id: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/rmhp-${id}-${i}/600/400`
  );

export const mockSpaces: Space[] = [
  {
    id: '1',
    spaceNumber: '101',
    status: 'Available',
    lotSize: '40x80',
    homeSize: '1,200 sqft',
    pricePerMonth: 850,
    salePrice: 89500,
    bedrooms: 2,
    bathrooms: 2,
    storage: true,
    parkingType: 'Covered Parking',
    parkingSpaces: 2,
    aboutHome: 'Spacious corner lot with mature trees and covered parking. Close to park amenities.',
    forSale: true,
    byRmhp: true,
    images: makeImgs('1', 3),
  },
  {
    id: '2',
    spaceNumber: 'Unit A',
    status: 'Occupied',
    lotSize: '35x75',
    homeSize: '980 sqft',
    pricePerMonth: 750,
    bedrooms: 2,
    bathrooms: 1,
    storage: false,
    parkingType: 'Street Parking',
    aboutHome: 'Cozy home with updated interior and nice landscaping.',
    forSale: false,
    byRmhp: false,
    images: [],
  },
  {
    id: '3',
    spaceNumber: '102',
    status: 'Available',
    lotSize: '45x85',
    homeSize: '1,450 sqft',
    pricePerMonth: 950,
    salePrice: 115000,
    bedrooms: 3,
    bathrooms: 2,
    storage: true,
    parkingType: 'Covered Parking',
    parkingSpaces: 2,
    aboutHome: 'Large family home with extra storage room and spacious yard area.',
    forSale: true,
    byRmhp: false,
    images: makeImgs('3', 5),
  },
  {
    id: '4',
    spaceNumber: 'Unit B',
    status: 'Available',
    lotSize: '40x80',
    homeSize: '1,100 sqft',
    pricePerMonth: 825,
    salePrice: 72000,
    bedrooms: 2,
    bathrooms: 2,
    storage: true,
    parkingType: 'Street Parking',
    aboutHome: 'Well-maintained property with modern amenities.',
    forSale: true,
    byRmhp: true,
    images: makeImgs('4', 4),
  },
  {
    id: '5',
    spaceNumber: '103',
    status: 'Pending',
    lotSize: '38x78',
    homeSize: '1,050 sqft',
    pricePerMonth: 800,
    bedrooms: 2,
    bathrooms: 1,
    storage: false,
    parkingType: 'Street Parking',
    aboutHome: 'Recently renovated with new flooring and paint.',
    forSale: false,
    byRmhp: false,
    images: makeImgs('5', 2),
  },
  {
    id: '6',
    spaceNumber: '104',
    status: 'Available',
    lotSize: '42x82',
    homeSize: '1,300 sqft',
    pricePerMonth: 875,
    bedrooms: 3,
    bathrooms: 1,
    storage: true,
    parkingType: 'Covered Parking',
    parkingSpaces: 1,
    aboutHome: 'Quiet location with easy access to main road.',
    forSale: false,
    byRmhp: false,
    images: [],
  },
  {
    id: '7',
    spaceNumber: 'Unit C',
    status: 'Available',
    lotSize: '40x80',
    homeSize: '1,250 sqft',
    pricePerMonth: 900,
    salePrice: 98000,
    bedrooms: 2,
    bathrooms: 2,
    storage: true,
    parkingType: 'Covered Parking',
    parkingSpaces: 2,
    aboutHome: 'Premium location with ocean views and upgraded features.',
    forSale: true,
    byRmhp: true,
    images: makeImgs('7', 6),
  },
  {
    id: '8',
    spaceNumber: '105',
    status: 'Occupied',
    lotSize: '35x75',
    homeSize: '960 sqft',
    pricePerMonth: 775,
    bedrooms: 2,
    bathrooms: 1,
    storage: false,
    parkingType: 'Street Parking',
    aboutHome: 'Comfortable starter home in friendly community.',
    forSale: false,
    byRmhp: false,
    images: [],
  },
];

// ─── Mock Sold History (last 12 months) ────────────────────────────────────
export const soldHistory: SoldRecord[] = [
  {
    id: 's1',
    spaceNumber: '110',
    salePrice: 82000,
    soldDate: '2026-01-08',
    bedrooms: 2,
    bathrooms: 1,
    lotSize: '38x78',
    image: 'https://picsum.photos/seed/sold-s1/600/400',
  },
  {
    id: 's2',
    spaceNumber: '107',
    salePrice: 95000,
    soldDate: '2025-11-14',
    bedrooms: 3,
    bathrooms: 2,
    lotSize: '44x84',
    image: 'https://picsum.photos/seed/sold-s2/600/400',
  },
  {
    id: 's3',
    spaceNumber: 'Unit D',
    salePrice: 68500,
    soldDate: '2025-10-22',
    bedrooms: 2,
    bathrooms: 1,
    lotSize: '36x76',
    image: 'https://picsum.photos/seed/sold-s3/600/400',
  },
  {
    id: 's4',
    spaceNumber: '115',
    salePrice: 110000,
    soldDate: '2025-09-05',
    bedrooms: 3,
    bathrooms: 2,
    lotSize: '46x86',
    image: 'https://picsum.photos/seed/sold-s4/600/400',
  },
  {
    id: 's5',
    spaceNumber: '109',
    salePrice: 76000,
    soldDate: '2025-08-18',
    bedrooms: 2,
    bathrooms: 1,
    lotSize: '39x79',
    image: 'https://picsum.photos/seed/sold-s5/600/400',
  },
  {
    id: 's6',
    spaceNumber: 'Unit E',
    salePrice: 88500,
    soldDate: '2025-06-30',
    bedrooms: 2,
    bathrooms: 2,
    lotSize: '40x80',
    image: 'https://picsum.photos/seed/sold-s6/600/400',
  },
  {
    id: 's7',
    spaceNumber: '112',
    salePrice: 92000,
    soldDate: '2025-05-11',
    bedrooms: 3,
    bathrooms: 1,
    lotSize: '42x82',
    image: 'https://picsum.photos/seed/sold-s7/600/400',
  },
  {
    id: 's8',
    spaceNumber: '106',
    salePrice: 79000,
    soldDate: '2025-04-03',
    bedrooms: 2,
    bathrooms: 1,
    lotSize: '37x77',
    image: 'https://picsum.photos/seed/sold-s8/600/400',
  },
];

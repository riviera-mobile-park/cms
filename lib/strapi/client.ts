// client.ts
// Strapi CMS client for fetching/updating space data

import { Space } from '@/data/spaces';

export type SpaceScope = 'all' | 'for-sale' | 'rmhp-owned';

const DEFAULT_STRAPI_COLLECTION = 'spaces';
const DEFAULT_IMAGE_KEYS_FIELD = 'imageKeys';

export class StrapiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StrapiConfigError';
  }
}

interface StrapiConfig {
  baseUrl: string;
  token: string;
  spacesCollection: string;
  imageKeysField: string;
}

interface StrapiRestResponse<T> {
  data: T;
}

function getEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new StrapiConfigError(`Missing required env var: ${name}`);
  }
  return value;
}

function getConfig(): StrapiConfig {
  const baseUrl = getEnv('STRAPI_URL').replace(/\/$/, '');
  const token = getEnv('STRAPI_API_TOKEN');
  const spacesCollection =
    process.env.STRAPI_SPACES_COLLECTION?.trim() || DEFAULT_STRAPI_COLLECTION;
  const imageKeysField =
    process.env.STRAPI_IMAGE_KEYS_FIELD?.trim() || DEFAULT_IMAGE_KEYS_FIELD;

  return {
    baseUrl,
    token,
    spacesCollection,
    imageKeysField,
  };
}

function buildSpacesQuery(scope: SpaceScope): string {
  const params = new URLSearchParams();
  params.set('pagination[pageSize]', '250');
  params.set('sort[0]', 'spaceNumber:asc');
  params.set('populate', '*');

  if (scope === 'for-sale' || scope === 'rmhp-owned') {
    params.set('filters[forSale][$eq]', 'true');
  }
  if (scope === 'rmhp-owned') {
    params.set('filters[byRmhp][$eq]', 'true');
  }

  return params.toString();
}

async function strapiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const config = getConfig();
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${config.token}`);

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Strapi request failed (${response.status}): ${details || response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

function normalizeEntity<T extends Record<string, unknown>>(
  entity: unknown,
): { id: string; fields: T } {
  const value = (entity as Record<string, unknown>) || {};
  const attributes =
    typeof value.attributes === 'object' && value.attributes !== null
      ? (value.attributes as T)
      : (value as T);

  const idCandidate =
    value.id ??
    (attributes as Record<string, unknown>).id ??
    (attributes as Record<string, unknown>).documentId;

  return {
    id: String(idCandidate ?? ''),
    fields: attributes,
  };
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function toBoolean(value: unknown): boolean {
  return value === true;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function normalizeStatus(value: unknown): Space['status'] {
  if (value === 'Occupied' || value === 'Pending' || value === 'Available') {
    return value;
  }
  return 'Available';
}

function normalizeParkingType(value: unknown): Space['parkingType'] {
  return value === 'Covered Parking' ? 'Covered Parking' : 'Street Parking';
}

function normalizeMediaUrl(baseUrl: string, value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  if (value.startsWith('/')) {
    return `${baseUrl}${value}`;
  }

  return value;
}

function extractImages(
  fields: Record<string, unknown>,
  baseUrl: string,
  imageKeysField: string,
): string[] {
  const fromKeys = fields[imageKeysField];
  if (Array.isArray(fromKeys)) {
    return fromKeys
      .map((item) => normalizeMediaUrl(baseUrl, item))
      .filter((item): item is string => Boolean(item));
  }

  const rawImages = fields.images;

  if (Array.isArray(rawImages)) {
    return rawImages
      .map((item) => {
        if (typeof item === 'string') {
          return normalizeMediaUrl(baseUrl, item);
        }

        if (item && typeof item === 'object') {
          const typed = item as Record<string, unknown>;
          return normalizeMediaUrl(baseUrl, typed.url);
        }

        return null;
      })
      .filter((item): item is string => Boolean(item));
  }

  if (rawImages && typeof rawImages === 'object') {
    const relation = rawImages as { data?: unknown };
    const data = relation.data;

    if (Array.isArray(data)) {
      return data
        .map((item) => {
          const normalized = normalizeEntity<Record<string, unknown>>(item);
          return normalizeMediaUrl(baseUrl, normalized.fields.url);
        })
        .filter((item): item is string => Boolean(item));
    }

    if (data && typeof data === 'object') {
      const normalized = normalizeEntity<Record<string, unknown>>(data);
      const url = normalizeMediaUrl(baseUrl, normalized.fields.url);
      return url ? [url] : [];
    }
  }

  return [];
}

function toSpace(entity: unknown, config: StrapiConfig): Space {
  const normalized = normalizeEntity<Record<string, unknown>>(entity);
  const fields = normalized.fields;

  const rawSalePrice = fields.salePrice;
  const salePrice =
    rawSalePrice === null || rawSalePrice === undefined || rawSalePrice === ''
      ? undefined
      : toNumber(rawSalePrice, 0);

  return {
    id: normalized.id,
    spaceNumber: asString(fields.spaceNumber, ''),
    status: normalizeStatus(fields.status),
    lotSize: asString(fields.lotSize, ''),
    homeSize: asString(fields.homeSize, ''),
    pricePerMonth: toNumber(fields.pricePerMonth, 0),
    salePrice,
    bedrooms: toNumber(fields.bedrooms, 0),
    bathrooms: toNumber(fields.bathrooms, 0),
    storage: toBoolean(fields.storage),
    parkingType: normalizeParkingType(fields.parkingType),
    parkingSpaces:
      fields.parkingSpaces === undefined || fields.parkingSpaces === null
        ? undefined
        : toNumber(fields.parkingSpaces, 0),
    aboutHome: asString(fields.aboutHome, ''),
    forSale: toBoolean(fields.forSale),
    byRmhp: toBoolean(fields.byRmhp),
    images: extractImages(fields, config.baseUrl, config.imageKeysField),
  };
}

function spaceToStrapiData(
  patch: Partial<Space>,
  imageKeysField: string,
): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  if (patch.spaceNumber !== undefined) data.spaceNumber = patch.spaceNumber;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.lotSize !== undefined) data.lotSize = patch.lotSize;
  if (patch.homeSize !== undefined) data.homeSize = patch.homeSize;
  if (patch.pricePerMonth !== undefined) data.pricePerMonth = patch.pricePerMonth;
  if (patch.salePrice !== undefined) data.salePrice = patch.salePrice;
  if (patch.bedrooms !== undefined) data.bedrooms = patch.bedrooms;
  if (patch.bathrooms !== undefined) data.bathrooms = patch.bathrooms;
  if (patch.storage !== undefined) data.storage = patch.storage;
  if (patch.parkingType !== undefined) data.parkingType = patch.parkingType;
  if (patch.parkingSpaces !== undefined) data.parkingSpaces = patch.parkingSpaces;
  if (patch.aboutHome !== undefined) data.aboutHome = patch.aboutHome;
  if (patch.forSale !== undefined) data.forSale = patch.forSale;
  if (patch.byRmhp !== undefined) data.byRmhp = patch.byRmhp;

  if (patch.images !== undefined) {
    data[imageKeysField] = patch.images;
  }

  return data;
}

export async function getSpaces(scope: SpaceScope = 'all'): Promise<Space[]> {
  const config = getConfig();
  const query = buildSpacesQuery(scope);

  const payload = await strapiRequest<StrapiRestResponse<unknown[]>>(
    `/api/${config.spacesCollection}?${query}`,
  );

  if (!Array.isArray(payload.data)) {
    return [];
  }

  return payload.data.map((item) => toSpace(item, config));
}

export async function getSpaceById(id: string): Promise<Space> {
  const config = getConfig();

  const payload = await strapiRequest<StrapiRestResponse<unknown>>(
    `/api/${config.spacesCollection}/${encodeURIComponent(id)}?populate=*`,
  );

  return toSpace(payload.data, config);
}

export async function updateSpace(
  id: string,
  patch: Partial<Space>,
): Promise<Space> {
  const config = getConfig();
  const data = spaceToStrapiData(patch, config.imageKeysField);

  const payload = await strapiRequest<StrapiRestResponse<unknown>>(
    `/api/${config.spacesCollection}/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify({ data }),
    },
  );

  return toSpace(payload.data, config);
}

export async function appendSpaceImages(
  id: string,
  images: string[],
): Promise<Space> {
  const current = await getSpaceById(id);
  const merged = Array.from(new Set([...(current.images ?? []), ...images]));
  return updateSpace(id, { images: merged });
}

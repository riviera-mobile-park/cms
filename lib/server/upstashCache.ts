// upstashCache.ts
// Redis caching layer (optional, falls back gracefully)

import { Space } from '@/data/spaces';
import { SpaceScope } from '@/lib/strapi/client';

const DEFAULT_TTL_SECONDS = 300;

interface UpstashResponse<T> {
  result: T;
  error?: string;
}

interface UpstashConfig {
  url: string;
  token: string;
  ttlSeconds: number;
}

function isPlaceholder(value: string): boolean {
  return (
    value.includes('PLACEHOLDER') ||
    value.includes('your-') ||
    value.includes('example.com')
  );
}

function getConfig(): UpstashConfig | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token || isPlaceholder(url) || isPlaceholder(token)) {
    return null;
  }

  const ttlValue = Number(process.env.SPACES_CACHE_TTL_SECONDS || DEFAULT_TTL_SECONDS);
  const ttlSeconds = Number.isFinite(ttlValue) && ttlValue > 0 ? ttlValue : DEFAULT_TTL_SECONDS;

  return {
    url: url.replace(/\/$/, ''),
    token,
    ttlSeconds,
  };
}

async function runCommand<T>(
  command: string,
  args: Array<string | number>,
): Promise<T | null> {
  const config = getConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/${command}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Upstash command ${command} failed (${response.status}): ${details}`);
  }

  const payload = (await response.json()) as UpstashResponse<T>;
  if (payload.error) {
    throw new Error(`Upstash command ${command} error: ${payload.error}`);
  }

  return payload.result ?? null;
}

function spacesCacheKey(scope: SpaceScope): string {
  return `spaces:${scope}`;
}

export function isUpstashCacheConfigured(): boolean {
  return Boolean(getConfig());
}

export async function getCachedSpaces(scope: SpaceScope): Promise<Space[] | null> {
  const value = await runCommand<string | null>('get', [spacesCacheKey(scope)]);
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Space[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function setCachedSpaces(
  scope: SpaceScope,
  spaces: Space[],
): Promise<void> {
  const config = getConfig();
  if (!config) return;

  await runCommand('set', [
    spacesCacheKey(scope),
    JSON.stringify(spaces),
    'EX',
    config.ttlSeconds,
  ]);
}

export async function invalidateSpacesCache(): Promise<void> {
  const configured = getConfig();
  if (!configured) return;

  await runCommand('del', ['spaces:all', 'spaces:for-sale', 'spaces:rmhp-owned']);
}

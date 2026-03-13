# Riviera Mobile Home Park Dashboard

Next.js dashboard for managing mobile home spaces at Riviera Mobile Home Park.

## What it does

- View and edit all mobile home spaces
- Upload and assign images to spaces (S3/R2 storage)
- Track which spaces are for sale and which are RMHP-owned
- Responsive table view (desktop) and card view (mobile)
- Integrates with Strapi CMS for data storage
- Optional Redis caching layer

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Radix UI / shadcn components
- Framer Motion for animations

**Backend:**
- Strapi CMS (headless)
- Upstash Redis (optional caching)
- S3/R2 for image storage
- CloudFront for image CDN

## Project Structure

```
rmhp-dashboard/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Dashboard home page
│   ├── spaces/                  # All spaces management
│   ├── homes-for-sale/          # For-sale listings
│   ├── our-homes/               # RMHP-owned properties
│   ├── upload/                  # Image upload interface
│   └── api/                     # API routes
│       ├── spaces/              # Space CRUD operations
│       │   ├── route.ts         # GET all, POST create
│       │   └── [id]/            
│       │       ├── route.ts     # GET, PATCH, DELETE by ID
│       │       └── images/route.ts # Update space images
│       └── images/presign/route.ts # Generate S3 presigned URLs
│
├── components/                   # React components
│   ├── pages/                   # Page-level components
│   │   ├── Dashboard.tsx        # Main dashboard with stats
│   │   ├── Spaces.tsx           # Spaces management page
│   │   ├── HomesForSale.tsx     # For-sale filter view
│   │   ├── OurHomes.tsx         # RMHP-owned filter view
│   │   └── Upload.tsx           # Image upload interface
│   ├── ui/                      # Reusable UI components (shadcn)
│   │   ├── button.tsx           
│   │   ├── dialog.tsx           
│   │   ├── input.tsx            
│   │   ├── table.tsx            
│   │   └── dashboard-cards.tsx  # Dashboard-specific cards
│   ├── Header.tsx               # Navigation header
│   ├── SpaceTable.tsx           # Desktop table view
│   ├── SpaceCard.tsx            # Mobile card view
│   ├── EditSpaceModal.tsx       # Space editing modal
│   ├── SpacePreviewModal.tsx    # Space preview modal
│   ├── ImageAssignmentModal.tsx # Image-to-space assignment
│   ├── OptimizedImage.tsx       # CloudFront image wrapper
│   └── Providers.tsx            # Theme and context providers
│
├── lib/                         # Utilities and integrations
│   ├── hooks/
│   │   └── useSpaces.ts         # Shared space data hook
│   ├── utils/
│   │   ├── error.ts             # Error formatting utilities
│   │   └── dashboard.ts         # Dashboard calculation helpers
│   ├── client/
│   │   └── spacesApi.ts         # Client-side API wrapper
│   ├── server/
│   │   └── upstashCache.ts      # Redis caching layer
│   ├── strapi/
│   │   └── client.ts            # Strapi CMS integration
│   ├── images/
│   │   └── getImageUrl.ts       # CloudFront URL generator
│   └── aws/
│       └── uploadImage.ts       # S3 upload helper
│
├── data/
│   └── spaces.ts                # Space type definitions
│
└── app/globals.css              # Global styles and CSS variables
```

## 🎨 Design System

## Design System

Colors (defined in `globals.css`):
- Primary: `#7FD1C2` (teal)
- Secondary: `#2F6F8F` (blue)  
- Accent: `#24323A` (dark navy)
- Muted: `#D7E3E7` (light gray-blue)

Fonts:
- Headings: "Cinzel Decorative"
- Body: System font stack

## Key Features

**Space Management**
- Sortable table (desktop) and card layout (mobile)
- Edit details: price, beds, baths, sqft, description
- Drag to reorder images
- Toggle for-sale and RMHP-owned status

**Image Uploads**
- Drag-and-drop interface
- Direct S3/R2 upload via presigned URLs
- Assign images by space number or unit letter

**Dashboard Stats**
- Total spaces
- For sale count
- RMHP-owned count
- Occupancy tracking

**Filtered Views**
- /homes-for-sale: Spaces marked forSale
- /our-homes: Spaces marked forSale AND byRmhp

## Setup

## Setup

Install dependencies:
```bash
npm install
```

Create `.env.local` with these variables:

```env
# Strapi CMS
STRAPI_URL=https://your-strapi-instance.com/api
STRAPI_API_TOKEN=your_token
STRAPI_SPACES_COLLECTION=spaces
STRAPI_IMAGE_KEYS_FIELD=imageKeys

# S3 or R2
S3_BUCKET_NAME=your-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your_key
S3_SECRET_ACCESS_KEY=your_secret
S3_ENDPOINT=https://account.r2.cloudflarestorage.com  # for R2 only

# CloudFront
CLOUDFRONT_DOMAIN=your-distribution.cloudfront.net

# Redis (optional)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
SPACES_CACHE_TTL_SECONDS=300
```

Run dev server:
```bash
npm run dev
```

Open http://localhost:3000

### Strapi Collection Fields

Your `spaces` collection needs:

| Field Name | Type | Description |
|------------|------|-------------|
| `spaceNumber` | String | Space identifier (e.g., "1", "A", "42") |
| `beds` | Number | Number of bedrooms |
| `baths` | Number | Number of bathrooms |
| `sqft` | Number | Square footage |
| `price` | Number | Listing price |
| `description` | Text | Space description |
| `unitLetter` | String | Optional unit letter |
| `forSale` | Boolean | Whether space is for sale |
| `byRmhp` | Boolean | Whether RMHP-owned |
| `imageKeys` | JSON | Array of S3 object keys |


## API Routes

**Spaces:**
- `GET /api/spaces` - List all spaces (params: `scope`, `invalidateCache`)
- `POST /api/spaces` - Create space  
- `GET /api/spaces/[id]` - Get one space
- `PATCH /api/spaces/[id]` - Update space
- `DELETE /api/spaces/[id]` - Delete space
- `PATCH /api/spaces/[id]/images` - Update space images

**Images:**
- `POST /api/images/presign` - Get presigned S3 upload URL

## Code Organization

**Hooks** (`lib/hooks/`):
- `useSpaces(scope)` - Fetch and manage space data with methods for updating, toggling flags, and assigning images

**Utils** (`lib/utils/`):
- `formatError()` - Error message formatting
- `calculateOccupancyRate()` - Dashboard stats

**Page Components** (`components/pages/`):
- Handle data fetching and state
- Pass data to presentational components

**UI Components** (`components/`):
- Presentational only, no data fetching
- Desktop table view and mobile card view

## Build & Deploy

```bash
npm run build
npm start
```

## Common Issues

**Strapi won't connect:**
- Check STRAPI_URL ends with `/api`
- Verify token permissions
- Check CORS settings

**Images won't upload:**
- Verify S3 bucket permissions
- Check presigned URL hasn't expired (5min default)

**Cache not working:**
- Make sure Redis env vars are set correctly
- Try `?invalidateCache=true` to force refresh


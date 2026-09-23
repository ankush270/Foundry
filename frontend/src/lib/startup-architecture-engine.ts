import type { Startup } from "@/data/types";

export interface StackItem {
  name: string;
  category: "Frontend" | "Backend" | "Database" | "Auth" | "Storage" | "Search" | "Realtime" | "Payments" | "DevOps";
  recommendation: string;
  ossAlternative: string;
  why: string;
}

export interface ApiIntegration {
  name: string;
  category: string;
  provider: string;
  purpose: string;
  exampleSnippet?: string;
}

export interface DbTableColumn {
  name: string;
  type: string;
  constraints?: string;
  description: string;
}

export interface DbTable {
  name: string;
  description: string;
  columns: DbTableColumn[];
}

export interface EngineeringChallenge {
  title: string;
  problem: string;
  solution: string;
  codeSnippet?: {
    language: string;
    code: string;
    filename?: string;
  };
}

export interface ArchitectureBlueprint {
  summary: string;
  targetAudience: string;
  complexityLevel: "Intermediate" | "Advanced" | "Expert";
  estimatedBuildTime: string;
  techStack: StackItem[];
  essentialApis: ApiIntegration[];
  dbSchema: DbTable[];
  keyChallenges: EngineeringChallenge[];
  mvpRoadmap: { phase: string; title: string; duration: string; tasks: string[] }[];
  quickPrompts: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  codeSnippets?: { language: string; code: string; title?: string }[];
}

/**
 * Generates an exhaustive technical architecture blueprint for building a clone or competitor of the given startup.
 */
export function getStartupArchitectureContext(startup: Startup): ArchitectureBlueprint {
  const name = startup.name;
  const nameLower = name.toLowerCase();
  const descLower = (startup.oneLiner + " " + startup.longDescription + " " + startup.industries.join(" ") + " " + startup.tags.join(" ")).toLowerCase();

  // Check if Airbnb or accommodation rental marketplace
  const isAirbnb = nameLower.includes("airbnb") || descLower.includes("accommodation") || descLower.includes("lodging") || descLower.includes("vacation rental");
  
  // Check if Stripe or payments/fintech
  const isPayments = nameLower.includes("stripe") || descLower.includes("payments") || descLower.includes("billing") || descLower.includes("financial infrastructure");

  // Check if DoorDash / Uber / logistics
  const isLogistics = nameLower.includes("doordash") || nameLower.includes("uber") || descLower.includes("delivery") || descLower.includes("courier") || descLower.includes("logistics");

  // Check if DevTools / SaaS / Supabase / Database
  const isDevTools = descLower.includes("developer") || descLower.includes("database") || descLower.includes("infrastructure") || descLower.includes("api") || descLower.includes("open source");

  // Check if AI / LLM
  const isAI = descLower.includes("ai") || descLower.includes("llm") || descLower.includes("machine learning") || descLower.includes("gpt");

  if (isAirbnb) {
    return {
      summary: `${name} is a global two-sided peer-to-peer accommodation marketplace connecting hosts (property owners) with guests (travelers). To build a high-performance clone, you need robust geo-spatial searching, real-time availability calendars, dual payout/charge payment rails, instant messaging, and strict double-booking protection.`,
      targetAudience: "Full-Stack Developers, System Architects & Founders",
      complexityLevel: "Advanced",
      estimatedBuildTime: "3 to 4 Weeks for Production MVP",
      techStack: [
        {
          name: "Frontend UI & Web App",
          category: "Frontend",
          recommendation: "Next.js 15 (App Router) + React + Tailwind CSS + Framer Motion",
          ossAlternative: "Sharetribe Flex / Cal.com UI components",
          why: "Next.js provides Server Components for fast SEO-rendered listing pages and dynamic client state for interactive map search."
        },
        {
          name: "Backend API & Server",
          category: "Backend",
          recommendation: "Node.js (TypeScript) with Hono or Express / Go microservices",
          ossAlternative: "Hono.js / Fastify / MedusaJS",
          why: "Handles high concurrency, webhook listeners, calendar availability checks, and booking state machines."
        },
        {
          name: "Database Engine & Geo Spatial",
          category: "Database",
          recommendation: "PostgreSQL 16 + PostGIS extension + Prisma / Drizzle ORM",
          ossAlternative: "Supabase / CockroachDB",
          why: "PostGIS enables instant ST_DWithin geo-radius queries across millions of lat/lng coordinates while maintaining ACID transactions for bookings."
        },
        {
          name: "Geo Search & Filtering Index",
          category: "Search",
          recommendation: "Meilisearch or Algolia + Redis Caching",
          ossAlternative: "Meilisearch / Elasticsearch",
          why: "Sub-50ms instant search across listing attributes (amenities, guest count, price range, city, dates)."
        },
        {
          name: "Realtime Chat & Notifications",
          category: "Realtime",
          recommendation: "WebSocket (Socket.io) or Supabase Realtime + Resend / Twilio",
          ossAlternative: "Ably / Stream Chat / Pusher",
          why: "Enables instant host-guest messaging, booking approval prompts, and push/SMS alerts."
        },
        {
          name: "Payments & Split Payouts",
          category: "Payments",
          recommendation: "Stripe Connect (Custom/Express Accounts)",
          ossAlternative: "Razorpay Route / Lago / LemonSqueezy",
          why: "Allows holding guest payments in escrow until check-in and automatically routing funds to the host minus platform commission."
        },
        {
          name: "Media Storage & Image CDN",
          category: "Storage",
          recommendation: "AWS S3 / Cloudflare R2 + Cloudinary or UploadThing",
          ossAlternative: "MinIO / Cloudflare R2",
          why: "Auto-resizes high-resolution property photos into responsive WebP thumbnails and gallery formats."
        }
      ],
      essentialApis: [
        {
          name: "Mapbox GL JS / Google Maps API",
          category: "Maps & Geocoding",
          provider: "Mapbox / Google Cloud",
          purpose: "Interactive property map, pin clustering, address auto-complete geocoding, and distance calculations.",
          exampleSnippet: "mapboxgl.accessToken = MAPBOX_KEY;\nconst map = new mapboxgl.Map({ container: 'map', style: 'mapbox://styles/mapbox/streets-v12' });"
        },
        {
          name: "Stripe Connect API",
          category: "Payment Gateway & Marketplace Payouts",
          provider: "Stripe",
          purpose: "Handles guest credit card charging, pre-authorizations, host onboarding (KYC), and automated 10-15% commission split payouts.",
          exampleSnippet: "const paymentIntent = await stripe.paymentIntents.create({\n  amount: 15000, // $150\n  currency: 'usd',\n  transfer_data: { destination: hostStripeAccountId },\n  application_fee_amount: 1500 // $15 platform fee\n});"
        },
        {
          name: "Twilio SMS & Whatsapp API",
          category: "Communications",
          provider: "Twilio",
          purpose: "Instant SMS/WhatsApp alerts to hosts when a new booking request is received.",
          exampleSnippet: "await client.messages.create({ body: 'New booking request for Ocean View Villa!', from: '+12345', to: hostPhone });"
        },
        {
          name: "Cloudinary / AWS S3 API",
          category: "Media Processing",
          provider: "Cloudinary",
          purpose: "On-the-fly photo transformations, watermarking, responsive gallery sizing, and webp compression.",
          exampleSnippet: "cloudinary.v2.uploader.upload(photoPath, { folder: 'listings/airbnb', transformation: [{ width: 1200, crop: 'limit' }] });"
        }
      ],
      dbSchema: [
        {
          name: "users",
          description: "Stores both Hosts and Guests accounts with roles & Stripe Connect accounts",
          columns: [
            { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Unique user identifier" },
            { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE, NOT NULL", description: "Account email address" },
            { name: "role", type: "ENUM('GUEST', 'HOST', 'ADMIN')", constraints: "DEFAULT 'GUEST'", description: "Account permission role" },
            { name: "stripe_account_id", type: "VARCHAR(255)", constraints: "NULLABLE", description: "Connected Stripe account for host payouts" },
            { name: "phone_verified", type: "BOOLEAN", constraints: "DEFAULT FALSE", description: "Identity verification status" }
          ]
        },
        {
          name: "listings",
          description: "Property listings created by hosts with geo location and pricing rules",
          columns: [
            { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Listing ID" },
            { name: "host_id", type: "UUID", constraints: "FOREIGN KEY -> users.id", description: "Owner host" },
            { name: "title", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Property headline" },
            { name: "price_per_night", type: "DECIMAL(10,2)", constraints: "NOT NULL", description: "Base nightly price in USD" },
            { name: "latitude", type: "DOUBLE PRECISION", constraints: "NOT NULL", description: "Latitude for map positioning" },
            { name: "longitude", type: "DOUBLE PRECISION", constraints: "NOT NULL", description: "Longitude for map positioning" },
            { name: "location_geom", type: "GEOGRAPHY(Point, 4326)", constraints: "INDEXED", description: "PostGIS spatial geography point for radius searches" },
            { name: "max_guests", type: "INTEGER", constraints: "NOT NULL", description: "Capacity limit" },
            { name: "status", type: "ENUM('DRAFT', 'PUBLISHED', 'UNLISTED')", constraints: "DEFAULT 'DRAFT'", description: "Listing state" }
          ]
        },
        {
          name: "bookings",
          description: "Reservations made by guests for specific check-in / check-out date ranges",
          columns: [
            { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Booking ID" },
            { name: "listing_id", type: "UUID", constraints: "FOREIGN KEY -> listings.id", description: "Booked listing" },
            { name: "guest_id", type: "UUID", constraints: "FOREIGN KEY -> users.id", description: "Booked guest" },
            { name: "check_in", type: "DATE", constraints: "NOT NULL", description: "Arrival date" },
            { name: "check_out", type: "DATE", constraints: "NOT NULL", description: "Departure date" },
            { name: "total_price", type: "DECIMAL(10,2)", constraints: "NOT NULL", description: "Total cost paid by guest" },
            { name: "status", type: "ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')", constraints: "DEFAULT 'PENDING'", description: "Booking status" },
            { name: "payment_intent_id", type: "VARCHAR(255)", constraints: "NULLABLE", description: "Stripe PaymentIntent ID" }
          ]
        },
        {
          name: "calendar_availability",
          description: "Blocks or overrides nightly pricing for custom date ranges",
          columns: [
            { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Availability record" },
            { name: "listing_id", type: "UUID", constraints: "FOREIGN KEY -> listings.id", description: "Target listing" },
            { name: "date", type: "DATE", constraints: "NOT NULL", description: "Specific calendar date" },
            { name: "is_blocked", type: "BOOLEAN", constraints: "DEFAULT FALSE", description: "Whether date is reserved/blocked" },
            { name: "custom_price", type: "DECIMAL(10,2)", constraints: "NULLABLE", description: "Surge or weekend price override" }
          ]
        }
      ],
      keyChallenges: [
        {
          title: "1. Preventing Double Bookings (Race Conditions)",
          problem: "If two guests try to book the exact same listing for overlapping dates at the exact same millisecond, both requests could pass validation and create duplicate bookings.",
          solution: "Use PostgreSQL Explicit Row Locks (`SELECT ... FOR UPDATE`) inside a database transaction OR a Redis Distributed Lock (`Redlock`) key on `lock:listing:{listing_id}:{date_hash}` before executing validation.",
          codeSnippet: {
            language: "typescript",
            filename: "src/services/booking.service.ts",
            code: `// Express/Node.js Booking Service with PostgreSQL Transaction + Row Locking
import { db } from '@/lib/db';

export async function createBooking(listingId: string, guestId: string, checkIn: string, checkOut: string) {
  return await db.$transaction(async (tx) => {
    // 1. Lock listing record to prevent concurrent modifications
    const listing = await tx.$queryRaw\`
      SELECT id, price_per_night FROM listings 
      WHERE id = \${listingId}::uuid 
      FOR UPDATE;
    \`;

    if (!listing) throw new Error("Listing not found");

    // 2. Check for overlapping existing confirmed bookings
    const overlapping = await tx.booking.findFirst({
      where: {
        listingId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          { checkIn: { lt: new Date(checkOut) } },
          { checkOut: { gt: new Date(checkIn) } }
        ]
      }
    });

    if (overlapping) {
      throw new Error("Selected dates are no longer available!");
    }

    // 3. Create reservation safely
    const newBooking = await tx.booking.create({
      data: {
        listingId,
        guestId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        status: 'PENDING'
      }
    });

    return newBooking;
  });
}`
          }
        },
        {
          title: "2. Ultra-Fast Geo Radius Search (Map View)",
          problem: "Searching across 500,000 listings within a map bounding box or 25km radius can freeze standard SQL queries.",
          solution: "Store latitude/longitude as PostGIS `GEOGRAPHY(Point, 4326)` with GIST index. Query using `ST_DWithin` or map bounding box `ST_MakeEnvelope`.",
          codeSnippet: {
            language: "sql",
            filename: "queries/geo_search.sql",
            code: `-- Fast PostGIS Index & Radius Search Query
CREATE INDEX idx_listings_location ON listings USING GIST (location_geom);

-- Find all available listings within 15 km of Paris (lat: 48.8566, lng: 2.3522)
SELECT id, title, price_per_night, 
       ST_Distance(location_geom, ST_MakePoint(2.3522, 48.8566)::geography) / 1000 AS distance_km
FROM listings
WHERE ST_DWithin(
  location_geom, 
  ST_MakePoint(2.3522, 48.8566)::geography, 
  15000 -- 15,000 meters = 15 km
)
AND status = 'PUBLISHED'
ORDER BY location_geom <-> ST_MakePoint(2.3522, 48.8566)::geography
LIMIT 50;`
          }
        },
        {
          title: "3. Split Payment Escrow & Host Commission",
          problem: "Guest pays $1,000 up front, but the host shouldn't receive funds until 24 hours after successful guest check-in.",
          solution: "Use Stripe Connect `transfer_group` and hold payment intent in escrow. Trigger `stripe.transfers.create` via Cron/Inngest job 24h after check-in date.",
          codeSnippet: {
            language: "typescript",
            filename: "src/jobs/hostPayoutJob.ts",
            code: `// Inngest / BullMQ Scheduled Job for Host Payouts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function processHostPayout(bookingId: string) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { listing: { include: { host: true } } }
  });

  const platformFeePercentage = 0.12; // 12% platform fee
  const hostAmount = Math.round(booking.totalPrice * (1 - platformFeePercentage) * 100);

  // Transfer funds directly to Host's Stripe Connected Account
  const transfer = await stripe.transfers.create({
    amount: hostAmount,
    currency: 'usd',
    destination: booking.listing.host.stripeAccountId,
    transfer_group: booking.id,
  });

  await db.booking.update({
    where: { id: bookingId },
    data: { status: 'COMPLETED', hostPayoutId: transfer.id }
  });
}`
          }
        }
      ],
      mvpRoadmap: [
        {
          phase: "Phase 1",
          title: "Core Models & Host Listing Builder",
          duration: "Days 1 - 4",
          tasks: ["Set up Next.js 15, PostgreSQL & Supabase Auth", "Create Listings DB schema and Cloudinary image uploader", "Build Host Dashboard to create property title, photos, price, lat/lng"]
        },
        {
          phase: "Phase 2",
          title: "Interactive Map Search & Filters",
          duration: "Days 5 - 8",
          tasks: ["Integrate Mapbox GL JS map view with custom price tag markers", "Implement PostGIS geo-radius search and Meilisearch filter sidebar", "Add date picker with react-day-picker for check-in/check-out"]
        },
        {
          phase: "Phase 3",
          title: "Booking Engine & Stripe Integration",
          duration: "Days 9 - 14",
          tasks: ["Implement atomic DB transactions for booking creation", "Integrate Stripe Checkout & Stripe Connect Host Onboarding", "Handle webhook triggers for payment success & booking confirmation"]
        },
        {
          phase: "Phase 4",
          title: "Realtime Chat, Reviews & Launch",
          duration: "Days 15 - 20",
          tasks: ["Build WebSocket / Supabase Realtime messaging between Guest & Host", "Add post-stay Review & Rating system (1-5 stars)", "Deploy to Vercel + Supabase + Cloudflare DNS"]
        }
      ],
      quickPrompts: [
        "⚡ How to prevent double bookings in PostgreSQL?",
        "🗺️ Give me React + Mapbox location search code",
        "💳 How to set up host payouts with Stripe Connect?",
        "𝌰 Show full database schema in SQL format",
        "🚀 2-Week MVP Build Roadmap for Airbnb clone"
      ]
    };
  }

  if (isPayments) {
    return {
      summary: `${name} is a high-reliability financial technology platform providing developer APIs for payments, billing, and transactions. Building a clone requires rock-solid idempotency, double-entry accounting ledger database schemas, strict webhook delivery guarantees, and PCI-DSS compliant vaulting.`,
      targetAudience: "Backend Engineers, Fintech Architects & CTOs",
      complexityLevel: "Expert",
      estimatedBuildTime: "4 to 6 Weeks for Core Engine",
      techStack: [
        { name: "API Gateway & Core API", category: "Backend", recommendation: "Go (Golang) / Rust or Node.js Hono", ossAlternative: "Lago / Moov / KillBill", why: "Ultra-low latency sub-10ms response times with strict memory safety." },
        { name: "Database Engine & Ledger", category: "Database", recommendation: "PostgreSQL with strict Double-Entry accounting tables", ossAlternative: "Formance Ledger / Supabase", why: "Ensures debit/credit balance integrity where sum of credits always equals sum of debits." },
        { name: "Rate Limiter & Idempotency Cache", category: "Search", recommendation: "Redis Cluster", ossAlternative: "KeyDB / DragonflyDB", why: "Enforces Idempotency-Key headers to prevent double-charging on network retries." },
        { name: "Message Queue & Webhooks", category: "Realtime", recommendation: "Apache Kafka / RabbitMQ + Inngest", ossAlternative: "BullMQ / Temporal.io", why: "Guarantees at-least-once webhook event delivery to merchants with exponential backoff." },
        { name: "Payments Gateway SDK", category: "Payments", recommendation: "Stripe API / Card Networks / ACH (Plaid)", ossAlternative: "Lago / Merchant Accounts", why: "Interfaces with underlying card processors (Visa/Mastercard) or bank transfers." }
      ],
      essentialApis: [
        { name: "Plaid API", category: "Banking", provider: "Plaid", purpose: "Instant bank account verification and ACH transfer authorization." },
        { name: "Card Issuing API", category: "Card Processing", provider: "Marqeta / Stripe Issuing", purpose: "Programmatically generate virtual/physical debit cards." }
      ],
      dbSchema: [
        {
          name: "accounts",
          description: "Internal customer financial accounts and wallets",
          columns: [
            { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Account ID" },
            { name: "currency", type: "VARCHAR(3)", constraints: "NOT NULL", description: "USD, EUR, INR" },
            { name: "balance", type: "BIGINT", constraints: "NOT NULL DEFAULT 0", description: "Balance in cents" }
          ]
        },
        {
          name: "ledger_entries",
          description: "Immutably records double-entry debits and credits",
          columns: [
            { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Entry ID" },
            { name: "transaction_id", type: "UUID", constraints: "NOT NULL", description: "Parent transaction" },
            { name: "account_id", type: "UUID", constraints: "FOREIGN KEY -> accounts.id", description: "Affected account" },
            { name: "type", type: "ENUM('DEBIT', 'CREDIT')", constraints: "NOT NULL", description: "Entry type" },
            { name: "amount", type: "BIGINT", constraints: "NOT NULL", description: "Amount in cents" }
          ]
        }
      ],
      keyChallenges: [
        {
          title: "1. Idempotency Key Handling",
          problem: "If a user's connection drops while processing a payment, the SDK will retry the POST request. Without idempotency, the customer will be charged twice.",
          solution: "Store the `Idempotency-Key` header in Redis with request status. Return cached response if key exists within 24h.",
          codeSnippet: {
            language: "typescript",
            filename: "src/middleware/idempotency.ts",
            code: `import { Request, Response, NextFunction } from 'express';
import { redis } from '@/lib/redis';

export async function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['idempotency-key'] as string;
  if (!key) return next();

  const cacheKey = \`idempotency:\${key}\`;
  const cachedResponse = await redis.get(cacheKey);

  if (cachedResponse) {
    const { status, body } = JSON.parse(cachedResponse);
    return res.status(status).json(body);
  }

  // Intercept res.json to cache response
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    redis.set(cacheKey, JSON.stringify({ status: res.statusCode, body }), 'EX', 86400); // 24h
    return originalJson(body);
  };

  next();
}`
          }
        }
      ],
      mvpRoadmap: [
        { phase: "Phase 1", title: "Double-Entry Ledger & API Gateway", duration: "Week 1", tasks: ["Set up Go/Node API server", "Build Double-Entry Accounting schema", "Implement Idempotency Middleware"] },
        { phase: "Phase 2", title: "Payment Method Vault & Webhooks", duration: "Week 2", tasks: ["Build Merchant API Keys & HMAC signatures", "Integrate Stripe/Plaid API connector", "Build Webhook retry engine with BullMQ"] }
      ],
      quickPrompts: [
        "💳 How to build double-entry accounting DB schema?",
        "🔐 Idempotency key middleware implementation code",
        "⚡ Webhook retries & exponential backoff system"
      ]
    };
  }

  // Generic Blueprint for any other startup (Uber, Supabase, DoorDash, Notion, etc.)
  return {
    summary: `${name} operates in the ${startup.industries.join(", ") || "Tech"} industry. ${startup.oneLiner} Building a scalable clone requires modular web/mobile clients, robust backend APIs, relational & document storage, auth, and automated background workflows.`,
    targetAudience: "Developers & Technical Founders",
    complexityLevel: "Intermediate",
    estimatedBuildTime: "2 to 3 Weeks for MVP",
    techStack: [
      { name: "Frontend Client", category: "Frontend", recommendation: "Next.js 15 + React + Tailwind CSS + Lucide Icons", ossAlternative: "Vite + React / Expo React Native", why: "Fast load times, responsive UI components, and great developer experience." },
      { name: "Backend API Framework", category: "Backend", recommendation: "Node.js (TypeScript) + Hono / Express or Python FastAPI", ossAlternative: "NestJS / Hono", why: "Clean routing, type-safe API contracts, and high performance." },
      { name: "Database Engine", category: "Database", recommendation: "PostgreSQL 16 + Prisma / Drizzle ORM", ossAlternative: "Supabase / PlanetScale", why: "ACID compliance for critical user & business entity storage." },
      { name: "Auth & Identity", category: "Auth", recommendation: "Clerk Auth or Supabase Auth / NextAuth", ossAlternative: "Lucia Auth / SuperTokens", why: "Out-of-the-box OAuth social logins, session management, and JWT validation." },
      { name: "Async Queues & Workflows", category: "DevOps", recommendation: "Redis + BullMQ or Inngest / Trigger.dev", ossAlternative: "n8n / Temporal", why: "Executes heavy background tasks, email dispatch, and third-party API syncs." }
    ],
    essentialApis: [
      { name: "Stripe API", category: "Payments", provider: "Stripe", purpose: "Subscription billing, one-time payments, and checkout sessions." },
      { name: "Resend / Postmark API", category: "Email", provider: "Resend", purpose: "Transactional emails for welcome, password resets, and notifications." },
      { name: "AWS S3 / Cloudflare R2", category: "Storage", provider: "Cloudflare / AWS", purpose: "Asset uploading, user media, and file hosting." }
    ],
    dbSchema: [
      {
        name: "users",
        description: "Primary user authentication & profile records",
        columns: [
          { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "User ID" },
          { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE, NOT NULL", description: "Email address" },
          { name: "name", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Full name" },
          { name: "created_at", type: "TIMESTAMP", constraints: "DEFAULT NOW()", description: "Registration timestamp" }
        ]
      },
      {
        name: "resources",
        description: "Main business entity created by users",
        columns: [
          { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Resource ID" },
          { name: "user_id", type: "UUID", constraints: "FOREIGN KEY -> users.id", description: "Owner ID" },
          { name: "title", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Title/Name" },
          { name: "status", type: "VARCHAR(50)", constraints: "DEFAULT 'ACTIVE'", description: "State" }
        ]
      }
    ],
    keyChallenges: [
      {
        title: "1. Scaling Database & Rate Limiting",
        problem: "Spikes in user traffic can overwhelm backend DB connections.",
        solution: "Use Prisma / Drizzle connection pooling (PgBouncer) and Redis Token Bucket rate limiting.",
        codeSnippet: {
          language: "typescript",
          filename: "src/middleware/rateLimit.ts",
          code: `// Redis Token Bucket Rate Limiter
import { redis } from '@/lib/redis';

export async function checkRateLimit(ip: string, limit = 60, windowSec = 60) {
  const current = await redis.incr(\`rate:\${ip}\`);
  if (current === 1) {
    await redis.expire(\`rate:\${ip}\`, windowSec);
  }
  return current <= limit;
}`
        }
      }
    ],
    mvpRoadmap: [
      { phase: "Week 1", title: "Schema Design & Authentication", duration: "7 Days", tasks: ["Set up Next.js & Supabase/PostgreSQL", "Implement Auth & User onboarding", "Create core DB tables"] },
      { phase: "Week 2", title: "Core Features & API Integration", duration: "7 Days", tasks: ["Build main feature UI components", "Connect Third-party APIs (Stripe, Email)", "Deploy to Vercel"] }
    ],
    quickPrompts: [
      `🚀 2-Week MVP Build Guide for ${name}`,
      `𝌰 Show complete PostgreSQL schema for ${name}`,
      `🔌 What APIs do I need to build a ${name} clone?`,
      `⚡ How to structure backend architecture?`
    ]
  };
}

/**
 * Intelligent chatbot conversational Q&A response generator tailored to the startup context.
 */
export function generateChatResponse(
  startup: Startup,
  userQuestion: string,
  history: ChatMessage[] = []
): string {
  const q = userQuestion.toLowerCase();
  const name = startup.name;
  const bp = getStartupArchitectureContext(startup);

  // 1. Double Booking / Concurrency Questions
  if (q.includes("double booking") || q.includes("race condition") || q.includes("concurrency") || q.includes("simultaneous")) {
    return `### ⚡ How to Prevent Double Bookings in ${name}

When multiple users try to reserve the same resource/listing at the exact same millisecond, standard database queries can fail due to **Race Conditions**.

#### 1. PostgreSQL Atomic Transaction with Row Locking (Recommended)
By adding \`FOR UPDATE\` to your SQL query inside a transaction, PostgreSQL locks the row until the transaction completes:

\`\`\`typescript
// src/services/booking.service.ts
import { db } from '@/lib/db';

export async function createBooking(listingId: string, checkIn: Date, checkOut: Date, userId: string) {
  return await db.$transaction(async (tx) => {
    // Lock listing record exclusively
    const [listing] = await tx.$queryRaw\`
      SELECT id FROM listings WHERE id = \${listingId}::uuid FOR UPDATE;
    \`;

    // Check for date overlap
    const conflict = await tx.booking.findFirst({
      where: {
        listingId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } }
        ]
      }
    });

    if (conflict) {
      throw new Error("Conflict: Dates are already booked!");
    }

    return await tx.booking.create({
      data: { listingId, guestId: userId, checkIn, checkOut, status: 'CONFIRMED' }
    });
  });
}
\`\`\`

> **Pro Tip**: You can also place a **Redis Distributed Lock (Redlock)** on key \`lock:listing:\${listingId}:\${checkInDate}\` for 5 seconds to instantly reject duplicate client requests at the API Gateway level!`;
  }

  // 2. Map Search / Geo queries
  if (q.includes("map") || q.includes("mapbox") || q.includes("location") || q.includes("geo") || q.includes("radius")) {
    return `### 🗺️ Implementing Interactive Map Search for ${name}

To build an Airbnb-style interactive map search with price pins and instant bounding-box filtering:

#### Recommended Tech Stack
1. **Frontend**: Mapbox GL JS (\`react-map-gl\` package) or Leaflet + OpenStreetMap.
2. **Spatial DB**: PostgreSQL with **PostGIS** extension.

#### 1. React + Mapbox GL JS Component
\`\`\`tsx
import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapExplorer({ listings }) {
  const [viewState, setViewState] = useState({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 12
  });

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '600px', borderRadius: '16px' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {listings.map(item => (
        <Marker key={item.id} longitude={item.longitude} latitude={item.latitude}>
          <button className="bg-white text-black font-extrabold text-xs px-2 py-1 rounded-full shadow-lg hover:scale-110 transition">
            $\${item.price_per_night}
          </button>
        </Marker>
      ))}
    </Map>
  );
}
\`\`\`

#### 2. PostGIS Geo-Radius SQL Query
\`\`\`sql
-- Search listings within 10km of user location
SELECT id, title, price_per_night, latitude, longitude
FROM listings
WHERE ST_DWithin(
  location_geom,
  ST_MakePoint(:userLng, :userLat)::geography,
  10000 -- 10km in meters
);
\`\`\``;
  }

  // 3. Payments & Stripe Connect
  if (q.includes("stripe") || q.includes("payout") || q.includes("payment") || q.includes("commission") || q.includes("escrow")) {
    return `### 💳 Payment Architecture & Host Payouts with Stripe Connect

For a two-sided platform like **${name}**, you need **Stripe Connect** to handle split payments:

#### Payment Flow Breakdown
1. **Guest Checkout**: Guest pays $200.
2. **Platform Commission**: Your platform keeps $20 (10%).
3. **Host Payout**: $180 is transferred directly to the host's connected bank account.

\`\`\`typescript
// src/pages/api/checkout.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createMarketplaceCheckout(
  amount: number, // Total in cents (e.g., 20000 = $200)
  hostStripeAccountId: string,
  bookingId: string
) {
  const platformFee = Math.round(amount * 0.10); // 10% fee ($20)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Listing Reservation' },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: {
        destination: hostStripeAccountId, // Host receives $180 automatically
      },
      metadata: { bookingId },
    },
    success_url: \`https://yourapp.com/booking/\${bookingId}/success\`,
    cancel_url: \`https://yourapp.com/listings\`,
  });

  return session.url;
}
\`\`\``;
  }

  // 4. Database Schema
  if (q.includes("schema") || q.includes("database") || q.includes("sql") || q.includes("tables")) {
    let sqlSchema = `### 𝌰 Complete PostgreSQL Database Schema for ${name}\n\nHere is the production-ready DDL script for PostgreSQL:\n\n\`\`\`sql\n`;
    bp.dbSchema.forEach(table => {
      sqlSchema += `-- Table: ${table.name} (${table.description})\nCREATE TABLE ${table.name} (\n`;
      table.columns.forEach((col, idx) => {
        const comma = idx === table.columns.length - 1 ? "" : ",";
        sqlSchema += `  ${col.name.padEnd(20)} ${col.type.padEnd(24)} ${col.constraints || ""}${comma} -- ${col.description}\n`;
      });
      sqlSchema += `);\n\n`;
    });
    sqlSchema += `CREATE INDEX idx_${bp.dbSchema[1]?.name || 'listings'}_created ON ${bp.dbSchema[1]?.name || 'listings'} (created_at DESC);\n\`\`\``;
    return sqlSchema;
  }

  // 5. MVP Roadmap
  if (q.includes("roadmap") || q.includes("mvp") || q.includes("how to build") || q.includes("start") || q.includes("guide")) {
    let text = `### 🚀 Step-by-Step MVP Build Plan for ${name}\n\n`;
    bp.mvpRoadmap.forEach(phase => {
      text += `#### ${phase.phase}: ${phase.title} (${phase.duration})\n`;
      phase.tasks.forEach(task => {
        text += `- ✅ ${task}\n`;
      });
      text += `\n`;
    });
    text += `> [!TIP]\n> **Recommended Tech Stack**: Next.js 15, PostgreSQL (Supabase), Tailwind CSS, Stripe, and Vercel hosting.`;
    return text;
  }

  // Default response synthesizing context
  return `### 💡 Building a Clone of ${name}

Here is the targeted response for your question: **"${userQuestion}"**

#### Key System Breakdown for ${name}:
- **Primary Domain**: ${startup.industries.join(", ") || "Marketplace / Software"}
- **Core Challenge**: ${bp.keyChallenges[0]?.title || "Scalable System Architecture"}

#### Recommended Solution & Implementation Steps:
1. **Frontend Layer**: Use **Next.js 15** with TypeScript for dynamic server rendering, responsive Tailwind CSS styling, and client state.
2. **Backend API**: Build type-safe REST or GraphQL APIs using **Node.js (Hono/Express)** or **Python FastAPI**.
3. **Database**: Store core entities in **PostgreSQL** using Drizzle or Prisma ORM for type safety.
4. **Third-Party Services**:
   ${bp.essentialApis.map(api => `- **${api.name}**: ${api.purpose}`).join("\n   ")}

\`\`\`typescript
// Quick starter code example
export interface ${name.replace(/[^a-zA-Z]/g, "")}Config {
  appName: "${name} Clone";
  domain: "${startup.industries[0] || "SaaS"}";
  maxConcurrency: 10000;
  features: ["Auth", "Payments", "Realtime Notifications", "Search Index"];
}
\`\`\`

Feel free to ask more specific questions about **database design**, **APIs**, **preventing double bookings**, **payment payouts**, or **sample code**!`;
}

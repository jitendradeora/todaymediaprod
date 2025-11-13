# Today Media - Project Overview

## 🎯 Project Summary

**Today Media** (اليوم ميديا) is a modern Arabic news/media website built with **Next.js 16** (App Router) that uses **WordPress as a headless CMS** via GraphQL. The project is designed for optimal performance, SEO, and Arabic RTL (Right-to-Left) support.

---

## 🏗️ Architecture Overview

### **Tech Stack**

- **Frontend Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.16
- **UI Components**: Radix UI (comprehensive component library)
- **Data Fetching**: Apollo Client 4.0.8 + GraphQL
- **Backend CMS**: WordPress (headless via GraphQL API)
- **State Management**: React 19.2.0 (with React Compiler enabled)
- **Theme**: next-themes (dark/light mode support)
- **Font**: Tajawal (Google Fonts, optimized for Arabic)

### **Project Structure**

```
todaymediaprod/
├── app/                    # Next.js App Router pages
│   ├── [category]/[id]/   # Dynamic article pages
│   ├── category/          # Category listing pages
│   ├── tag/               # Tag pages
│   ├── author/            # Author pages
│   ├── video/             # Video pages
│   ├── search/            # Search functionality
│   ├── about/             # About page
│   ├── contact/           # Contact form
│   └── api/               # API routes (revalidation, search, etc.)
│
├── components/            # React components
│   ├── home/              # Homepage sections
│   ├── header/            # Header components
│   ├── footer/            # Footer components
│   ├── ui/                # Reusable UI components (Radix UI)
│   └── shared/            # Shared utilities
│
├── lib/                   # Core business logic
│   ├── client/            # Apollo Client configuration
│   ├── api/               # Data fetching functions
│   ├── actions/           # Server actions
│   ├── queries/           # GraphQL queries
│   ├── transforms/        # Data transformation utilities
│   ├── metadata.ts        # SEO metadata generation
│   └── schemas.ts         # JSON-LD schema generation
│
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

---

## 🔌 WordPress Integration

### **Connection Method**

The project connects to WordPress via **GraphQL API** using Apollo Client:

- **GraphQL Endpoint**: `${NEXT_PUBLIC_DB_URI}/graphql`
- **Environment Variable**: `NEXT_PUBLIC_DB_URI` (WordPress site URL)
- **Example**: `http://todaymediabackend.local` or `https://biva.todaymedia.net`

### **Data Flow**

1. **WordPress** stores content (posts, pages, media, ACF fields)
2. **WPGraphQL Plugin** exposes WordPress data via GraphQL
3. **Apollo Client** fetches data from WordPress GraphQL endpoint
4. **Transform Functions** convert WordPress data to TypeScript types
5. **Next.js Pages** render the transformed data

### **Key GraphQL Queries**

Located in `lib/queries/`:
- **Articles**: `articleQuires.ts` - Fetch posts by ID, category, tag, author
- **Site Data**: `site/` - Homepage config, menus, logo, theme settings
- **Videos**: `videoQueries.ts` - Video content
- **Tags**: `tagQueries.ts` - Tag listings

---

## 🔄 Cache Management & Revalidation

### **Automatic Revalidation System**

The project implements a **webhook-based revalidation system** to keep Next.js cache in sync with WordPress:

#### **How It Works:**

1. **WordPress Side** (`wordpress-webhook.php`):
   - Hooks into WordPress actions (post save, publish, delete, menu update, etc.)
   - Sends HTTP POST request to Next.js revalidation API
   - Includes secret token for security

2. **Next.js Side** (`app/api/revalidate/route.ts`):
   - Receives webhook from WordPress
   - Validates secret token (`REVALIDATE_SECRET`)
   - Calls `revalidatePath()` to clear Next.js cache
   - Revalidates specific pages based on action type

#### **Revalidation Triggers:**

- ✅ Post/Page: Create, Update, Publish, Unpublish, Delete
- ✅ Menu: Update, Delete
- ✅ Media: Upload, Edit, Delete
- ✅ Theme Settings (ACF Options): Update

#### **Configuration:**

**WordPress** (`wordpress-webhook.php`):
```php
define('NEXTJS_URL', 'http://localhost:3000');
define('NEXTJS_SECRET', 'your-secret-token');
```

**Next.js** (`.env.local`):
```env
REVALIDATE_SECRET=your-secret-token
NEXT_PUBLIC_DB_URI=http://todaymediabackend.local
```

---

## 📄 Page Structure

### **Homepage** (`app/page.tsx`)

- Fetches homepage configuration from WordPress ACF fields
- Dynamically renders up to 11 sections based on WordPress config
- Section types:
  - **Hero Slider**: Featured articles carousel
  - **Grid Section**: Multi-column article grid (2, 3, or 4 columns)
  - **Horizontal Section**: Horizontal article list with excerpts
  - **Opinions Section**: Special CTA-style section
  - **Video Section**: Latest videos

### **Article Pages** (`app/[category]/[id]/page.tsx`)

- Dynamic routes for individual articles
- Fetches article by database ID
- Includes SEO metadata, JSON-LD schemas
- Displays: title, content, author, date, categories, tags

### **Category Pages** (`app/category/[category]/page.tsx`)

- Lists all articles in a category
- Supports pagination via GraphQL cursor-based pagination
- Category slug can be Arabic (URL encoded)

### **Other Pages**

- **Author Pages**: `/author/[id]` - Author profile and articles
- **Tag Pages**: `/tag/[tag]` - Articles by tag
- **Search**: `/search` - Full-text search
- **Videos**: `/videos` and `/video/[videoId]`
- **About/Contact**: Static pages with WordPress content

---

## 🎨 UI/UX Features

### **Design System**

- **RTL Support**: Full Arabic right-to-left layout
- **Dark Mode**: Theme toggle with system preference detection
- **Responsive**: Mobile-first design
- **Performance Optimized**:
  - Image optimization (AVIF, WebP)
  - Code splitting (dynamic imports)
  - React Compiler enabled
  - Aggressive caching strategies

### **Key Components**

- **Header**: Logo, search bar, navigation menu, theme toggle
- **Sticky Navigation**: Sticky header on scroll
- **Breaking News Bar**: Ticker-style breaking news
- **Footer**: Collapsible sections, social links, scroll-to-top
- **News Cards**: Reusable article card component
- **Video Player**: Custom video player component

---

## 🔍 SEO Optimization

### **Metadata Management** (`lib/metadata.ts`)

- Dynamic metadata generation for all pages
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs
- JSON-LD structured data (Organization, Website, Breadcrumbs)

### **Image Optimization**

- Next.js Image component with optimization
- Remote image patterns configured for WordPress CDN
- Lazy loading and responsive images
- AVIF/WebP format support

---

## 📦 Data Transformation

### **Article Transform** (`lib/transforms/articleTransform.ts`)

Converts WordPress GraphQL response to TypeScript `Article` type:

- Decodes HTML entities
- Calculates reading time
- Formats dates in Arabic
- Extracts SEO data from ACF fields
- Handles featured images

### **Type Definitions** (`types/`)

- `articles.ts` - Article interfaces
- `authors.ts` - Author types
- `videos.ts` - Video types
- `tags.ts` - Tag types

---

## 🚀 Development Workflow

### **Local Development**

1. **Prerequisites**:
   - Node.js 18+
   - WordPress installation with WPGraphQL plugin
   - ACF (Advanced Custom Fields) plugin

2. **Setup**:
   ```bash
   npm install
   cp .env.example .env.local
   # Edit .env.local with your WordPress URL
   npm run dev
   ```

3. **WordPress Setup**:
   - Install WPGraphQL plugin
   - Install ACF plugin
   - Add `wordpress-webhook.php` code to `functions.php`
   - Configure ACF fields for homepage sections

### **Build & Deploy**

```bash
npm run build  # Production build
npm start      # Start production server
```

### **Environment Variables**

Required in `.env.local`:
- `NEXT_PUBLIC_DB_URI` - WordPress site URL
- `REVALIDATE_SECRET` - Secret token for webhooks
- `SITE_URL` - Production site URL (optional)

---

## 🔐 Security Features

- Secret token validation for webhooks
- Image content security policy
- X-Frame-Options header
- Input sanitization in transforms
- Error handling and logging

---

## 📊 Performance Optimizations

1. **Next.js Optimizations**:
   - React Compiler enabled
   - Code splitting with dynamic imports
   - Image optimization
   - Font optimization (self-hosted Google Fonts)

2. **Caching Strategy**:
   - Next.js fetch cache with revalidation
   - Apollo Client network-only policy (bypasses Apollo cache)
   - Aggressive image caching (1 year)
   - Static page generation where possible

3. **Bundle Optimization**:
   - Package import optimization
   - Console removal in production
   - Tree shaking

---

## 🛠️ Key Files Reference

| File | Purpose |
|------|---------|
| `lib/client/ApolloClient.ts` | GraphQL client configuration |
| `lib/api/articles.ts` | Article data fetching functions |
| `lib/actions/site/homeActions.ts` | Homepage data fetching |
| `app/api/revalidate/route.ts` | Webhook endpoint for cache revalidation |
| `wordpress-webhook.php` | WordPress hooks for triggering revalidation |
| `lib/metadata.ts` | SEO metadata generation |
| `lib/transforms/articleTransform.ts` | WordPress data transformation |
| `components/HomePage.tsx` | Homepage component |
| `next.config.ts` | Next.js configuration |

---

## 📝 Notes

- The project uses **database ID** for article routing (not slug)
- Arabic slugs are URL encoded/decoded automatically
- Homepage sections are fully configurable via WordPress ACF
- All images are served from WordPress CDN (`biva.todaymedia.net`)
- The project supports both local development and production environments

---

## 🔗 Related Projects

- **WordPress Theme**: Separate WordPress theme (hello-elementor) for content management
- **WordPress Backend**: Headless WordPress installation with WPGraphQL

---

## 📧 Support

For questions or issues, refer to:
- Next.js Documentation: https://nextjs.org/docs
- WPGraphQL Documentation: https://www.wpgraphql.com/
- Apollo Client Documentation: https://www.apollographql.com/docs/react/

---

**Last Updated**: 2025-01-27
**Project Version**: 0.1.0


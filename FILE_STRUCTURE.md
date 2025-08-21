# PawConnect - File Structure & Code Explanations

## 📁 Complete File Listing

Below is the complete structure of the PawConnect project with explanations for each file:

## 🏗 Root Configuration Files

### `package.json` *(Read-Only)*
Package configuration with all dependencies for React, TypeScript, Supabase, and UI libraries.

### `tailwind.config.ts`
Tailwind CSS configuration with:
- Custom color palette using HSL values
- Pet-friendly design tokens (coral, warm shadows)
- Font family definitions
- Animation configurations
- Responsive breakpoints

### `vite.config.ts`
Vite build tool configuration with:
- React plugin setup
- Path aliasing (@/ for src/)
- Development server configuration

### `tsconfig.json` *(Read-Only)*
TypeScript configuration for strict type checking and modern JavaScript features.

## 🎨 Styling Files

### `src/index.css`
**Purpose**: Global styles and CSS custom properties
**Key Content**:
```css
/* Design system color tokens */
:root {
  --primary: [coral/orange hsl values];
  --secondary: [complementary colors];
  --accent: [bright interaction colors];
  /* Light mode color palette */
}

.dark {
  /* Dark mode color overrides */
}

/* Global typography and base styles */
```

### `src/App.css`
Legacy CSS file (can be removed as we use Tailwind)

## ⚛️ React Application Core

### `src/main.tsx`
**Purpose**: Application entry point
**Content**: Minimal React 18 setup with root rendering

### `src/App.tsx`
**Purpose**: Main application wrapper with providers
**Key Features**:
- React Query setup for server state management
- Authentication provider wrapping
- React Router configuration with routes:
  - `/` - Landing page (public)
  - `/auth` - Authentication (public)
  - `/feed` - Social feed (protected)
  - `*` - 404 fallback
- Toast and tooltip providers

## 🔐 Authentication System

### `src/hooks/useAuth.tsx`
**Purpose**: Authentication context and state management
**Key Features**:
```typescript
// Comprehensive auth interface
interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email, password, username, petName?, petBreed?) => Promise<{error}>
  signIn: (email, password) => Promise<{error}>
  signOut: () => Promise<void>
  loading: boolean;
}
```

**Critical Implementation Details**:
- Session persistence with localStorage
- Automatic token refresh
- Pet information collection during signup
- Proper redirect URL configuration for email verification
- Secure auth state listener setup

## 📄 Page Components

### `src/pages/Index.tsx`
**Purpose**: Landing/marketing page
**Features**:
- Hero section with pet imagery and value proposition
- Feature showcase with FeatureCard components
- Call-to-action buttons for auth
- Responsive design optimized for conversion
- Pet-themed imagery and messaging

### `src/pages/Auth.tsx`
**Purpose**: Combined login and registration page
**Features**:
```typescript
// Comprehensive form state management
const [signUpForm, setSignUpForm] = useState({
  email: '',
  password: '',
  username: '',
  confirmPassword: '',
  petName: '',      // Required pet information
  petBreed: ''      // Optional breed details
});
```

**User Experience Features**:
- Tabbed interface (Login/Signup)
- Password confirmation validation
- Pet information collection during signup
- Loading states with user feedback
- Toast notifications for errors/success
- Automatic redirect after authentication

### `src/pages/Feed.tsx`
**Purpose**: Main social media feed
**Features**:
```typescript
// Post interface with profile join
interface Post {
  caption: string;
  likes: number;
  comments: number;
  user_id: string;
  profiles: {
    username: string;
    pet_name: string;
    pet_breed?: string;
  };
}
```

**Key Functionality**:
- Authentication guard (redirects if not logged in)
- Supabase query with profile joins
- Post display with PetPhotoCard components
- Create post dialog integration
- Empty state handling
- Loading animations

### `src/pages/NotFound.tsx`
**Purpose**: Custom 404 error page
**Features**: Branded 404 page matching site design

## 🧩 UI Components

### `src/components/PetPhotoCard.tsx`
**Purpose**: Individual post display component
**Props Interface**:
```typescript
interface PetPhotoCardProps {
  image: string;
  petName: string;
  ownerName: string;
  likes: number;
  comments: number;
  caption: string;
}
```

**Visual Features**:
- Responsive image display with proper aspect ratio
- Engagement buttons (like, comment, share) with counts
- Hover effects and smooth animations
- Pet and owner attribution
- Card-based layout with warm shadows

### `src/components/CreatePostDialog.tsx`
**Purpose**: Modal for creating new posts
**Status**: Referenced in Feed.tsx but not yet fully implemented
**Planned Features**: Image upload, caption input, post creation

### `src/components/PawConnectLogo.tsx`
**Purpose**: Reusable brand logo component
**Usage**: Used in headers, loading states, and branding

### `src/components/FeatureCard.tsx`
**Purpose**: Feature showcase cards for landing page
**Features**: Consistent card layout for highlighting platform capabilities

## 🎛 UI Component Library

### `src/components/ui/`
**Purpose**: Shadcn/ui component library
**Key Components**:
- `button.tsx` - Customizable button variants
- `card.tsx` - Container component with proper styling
- `input.tsx` - Form input with validation styling
- `label.tsx` - Accessible form labels
- `tabs.tsx` - Tab navigation (used in auth page)
- `dialog.tsx` - Modal dialogs
- `toast.tsx` & `toaster.tsx` - Notification system
- `form.tsx` - React Hook Form integration
- Additional utility components (avatar, badge, etc.)

## 🔗 Backend Integration

### `src/integrations/supabase/client.ts`
**Purpose**: Supabase client configuration
**Configuration**:
```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,        // Session persistence
    persistSession: true,        // Cross-session persistence
    autoRefreshToken: true,      // Automatic token refresh
  }
});
```

**Security**: Configured for secure authentication with proper session management

### `src/integrations/supabase/types.ts` *(Auto-Generated)*
**Purpose**: TypeScript types for database schema
**Content**:
- Complete database table interfaces
- Relationship definitions
- Insert/Update type safety
- Enum definitions
- Query result types

**Important**: This file is auto-generated from Supabase and should not be manually edited

## 🛠 Utility Files

### `src/lib/utils.ts`
**Purpose**: Utility functions for component development
**Key Functions**:
- `cn()` - Tailwind class name merging utility
- Type-safe class concatenation
- Conditional class application

### `src/hooks/use-mobile.tsx`
**Purpose**: Responsive design hook for mobile detection
**Usage**: Helps components adapt to mobile vs desktop layouts

### `src/hooks/use-toast.ts`
**Purpose**: Toast notification hook
**Features**: Programmatic toast creation with proper typing

## 🗄 Database Files

### `supabase/config.toml`
**Purpose**: Supabase project configuration
**Content**: Local development settings and project metadata

### `supabase/migrations/` *(Auto-Generated)*
**Purpose**: Database migration files
**Content**: SQL commands for creating tables, policies, functions, and triggers

## 🏗 Build Configuration

### `.env` *(Read-Only)*
Environment variables for Supabase configuration

### `eslint.config.js`
ESLint configuration for code quality and consistency

### `postcss.config.js` *(Read-Only)*
PostCSS configuration for Tailwind CSS processing

### `index.html`
Main HTML template with proper meta tags and root element

## 📱 Static Assets

### `public/`
- `favicon.ico` - Site favicon
- `robots.txt` - Search engine crawling rules
- `placeholder.svg` - Placeholder graphics

### `src/assets/`
**Purpose**: Project-specific assets
**Current Assets**:
- `hero-cat.jpg` - Cat image for landing page hero
- `hero-dog.jpg` - Dog image for landing page hero
- `hero-rabbit.jpg` - Rabbit image for landing page hero

**Usage**: Imported as ES6 modules for optimal bundling

## 🔒 Security & Access Files

### Files You **CAN** Modify:
- All `src/` files (components, pages, hooks, styles)
- `tailwind.config.ts`
- `vite.config.ts`
- Static assets in `public/` and `src/assets/`

### Files You **CANNOT** Modify:
- `package.json` (use Lovable dependency tools instead)
- `tsconfig.json` and related TypeScript configs
- `components.json` (Shadcn configuration)
- `postcss.config.js`
- Lock files (`bun.lockb`, `package-lock.json`)
- `src/integrations/supabase/types.ts` (auto-generated)

## 📊 File Importance Levels

### **Critical Files** (Must have for basic functionality):
1. `src/App.tsx` - Application structure
2. `src/hooks/useAuth.tsx` - Authentication system
3. `src/pages/Auth.tsx` - User registration/login
4. `src/pages/Feed.tsx` - Main application interface
5. `src/integrations/supabase/client.ts` - Backend connection
6. `src/index.css` - Design system foundation

### **Important Files** (Core features):
1. `src/pages/Index.tsx` - Landing page
2. `src/components/PetPhotoCard.tsx` - Post display
3. `tailwind.config.ts` - Design configuration
4. `src/main.tsx` - Application entry

### **Supporting Files** (Enhanced UX):
1. All `src/components/ui/` files - UI consistency
2. `src/lib/utils.ts` - Developer utilities
3. Asset files - Visual appeal
4. Configuration files - Development experience

## 🎯 Implementation Priority

When recreating this project, implement in this order:

1. **Foundation** (Critical files + basic routing)
2. **Authentication** (Auth system + database setup)
3. **Core Features** (Feed display + post creation)
4. **Polish** (UI enhancements + responsive design)
5. **Advanced** (Real-time features + optimizations)

This structure provides a solid foundation for a scalable, maintainable pet social media platform.
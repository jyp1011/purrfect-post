# PawConnect - Technical Documentation

## 🏗 Architecture Overview

PawConnect follows a modern React architecture with TypeScript, utilizing Supabase for backend services and a component-based design system.

## 📁 Detailed Code Structure

### Core Application Files

#### `src/main.tsx`
Entry point that renders the React application with minimal setup.

#### `src/App.tsx`
Main application component that sets up:
- **React Query** for server state management
- **React Router** for client-side routing
- **Authentication Provider** for user context
- **UI Providers** (Tooltip, Toast) for user experience
- **Route Configuration** with protected routes

```typescript
// Key routes:
- "/" - Landing page (public)
- "/auth" - Authentication (public) 
- "/feed" - Main social feed (protected)
- "*" - 404 fallback
```

### Authentication System

#### `src/hooks/useAuth.tsx`
Comprehensive authentication context providing:

**State Management:**
```typescript
interface AuthContextType {
  user: User | null;           // Current authenticated user
  session: Session | null;     // Supabase session with tokens
  signUp: (email, password, username, petName?, petBreed?) => Promise<{error}>
  signIn: (email, password) => Promise<{error}>
  signOut: () => Promise<void>
  loading: boolean;           // Initial auth state loading
}
```

**Key Implementation Details:**
- **Session Persistence**: Uses localStorage for session storage
- **Auto Refresh**: Automatic token refresh via Supabase
- **Email Redirect**: Properly configured redirect URLs for email verification
- **Pet Data Collection**: Extends signup to collect pet information
- **Error Handling**: Comprehensive error handling with user feedback

**Authentication Flow:**
1. **Initialization**: Sets up auth state listener before checking existing session
2. **State Updates**: Synchronous updates to prevent race conditions  
3. **Profile Creation**: Automatic profile creation via database trigger
4. **Redirect Handling**: Proper URL redirects after authentication

### Page Components

#### `src/pages/Index.tsx` - Landing Page
**Purpose**: Marketing page to introduce PawConnect and convert visitors

**Key Features:**
- Hero section with pet imagery and value proposition
- Feature showcase highlighting platform capabilities  
- Clear call-to-action buttons for signup/login
- Responsive design optimized for conversion

#### `src/pages/Auth.tsx` - Authentication Page
**Purpose**: Handles both login and registration flows

**Form Management:**
```typescript
// Login form state
const [signInForm, setSignInForm] = useState({
  email: '',
  password: ''
});

// Registration form state  
const [signUpForm, setSignUpForm] = useState({
  email: '',
  password: '',
  username: '',
  confirmPassword: '',
  petName: '',      // Required for pet-focused platform
  petBreed: ''      // Optional breed information
});
```

**Validation & UX:**
- Password confirmation matching
- Required field validation
- Loading states during authentication
- Toast notifications for success/error feedback
- Automatic redirect to feed on successful authentication

#### `src/pages/Feed.tsx` - Main Social Feed
**Purpose**: Primary interface for viewing and interacting with pet posts

**Data Management:**
```typescript
interface Post {
  caption: string;
  likes: number;
  comments: number;
  user_id: string;
  image_url?: string;
  // Joined profile data:
  profiles: {
    username: string;
    pet_name: string;
    pet_breed?: string;
  };
}
```

**Key Functionality:**
- **Authentication Guard**: Redirects unauthenticated users to auth page
- **Post Fetching**: Joins posts with profile data for complete display
- **Real-time Ready**: Structure supports Supabase real-time subscriptions
- **Post Creation**: Integration with CreatePostDialog component
- **Loading States**: Elegant loading animation with logo
- **Empty States**: Encourages first post creation

### UI Components

#### `src/components/PetPhotoCard.tsx`
**Purpose**: Displays individual pet posts in the feed

**Design Features:**
- **Image Display**: Optimized pet photo presentation with proper aspect ratios
- **Engagement UI**: Like, comment, and share buttons with counts
- **Owner Attribution**: Clear pet name and owner display
- **Interactive Elements**: Hover effects and smooth animations
- **Accessibility**: Proper alt text and ARIA labels

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

#### `src/components/CreatePostDialog.tsx`
Modal component for creating new posts (referenced but not yet implemented)

#### `src/components/PawConnectLogo.tsx`
Brand logo component used across the application

#### `src/components/FeatureCard.tsx`
Reusable card component for displaying features on landing page

### Backend Integration

#### `src/integrations/supabase/client.ts`
Supabase client configuration with authentication settings:

```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,        // Persistent session storage
    persistSession: true,        // Maintain sessions across browser sessions
    autoRefreshToken: true,      // Automatic token refresh
  }
});
```

#### `src/integrations/supabase/types.ts` 
Auto-generated TypeScript types from Supabase schema providing:
- Complete database schema types
- Table relationships and constraints
- Insert/update/select type safety
- Enum and composite type definitions

## 🗄 Database Schema Details

### Tables and Relationships

#### `profiles` Table
**Purpose**: Store user profile information including pet details
```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- username: TEXT (unique identifier)  
- display_name: TEXT (optional display name)
- pet_name: TEXT (pet's name)
- pet_breed: TEXT (optional breed information)
- pet_age: INTEGER (optional age)
- bio: TEXT (optional biography)
- avatar_url: TEXT (optional profile image)
- created_at/updated_at: TIMESTAMP
```

#### `posts` Table  
**Purpose**: Store main post content and metadata
```sql
- id: UUID (primary key)
- user_id: UUID (post owner)
- caption: TEXT (optional post description)
- likes_count: INTEGER (cached like count)
- comments_count: INTEGER (cached comment count)  
- created_at/updated_at: TIMESTAMP
```

#### `post_images` Table
**Purpose**: Support multiple images per post
```sql
- id: UUID (primary key)
- post_id: UUID (references posts)
- image_url: TEXT (image storage URL)
- alt_text: TEXT (accessibility description)
- display_order: INTEGER (image ordering)
- created_at: TIMESTAMP
```

#### Social Interaction Tables
- **`post_likes`**: User likes on posts
- **`comments`**: Nested comment system with parent_id for replies
- **`comment_likes`**: User likes on comments  
- **`follows`**: User following relationships

### Database Functions & Triggers

#### `handle_new_user()` Function
**Purpose**: Automatically create user profile when user signs up

```sql
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name, pet_name, pet_breed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'pet_name',
    NEW.raw_user_meta_data->>'pet_breed'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Trigger**: `on_auth_user_created` - Fires after user creation in auth.users

#### Counter Functions
Auto-maintain engagement counts:
- `update_post_likes_count()` - Updates post like counts
- `update_comment_likes_count()` - Updates comment like counts  
- `update_post_comments_count()` - Updates post comment counts

### Row Level Security (RLS) Policies

#### Core Security Principles:
1. **Public Read Access**: Social features require public visibility
2. **Owner Write Access**: Users can only modify their own content
3. **Authentication Required**: Write operations require valid user session

#### Example Policy Structure:
```sql
-- Posts are viewable by everyone (social media requirement)
CREATE POLICY "Posts are viewable by everyone" 
ON posts FOR SELECT USING (true);

-- Users can only create posts as themselves
CREATE POLICY "Users can create their own posts"
ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only modify their own posts  
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE USING (auth.uid() = user_id);
```

## 🎨 Design System Implementation

### Tailwind Configuration (`tailwind.config.ts`)
Extends Tailwind with custom design tokens:

```typescript
theme: {
  extend: {
    colors: {
      // Semantic color system using HSL
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",  
      accent: "hsl(var(--accent))",
      // Component-specific colors
      card: "hsl(var(--card))",
      popover: "hsl(var(--popover))",
    },
    fontFamily: {
      heading: ["Inter", "sans-serif"],
      body: ["system-ui", "sans-serif"]
    }
  }
}
```

### CSS Custom Properties (`src/index.css`)
Root-level design tokens for consistent theming:

```css
:root {
  /* Color palette using HSL for easy manipulation */
  --primary: [hsl values];
  --secondary: [hsl values];
  --accent: [hsl values];
  
  /* Component colors */
  --card: [hsl values];
  --popover: [hsl values];
  
  /* Interactive states */
  --muted: [hsl values];
  --muted-foreground: [hsl values];
}

/* Dark mode support */
.dark {
  --primary: [dark mode hsl values];
  /* ... other dark mode overrides */
}
```

## 🔧 Development Patterns

### State Management Strategy
- **Server State**: React Query for API data with caching
- **Authentication**: React Context for global auth state
- **Component State**: useState for local component state
- **Form State**: Controlled components with validation

### Error Handling Patterns
```typescript
// Authentication errors
const { error } = await signUp(email, password, username, petName, petBreed);
if (error) {
  toast({
    title: "Signup Error",
    description: error.message,
    variant: "destructive"
  });
  return;
}

// Success feedback  
toast({
  title: "Account created successfully!",
  description: "Welcome to PawConnect!"
});
```

### Loading State Management
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    // Async operation
  } finally {
    setIsLoading(false); // Always reset loading state
  }
};
```

### Type Safety Implementation
- **Supabase Types**: Auto-generated types for database operations
- **Component Props**: Explicit interfaces for all component props
- **API Responses**: Typed responses from Supabase operations
- **Form Data**: Typed form state management

## 📱 Responsive Design Implementation

### Mobile-First Approach
- **Base Styles**: Mobile-optimized by default
- **Progressive Enhancement**: Larger breakpoints enhance experience
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Performance**: Optimized for mobile network conditions

### Breakpoint Strategy
```css
/* Tailwind breakpoints used throughout */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */  
lg: 1024px  /* Small desktops */
xl: 1280px  /* Large desktops */
```

## 🚀 Performance Optimizations

### Code Splitting
- **Route-based**: Each page component loads independently
- **Component-based**: Heavy components use React.lazy()
- **Library Splitting**: Vendor code separated from app code

### Image Optimization
- **Responsive Images**: Multiple sizes for different screen densities  
- **Lazy Loading**: Images load as they come into viewport
- **Format Optimization**: Modern formats (WebP) with fallbacks

### Database Performance
- **Efficient Queries**: Joins minimize database round trips
- **Proper Indexing**: Indexes on commonly queried columns
- **Pagination Ready**: Query structure supports efficient pagination

## 🔒 Security Implementation

### Authentication Security
- **Secure Defaults**: Supabase Auth handles security best practices
- **Token Management**: Automatic refresh prevents stale tokens
- **Session Validation**: Server-side validation of all requests

### Data Protection
- **Input Sanitization**: All user inputs properly sanitized
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Supabase handles CSRF token management

### Privacy by Design
- **Minimal Data Collection**: Only necessary data is collected
- **User Control**: Users control their own data visibility
- **Secure Defaults**: Privacy-first configuration choices

This technical documentation provides the foundation for understanding, extending, and maintaining the PawConnect platform.
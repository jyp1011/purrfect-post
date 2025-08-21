# PawConnect - Setup Guide

## 🚀 Quick Start Guide

This guide will help you recreate the PawConnect project from scratch in your Lovable account.

## 📋 Prerequisites

- Lovable account
- Supabase account (free tier is sufficient)
- Basic understanding of React and TypeScript

## 🛠 Project Setup Steps

### Step 1: Create New Lovable Project

1. **Log into Lovable** and click "Create New Project"
2. **Choose Template**: Start with "React + TypeScript" template
3. **Project Name**: "PawConnect" or your preferred name
4. **Description**: "Pet-focused social media platform"

### Step 2: Supabase Backend Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create new project
2. **Project Name**: Same as your Lovable project
3. **Database Password**: Generate secure password (save it!)
4. **Region**: Choose closest to your users
5. Wait for project initialization (2-3 minutes)

#### Get Supabase Credentials  
1. Go to **Project Settings > API**
2. Copy these values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)

### Step 3: Configure Supabase in Lovable

#### Update Supabase Client Configuration
1. **Open** `src/integrations/supabase/client.ts`
2. **Replace** the URL and key with your project's values:

```typescript
const SUPABASE_URL = "YOUR_PROJECT_URL_HERE";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_ANON_KEY_HERE";
```

### Step 4: Database Schema Setup

#### Run Database Migrations
In Supabase SQL Editor, execute these commands in order:

**1. Create Profiles Table:**
```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  username text NOT NULL UNIQUE,
  display_name text,
  pet_name text,
  pet_breed text,
  pet_age integer,
  bio text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
```

**2. Create Posts System:**
```sql
-- Create posts table
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  caption text,
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Posts are viewable by everyone" 
ON public.posts FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" 
ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.posts FOR DELETE USING (auth.uid() = user_id);
```

**3. Create Post Images Table:**
```sql
-- Create post_images table
CREATE TABLE public.post_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Post images are viewable by everyone" 
ON public.post_images FOR SELECT USING (true);

CREATE POLICY "Users can add images to their own posts" 
ON public.post_images FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM posts 
  WHERE posts.id = post_images.post_id 
  AND posts.user_id = auth.uid()
));

CREATE POLICY "Users can update images on their own posts" 
ON public.post_images FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM posts 
  WHERE posts.id = post_images.post_id 
  AND posts.user_id = auth.uid()
));

CREATE POLICY "Users can delete images from their own posts" 
ON public.post_images FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM posts 
  WHERE posts.id = post_images.post_id 
  AND posts.user_id = auth.uid()
));
```

**4. Create Social Features:**
```sql
-- Create post_likes table
CREATE TABLE public.post_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Post likes are viewable by everyone" 
ON public.post_likes FOR SELECT USING (true);

CREATE POLICY "Users can like posts" 
ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes" 
ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Create comments table
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  parent_id uuid,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies  
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments" 
ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Create comment_likes table
CREATE TABLE public.comment_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Comment likes are viewable by everyone" 
ON public.comment_likes FOR SELECT USING (true);

CREATE POLICY "Users can like comments" 
ON public.comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own comment likes" 
ON public.comment_likes FOR DELETE USING (auth.uid() = user_id);

-- Create follows table
CREATE TABLE public.follows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid NOT NULL,
  following_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Follows are viewable by everyone" 
ON public.follows FOR SELECT USING (true);

CREATE POLICY "Users can follow others" 
ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
ON public.follows FOR DELETE USING (auth.uid() = follower_id);
```

**5. Create Database Functions:**
```sql
-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Function to update post likes count
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update comment likes count
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.comments SET likes_count = likes_count - 1 WHERE id = OLD.comment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update post comments count
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

**6. Create Triggers:**
```sql
-- Trigger for auto-updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for auto-creating user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Triggers for maintaining counts
CREATE TRIGGER update_post_likes_count_trigger
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_likes_count();

CREATE TRIGGER update_comment_likes_count_trigger
  AFTER INSERT OR DELETE ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_likes_count();

CREATE TRIGGER update_post_comments_count_trigger
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_comments_count();
```

### Step 5: Install Required Dependencies

In your Lovable project, ensure these packages are installed:

```bash
# Core dependencies (should already be installed)
@supabase/supabase-js
@tanstack/react-query
react-router-dom
react-hook-form
@hookform/resolvers
zod

# UI dependencies
@radix-ui/react-tabs
@radix-ui/react-dialog
@radix-ui/react-toast
lucide-react
sonner

# Utility dependencies  
clsx
tailwind-merge
class-variance-authority
```

### Step 6: Copy Project Files

Copy all the provided source files to your Lovable project:

#### Core Files:
- `src/App.tsx` - Main application setup
- `src/main.tsx` - Entry point
- `src/index.css` - Design system styles

#### Hook Files:
- `src/hooks/useAuth.tsx` - Authentication context

#### Page Files:
- `src/pages/Index.tsx` - Landing page
- `src/pages/Auth.tsx` - Authentication page  
- `src/pages/Feed.tsx` - Main social feed
- `src/pages/NotFound.tsx` - 404 page

#### Component Files:
- `src/components/PetPhotoCard.tsx` - Post display component
- `src/components/CreatePostDialog.tsx` - Post creation modal
- `src/components/PawConnectLogo.tsx` - Logo component
- `src/components/FeatureCard.tsx` - Feature showcase component

#### Integration Files:
- `src/integrations/supabase/client.ts` - Supabase configuration
- Update with your project's URL and key

### Step 7: Configure Design System

#### Update `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        heading: ["Inter", "sans-serif"],
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        warm: "0 4px 20px -2px rgba(251, 146, 60, 0.15)",
        coral: "0 8px 30px -4px rgba(251, 146, 60, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

### Step 8: Add Pet Images

Download and add these pet images to `src/assets/`:
- `hero-cat.jpg` - Cat image for landing page
- `hero-dog.jpg` - Dog image for landing page  
- `hero-rabbit.jpg` - Rabbit image for landing page

Or use placeholder images from a service like Unsplash.

### Step 9: Test the Application

1. **Start Development**: Your Lovable project should now be running
2. **Test Registration**: 
   - Go to `/auth`
   - Create new account with pet information
   - Verify profile creation in Supabase dashboard
3. **Test Authentication Flow**:
   - Login with created account
   - Verify redirect to `/feed`
   - Test logout functionality

### Step 10: Generate Supabase Types

1. **In Supabase Dashboard**: Go to Settings > API
2. **Generate Types**: Use the TypeScript type generator
3. **Update Types**: Replace content in `src/integrations/supabase/types.ts`

## 🎯 Next Steps After Setup

### Immediate Features to Implement:
1. **Complete Post Creation**: Build the CreatePostDialog component
2. **Image Upload**: Add Supabase Storage for pet photos
3. **Like/Unlike**: Implement post engagement features
4. **Comments**: Add comment display and creation
5. **User Profiles**: Create detailed profile pages

### Optional Enhancements:
- Email verification setup in Supabase Auth
- Real-time subscriptions for live updates
- Image optimization and CDN integration
- Push notifications for engagement
- Advanced search and filtering

## ❗ Common Issues & Solutions

### Authentication Issues:
- **Problem**: Users can't log in after signup
- **Solution**: Check email confirmation settings in Supabase Auth

### Database Connection Issues:
- **Problem**: "Invalid API key" errors  
- **Solution**: Verify Supabase URL and key are correct

### RLS Policy Issues:
- **Problem**: Users can't see posts
- **Solution**: Ensure RLS policies allow SELECT for authenticated users

### Type Errors:
- **Problem**: TypeScript errors for database operations
- **Solution**: Regenerate types from Supabase dashboard

## 📞 Support Resources

- **Lovable Documentation**: [docs.lovable.dev](https://docs.lovable.dev)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **React Router Documentation**: [reactrouter.com](https://reactrouter.com)
- **Tailwind CSS Documentation**: [tailwindcss.com](https://tailwindcss.com)

This setup guide provides everything needed to recreate PawConnect in your own Lovable environment!
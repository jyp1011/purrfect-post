import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import PawConnectLogo from '@/components/PawConnectLogo';
import PetPhotoCard from '@/components/PetPhotoCard';
import { Plus, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    display_name: string;
    pet_name: string;
  } | null;
  post_images: {
    image_url: string;
  }[];
}

const Feed = () => {
  const { user, signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchPosts();
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          id,
          caption,
          likes_count,
          comments_count,
          created_at,
          user_id,
          post_images (
            image_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        return;
      }

      // Fetch profiles separately to avoid relationship issues
      const userIds = [...new Set(posts?.map(post => post.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, pet_name')
        .in('user_id', userIds);

      // Create a map of profiles by user_id
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Merge posts with profiles
      const postsWithProfiles = posts?.map(post => ({
        ...post,
        profiles: profileMap.get(post.user_id) || null
      })) || [];

      setPosts(postsWithProfiles);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <PawConnectLogo className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-16 items-center justify-between">
          <PawConnectLogo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Welcome Message */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-heading font-bold">Welcome to your feed!</h1>
            <p className="text-muted-foreground">Share your pet's adventures with the community</p>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PetPhotoCard
                  key={post.id}
                  image={post.post_images[0]?.image_url || '/placeholder.svg'}
                  petName={post.profiles?.pet_name || 'Unknown Pet'}
                  ownerName={post.profiles?.username || 'Unknown User'}
                  likes={post.likes_count}
                  comments={post.comments_count}
                  caption={post.caption || ''}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Feed;
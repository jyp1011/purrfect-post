import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ImagePlus, X } from 'lucide-react';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
}

const CreatePostDialog = ({ open, onOpenChange, onPostCreated }: CreatePostDialogProps) => {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || (!caption.trim() && !imageUrl.trim())) {
      toast({
        title: "Error",
        description: "Please add a caption or image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          caption: caption.trim() || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Add image if provided
      if (imageUrl.trim() && post) {
        const { error: imageError } = await supabase
          .from('post_images')
          .insert({
            post_id: post.id,
            image_url: imageUrl.trim(),
            display_order: 0,
          });

        if (imageError) throw imageError;
      }

      toast({
        title: "Success!",
        description: "Your post has been shared with the community",
      });

      // Reset form
      setCaption('');
      setImageUrl('');
      onOpenChange(false);
      onPostCreated?.();

    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCaption('');
      setImageUrl('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-heading">Share Your Pet's Moment</DialogTitle>
          <DialogDescription>
            Share a special moment with your pet and connect with the PawConnect community.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Tell us about this moment with your pet..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isSubmitting}
              >
                <ImagePlus className="h-4 w-4" />
              </Button>
            </div>
            {imageUrl && (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={() => setImageUrl('')}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => setImageUrl('')}
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={isSubmitting || (!caption.trim() && !imageUrl.trim())}
            >
              {isSubmitting ? 'Sharing...' : 'Share Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
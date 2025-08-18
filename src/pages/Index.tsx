import { Button } from "@/components/ui/button";
import { Camera, Heart, Users, Share, MessageCircle, Star } from "lucide-react";
import PawConnectLogo from "@/components/PawConnectLogo";
import PetPhotoCard from "@/components/PetPhotoCard";
import FeatureCard from "@/components/FeatureCard";
import heroDog from "@/assets/hero-dog.jpg";
import heroCat from "@/assets/hero-cat.jpg";
import heroRabbit from "@/assets/hero-rabbit.jpg";

const Index = () => {
  const samplePosts = [
    {
      image: heroDog,
      petName: "Buddy",
      ownerName: "sarah_petlover",
      likes: 127,
      comments: 23,
      caption: "Morning walks are the best! 🌅 Buddy always finds the perfect spot for photos."
    },
    {
      image: heroCat,
      petName: "Whiskers",
      ownerName: "cat_mom_jane",
      likes: 89,
      comments: 15,
      caption: "This little one found the coziest window spot and won't move! 😸"
    },
    {
      image: heroRabbit,
      petName: "Clover",
      ownerName: "bunny_dad",
      likes: 156,
      comments: 31,
      caption: "Garden time with my favorite bunny! She loves exploring the flowers 🌸"
    }
  ];

  const features = [
    {
      icon: Camera,
      title: "Share Pet Moments",
      description: "Upload and share your favorite pet photos with a loving community of pet enthusiasts.",
      gradient: "coral" as const
    },
    {
      icon: Heart,
      title: "Connect with Pet Lovers",
      description: "Follow other pet parents, like their posts, and build meaningful connections.",
      gradient: "mint" as const
    },
    {
      icon: Users,
      title: "Join Communities",
      description: "Find breed-specific groups, local pet meetups, and specialized communities.",
      gradient: "warm" as const
    }
  ];

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <PawConnectLogo />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#community" className="text-foreground hover:text-primary transition-colors">Community</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>Sign In</Button>
            <Button variant="hero" onClick={() => window.location.href = '/auth'}>Join Now</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight">
              Where Pet Love
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Comes Together
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your pet's precious moments, connect with fellow pet lovers, and discover a warm community 
              that celebrates the joy our furry friends bring to our lives.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="hero" className="text-lg px-8 py-6" onClick={() => window.location.href = '/auth'}>
              <Camera className="mr-2 h-5 w-5" />
              Start Sharing
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              <Users className="mr-2 h-5 w-5" />
              Explore Community
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-primary" />
              <span>10k+ Happy Pet Parents</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              <span>50k+ Pet Photos Shared</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Posts Preview */}
      <section id="community" className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">See What Our Community Shares</h2>
            <p className="text-xl text-muted-foreground">Real pets, real moments, real love</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {samplePosts.map((post, index) => (
              <PetPhotoCard key={index} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-4">Built for Pet Lovers</h2>
            <p className="text-xl text-muted-foreground">Everything you need to share and celebrate your pet's life</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-heading font-bold">Ready to Join PawConnect?</h2>
          <p className="text-xl text-muted-foreground">
            Start sharing your pet's story today and become part of our loving community
          </p>
          <Button size="lg" variant="hero" className="text-lg px-12 py-6" onClick={() => window.location.href = '/auth'}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white/80 backdrop-blur-md border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <PawConnectLogo />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
            <p>© 2024 PawConnect. Made with ❤️ for pet lovers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

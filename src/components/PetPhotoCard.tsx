import { Heart, MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PetPhotoCardProps {
  image: string;
  petName: string;
  ownerName: string;
  likes: number;
  comments: number;
  caption: string;
}

const PetPhotoCard = ({ image, petName, ownerName, likes, comments, caption }: PetPhotoCardProps) => {
  return (
    <Card className="overflow-hidden shadow-warm hover:shadow-coral transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={image} 
          alt={`${petName} the pet`}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Heart className="h-4 w-4 text-primary" />
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading font-semibold text-lg">{petName}</h3>
          <p className="text-muted-foreground text-sm">by @{ownerName}</p>
        </div>
        
        <p className="text-foreground">{caption}</p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
              <Heart className="h-4 w-4" />
              <span className="text-sm">{likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{comments}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PetPhotoCard;
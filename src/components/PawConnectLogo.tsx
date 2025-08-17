import { Heart } from "lucide-react";

const PawConnectLogo = ({ className = "h-8 w-auto" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Heart className="h-8 w-8 text-primary fill-primary" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-background"></div>
      </div>
      <span className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        PawConnect
      </span>
    </div>
  );
};

export default PawConnectLogo;
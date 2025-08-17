import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: "coral" | "mint" | "warm";
}

const FeatureCard = ({ icon: Icon, title, description, gradient = "warm" }: FeatureCardProps) => {
  const gradientClass = {
    coral: "gradient-coral",
    mint: "gradient-mint", 
    warm: "gradient-warm"
  }[gradient];

  return (
    <Card className={`p-6 ${gradientClass} shadow-warm hover:shadow-coral transition-all duration-300 transform hover:-translate-y-2 border-0`}>
      <div className="space-y-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 w-fit">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
          <p className="text-foreground/80">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default FeatureCard;
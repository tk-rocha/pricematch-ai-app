import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CommonHeaderProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
  showMenuButton?: boolean;
}

export const CommonHeader = ({ 
  title, 
  showBackButton = true, 
  backTo = "/dashboard",
  showMenuButton = false 
}: CommonHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backTo);
  };

  const handleMenu = () => {
    navigate("/cadastros");
  };

  return (
    <div className="flex items-center justify-between w-full p-4 bg-background border-b border-border">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 bg-background border-muted shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        {showMenuButton && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleMenu}
            className="h-10 w-10 bg-background border-muted shadow-sm"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>

      <h1 className="text-xl font-bold text-primary text-center flex-1">
        {title}
      </h1>

      <div className="w-10" /> {/* Spacer for balance */}
    </div>
  );
};
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PrecificaLogo from "@/components/PrecificaLogo";

const Index = () => {
  const navigate = useNavigate();

  const handleAccess = () => {
    // Navigate to dashboard or show success message
    console.log("Acesso realizado com sucesso!");
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col justify-between items-center px-6 py-8"
      style={{
        backgroundImage: `url('/lovable-uploads/f0be0c35-df3f-4cb3-9249-e88a181af9a4.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Logo Section */}
      <div className="relative z-10 pt-16">
        <PrecificaLogo />
      </div>
      
      {/* Access Button and Footer */}
      <div className="relative z-10 w-full max-w-sm space-y-6">
        <Button 
          variant="access" 
          size="lg"
          onClick={handleAccess}
          className="w-full text-lg py-4"
        >
          ACESSAR
        </Button>
        
        <footer className="text-center">
          <p className="text-precifica-gray text-sm">
            © 2025 Precific.aí
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

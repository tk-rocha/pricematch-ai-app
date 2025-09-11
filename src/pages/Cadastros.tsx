import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";

const Cadastros = () => {
  const navigate = useNavigate();

  const cadastroOptions = [
    { id: "produto", label: "Novo Produto" },
    { id: "insumo", label: "Novo Insumo" },
    { id: "unidade", label: "Nova Unidade de Medida" },
    { id: "plataforma", label: "Nova Plataforma" },
    { id: "placeholder1", label: "xxxx" },
    { id: "placeholder2", label: "xxxx" },
  ];

  const handleOptionClick = (optionId: string) => {
    switch (optionId) {
      case "plataforma":
        navigate("/cadastro-plataforma");
        break;
      case "unidade":
        navigate("/cadastro-unidade");
        break;
      default:
        console.log(`Navigate to ${optionId} registration`);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Fixed Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <h1 className="text-lg font-medium">
            CADASTROS
          </h1>
          
          {/* Empty div for spacing */}
          <div className="w-10" />
        </div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 max-w-md mx-auto">
          {cadastroOptions.map((option) => (
            <Card 
              key={option.id}
              className="bg-card border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleOptionClick(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-primary font-semibold text-left flex-1">
                    {option.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cadastros;
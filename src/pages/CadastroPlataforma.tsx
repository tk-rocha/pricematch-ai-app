import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Plataforma {
  id: string;
  nome: string;
  taxa: number;
}

const CadastroPlataforma = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: "",
    taxa: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Remove error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTaxaChange = (value: string) => {
    // Allow only numbers and decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === "") {
      handleInputChange("taxa", value);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da plataforma é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const savePlataforma = () => {
    if (!validateForm()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome da plataforma",
        variant: "destructive"
      });
      return false;
    }

    // Get existing platforms from localStorage
    const existingPlataformas = JSON.parse(localStorage.getItem("plataformas") || "[]");
    
    // Create new platform
    const newPlataforma: Plataforma = {
      id: Date.now().toString(),
      nome: formData.nome.trim(),
      taxa: parseFloat(formData.taxa) || 0
    };

    // Save to localStorage
    existingPlataformas.push(newPlataforma);
    localStorage.setItem("plataformas", JSON.stringify(existingPlataformas));

    return true;
  };

  const handleSave = () => {
    if (savePlataforma()) {
      toast({
        title: "Plataforma salva!",
        description: "A plataforma foi cadastrada com sucesso"
      });
      navigate("/listagem-plataformas");
    }
  };

  const handleContinuarCadastrando = () => {
    if (savePlataforma()) {
      toast({
        title: "Plataforma salva!",
        description: "Continue cadastrando mais plataformas"
      });
      
      // Clear form
      setFormData({
        nome: "",
        taxa: ""
      });
      setErrors({});
    }
  };

  const handleBack = () => {
    navigate("/listagem-plataformas");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Button>
          
          <h1 className="text-base sm:text-lg font-bold text-primary">
            Plataformas
          </h1>
          
          <div className="w-10 sm:w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20 safe-area-bottom">
        <div className="max-w-lg mx-auto p-3 sm:p-4">
          
          {/* Form Card */}
          <Card className="shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-foreground flex items-center gap-2">
                <Package className="h-5 w-5" />
                Cadastro de Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
              
              {/* Nome Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nome da Plataforma *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Ex: Mercado Livre, Shopee, Amazon..."
                  className={`w-full h-12 sm:h-14 px-4 py-3 border rounded-md text-sm placeholder:text-precifica-gray-text focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    errors.nome ? 'border-red-500' : 'border-input bg-background'
                  }`}
                />
                {errors.nome && (
                  <p className="text-red-500 text-xs">{errors.nome}</p>
                )}
              </div>

              {/* Taxa Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Taxa da Plataforma (%)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.taxa}
                    onChange={(e) => handleTaxaChange(e.target.value)}
                    placeholder="Ex: 12.5"
                    className="w-full h-12 sm:h-14 px-4 py-3 pr-8 border border-input bg-background rounded-md text-sm placeholder:text-precifica-gray-text focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxa cobrada pela plataforma sobre as vendas
                </p>
              </div>

              {/* Continue Button */}
              <div className="pt-4">
                <Button
                  onClick={handleContinuarCadastrando}
                  className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold"
                  size="lg"
                >
                  Continuar Cadastrando
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer Buttons */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 sm:p-4 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 h-11 sm:h-12 text-sm"
          >
            Voltar
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 h-11 sm:h-12 text-sm font-semibold"
          >
            Salvar
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CadastroPlataforma;
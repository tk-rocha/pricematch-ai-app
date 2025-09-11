import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ruler } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Unidade {
  id: string;
  nome: string;
  sigla: string;
}

const CadastroUnidade = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: "",
    sigla: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Remove error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da unidade é obrigatório";
    }

    if (!formData.sigla.trim()) {
      newErrors.sigla = "Sigla é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveUnidade = () => {
    if (!validateForm()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome da unidade e a sigla",
        variant: "destructive"
      });
      return false;
    }

    // Get existing units from localStorage
    const existingUnidades = JSON.parse(localStorage.getItem("unidades") || "[]");
    
    // Create new unit
    const newUnidade: Unidade = {
      id: Date.now().toString(),
      nome: formData.nome.trim(),
      sigla: formData.sigla.trim().toUpperCase()
    };

    // Save to localStorage
    existingUnidades.push(newUnidade);
    localStorage.setItem("unidades", JSON.stringify(existingUnidades));

    return true;
  };

  const handleSave = () => {
    if (saveUnidade()) {
      toast({
        title: "Unidade salva!",
        description: "A unidade de medida foi cadastrada com sucesso"
      });
      navigate("/cadastros");
    }
  };

  const handleContinuarCadastrando = () => {
    if (saveUnidade()) {
      toast({
        title: "Unidade salva!",
        description: "Continue cadastrando mais unidades"
      });
      
      // Clear form
      setFormData({
        nome: "",
        sigla: ""
      });
      setErrors({});
    }
  };

  const handleBack = () => {
    navigate("/cadastros");
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
            Unidade de Medida
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
                <Ruler className="h-5 w-5" />
                Cadastro de Unidade de Medida
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
              
              {/* Nome Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nome da Unidade *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Ex: Quilograma, Metro, Litro..."
                  className={`w-full h-12 sm:h-14 px-4 py-3 border rounded-md text-sm placeholder:text-precifica-gray-text focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    errors.nome ? 'border-red-500' : 'border-input bg-background'
                  }`}
                />
                {errors.nome && (
                  <p className="text-red-500 text-xs">{errors.nome}</p>
                )}
              </div>

              {/* Sigla Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Sigla *
                </label>
                <input
                  type="text"
                  value={formData.sigla}
                  onChange={(e) => handleInputChange("sigla", e.target.value)}
                  placeholder="Ex: KG, M, L..."
                  className={`w-full h-12 sm:h-14 px-4 py-3 border rounded-md text-sm placeholder:text-precifica-gray-text focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    errors.sigla ? 'border-red-500' : 'border-input bg-background'
                  }`}
                />
                {errors.sigla && (
                  <p className="text-red-500 text-xs">{errors.sigla}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Abreviação da unidade de medida
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
        <div className="max-w-lg mx-auto flex gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="h-11 sm:h-12 text-sm px-6"
          >
            Voltar
          </Button>
          <Button
            onClick={handleSave}
            className="h-11 sm:h-12 text-sm font-semibold px-6"
          >
            Salvar
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CadastroUnidade;
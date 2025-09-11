import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CommonHeader } from "@/components/CommonHeader";

const PlatformRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    taxa: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "O campo Nome é obrigatório.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const savePlatform = () => {
    if (!validateForm()) return false;

    // Save to localStorage (simulating database)
    const platforms = JSON.parse(localStorage.getItem("platforms") || "[]");
    const newPlatform = {
      id: Date.now(),
      nome: formData.nome,
      taxa: formData.taxa ? parseFloat(formData.taxa) : null,
      createdAt: new Date().toISOString(),
    };
    platforms.push(newPlatform);
    localStorage.setItem("platforms", JSON.stringify(platforms));

    toast({
      title: "Sucesso",
      description: "Plataforma salva com sucesso!",
    });

    return true;
  };

  const handleSave = () => {
    if (savePlatform()) {
      navigate("/cadastros");
    }
  };

  const handleContinueRegistering = () => {
    if (savePlatform()) {
      setFormData({ nome: "", taxa: "" });
    }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <CommonHeader 
        title="Cadastro de Plataforma" 
        backTo="/cadastros" 
      />

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
          {/* Form Fields */}
          <div className="bg-card p-6 rounded-lg shadow-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium text-foreground">
                Nome *
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Digite o nome da plataforma"
                className="bg-background border-input placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxa" className="text-sm font-medium text-foreground">
                Taxa %
              </Label>
              <Input
                id="taxa"
                type="number"
                step="0.01"
                value={formData.taxa}
                onChange={(e) => handleInputChange("taxa", e.target.value)}
                placeholder="Digite a taxa (opcional)"
                className="bg-background border-input placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Continue Registering Button */}
            <Button
              onClick={handleContinueRegistering}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg text-base font-medium"
            >
              Continuar Cadastrando
            </Button>

            {/* Bottom Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/cadastros")}
                className="flex-1 border-primary text-primary hover:bg-primary/10"
              >
                Voltar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformRegistration;
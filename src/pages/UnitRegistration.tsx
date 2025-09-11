import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CommonHeader } from "@/components/CommonHeader";

const UnitRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    sigla: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim() || !formData.sigla.trim()) {
      toast({
        title: "Erro de validação",
        description: "Os campos Nome e Sigla são obrigatórios.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const saveUnit = () => {
    if (!validateForm()) return false;

    // Save to localStorage (simulating database)
    const units = JSON.parse(localStorage.getItem("units") || "[]");
    const newUnit = {
      id: Date.now(),
      nome: formData.nome,
      sigla: formData.sigla,
      createdAt: new Date().toISOString(),
    };
    units.push(newUnit);
    localStorage.setItem("units", JSON.stringify(units));

    toast({
      title: "Sucesso",
      description: "Unidade de medida salva com sucesso!",
    });

    return true;
  };

  const handleSave = () => {
    if (saveUnit()) {
      navigate("/cadastros");
    }
  };

  const handleContinueRegistering = () => {
    if (saveUnit()) {
      setFormData({ nome: "", sigla: "" });
    }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <CommonHeader 
        title="Cadastro de Unidade" 
        backTo="/cadastros" 
      />

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
          {/* Form Fields */}
          <div className="bg-card p-6 rounded-lg shadow-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium text-foreground">
                Nome da Unidade *
              </Label>
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Ex.: Quilograma, Litro, Unidade"
                className="bg-background border-input placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sigla" className="text-sm font-medium text-foreground">
                Sigla *
              </Label>
              <Input
                id="sigla"
                type="text"
                value={formData.sigla}
                onChange={(e) => handleInputChange("sigla", e.target.value)}
                placeholder="Ex.: kg, L, un"
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

export default UnitRegistration;
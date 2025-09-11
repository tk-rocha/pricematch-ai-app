import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    if (!validateForm()) return;

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
  };

  const handleSave = () => {
    saveUnit();
    navigate("/cadastros");
  };

  const handleContinueRegistering = () => {
    saveUnit();
    setFormData({ nome: "", sigla: "" });
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-sm">
        <div className="flex items-center justify-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cadastros")}
            className="absolute left-0 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <h1 className="text-lg font-medium text-[#0C1646]">
            UNIDADE DE MEDIDA
          </h1>
        </div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-6">
          {/* Form Fields */}
          <div className="bg-card p-6 rounded-lg shadow-[0_2px_8px_rgba(12,22,70,0.1)] space-y-4">
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
              className="w-full bg-[#0C1646] hover:bg-[#0C1646]/90 text-white py-3 rounded-lg text-base font-medium"
            >
              Continuar Cadastrando
            </Button>

            {/* Bottom Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/cadastros")}
                className="flex-1 border-[#0C1646] text-[#0C1646] hover:bg-[#0C1646]/10"
              >
                Voltar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-[#0C1646] hover:bg-[#0C1646]/90 text-white"
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Insumo {
  id: string;
  nome: string;
  codigo?: string;
  unidade: string;
  preco: string;
}

const CadastroInsumo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    unidade: "",
    preco: ""
  });

  const unidadesMedida = ["Un", "L", "Kg", "M", "Caixa", "Pacote"];

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Remove error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePrecoChange = (value: string) => {
    const regex = /^\d*[.,]?\d*$/;
    if (regex.test(value) || value === "") {
      const standardizedValue = value.replace(',', '.');
      handleInputChange("preco", standardizedValue);
    }
  };


  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.unidade) {
      newErrors.unidade = "Unidade de Medida é obrigatória";
    }

    if (!formData.preco.trim()) {
      newErrors.preco = "Preço é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveInsumo = () => {
    if (!validateForm()) {
      toast({
        title: "Campos obrigatórios",
        description: "Os campos Nome, Unidade de Medida e Preço são obrigatórios",
        variant: "destructive"
      });
      return false;
    }

    const existingInsumos = JSON.parse(localStorage.getItem("insumos") || "[]");
    
    const newInsumo: Insumo = {
      id: Date.now().toString(),
      nome: formData.nome.trim(),
      codigo: formData.codigo.trim(),
      unidade: formData.unidade,
      preco: formData.preco
    };

    existingInsumos.push(newInsumo);
    localStorage.setItem("insumos", JSON.stringify(existingInsumos));

    return true;
  };

  const handleSave = () => {
    if (saveInsumo()) {
      toast({
        title: "Insumo salvo!",
        description: "O insumo foi cadastrado com sucesso"
      });
      navigate("/listagem-insumos");
    }
  };

  const handleContinuarCadastrando = () => {
    if (saveInsumo()) {
      toast({
        title: "Insumo salvo!",
        description: "Continue cadastrando mais insumos"
      });
      
      // Clear form
      setFormData({
        nome: "",
        codigo: "",
        unidade: "",
        preco: ""
      });
      setErrors({});
    }
  };

  const handleBack = () => {
    navigate("/listagem-insumos");
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
            Insumos
          </h1>
          
          <div className="w-10 sm:w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <div className="max-w-lg mx-auto p-4">
          
          <Card className="shadow-lg border-0" style={{ borderRadius: '3px' }}>
            <CardContent className="p-6">
              
              <div className="space-y-4">
                {/* Nome Field */}
                <div>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Nome"
                    className={`w-full h-12 px-4 border rounded text-sm ${
                      errors.nome ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ borderRadius: '3px', color: '#666666' }}
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
                  )}
                </div>

                {/* Código Field */}
                <div>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange("codigo", e.target.value)}
                    placeholder="Código"
                    className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                    style={{ borderRadius: '3px', color: '#666666' }}
                  />
                </div>

                {/* Unidade de Medida Field */}
                <div>
                  <select
                    value={formData.unidade}
                    onChange={(e) => handleInputChange("unidade", e.target.value)}
                    className={`w-full h-12 px-4 border rounded text-sm ${
                      errors.unidade ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ borderRadius: '3px', color: formData.unidade ? '#000' : '#666666' }}
                  >
                    <option value="">Unidade Medida</option>
                    {unidadesMedida.map(unidade => (
                      <option key={unidade} value={unidade}>{unidade}</option>
                    ))}
                  </select>
                  {errors.unidade && (
                    <p className="text-red-500 text-xs mt-1">{errors.unidade}</p>
                  )}
                </div>

                {/* Preço Field */}
                <div>
                  <input
                    type="text"
                    value={formData.preco}
                    onChange={(e) => handlePrecoChange(e.target.value)}
                    placeholder="Preço"
                    className={`w-full h-12 px-4 border rounded text-sm ${
                      errors.preco ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ borderRadius: '3px', color: '#666666' }}
                  />
                  {errors.preco && (
                    <p className="text-red-500 text-xs mt-1">{errors.preco}</p>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <div className="mt-16">
                <Button
                  onClick={handleContinuarCadastrando}
                  className="w-full h-12 font-bold"
                  style={{ backgroundColor: '#180F33', borderRadius: '3px' }}
                >
                  Salvar e Continuar Cadastrando
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

export default CadastroInsumo;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  categoria: string;
}

const CadastroProduto = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Remove error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePrecoChange = (value: string) => {
    // Allow only numbers, decimal point and comma
    const regex = /^\d*[.,]?\d*$/;
    if (regex.test(value) || value === "") {
      // Replace comma with dot for standardization
      const standardizedValue = value.replace(',', '.');
      handleInputChange("preco", standardizedValue);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome do produto é obrigatório";
    }

    if (!formData.preco.trim()) {
      newErrors.preco = "Preço é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveProduto = () => {
    if (!validateForm()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e preço do produto",
        variant: "destructive"
      });
      return false;
    }

    // Get existing products from localStorage
    const existingProdutos = JSON.parse(localStorage.getItem("produtos") || "[]");
    
    // Create new product
    const newProduto: Produto = {
      id: Date.now().toString(),
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      preco: formData.preco,
      categoria: formData.categoria.trim()
    };

    // Save to localStorage
    existingProdutos.push(newProduto);
    localStorage.setItem("produtos", JSON.stringify(existingProdutos));

    return true;
  };

  const handleSave = () => {
    if (saveProduto()) {
      toast({
        title: "Produto salvo!",
        description: "O produto foi cadastrado com sucesso"
      });
      navigate("/dashboard");
    }
  };

  const handleContinuarCadastrando = () => {
    if (saveProduto()) {
      toast({
        title: "Produto salvo!",
        description: "Continue cadastrando mais produtos"
      });
      
      // Clear form
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        categoria: ""
      });
      setErrors({});
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
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
            Cadastro de Produtos
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
                Novo Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
              
              {/* Nome Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  placeholder="Ex: Camiseta Basic, Tênis Esportivo..."
                  className={`w-full h-12 sm:h-14 px-4 py-3 border rounded-md text-sm placeholder:text-precifica-gray-text focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                    errors.nome ? 'border-red-500' : 'border-input bg-background'
                  }`}
                />
                {errors.nome && (
                  <p className="text-red-500 text-xs">{errors.nome}</p>
                )}
              </div>

              {/* Descrição Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  placeholder="Descreva as características do produto..."
                  rows={3}
                  className="w-full px-4 py-3 border border-input bg-background rounded-md text-sm placeholder:text-precifica-gray-text focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
              </div>

              {/* Preço Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Preço *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.preco}
                    onChange={(e) => handlePrecoChange(e.target.value)}
                    placeholder="0,00"
                    className={`w-full h-12 sm:h-14 px-4 py-3 pl-12 border rounded-md text-sm placeholder:text-precifica-gray-text focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                      errors.preco ? 'border-red-500' : 'border-input bg-background'
                    }`}
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                    R$
                  </span>
                </div>
                {errors.preco && (
                  <p className="text-red-500 text-xs">{errors.preco}</p>
                )}
              </div>

              {/* Categoria Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => handleInputChange("categoria", e.target.value)}
                  placeholder="Ex: Roupas, Calçados, Eletrônicos..."
                  className="w-full h-12 sm:h-14 px-4 py-3 border border-input bg-background rounded-md text-sm placeholder:text-precifica-gray-text focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
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

export default CadastroProduto;
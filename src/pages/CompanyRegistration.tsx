import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    empresa: "",
    email: "",
    nome: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    municipioUf: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCepSearch = () => {
    if (formData.cep) {
      // Here you would implement CEP API search
      toast({
        title: "CEP",
        description: "Funcionalidade de busca por CEP será implementada",
      });
    }
  };

  const handleSave = () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O campo Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage to persist between sessions
    localStorage.setItem("userData", JSON.stringify(formData));
    
    toast({
      title: "Sucesso",
      description: "Dados salvos com sucesso!",
    });
    
    navigate("/dashboard");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Title */}
        <h1 className="text-xl font-bold text-primary text-center">
          CADASTRO LOJA
        </h1>

        {/* Form */}
        <div className="space-y-4">
          {/* Empresa */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <Label htmlFor="empresa" className="text-sm text-muted-foreground">
                Empresa (opcional)
              </Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => handleInputChange("empresa", e.target.value)}
                placeholder="Nome da empresa"
                className="mt-1"
              />
            </CardContent>
          </Card>

          {/* E-mail */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <Label htmlFor="email" className="text-sm text-muted-foreground">
                E-mail (opcional)
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="seu@email.com"
                className="mt-1"
              />
            </CardContent>
          </Card>

          {/* Nome */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <Label htmlFor="nome" className="text-sm text-muted-foreground">
                Nome (obrigatório)
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Seu nome"
                className="mt-1"
                required
              />
            </CardContent>
          </Card>

          {/* CEP */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <Label htmlFor="cep" className="text-sm text-muted-foreground">
                CEP (opcional)
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                  placeholder="00000-000"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleCepSearch}
                  className="px-4"
                >
                  OK
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rua */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-4">
              <Label htmlFor="rua" className="text-sm text-muted-foreground">
                Rua (opcional)
              </Label>
              <Input
                id="rua"
                value={formData.rua}
                onChange={(e) => handleInputChange("rua", e.target.value)}
                placeholder="Nome da rua"
                className="mt-1"
              />
            </CardContent>
          </Card>

          {/* Número e Complemento */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <Label htmlFor="numero" className="text-sm text-muted-foreground">
                  Número (opcional)
                </Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  placeholder="123"
                  className="mt-1"
                />
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <Label htmlFor="complemento" className="text-sm text-muted-foreground">
                  Complemento (opcional)
                </Label>
                <Input
                  id="complemento"
                  value={formData.complemento}
                  onChange={(e) => handleInputChange("complemento", e.target.value)}
                  placeholder="Apto 101"
                  className="mt-1"
                />
              </CardContent>
            </Card>
          </div>

          {/* Bairro e Município/UF */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <Label htmlFor="bairro" className="text-sm text-muted-foreground">
                  Bairro (opcional)
                </Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange("bairro", e.target.value)}
                  placeholder="Centro"
                  className="mt-1"
                />
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <Label htmlFor="municipioUf" className="text-sm text-muted-foreground">
                  Município/UF (opcional)
                </Label>
                <Input
                  id="municipioUf"
                  value={formData.municipioUf}
                  onChange={(e) => handleInputChange("municipioUf", e.target.value)}
                  placeholder="São Paulo/SP"
                  className="mt-1"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-full text-primary border-primary hover:bg-primary/5"
          >
            Voltar
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="w-full text-primary border-primary hover:bg-primary/5"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
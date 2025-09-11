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

  const handleCepSearch = async () => {
    if (!formData.cep) return;
    
    const cepNumbers = formData.cep.replace(/\D/g, '');
    
    if (cepNumbers.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "O CEP deve conter 8 dígitos",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado!",
          description: "Verifique o CEP informado",
          variant: "destructive",
        });
        return;
      }

      // Auto-fill address fields
      setFormData(prev => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        municipioUf: `${data.localidade}/${data.uf}` || ""
      }));

      toast({
        title: "CEP encontrado",
        description: "Endereço preenchido automaticamente",
      });

    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar o CEP",
        variant: "destructive",
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-sm">
        <h1 className="text-lg font-medium text-center">
          Cadastro da Loja
        </h1>
      </header>

      {/* Form Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">
          {/* Empresa */}
          <Card className="shadow-sm border-muted">
            <CardContent className="p-4">
              <Label htmlFor="empresa" className="text-sm font-medium text-muted-foreground">
                Empresa
              </Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => handleInputChange("empresa", e.target.value)}
                placeholder="Nome da empresa"
                className="mt-2 focus:ring-accent focus:border-accent"
              />
            </CardContent>
          </Card>

          {/* E-mail */}
          <Card className="shadow-sm border-muted">
            <CardContent className="p-4">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="seu@email.com"
                className="mt-2 focus:ring-accent focus:border-accent"
              />
            </CardContent>
          </Card>

          {/* Nome */}
          <Card className="shadow-sm border-muted">
            <CardContent className="p-4">
              <Label htmlFor="nome" className="text-sm font-medium text-muted-foreground">
                Nome
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                placeholder="Seu nome"
                className="mt-2 focus:ring-accent focus:border-accent"
                required
              />
            </CardContent>
          </Card>

          {/* CEP */}
          <Card className="shadow-sm border-muted">
            <CardContent className="p-4">
              <Label htmlFor="cep" className="text-sm font-medium text-muted-foreground">
                CEP
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => handleInputChange("cep", e.target.value)}
                  placeholder="00000-000"
                  className="flex-1 focus:ring-accent focus:border-accent"
                />
                <Button 
                  variant="outline" 
                  onClick={handleCepSearch}
                  className="px-4 text-primary border-primary hover:bg-primary/5"
                >
                  OK
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rua */}
          <Card className="shadow-sm border-muted">
            <CardContent className="p-4">
              <Label htmlFor="rua" className="text-sm font-medium text-muted-foreground">
                Rua
              </Label>
              <Input
                id="rua"
                value={formData.rua}
                onChange={(e) => handleInputChange("rua", e.target.value)}
                placeholder="Nome da rua"
                className="mt-2 focus:ring-accent focus:border-accent"
              />
            </CardContent>
          </Card>

          {/* Número e Complemento */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4">
                <Label htmlFor="numero" className="text-sm font-medium text-muted-foreground">
                  Número
                </Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange("numero", e.target.value)}
                  placeholder="123"
                  className="mt-2 focus:ring-accent focus:border-accent"
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-muted">
              <CardContent className="p-4">
                <Label htmlFor="complemento" className="text-sm font-medium text-muted-foreground">
                  Complemento
                </Label>
                <Input
                  id="complemento"
                  value={formData.complemento}
                  onChange={(e) => handleInputChange("complemento", e.target.value)}
                  placeholder="Apto 101"
                  className="mt-2 focus:ring-accent focus:border-accent"
                />
              </CardContent>
            </Card>
          </div>

          {/* Bairro e Município/UF */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4">
                <Label htmlFor="bairro" className="text-sm font-medium text-muted-foreground">
                  Bairro
                </Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange("bairro", e.target.value)}
                  placeholder="Centro"
                  className="mt-2 focus:ring-accent focus:border-accent"
                />
              </CardContent>
            </Card>

            <Card className="shadow-sm border-muted">
              <CardContent className="p-4">
                <Label htmlFor="municipioUf" className="text-sm font-medium text-muted-foreground">
                  Município / UF
                </Label>
                <Input
                  id="municipioUf"
                  value={formData.municipioUf}
                  onChange={(e) => handleInputChange("municipioUf", e.target.value)}
                  placeholder="São Paulo/SP"
                  className="mt-2 focus:ring-accent focus:border-accent"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed Footer Buttons */}
      <footer className="p-4 bg-background border-t border-muted">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-full text-primary border-primary hover:bg-primary/5 shadow-sm"
          >
            Voltar
          </Button>
          <Button
            onClick={handleSave}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            Salvar
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CompanyRegistration;
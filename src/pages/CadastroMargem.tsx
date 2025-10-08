import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handlePercentageInput, parsePercentageToDecimal } from "@/lib/utils";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const CadastroMargem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [margem, setMargem] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingMargem, setHasExistingMargem] = useState(false);
  const [custoIndireto, setCustoIndireto] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

// Check if margin already exists
    useEffect(() => {
      const storedMargem = localStorage.getItem("margem");
      if (storedMargem) {
        try {
          const parsed = JSON.parse(storedMargem);
          setMargem(parsed.margem || "");
          setCustoIndireto(parsed.custoIndireto || "");
          setHasExistingMargem(true);
        } catch (error) {
          console.error("Erro ao carregar margem:", error);
        }
      }

    // Modo edição via query param
    const params = new URLSearchParams(location.search);
    const modo = params.get("modo");
    if (modo === "editar") {
      setIsEditing(true);
    }
  }, [location.search]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!margem.trim()) {
      newErrors.margem = "% Margem é obrigatória";
    } else {
      const margemDecimal = parsePercentageToDecimal(margem);
      if (margemDecimal <= 0 || margemDecimal > 100) {
        newErrors.margem = "A margem deve estar entre 0,1% e 100%";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, verifique os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const margemDecimal = parsePercentageToDecimal(margem);
    const custoIndiretoDecimal = parsePercentageToDecimal(custoIndireto || "0");
   
    const margemData = {
      margem: margem,
      margemDecimal: margemDecimal,
      custoIndireto: custoIndireto,
      custoIndiretoDecimal: custoIndiretoDecimal,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem("margem", JSON.stringify(margemData));
    toast({
      title: hasExistingMargem ? "Margem atualizada!" : "Margem cadastrada!",
      description: hasExistingMargem ? "A margem foi atualizada com sucesso" : "A margem foi cadastrada com sucesso"
    });
    navigate("/listagem-margem");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    navigate("/listagem-margem");
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "margem") {
      setMargem(value);
    } else if (field === "custoIndireto") {
      setCustoIndireto(value);
    }
    
    // Remove error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
            {hasExistingMargem && !isEditing ? "Margem Cadastrada" : "Margem"}
          </h1>

          <div className="w-10 sm:w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <div className="max-w-lg mx-auto p-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/cadastros">Cadastros</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/listagem-margem">Margem</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{hasExistingMargem && !isEditing ? "Visualizar" : "Cadastrar"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card className="shadow-lg border-0" style={{ borderRadius: "3px" }}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* % Margem Field */}
                <div>
                  <Input
                    type="text"
                    value={margem}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length < margem.length) {
                        handleInputChange("margem", value);
                      } else {
                        handlePercentageInput(value, (newValue) => handleInputChange("margem", newValue));
                      }
                    }}
                    placeholder="% Margem"
                    disabled={hasExistingMargem && !isEditing}
                    className={errors.margem ? 'border-destructive' : ''}
                  />
                  {errors.margem && (
                    <p className="text-destructive text-xs mt-1">{errors.margem}</p>
                  )}
                </div>

                {/* Custo Indireto Field */}
                <div>
                  <Input
                    type="text"
                    value={custoIndireto}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length < custoIndireto.length) {
                        handleInputChange("custoIndireto", value);
                      } else {
                        handlePercentageInput(value, (newValue) => handleInputChange("custoIndireto", newValue));
                      }
                    }}
                    placeholder="Custo Indireto Padrão (%)"
                    disabled={hasExistingMargem && !isEditing}
                  />
                </div>
              </div>

              {/* Save/Edit Button */}
              {hasExistingMargem && !isEditing && (
                <div className="mt-16">
                  <Button
                    onClick={handleEdit}
                    className="w-full h-12 font-bold"
                    style={{ backgroundColor: "#180F33", borderRadius: "3px" }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              )}

              {(!hasExistingMargem || isEditing) && (
                <div className="mt-16">
                  <Button
                    onClick={handleSave}
                    className="w-full h-12 font-bold"
                    style={{ backgroundColor: "#180F33", borderRadius: "3px" }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {hasExistingMargem ? "Salvar Alterações" : "Salvar"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
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
            {hasExistingMargem ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CadastroMargem;
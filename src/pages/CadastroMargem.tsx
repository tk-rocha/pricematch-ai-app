import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Edit } from "lucide-react";
import { toast } from "sonner";
import { handlePercentageInput, parsePercentageToDecimal } from "@/lib/utils";

const CadastroMargem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [margem, setMargem] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingMargem, setHasExistingMargem] = useState(false);
  // Adicione ao topo junto com os outros useState
const [custoIndireto, setCustoIndireto] = useState("");

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

  const handleSave = () => {
    if (!margem.trim()) {
      toast.error("Por favor, informe a % de margem.");
      return;
    }

    const margemDecimal = parsePercentageToDecimal(margem);
    if (margemDecimal <= 0 || margemDecimal > 100) {
      toast.error("A margem deve estar entre 0,1% e 100%.");
      return;
    }
    const custoIndiretoDecimal = parsePercentageToDecimal(custoIndireto || "0");
   
    const margemData = {
      margem: margem,
      margemDecimal: margemDecimal,
      custoIndireto: custoIndireto,
      custoIndiretoDecimal: custoIndiretoDecimal,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem("margem", JSON.stringify(margemData));
    toast.success(hasExistingMargem ? "Margem atualizada com sucesso!" : "Margem cadastrada com sucesso!");
    navigate("/listagem-margem");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    navigate("/listagem-margem");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/listagem-margem")}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Button>

          <h1 className="text-base sm:text-lg font-bold text-foreground">
            {hasExistingMargem && !isEditing ? "Margem Cadastrada" : "Cadastro de Margem"}
          </h1>

          <div className="w-10 sm:w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 p-3 sm:p-4 pb-6 safe-area-bottom">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {hasExistingMargem && !isEditing ? "Margem Padrão" : "Configure a Margem"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="margem" className="text-sm font-medium">
                  % Margem *
                </Label>
                <Input
                  id="margem"
                  type="text"
                  placeholder="Ex: 30,0%"
                  value={margem}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length < margem.length) {
                      setMargem(value);
                    } else {
                      handlePercentageInput(value, setMargem);
                    }
                  }}
                  disabled={hasExistingMargem && !isEditing}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custo-indireto" className="text-sm font-medium">
                  Custo Indireto Padrão (%)
                </Label>
                <Input
                  id="custo-indireto"
                  type="text"
                  placeholder="Ex: 10,0%"
                  value={custoIndireto}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length < custoIndireto.length) {
                      setCustoIndireto(value);
                    } else {
                      handlePercentageInput(value, setCustoIndireto);
                    }
                  }}
                  disabled={hasExistingMargem && !isEditing}
                  className="w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Voltar
                </Button>

                {hasExistingMargem && !isEditing ? (
                  <Button
                    onClick={handleEdit}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CadastroMargem;
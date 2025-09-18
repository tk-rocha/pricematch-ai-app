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
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/listagem-margem")}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </Button>

          <h1 className="text-base sm:text-lg font-bold text-primary">
            {hasExistingMargem && !isEditing ? "Margem Cadastrada" : "Cadastro de Margem"}
          </h1>

          <div className="w-10 sm:w-11"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20">
        <div className="max-w-lg mx-auto p-4">
          <Card className="shadow-lg border-0" style={{ borderRadius: "3px" }}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    % Margem *
                  </label>
                  <input
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
                    className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                    style={{ borderRadius: "3px", color: "#666666" }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Custo Indireto Padrão (%)
                  </label>
                  <input
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
                    className="w-full h-12 px-4 border border-gray-300 rounded text-sm"
                    style={{ borderRadius: "3px", color: "#666666" }}
                  />
                </div>
              </div>

              {hasExistingMargem && !isEditing && (
                <div className="mt-6">
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
                <div className="mt-6">
                  <Button
                    onClick={handleSave}
                    className="w-full h-12 font-bold"
                    style={{ backgroundColor: "#180F33", borderRadius: "3px" }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-3 sm:p-4 safe-area-bottom">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            className="w-full h-11 sm:h-12 text-sm"
          >
            Voltar
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CadastroMargem;
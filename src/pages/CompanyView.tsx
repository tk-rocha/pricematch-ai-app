import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const CompanyView = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      // If no data exists, redirect to registration
      navigate("/cadastro-loja");
    }
  }, [navigate]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleEdit = () => {
    navigate("/cadastro-loja");
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-sm">
        <h1 className="text-lg font-medium text-center">
          Dados da Loja
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">
          {/* Empresa */}
          {userData.empresa && (
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  Empresa
                </Label>
                <p className="mt-2 text-foreground">{userData.empresa}</p>
              </CardContent>
            </Card>
          )}

          {/* E-mail */}
          {userData.email && (
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  E-mail
                </Label>
                <p className="mt-2 text-foreground">{userData.email}</p>
              </CardContent>
            </Card>
          )}

          {/* Nome */}
          <Card className="shadow-sm border-muted">
            <CardContent className="p-4">
              <Label className="text-sm font-medium text-muted-foreground">
                Nome
              </Label>
              <p className="mt-2 text-foreground font-medium">{userData.nome}</p>
            </CardContent>
          </Card>

          {/* CEP */}
          {userData.cep && (
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  CEP
                </Label>
                <p className="mt-2 text-foreground">{userData.cep}</p>
              </CardContent>
            </Card>
          )}

          {/* Rua */}
          {userData.rua && (
            <Card className="shadow-sm border-muted">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-muted-foreground">
                  Rua
                </Label>
                <p className="mt-2 text-foreground">{userData.rua}</p>
              </CardContent>
            </Card>
          )}

          {/* Número e Complemento */}
          {(userData.numero || userData.complemento) && (
            <div className="grid grid-cols-2 gap-2">
              {userData.numero && (
                <Card className="shadow-sm border-muted">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Número
                    </Label>
                    <p className="mt-2 text-foreground">{userData.numero}</p>
                  </CardContent>
                </Card>
              )}

              {userData.complemento && (
                <Card className="shadow-sm border-muted">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Complemento
                    </Label>
                    <p className="mt-2 text-foreground">{userData.complemento}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Bairro e Município/UF */}
          {(userData.bairro || userData.municipioUf) && (
            <div className="grid grid-cols-2 gap-2">
              {userData.bairro && (
                <Card className="shadow-sm border-muted">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Bairro
                    </Label>
                    <p className="mt-2 text-foreground">{userData.bairro}</p>
                  </CardContent>
                </Card>
              )}

              {userData.municipioUf && (
                <Card className="shadow-sm border-muted">
                  <CardContent className="p-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Município / UF
                    </Label>
                    <p className="mt-2 text-foreground">{userData.municipioUf}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
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
            onClick={handleEdit}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            Editar
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CompanyView;
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Menu, 
  User, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  ShoppingCart,
  Package,
  Truck,
  Receipt
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Usuário");
  
  // Get current date
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.nome) {
        setUserName(parsedData.nome);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cadastros")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <h1 className="text-lg font-medium">
            Olá, {userName}
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const userData = localStorage.getItem("userData");
              if (userData) {
                // If user data exists, go to view screen
                navigate("/company-view");
              } else {
                // If no data exists, go to registration screen
                navigate("/company-registration");
              }
            }}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <User className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {/* Sales Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Vendas Hoje</CardTitle>
              <p className="text-xs text-muted-foreground">{currentDate}</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-muted-foreground">R$ 0,00</p>
            </CardContent>
          </Card>

          <Card className="border-primary shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Quantidade de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-center text-muted-foreground">0</p>
            </CardContent>
          </Card>
        </div>

        {/* Profitability Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Maior Rentabilidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">1. Produto A</p>
                <p className="text-sm text-muted-foreground">2. Produto B</p>
                <p className="text-sm text-muted-foreground">3. Produto C</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-primary flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Menor Rentabilidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">1. Produto X</p>
                <p className="text-sm text-muted-foreground">2. Produto Y</p>
                <p className="text-sm text-muted-foreground">3. Produto Z</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-primary shadow-sm cursor-pointer hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-primary">Novo Produto</p>
                <p className="text-xs text-muted-foreground">0 cadastrados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary shadow-sm cursor-pointer hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-primary">Novo Insumo</p>
                <p className="text-xs text-muted-foreground">0 cadastrados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary shadow-sm cursor-pointer hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-primary">Nova Entrada</p>
                <p className="text-xs text-muted-foreground">Registrar entrada</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary shadow-sm cursor-pointer hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-primary">Nova Venda</p>
                <p className="text-xs text-muted-foreground">0 vendas hoje</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
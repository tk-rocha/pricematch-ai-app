import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, User, ShoppingCart, Package, TrendingUp, DollarSign } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  // Simulated user name - in a real app, this would come from auth context
  const userName = "Usuário";

  const handleCadastrosClick = () => {
    navigate("/cadastros");
  };

  const handleLojaClick = () => {
    navigate("/cadastro-loja");
  };

  const dashboardCards = [
    {
      title: "Produtos Cadastrados",
      value: "124",
      icon: Package,
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Vendas do Mês",
      value: "R$ 15.780",
      icon: DollarSign,
      change: "+8%",
      changeType: "positive" as const
    },
    {
      title: "Pedidos Pendentes",
      value: "23",
      icon: ShoppingCart,
      change: "-5%",
      changeType: "negative" as const
    },
    {
      title: "Taxa de Conversão",
      value: "3.2%",
      icon: TrendingUp,
      change: "+0.5%",
      changeType: "positive" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3 h-14">
          {/* Menu Hambúrguer */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCadastrosClick}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </Button>

          {/* Saudação Central */}
          <h1 className="text-base sm:text-lg font-bold text-foreground truncate mx-2">
            Olá, {userName}
          </h1>

          {/* Ícone de Usuário */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLojaClick}
            className="hover:bg-muted min-w-[44px] min-h-[44px]"
          >
            <User className="h-6 w-6 text-foreground" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 p-3 sm:p-4 pb-6 safe-area-bottom">
        <div className="max-w-7xl mx-auto">`
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {dashboardCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">`
                    <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                      {card.value}
                    </div>
                    <p className={`text-xs ${
                      card.changeType === 'positive' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {card.change} em relação ao mês anterior
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">`
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg text-foreground">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
                <Button 
                  onClick={() => navigate("/cadastro-produto")} 
                  className="w-full justify-start h-12 text-sm"
                  variant="outline"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Cadastrar Produto
                </Button>
                <Button 
                  onClick={() => navigate("/cadastro-plataforma")} 
                  className="w-full justify-start h-12 text-sm"
                  variant="outline"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cadastrar Plataforma
                </Button>
                <Button 
                  onClick={() => navigate("/relatorios")} 
                  className="w-full justify-start h-12 text-sm"
                  variant="outline"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Ver Relatórios
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg text-foreground">Resumo Recente</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">`
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Último produto:</span>
                    <span className="text-sm font-medium text-foreground">Smartphone XY</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Última venda:</span>
                    <span className="text-sm font-medium text-foreground">Hoje, 14:30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-sm font-medium text-green-600">Ativo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg text-foreground">Notificações</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">`
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-foreground">3 produtos com estoque baixo</p>
                    <p className="text-xs text-muted-foreground">Há 2 horas</p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-foreground">Nova venda registrada</p>
                    <p className="text-xs text-muted-foreground">Há 1 hora</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
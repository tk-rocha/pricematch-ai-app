import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao Precific.aí</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Funcionalidades</h2>
            <div className="grid gap-3">
              <div className="p-3 bg-accent rounded">
                <p className="font-medium text-accent-foreground">Comparar Preços</p>
              </div>
              <div className="p-3 bg-accent rounded">
                <p className="font-medium text-accent-foreground">Histórico de Preços</p>
              </div>
              <div className="p-3 bg-accent rounded">
                <p className="font-medium text-accent-foreground">Lista de Compras</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="w-full"
          >
            Voltar ao Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
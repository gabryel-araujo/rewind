import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    //fazer uma validação para caso o cookie tenha um token válido redirecionar para a home
    navigate({
      to: "/signin",
    });
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center animate-pulse repeat-infinite">
      Carregando...
    </div>
  );
}

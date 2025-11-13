import { routeTree } from "./route-tree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
//import axios from "axios";

const router = createRouter({ routeTree });

const queryClient = new QueryClient();
//axios.defaults.withCredentials = true;

export function App() {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <TanStackRouterDevtools router={router} initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

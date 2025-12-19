import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import CurrentUserProviderContext from "./context/CurrentUserProviderContext";


export const queryClient = new QueryClient();

function App() {
  
  const [theme] = useState<string>(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.setAttribute("data-theme", "night");
    } else {
      root.setAttribute("data-theme", "light");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CurrentUserProviderContext>
          <div className="bg-gray-100 dark:bg-gray-950">
            <Outlet />
            <Toaster theme={theme === "night" ? "light" : "dark"} />
          </div>
        </CurrentUserProviderContext>
      </QueryClientProvider>
    </>
  );
}

export default App;

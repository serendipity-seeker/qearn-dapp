import { RouterProvider } from "react-router-dom";
import { QubicConnectProvider } from "./components/connect/QubicConnectContext";
import router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { WalletConnectProvider } from "./components/connect/WalletConnectContext";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { settingsAtom } from "./store/settings";

const queryClient = new QueryClient();

function App() {
  const [settings] = useAtom(settingsAtom);

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(settings?.darkMode ? "dark" : "light");
  }, [settings]);

  return (
    <div className={`bg-background font-space text-foreground`}>
      <QueryClientProvider client={queryClient}>
        <WalletConnectProvider>
          <QubicConnectProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#202E3C",
                  color: "#fff",
                },
              }}
            />
          </QubicConnectProvider>
        </WalletConnectProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;

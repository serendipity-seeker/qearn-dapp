import { Outlet } from "react-router-dom";
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import logo from "@/assets/qearn.svg";
import InfoBanner from "@/components/InfoBanner";
import useDataFetcher from "@/hooks/useDataFetcher";
import useTxMonitor from "@/hooks/useTxMonitor";

const Layout: React.FC = () => {
  useDataFetcher();
  useTxMonitor();

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-background text-foreground">
      <Header logo={logo} />
      <div className="flex flex-1 flex-col pt-[80px]">
        <div className="flex flex-1 flex-col p-4">
          <Outlet />
        </div>
      </div>
      <div>
        <InfoBanner />
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

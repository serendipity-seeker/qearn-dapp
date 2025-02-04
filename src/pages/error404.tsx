import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Error404: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-7xl font-bold">404</h1>
      <p className="mt-4 text-2xl">{t("error404.Page Not Found")}</p>
      <div className="mt-6">
        <Button variant="primary" label={t("error404.Go back to Home")} onClick={() => navigate("/")} />
      </div>
    </div>
  );
};

export default Error404;

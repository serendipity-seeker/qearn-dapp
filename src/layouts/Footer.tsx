import pkg from "../../package.json";
import logoShort from "@/assets/logo/logo-text-short.svg";
import { useTranslation } from "react-i18next";

interface FooterProps {
  appVersion?: string;
}

const Footer: React.FC<FooterProps> = ({ appVersion }): JSX.Element | null => {
  const { t } = useTranslation();

  return (
    <div className="md:px-100 flex flex-col items-center justify-center gap-10 px-5 py-10 sm:flex-row sm:px-20">
      <div className="flex gap-10">
        <img src={logoShort} alt="logo-short" />
        <span className="leading-18 font-space text-12 text-gray-500">
          {"\u00A9"} {new Date().getFullYear()} Qubic
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 md:flex-row">
        <a
          style={{ textDecoration: "none" }}
          className="leading-18 font-space text-12 text-foreground"
          target="_blank"
          rel="noreferrer"
          href="https://qubic.org/terms-of-service"
        >
          {t("footer.Terms of service")}
        </a>
        <span className="hidden text-gray-500 md:block">•</span>
        <a
          style={{ textDecoration: "none" }}
          className="leading-18 font-space text-12 text-foreground"
          target="_blank"
          rel="noreferrer"
          href="https://qubic.org/privacy-policy"
        >
          {t("footer.Privacy Policy")}
        </a>
        <span className="hidden text-gray-500 md:block">•</span>
        <a
          style={{ textDecoration: "none" }}
          className="leading-18 font-space text-12 text-foreground"
          target="_blank"
          rel="noreferrer"
          href="https://status.qubic.li/"
        >
          {t("footer.Network Status")}
        </a>
        <span className="text-12 text-gray-500">{t("footer.Version", { version: appVersion || pkg.version })}</span>
      </div>
    </div>
  );
};

export default Footer;

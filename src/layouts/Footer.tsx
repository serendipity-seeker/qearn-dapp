import pkg from '../../package.json';
import logoShort from '@/assets/logo/logo-text-short.svg';

interface FooterProps {
  appVersion?: string;
}

const Footer: React.FC<FooterProps> = ({ appVersion }): JSX.Element | null => {
  return (
    <div className="px-5 sm:px-20 md:px-100 py-10 flex flex-col sm:flex-row items-center justify-center gap-10">
      <div className="flex gap-10">
        <img src={logoShort} alt="logo-short" />
        <span className="text-gray-500 text-12 leading-18 font-space">
          {'\u00A9'} {new Date().getFullYear()} Qubic
        </span>
      </div>

      <div className="flex items-center gap-2">
        <a style={{ textDecoration: 'none' }} className="text-foreground text-12 leading-18 font-space" target="_blank" rel="noreferrer" href="https://qubic.org/Terms-of-service">
          Terms of service
        </a>
        <span className="text-gray-500">•</span>
        <a style={{ textDecoration: 'none' }} className="text-foreground text-12 leading-18 font-space" target="_blank" rel="noreferrer" href="https://qubic.org/Privacy-policy">
          Privacy Policy
        </a>
        <span className="text-gray-500">•</span>
        <a style={{ textDecoration: 'none' }} className="text-foreground text-12 leading-18 font-space" target="_blank" rel="noreferrer" href="https://status.qubic.li/">
          Network Status
        </a>
        <span className="text-gray-500 text-12">Version {appVersion || pkg.version}</span>
      </div>
    </div>
  );
};

export default Footer;

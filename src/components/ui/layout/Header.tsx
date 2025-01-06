import { Link } from 'react-router-dom';
import ConnectLink from '../../connect/ConnectLink';
import WalletInfoLabel from '@/components/WalletInfoLabel';
import TickInfoLabel from '@/components/TickInfoLabel';

interface HeaderProps {
  logo?: string;
}

const Header = ({ logo = '/qubic.svg' }: HeaderProps): JSX.Element => {
  return (
    <div className="px-6 sm:px-12 fixed h-[78px] flex w-full z-10 top-0 gap-6 justify-between items-center border-b border-solid border-gray-70 bg-gray-90">
      <div className="flex flex-1 items-center gap-2">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <TickInfoLabel />
        <ConnectLink />
      </div>
    </div>
  );
};

export default Header;

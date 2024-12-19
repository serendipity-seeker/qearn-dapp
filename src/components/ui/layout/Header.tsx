import { Link } from 'react-router-dom';
import ConnectLink from '../../connect/ConnectLink';

interface HeaderProps {
  logo?: string;
}

const Header = ({ logo = '/qubic.svg' }: HeaderProps): JSX.Element => {
  return (
    <div
      className="
      fixed h-[78px] flex w-full z-10 top-0 gap-6 justify-center items-center
      border-b border-solid border-gray-70 bg-gray-90
    "
    >
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>

      <ConnectLink />
    </div>
  );
};

export default Header;

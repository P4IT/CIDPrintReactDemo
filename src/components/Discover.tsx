import { CIDPrint } from '@captureid/capacitor3-cidprint';
import './Discover.css';

interface ContainerProps {
  name: string;
}

const Discover: React.FC<ContainerProps> = ({ name }) => {
  const discoverPrinter = () => {
    CIDPrint.discoverDevices({timeout: 0});
  }

  return (
    <div className="container">
      <strong onClick={() => discoverPrinter()}>{name}</strong>
    </div>
  );
};

export default Discover;

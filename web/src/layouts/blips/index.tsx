import Header from './components/Header';
import BlipTable from './components/BlipTable';

const Blips: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <BlipTable />
    </div>
  );
};

export default Blips;

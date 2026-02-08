import Inputs from './components/Inputs';
import Switches from './components/Switches';
import Sliders from './components/Sliders';

const General: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-5">
        <Inputs />
        <Sliders />
        <Switches />
      </div>
    </div>
  );
};

export default General;

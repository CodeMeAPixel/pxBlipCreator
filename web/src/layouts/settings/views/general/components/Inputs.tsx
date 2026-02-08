import Input from './Input';
import { useStore, useSetters } from '../../../../../store';

const Inputs: React.FC = () => {
  const blipName = useStore((state) => state.name);
  const ftimer = useStore((state) => state.ftimer);

  const setBlipName = useSetters((setter) => setter.setName);
  const setftimer = useSetters((setter) => setter.setftimer);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Input label="Blip name" type="text" value={blipName || ''} setValue={(value) => setBlipName(String(value))} />
      <Input
        label="Flash Timer"
        infoCircle="Time in milliseconds after which blip will be flashed"
        type="text"
        value={ftimer || ''}
        setValue={(value) => setftimer(Number(value))}
      />
    </div>
  );
};

export default Inputs;

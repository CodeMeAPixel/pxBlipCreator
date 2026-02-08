import { useSetters, useStore } from '../../../../../store';
import TooltipSwitch from './TooltipSwitch';

const Switches: React.FC = () => {
  const tickb = useStore((state) => state.tickb);
  const outline = useStore((state) => state.outline);
  const hideb = useStore((state) => state.hideb);
  const bflash = useStore((state) => state.bflash);
  const sRange = useStore((state) => state.sRange);
  const hideUi = useStore((state) => state.hideUi);

  const toggleCheckbox = useSetters((setter) => setter.toggleCheckbox);

  return (
    <div className="grid grid-cols-2 gap-3">
      <TooltipSwitch
        label="Tick On Blip"
        infoCircle="Enable if you want to add tick on target blip"
        value={tickb || false}
        toggle={() => toggleCheckbox('tickb')}
      />
      <TooltipSwitch
        label="Outline"
        infoCircle="Enable if the target created with outline"
        value={outline || false}
        toggle={() => toggleCheckbox('outline')}
      />
      <TooltipSwitch
        label="Hide on Minimap"
        infoCircle="Enable if the target needs to be hidden in minimap"
        value={hideb || false}
        toggle={() => toggleCheckbox('hideb')}
      />
      <TooltipSwitch
        label="Blip Flashes"
        infoCircle="Enable if the target blip needs to be flashing"
        value={bflash || false}
        toggle={() => toggleCheckbox('bflash')}
      />
      <TooltipSwitch
        label="Short Range Blip"
        infoCircle="Enable if the target blip visible in short range only"
        value={sRange || false}
        toggle={() => toggleCheckbox('sRange')}
      />
      <TooltipSwitch
        label="Hide Blip"
        infoCircle="Hides blip from map"
        value={hideUi || false}
        toggle={() => toggleCheckbox('hideUi')}
      />
    </div>
  );
};

export default Switches;

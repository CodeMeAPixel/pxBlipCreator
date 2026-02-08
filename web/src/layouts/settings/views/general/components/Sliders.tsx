import * as Slider from '@radix-ui/react-slider';
import { useStore, useSetters } from '../../../../../store';

const Sliders: React.FC = () => {
  const blipScale = useStore((state) => state.scale);
  const blipAlpha = useStore((state) => state.alpha);

  const setblipScale = useSetters((setter) => setter.setblipScale);
  const setblipAlpha = useSetters((setter) => setter.setblipAlpha);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-secondary">Blip Scale</span>
          <span className="text-xs font-mono text-text-tertiary">{(blipScale || 1).toFixed(1)}</span>
        </div>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[blipScale || 1]}
          onValueChange={([v]) => setblipScale(v)}
          min={0}
          max={10}
          step={0.1}
        >
          <Slider.Track className="bg-surface-300 relative grow rounded-full h-0.75">
            <Slider.Range className="absolute bg-px-600 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-3.5 h-3.5 bg-white rounded-full shadow-md shadow-black/30 hover:bg-px-100 focus:outline-none focus:ring-2 focus:ring-px-600/40 transition-colors" />
        </Slider.Root>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-text-secondary">Blip Opacity</span>
          <span className="text-xs font-mono text-text-tertiary">{blipAlpha || 255}</span>
        </div>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[blipAlpha || 255]}
          onValueChange={([v]) => setblipAlpha(v)}
          min={0}
          max={255}
          step={1}
        >
          <Slider.Track className="bg-surface-300 relative grow rounded-full h-0.75">
            <Slider.Range className="absolute bg-px-600 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-3.5 h-3.5 bg-white rounded-full shadow-md shadow-black/30 hover:bg-px-100 focus:outline-none focus:ring-2 focus:ring-px-600/40 transition-colors" />
        </Slider.Root>
      </div>
    </div>
  );
};

export default Sliders;

import { Routes, Route, useNavigate } from 'react-router-dom';
import { useNuiEvent } from './hooks/useNuiEvent';
import { useStore } from './store';
import Blips from './layouts/blips';
import Settings from './layouts/settings';
import { useVisibility } from './store/visibility';
import { useExitListener } from './hooks/useExitListener';
import { useBlips } from './store/blips';
import type { BlipColumn } from './store/blips';
import { convertData } from './utils/convertData';
import ErrorBoundary from './components/ErrorBoundary';
import { cn } from './utils/cn';
import { theme } from './theme';

const App: React.FC = () => {
  const [visible, setVisible] = useVisibility((state) => [state.visible, state.setVisible]);
  const blips = useBlips((state) => state.blips);
  const setBlips = useBlips((state) => state.setBlips);
  const navigate = useNavigate();

  useNuiEvent('setVisible', (data: number) => {
    setVisible(true);
    if (data === undefined) return navigate('/');
    for (let i = 0; i < blips.length; i++) {
      if (blips[i].id === data) {
        useStore.setState(convertData(blips[i]), true);
        navigate('/settings/general');
        break;
      }
    }
  });

  useNuiEvent('updateBlipData', (data: BlipColumn | number) => {
    // Blip id sent so delete — filter out the blip
    if (typeof data === 'number') return setBlips(blips.filter((blip) => blip.id !== data));
    else {
      // Single blip sent so update the object
      if (Object.prototype.hasOwnProperty.call(data, 'id')) {
        let index = blips.length;
        for (let i = 0; i < index; i++) {
          const blip = Object.values(blips)[i];
          if (blip.id === data.id) {
            index = i;
            break;
          }
        }
        return setBlips(Object.values({ ...blips, [index]: data } as BlipColumn[]));
      }
      // More than 1 blip sent — replace the object
      return setBlips(Object.values(data));
    }
  });

  useExitListener(setVisible);

  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center w-full h-full">
        <div
          className={cn(
            'glass-panel flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-black/40',
            'transition-all duration-300 ease-out',
            visible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          )}
          style={{ width: theme.container.width, height: theme.container.height }}
        >
          <Routes>
            <Route path="/" element={<Blips />} />
            <Route path="/settings/*" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;

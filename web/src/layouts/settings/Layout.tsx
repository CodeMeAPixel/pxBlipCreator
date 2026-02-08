import { Plus } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Props {
  children: React.ReactNode;
  setter: () => void;
}

const Layout: React.FC<Props> = ({ children, setter }) => {
  return (
    <div className="flex flex-col justify-between items-center h-full">
      <div className="w-full overflow-y-auto max-h-102.5">
        {children}

        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={setter}
                className="mt-3 w-full flex items-center justify-center h-9 rounded-lg border border-dashed border-border text-text-tertiary hover:text-text-primary hover:border-border-hover hover:bg-glass-hover transition-all"
              >
                <Plus size={18} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={6}
                className="px-2.5 py-1.5 text-xs rounded-lg bg-surface-200 border border-border text-text-secondary shadow-lg"
              >
                Create a new row
                <Tooltip.Arrow className="fill-surface-200" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
};

export default Layout;

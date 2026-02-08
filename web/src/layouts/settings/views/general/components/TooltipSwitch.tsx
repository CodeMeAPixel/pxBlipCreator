import * as Switch from '@radix-ui/react-switch';
import * as Tooltip from '@radix-ui/react-tooltip';
import { HelpCircle } from 'lucide-react';

interface Props {
  label: string;
  infoCircle?: string;
  value: boolean;
  toggle: () => void;
}

const TooltipSwitch: React.FC<Props> = ({ infoCircle, label, value, toggle }) => {
  return (
    <div className="flex items-center gap-2.5">
      <Switch.Root
        checked={value}
        onCheckedChange={() => toggle()}
        className="w-9 h-5 rounded-full bg-surface-300 data-[state=checked]:bg-px-600 transition-colors relative"
      >
        <Switch.Thumb className="block w-4 h-4 rounded-full bg-white shadow-sm shadow-black/20 transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
      </Switch.Root>
      <span className="text-sm text-text-secondary">{label}</span>
      {infoCircle && (
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="text-text-tertiary hover:text-text-secondary transition-colors">
                <HelpCircle size={13} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={6}
                className="max-w-[200px] px-2.5 py-1.5 text-xs rounded-lg bg-surface-200 border border-border text-text-secondary shadow-lg"
              >
                {infoCircle}
                <Tooltip.Arrow className="fill-surface-200" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  );
};

export default TooltipSwitch;

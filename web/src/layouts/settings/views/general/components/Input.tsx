import { HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Props {
  label: string;
  type: 'text' | 'number';
  value?: string | number;
  setValue: (value: string | number) => void;
  infoCircle?: string;
}

const Input: React.FC<Props> = ({ label, type, infoCircle, value, setValue }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-medium text-text-secondary">{label}</label>
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
                  className="max-w-50 px-2.5 py-1.5 text-xs rounded-lg bg-surface-200 border border-border text-text-secondary shadow-lg"
                >
                  {infoCircle}
                  <Tooltip.Arrow className="fill-surface-200" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}
      </div>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) =>
          type === 'number' ? setValue(Number(e.target.value)) : setValue(e.target.value)
        }
        className="h-9 px-3 text-sm bg-surface-100 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-px-600/50 focus:ring-1 focus:ring-px-600/20 transition-all"
      />
    </div>
  );
};

export default Input;

import { Trash2 } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useStore, useSetters } from '../../../../../store';

const GroupFields: React.FC = () => {
  const groups = useStore((state) => state.groups);
  const setGroups = useSetters((setter) => setter.setGroups);

  const handleChange = (value: string | number | undefined, index: number, property: 'name' | 'grade') => {
    setGroups((prevState) => {
      return prevState.map((item, indx) => (index === indx ? { ...item, [property]: value } : item));
    });
  };

  const handleRowDelete = (index: number) => {
    setGroups((prevState) => prevState.filter((_obj, indx) => indx !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {groups.map((field, index) => (
        <div key={`group-${index}`} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Group name"
            value={(field.name as string) ?? ''}
            onChange={(e) => handleChange(e.target.value, index, 'name')}
            className="flex-1 h-9 px-3 text-sm bg-surface-100 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-px-600/50 focus:ring-1 focus:ring-px-600/20 transition-all"
          />
          <input
            type="number"
            placeholder="Grade"
            value={field.grade ?? ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : undefined, index, 'grade')}
            className="w-24 h-9 px-3 text-sm bg-surface-100 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-px-600/50 focus:ring-1 focus:ring-px-600/20 transition-all"
          />
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => handleRowDelete(index)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger/10 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={6}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-surface-200 border border-border text-text-secondary shadow-lg"
                >
                  Delete row
                  <Tooltip.Arrow className="fill-surface-200" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      ))}
    </div>
  );
};

export default GroupFields;

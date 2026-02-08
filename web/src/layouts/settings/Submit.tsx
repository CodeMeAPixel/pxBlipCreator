import { ClipboardCheck } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useStore } from '../../store';
import { fetchNui } from '../../utils/fetchNui';
import { useClipboard } from '../../store/clipboard';
import { useVisibility } from '../../store/visibility';
import type { BlipSubmitData, GroupRecord } from '../../types';
import { cn } from '../../utils/cn';

const Submit: React.FC = () => {
  const clipboard = useClipboard((state) => state.clipboard);
  const setVisible = useVisibility((state) => state.setVisible);

  const handleSubmit = () => {
    const state = useStore.getState();
    const submitData: BlipSubmitData = {
      ...state,
      name: state.name === '' ? null : (state.name ?? null),
      hideUi: state.hideUi || null,
      groups: null,
    };

    if (state.groups && state.groups.length > 0) {
      const groupsObj: GroupRecord = {};
      for (let i = 0; i < state.groups.length; i++) {
        const groupField = state.groups[i];
        if (groupField.name && groupField.name !== '') {
          groupsObj[groupField.name] = groupField.grade || 0;
        }
      }
      submitData.groups = Object.keys(groupsObj).length > 0 ? groupsObj : null;
    }

    setVisible(false);
    fetchNui('createBlip', submitData);
  };

  return (
    <div className="flex items-center gap-3 pt-3 border-t border-border mt-3">
      <button
        onClick={handleSubmit}
        className="flex-1 h-9 rounded-lg bg-px-600 text-white text-sm font-medium hover:bg-px-700 active:bg-px-800 transition-colors uppercase tracking-wider"
      >
        Confirm blip
      </button>

      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              disabled={!clipboard}
              onClick={() => {
                if (!clipboard) return;
                useStore.setState(
                  {
                    name: '',
                    ftimer: clipboard.ftimer,
                    Sprite: clipboard.Sprite,
                    SpriteImg: clipboard.SpriteImg,
                    sColor: clipboard.sColor,
                    scImg: clipboard.scImg,
                    scale: clipboard.scale,
                    alpha: clipboard.alpha,
                    items: clipboard.items,
                    colors: clipboard.colors,
                    groups: clipboard.groups,
                    hideb: clipboard.hideb,
                    tickb: clipboard.tickb,
                    bflash: clipboard.bflash,
                    sRange: clipboard.sRange,
                    outline: clipboard.outline,
                    hideUi: clipboard.hideUi,
                  },
                  true
                );
                fetchNui('notify', 'Settings applied');
              }}
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg border transition-all',
                clipboard
                  ? 'border-border text-text-secondary hover:text-px-400 hover:border-px-600/40 hover:bg-glass-hover'
                  : 'border-border/50 text-text-muted cursor-not-allowed opacity-40'
              )}
            >
              <ClipboardCheck size={16} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={6}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-surface-200 border border-border text-text-secondary shadow-lg"
            >
              {!clipboard ? 'No blip settings copied' : 'Apply copied settings'}
              <Tooltip.Arrow className="fill-surface-200" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
};

export default Submit;

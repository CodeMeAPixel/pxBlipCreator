import { Settings, Trash2, ClipboardCopy, Locate, MoreHorizontal } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import type { BlipColumn } from '../../../store/blips';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store';
import { convertData } from '../../../utils/convertData';
import { useClipboard } from '../../../store/clipboard';
import { fetchNui } from '../../../utils/fetchNui';
import type { CellContext } from '@tanstack/react-table';
import { useVisibility } from '../../../store/visibility';
import { useState } from 'react';

const ActionsMenu: React.FC<{ data: CellContext<BlipColumn, unknown> }> = ({ data }) => {
  const navigate = useNavigate();
  const setClipboard = useClipboard((state) => state.setClipboard);
  const setVisible = useVisibility((state) => state.setVisible);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center justify-center w-7 h-7 rounded-md text-text-tertiary hover:text-text-primary hover:bg-glass-hover transition-all opacity-0 group-hover:opacity-100">
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={4}
            align="end"
            className="min-w-45 p-1 rounded-lg bg-surface-150 border border-border shadow-xl shadow-black/30 animate-in fade-in slide-in-from-top-1 duration-150 z-50"
          >
            <DropdownMenu.Item
              onSelect={() => {
                useStore.setState(convertData(data.row.original), false);
                navigate('/settings/general');
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary rounded-md cursor-pointer hover:bg-glass-hover hover:text-text-primary transition-colors outline-none"
            >
              <Settings size={14} />
              Settings
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onSelect={() => {
                setClipboard(convertData(data.row.original));
                fetchNui('notify', 'Settings copied');
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary rounded-md cursor-pointer hover:bg-glass-hover hover:text-text-primary transition-colors outline-none"
            >
              <ClipboardCopy size={14} />
              Copy settings
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onSelect={() => {
                setVisible(false);
                fetchNui('teleportToBlip', data.row.getValue('id'));
              }}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-text-secondary rounded-md cursor-pointer hover:bg-glass-hover hover:text-text-primary transition-colors outline-none"
            >
              <Locate size={14} />
              Teleport to blip
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px my-1 bg-border" />

            <DropdownMenu.Item
              onSelect={() => setDeleteOpen(true)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-danger rounded-md cursor-pointer hover:bg-danger/10 transition-colors outline-none"
            >
              <Trash2 size={14} />
              Delete blip
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Delete confirmation dialog */}
      <AlertDialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 z-50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 p-5 rounded-xl bg-surface-150 border border-border shadow-2xl shadow-black/40 animate-in fade-in zoom-in-95 duration-200 z-50">
            <AlertDialog.Title className="text-base font-semibold text-text-primary">
              Confirm deletion
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-text-secondary">
              Are you sure you want to delete <span className="font-semibold text-text-primary">{data.row.getValue('name')}</span>?
            </AlertDialog.Description>
            <div className="flex justify-end gap-2 mt-5">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 text-sm rounded-lg border border-border text-text-secondary hover:bg-glass-hover transition-colors">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={() => fetchNui('deleteblip', data.row.getValue('id'))}
                  className="px-4 py-2 text-sm rounded-lg bg-danger text-white hover:bg-danger/90 transition-colors"
                >
                  Confirm
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};

export default ActionsMenu;

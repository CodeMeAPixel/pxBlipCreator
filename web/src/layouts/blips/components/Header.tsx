import { Plus, X, Download, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVisibility } from '../../../store/visibility';
import { fetchNui } from '../../../utils/fetchNui';
import Searchbar from './Search';
import { useStore, defaultState } from '../../../store';
import { useBlips } from '../../../store/blips';
import * as Tooltip from '@radix-ui/react-tooltip';
import PxLogo from '../../../components/PxLogo';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { useRef } from 'react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const setVisible = useVisibility((state) => state.setVisible);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle export data from server
  useNuiEvent('exportData', (jsonString: string) => {
    try {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pxBlipCreator-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      console.error('Failed to download export');
    }
  });

  // Handle import result
  useNuiEvent('importResult', (data: { imported: number; failed: number }) => {
    // The blips store will be updated via the setBlips event
    console.warn(`Import complete: ${data.imported} imported, ${data.failed} failed`);
  });

  const handleExport = () => {
    fetchNui('exportBlips');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        fetchNui('importBlips', content);
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-2">
      {/* Brand mark */}
      <div className="flex items-center gap-2 mr-1 select-none">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-px-500 to-px-700 flex items-center justify-center shadow-md shadow-px-900/30">
          <PxLogo size={18} className="text-white" />
        </div>
      </div>

      <Tooltip.Provider delayDuration={200}>
        {/* New Blip */}
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={() => {
                useStore.setState(defaultState, true);
                navigate('/settings/general');
              }}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-glass-hover hover:border-border-hover transition-all"
            >
              <Plus size={16} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={6}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-surface-200 border border-border text-text-secondary shadow-lg animate-in fade-in zoom-in-95 duration-150"
            >
              Create a new blip
              <Tooltip.Arrow className="fill-surface-200" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        {/* Export */}
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={handleExport}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-glass-hover hover:border-border-hover transition-all"
            >
              <Download size={15} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={6}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-surface-200 border border-border text-text-secondary shadow-lg animate-in fade-in zoom-in-95 duration-150"
            >
              Export blips
              <Tooltip.Arrow className="fill-surface-200" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>

        {/* Import */}
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-glass-hover hover:border-border-hover transition-all"
            >
              <Upload size={15} />
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={6}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-surface-200 border border-border text-text-secondary shadow-lg animate-in fade-in zoom-in-95 duration-150"
            >
              Import blips
              <Tooltip.Arrow className="fill-surface-200" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Searchbar />

      <button
        onClick={() => {
          setVisible(false);
          fetchNui('exit');
        }}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-glass-hover transition-all"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Header;

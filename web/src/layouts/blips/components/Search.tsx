import { useEffect } from 'react';
import { Search } from 'lucide-react';
import useDebounce from '../../../hooks/useDebounce';
import { useSearch } from '../../../store/search';

const Searchbar: React.FC = () => {
  const search = useSearch();
  const debouncedSearch = useDebounce(search.value);

  useEffect(() => {
    search.setDebouncedValue(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="flex-1 relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
      <input
        type="text"
        placeholder="Search blips..."
        value={search.value ?? ''}
        onChange={(e) => search.setValue(e.target.value)}
        className="w-full h-8 pl-9 pr-3 text-sm bg-surface-100 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-px-600/50 focus:ring-1 focus:ring-px-600/20 transition-all"
      />
    </div>
  );
};

export default Searchbar;

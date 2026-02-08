import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Settings, ImageIcon, Palette, Briefcase, ArrowLeft } from 'lucide-react';
import General from './views/general';
import Groups from './views/groups';
import Items from './views/items';
import Colors from './views/colors';
import Submit from './Submit';
import { cn } from '../../utils/cn';

const navItems = [
  { value: 'back', label: 'Blips', icon: ArrowLeft, isBack: true },
  { value: 'general', label: 'General', icon: Settings },
  { value: 'items', label: 'Sprite', icon: ImageIcon },
  { value: 'colors', label: 'Color', icon: Palette },
  { value: 'groups', label: 'Job', icon: Briefcase },
];

const SettingsLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.substring(10); // remove "/settings/"

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <nav className="flex flex-col w-35 min-w-35 border-r border-border bg-surface-50/50 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isBack && activeTab === item.value;

          return (
            <button
              key={item.value}
              onClick={() => (item.isBack ? navigate('/') : navigate(`/settings/${item.value}`))}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all',
                item.isBack && 'mb-2 text-text-tertiary hover:text-text-primary hover:bg-glass-hover',
                !item.isBack && isActive && 'bg-px-600/10 text-px-400 font-medium',
                !item.isBack && !isActive && 'text-text-secondary hover:text-text-primary hover:bg-glass-hover'
              )}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Content area */}
      <div className="flex flex-col flex-1 p-4 justify-between overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/general" element={<General />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/items" element={<Items />} />
            <Route path="/colors" element={<Colors />} />
          </Routes>
        </div>
        <Submit />
      </div>
    </div>
  );
};

export default SettingsLayout;

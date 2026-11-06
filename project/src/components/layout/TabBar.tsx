import { Map, List, CircleAlert, User } from 'lucide-react';

interface TabBarProps {
  active: 'mapa' | 'lista' | 'pendientes' | 'perfil';
  onChange: (tab: 'mapa' | 'lista' | 'pendientes' | 'perfil') => void;
  pendingCount?: number;
}

const tabs = [
  { id: 'mapa', label: 'Mapa', icon: Map },
  { id: 'lista', label: 'Lista', icon: List },
  { id: 'pendientes', label: 'Pendientes', icon: CircleAlert },
  { id: 'perfil', label: 'Perfil', icon: User },
] as const;

export function TabBar({ active, onChange, pendingCount = 0 }: TabBarProps) {
  return (
    <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      <div className="flex items-stretch justify-around">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 w-16 py-1"
            >
              <span
                className={`relative grid place-items-center w-9 h-7 rounded-lg transition ${
                  isActive ? 'text-primary' : 'text-ink-muted'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                {t.id === 'pendientes' && pendingCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-alert text-white text-[10px] font-bold grid place-items-center">
                    {pendingCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-primary' : 'text-ink-muted'
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

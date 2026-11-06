import { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Login } from '@/screens/Login';
import { InspectorHome } from '@/screens/InspectorHome';
import { InspectionForm } from '@/screens/InspectionForm';
import { AdminPanel } from '@/screens/AdminPanel';
import { OfflineState } from '@/screens/OfflineState';
import { type Asset } from '@/data/appData';

type Screen =
  | { name: 'login' }
  | { name: 'home' }
  | { name: 'inspection'; asset: Asset }
  | { name: 'admin' };

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState<Screen>({ name: 'login' });
  const [online, setOnline] = useState(true);
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  const doLogin = () => {
    setLoggedIn(true);
    setScreen({ name: 'home' });
  };

  return (
    <div className="w-full min-h-screen bg-gray-200 flex flex-col items-center">
      {/* Device toggle (so reviewer can see both layouts) */}
      <div className="sticky top-0 z-50 w-full bg-gray-900/95 backdrop-blur text-white px-4 py-2 flex items-center justify-between text-xs">
        <span className="font-semibold tracking-wide">Inspecciones AP · Demo</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setOnline((v) => !v)}
            className={`h-7 px-2.5 rounded-full font-medium ${online ? 'bg-success/20 text-success' : 'bg-alert/20 text-alert-light'}`}
          >
            {online ? '● Online' : '○ Offline'}
          </button>
          <div className="flex bg-white/10 rounded-full p-0.5">
            <button
              onClick={() => setDevice('mobile')}
              className={`h-6 px-3 rounded-full flex items-center gap-1 text-xs font-medium ${device === 'mobile' ? 'bg-white text-gray-900' : 'text-white/70'}`}
            >
              <Smartphone size={13} /> Móvil
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`h-6 px-3 rounded-full flex items-center gap-1 text-xs font-medium ${device === 'desktop' ? 'bg-white text-gray-900' : 'text-white/70'}`}
            >
              <Monitor size={13} /> Escritorio
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full flex items-start justify-center p-4">
        {device === 'mobile' ? (
          <MobileFrame>
            {!loggedIn ? (
              <Login onLogin={doLogin} />
            ) : (
              <>
                {screen.name === 'home' && (
                  <InspectorHome
                    online={online}
                    onOpenInspection={(asset) => setScreen({ name: 'inspection', asset })}
                    onOpenAdmin={() => {
                      setDevice('desktop');
                      setScreen({ name: 'admin' });
                    }}
                  />
                )}
                {screen.name === 'inspection' && (
                  <InspectionForm
                    asset={screen.asset}
                    online={online}
                    onBack={() => setScreen({ name: 'home' })}
                    onSave={() => setScreen({ name: 'home' })}
                  />
                )}
                {!online && screen.name === 'home' && (
                  <OfflineState online={false} onRetry={() => setOnline(true)} />
                )}
              </>
            )}
          </MobileFrame>
        ) : (
          <DesktopFrame>
            <AdminPanel onBack={() => { setDevice('mobile'); setScreen({ name: 'home' }); }} />
          </DesktopFrame>
        )}
      </div>
    </div>
  );
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative bg-white shadow-2xl overflow-hidden"
      style={{ width: 390, height: 844, borderRadius: 44, border: '10px solid #0C1B2E' }}
    >
      {/* notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-32 h-6 bg-[#0C1B2E] rounded-b-2xl" />
      <div className="absolute inset-0 overflow-hidden rounded-[34px]">{children}</div>
    </div>
  );
}

function DesktopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative bg-white shadow-2xl overflow-hidden rounded-xl border border-gray-200"
      style={{ width: 1440, height: 900, maxWidth: '100%' }}
    >
      {children}
    </div>
  );
}

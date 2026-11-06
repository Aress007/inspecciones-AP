import { useState } from 'react';
import { Zap, User, Lock, LogIn, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [usuario, setUsuario] = useState('cramirez');
  const [clave, setClave] = useState('');

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-white/10 grid place-items-center mb-4 shadow-float">
              <Zap size={40} className="text-accent" fill="#4A90D9" />
            </div>
            <h1 className="text-white text-2xl font-bold leading-tight">Inspecciones AP</h1>
            <p className="text-white/70 text-sm mt-1">Interventoría de Alumbrado Público</p>
            <p className="text-accent text-xs font-semibold mt-2 tracking-wider uppercase">
              CONSORCIO INTERALUMBRADO DE CUCUTA
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-float space-y-4">
            <Input
              label="Usuario"
              leftIcon={<User size={18} />}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingrese su usuario"
            />
            <Input
              label="Contraseña"
              type="password"
              leftIcon={<Lock size={18} />}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Ingrese su contraseña"
            />
            <Button full onClick={onLogin} leftIcon={<LogIn size={18} />}>
              INGRESAR
            </Button>
            <div className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
              <WifiOff size={13} />
              <span>Funciona sin conexión</span>
            </div>
          </div>

          <p className="text-center text-white/50 text-xs mt-6">
            Versión 1.0 · Funciona sin conexión
          </p>
        </div>
      </div>
    </div>
  );
}

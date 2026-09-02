import React from 'react';
import { useGame } from '../store/GameContext';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useGame();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '4.5rem',
        right: '1rem',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '340px'
      }}
    >
      {toasts.map((toast) => {
        let icon = <Info size={18} color="#60A5FA" />;
        let borderCol = 'rgba(96, 165, 250, 0.4)';
        let bgCol = 'rgba(15, 23, 42, 0.95)';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} color="#34D399" />;
          borderCol = 'rgba(52, 211, 153, 0.5)';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={18} color="#FBBF24" />;
          borderCol = 'rgba(251, 191, 36, 0.5)';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={18} color="#F87171" />;
          borderCol = 'rgba(248, 113, 113, 0.5)';
        }

        return (
          <div
            key={toast.id}
            className="animate-slide-down"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: bgCol,
              border: `1px solid ${borderCol}`,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#F8FAFC'
            }}
          >
            {icon}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface PlatformSwitcherProps {
  selected: 'all' | 'meta' | 'google';
  onChange: (platform: 'all' | 'meta' | 'google') => void;
}

export default function PlatformSwitcher({ selected, onChange }: PlatformSwitcherProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-dashboard-bg border border-dashboard-border rounded-xl">
      <PlatformButton
        label="All"
        isSelected={selected === 'all'}
        onClick={() => onChange('all')}
      />
      <PlatformButton
        label="Meta"
        icon={<MetaIcon />}
        isSelected={selected === 'meta'}
        onClick={() => onChange('meta')}
        accentColor="from-blue-500 to-blue-600"
      />
      <PlatformButton
        label="Google"
        icon={<GoogleIcon />}
        isSelected={selected === 'google'}
        onClick={() => onChange('google')}
        accentColor="from-red-500 to-yellow-500"
        disabled
        comingSoon
      />
    </div>
  );
}

interface PlatformButtonProps {
  label: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  accentColor?: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

function PlatformButton({
  label,
  icon,
  isSelected,
  onClick,
  accentColor,
  disabled,
  comingSoon,
}: PlatformButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isSelected
          ? 'bg-dashboard-card text-white shadow-sm'
          : 'text-gray-400 hover:text-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon}
      <span>{label}</span>
      {isSelected && !disabled && (
        <Check size={14} className="text-dashboard-accent" />
      )}
      {comingSoon && (
        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-dashboard-warning text-dashboard-bg text-[9px] font-bold rounded-full">
          SOON
        </span>
      )}
    </button>
  );
}

// Meta (Facebook) Icon
function MetaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
        fill="#0866FF"
      />
    </svg>
  );
}

// Google Icon
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// Connected Accounts Display
interface ConnectedAccountsProps {
  metaConnected: boolean;
  googleConnected: boolean;
  metaAccountName?: string;
  googleAccountName?: string;
}

export function ConnectedAccounts({
  metaConnected,
  googleConnected,
  metaAccountName,
  googleAccountName,
}: ConnectedAccountsProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          metaConnected
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-dashboard-bg border-dashboard-border opacity-50'
        }`}
      >
        <MetaIcon />
        <span className="text-xs font-medium text-gray-300">
          {metaConnected ? metaAccountName || 'Connected' : 'Not Connected'}
        </span>
        {metaConnected && (
          <div className="w-2 h-2 rounded-full bg-dashboard-success animate-pulse" />
        )}
      </div>

      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
          googleConnected
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-dashboard-bg border-dashboard-border opacity-50'
        }`}
      >
        <GoogleIcon />
        <span className="text-xs font-medium text-gray-300">
          {googleConnected ? googleAccountName || 'Connected' : 'Coming Soon'}
        </span>
      </div>
    </div>
  );
}

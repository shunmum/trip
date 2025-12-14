import { cn } from '../lib/utils';
import type { User } from '../types/index.ts';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xs';
}

const COLORS = [
  'bg-red-100 text-red-700 border-red-200',
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-lime-100 text-lime-700 border-lime-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-sky-100 text-sky-700 border-sky-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-violet-100 text-violet-700 border-violet-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-rose-100 text-rose-700 border-rose-200',
];

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  // Simple check for legacy hardcoded users to maintain some consistency if needed, 
  // but mostly relying on dynamic hashing now.

  // Deterministic color selection
  const getColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
  };

  const className = cn(
    "rounded-full flex items-center justify-center font-bold border shadow-sm",
    getColor(user),
    {
      'w-5 h-5 text-[10px]': size === 'xs',
      'w-6 h-6 text-xs': size === 'sm',
      'w-8 h-8 text-sm': size === 'md',
      'w-10 h-10 text-base': size === 'lg',
    }
  );

  return (
    <div className={className} title={user}>
      {user.charAt(0).toUpperCase()}
    </div>
  );
}

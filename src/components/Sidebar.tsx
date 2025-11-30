'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Megaphone,
  Lightbulb,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  Target,
  Users,
  PlusCircle,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: <Megaphone size={20} />,
  },
  {
    label: 'Recommendations',
    href: '/dashboard/recommendations',
    icon: <Lightbulb size={20} />,
    badge: 3,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: <BarChart3 size={20} />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: 'Audiences',
    href: '/dashboard/audiences',
    icon: <Users size={20} />,
  },
  {
    label: 'Creatives',
    href: '/dashboard/creatives',
    icon: <Target size={20} />,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-dashboard-card border-r border-dashboard-border transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-dashboard-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dashboard-accent to-emerald-600 flex items-center justify-center">
            <Zap size={22} className="text-dashboard-bg" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold gradient-text">YOAİ</span>
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive(item.href)
                  ? 'bg-dashboard-accent/10 text-dashboard-accent'
                  : 'text-gray-400 hover:bg-dashboard-hover hover:text-white'
              }`}
            >
              {isActive(item.href) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dashboard-accent rounded-r-full" />
              )}
              <span className={isActive(item.href) ? 'text-dashboard-accent' : ''}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-dashboard-danger/20 text-dashboard-danger text-xs font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-dashboard-danger text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-dashboard-border" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Assets
            </p>
          )}
          {secondaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-dashboard-accent/10 text-dashboard-accent'
                  : 'text-gray-400 hover:bg-dashboard-hover hover:text-white'
              }`}
            >
              {item.icon}
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Create Campaign Button */}
        <div className="mt-6 px-1">
          <Link
            href="/dashboard/campaigns/create"
            className={`flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-dashboard-accent to-emerald-600 text-dashboard-bg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-dashboard-accent/30 ${
              collapsed ? 'px-3' : 'px-4'
            }`}
          >
            <PlusCircle size={20} />
            {!collapsed && <span>New Campaign</span>}
          </Link>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-dashboard-border p-3">
        {/* Settings */}
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-dashboard-hover hover:text-white transition-all duration-200 ${
            isActive('/dashboard/settings') ? 'bg-dashboard-hover text-white' : ''
          }`}
        >
          <Settings size={20} />
          {!collapsed && <span className="font-medium">Settings</span>}
        </Link>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-dashboard-hover hover:text-white transition-all duration-200 mt-1"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="font-medium">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ClipboardList,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      href: '/crm/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      show: true
    },
    {
      href: '/crm/leads',
      label: 'Leads',
      icon: ClipboardList,
      show: true
    },
    {
      href: '/crm/users',
      label: 'Users',
      icon: Users,
      show: session?.user.role === 'admin'
    },
    {
      href: '/crm/settings',
      label: 'Settings',
      icon: Settings,
      show: true
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col shadow-lg`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-700">
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                AdmCRM
              </h1>
              <p className="text-xs text-gray-400">Admissions System</p>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            if (!item.show) return null;
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                title={!isOpen ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {active && <ChevronRight className="w-4 h-4" />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-700 px-3 py-4 space-y-2">
          {isOpen && (
            <div className="px-4 py-3 bg-gray-700 rounded-lg mb-2">
              <p className="text-xs text-gray-400 mb-1">Logged in as</p>
              <p className="text-sm font-semibold truncate">{session?.user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{session?.user.role}</p>
            </div>
          )}
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-sm font-medium"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-gray-900">
              {navItems.find(item => isActive(item.href))?.label || 'Dashboard'}
            </h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

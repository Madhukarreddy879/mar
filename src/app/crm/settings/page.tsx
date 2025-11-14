'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bell, Lock, Globe, Database, HelpCircle } from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'text' | 'select';
  value?: any;
  options?: { label: string; value: string }[];
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
  }, [status, router]);

  const handleSettingChange = (sectionId: string, itemId: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [`${sectionId}_${itemId}`]: value
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, you'd save these to the database
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      items: [
        {
          id: 'email_new_leads',
          label: 'Email notifications for new leads',
          description: 'Receive email when new leads are submitted',
          type: 'toggle',
          value: true
        },
        {
          id: 'email_lead_updates',
          label: 'Email notifications for lead updates',
          description: 'Receive email when a lead status changes',
          type: 'toggle',
          value: true
        },
        {
          id: 'daily_summary',
          label: 'Daily summary email',
          description: 'Receive a daily summary of leads and activities',
          type: 'toggle',
          value: false
        }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Manage your account security settings',
      icon: Lock,
      items: [
        {
          id: 'two_factor',
          label: 'Two-factor authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle',
          value: false
        },
        {
          id: 'login_alerts',
          label: 'Login alerts',
          description: 'Get notified of new login attempts',
          type: 'toggle',
          value: true
        },
        {
          id: 'session_timeout',
          label: 'Session timeout (minutes)',
          description: 'Automatically sign out after inactive time',
          type: 'text',
          value: '30'
        }
      ]
    },
    {
      id: 'system',
      title: 'System',
      description: 'General system settings and preferences',
      icon: Globe,
      items: [
        {
          id: 'timezone',
          label: 'Timezone',
          description: 'Set your preferred timezone',
          type: 'select',
          value: 'UTC',
          options: [
            { label: 'UTC', value: 'UTC' },
            { label: 'EST', value: 'EST' },
            { label: 'CST', value: 'CST' },
            { label: 'MST', value: 'MST' },
            { label: 'PST', value: 'PST' }
          ]
        },
        {
          id: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: 'en',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' }
          ]
        },
        {
          id: 'theme',
          label: 'Theme',
          description: 'Choose light or dark theme',
          type: 'select',
          value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Auto', value: 'auto' }
          ]
        }
      ]
    }
  ];

  const SettingToggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Settings saved successfully
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Section Items */}
              <div className="divide-y divide-gray-100">
                {section.items.map((item, index) => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-900">
                        {item.label}
                      </label>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      {item.type === 'toggle' && (
                        <SettingToggle
                          value={settings[`${section.id}_${item.id}`] ?? item.value}
                          onChange={(value) => handleSettingChange(section.id, item.id, value)}
                        />
                      )}
                      {item.type === 'text' && (
                        <input
                          type="text"
                          value={settings[`${section.id}_${item.id}`] ?? item.value}
                          onChange={(e) => handleSettingChange(section.id, item.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      )}
                      {item.type === 'select' && (
                        <select
                          value={settings[`${section.id}_${item.id}`] ?? item.value}
                          onChange={(e) => handleSettingChange(section.id, item.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          {item.options?.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Save Settings
        </button>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Need help?</p>
          <p>Contact the support team for assistance with your account or settings configuration.</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { CheckCircle, Loader } from 'lucide-react';

interface Settings {
  notifications: {
    email: boolean;
    sms: boolean;
    browser: boolean;
    appointments: boolean;
    marketing: boolean;
    updates: boolean;
  };
  privacy: {
    shareProfile: boolean;
    showDonationHistory: boolean;
    anonymizeData: boolean;
    allowResearch: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginNotifications: boolean;
    allowMultipleDevices: boolean;
    sessionTimeout: '30m' | '1h' | '4h' | '1d' | 'never';
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'es' | 'fr' | 'zh';
    dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    timeZone: string;
  };
}

export default function SettingsPage() {
  const { address } = useAccount();
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      sms: false,
      browser: true,
      appointments: true,
      marketing: false,
      updates: true,
    },
    privacy: {
      shareProfile: true,
      showDonationHistory: false,
      anonymizeData: true,
      allowResearch: false,
    },
    security: {
      twoFactorEnabled: false,
      loginNotifications: true,
      allowMultipleDevices: true,
      sessionTimeout: '4h',
    },
    preferences: {
      theme: 'system',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeZone: 'America/New_York',
    },
  });
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'security' | 'preferences'>('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the user's settings from your backend
    // For this demo, we'll just use the default settings defined above
  }, []);

  const handleNotificationChange = (field: keyof Settings['notifications']) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: !settings.notifications[field],
      },
    });
  };

  const handlePrivacyChange = (field: keyof Settings['privacy']) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [field]: !settings.privacy[field],
      },
    });
  };

  const handleSecurityChange = (field: keyof Settings['security'], value: boolean | string) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [field]: value,
      },
    });
  };

  const handlePreferenceChange = (field: keyof Settings['preferences'], value: string) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [field]: value,
      } as Settings['preferences'], // Type assertion to satisfy TypeScript
    });
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    // In a real app, you would save the settings to your backend
    // For now, we'll simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setShowSavedMessage(true);
    
    // Hide the saved message after 3 seconds
    setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'zh', name: '中文' },
  ];

  const timeZones = [
    { code: 'America/New_York', name: 'Eastern Time (US & Canada)' },
    { code: 'America/Chicago', name: 'Central Time (US & Canada)' },
    { code: 'America/Denver', name: 'Mountain Time (US & Canada)' },
    { code: 'America/Los_Angeles', name: 'Pacific Time (US & Canada)' },
    { code: 'Europe/London', name: 'London' },
    { code: 'Europe/Paris', name: 'Paris' },
    { code: 'Asia/Tokyo', name: 'Tokyo' },
    { code: 'Australia/Sydney', name: 'Sydney' },
  ];

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
          >
            {isSaving ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Saving...
              </>
            ) : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Saved message notification */}
      {showSavedMessage && (
        <div className="mt-4 bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Settings saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`${
                activeTab === 'privacy'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`${
                activeTab === 'preferences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Preferences
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'notifications' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Choose how you want to receive notifications.</p>
              </div>

              <div className="space-y-6">
                {/* Notification methods */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notification Methods</h4>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        name="email-notifications"
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={() => handleNotificationChange('email')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="email-notifications" className="ml-3 text-sm text-gray-700">
                        Email notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sms-notifications"
                        name="sms-notifications"
                        type="checkbox"
                        checked={settings.notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sms-notifications" className="ml-3 text-sm text-gray-700">
                        SMS notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="browser-notifications"
                        name="browser-notifications"
                        type="checkbox"
                        checked={settings.notifications.browser}
                        onChange={() => handleNotificationChange('browser')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="browser-notifications" className="ml-3 text-sm text-gray-700">
                        Browser notifications
                      </label>
                    </div>
                  </div>
                </div>

                {/* Notification types */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notification Types</h4>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="appointment-notifications"
                        name="appointment-notifications"
                        type="checkbox"
                        checked={settings.notifications.appointments}
                        onChange={() => handleNotificationChange('appointments')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="appointment-notifications" className="ml-3 text-sm text-gray-700">
                        Appointment reminders and updates
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="marketing-notifications"
                        name="marketing-notifications"
                        type="checkbox"
                        checked={settings.notifications.marketing}
                        onChange={() => handleNotificationChange('marketing')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="marketing-notifications" className="ml-3 text-sm text-gray-700">
                        Marketing and promotional messages
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="update-notifications"
                        name="update-notifications"
                        type="checkbox"
                        checked={settings.notifications.updates}
                        onChange={() => handleNotificationChange('updates')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="update-notifications" className="ml-3 text-sm text-gray-700">
                        Platform updates and new features
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Manage how your information is displayed and used.</p>
              </div>

              <div className="space-y-6">
                {/* Profile visibility */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Profile Visibility</h4>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="share-profile"
                          name="share-profile"
                          type="checkbox"
                          checked={settings.privacy.shareProfile}
                          onChange={() => handlePrivacyChange('shareProfile')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="share-profile" className="font-medium text-gray-700">
                          Share profile with partner hospitals
                        </label>
                        <p className="text-gray-500">
                          Allow partner hospitals to view your profile information to provide personalized care.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="show-donation-history"
                          name="show-donation-history"
                          type="checkbox"
                          checked={settings.privacy.showDonationHistory}
                          onChange={() => handlePrivacyChange('showDonationHistory')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="show-donation-history" className="font-medium text-gray-700">
                          Display donation history on profile
                        </label>
                        <p className="text-gray-500">
                          Your donation history will be visible to other users and can be verified on the blockchain.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data usage */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Data Usage</h4>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="anonymize-data"
                          name="anonymize-data"
                          type="checkbox"
                          checked={settings.privacy.anonymizeData}
                          onChange={() => handlePrivacyChange('anonymizeData')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="anonymize-data" className="font-medium text-gray-700">
                          Anonymize my data in the blockchain
                        </label>
                        <p className="text-gray-500">
                          Your personal details will be hashed and anonymized when stored on the blockchain.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="allow-research"
                          name="allow-research"
                          type="checkbox"
                          checked={settings.privacy.allowResearch}
                          onChange={() => handlePrivacyChange('allowResearch')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="allow-research" className="font-medium text-gray-700">
                          Share anonymized data for research
                        </label>
                        <p className="text-gray-500">
                          Allow your anonymized data to be used for fertility research and technological advancement.
                        </p>
                        {settings.privacy.allowResearch && (
                          <div className="mt-2 text-xs text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Earn 50 DATA tokens per month for participating
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your account security preferences.</p>
              </div>

              {/* Wallet connection */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">Connected Wallet</h4>
                <div className="mt-2 flex items-center">
                  <div className="flex-shrink-0">
                    <Image src="/images/ethereum.svg" alt="Ethereum" width={24} height={24} className="h-6 w-6" />
                  </div>
                  <div className="ml-3 text-sm text-gray-700">
                    {address ? (
                      <span className="font-mono">{address.substring(0, 8)}...{address.substring(address.length - 6)}</span>
                    ) : (
                      "No wallet connected"
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <button className="text-xs text-blue-600 hover:text-blue-500">
                    Change Wallet Connection
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Two-factor authentication */}
                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="two-factor-auth"
                        name="two-factor-auth"
                        type="checkbox"
                        checked={settings.security.twoFactorEnabled}
                        onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="two-factor-auth" className="font-medium text-gray-700">
                        Enable two-factor authentication
                      </label>
                      <p className="text-gray-500">
                        Add an extra layer of security to your account by requiring a verification code.
                      </p>
                      {settings.security.twoFactorEnabled && (
                        <button className="mt-2 text-xs text-blue-600 hover:text-blue-500">
                          Configure two-factor authentication
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Login notifications */}
                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="login-notifications"
                        name="login-notifications"
                        type="checkbox"
                        checked={settings.security.loginNotifications}
                        onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="login-notifications" className="font-medium text-gray-700">
                        Receive login notifications
                      </label>
                      <p className="text-gray-500">
                        Get notified when someone logs into your account from a new device or location.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Multiple devices */}
                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="multiple-devices"
                        name="multiple-devices"
                        type="checkbox"
                        checked={settings.security.allowMultipleDevices}
                        onChange={(e) => handleSecurityChange('allowMultipleDevices', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="multiple-devices" className="font-medium text-gray-700">
                        Allow multiple device logins
                      </label>
                      <p className="text-gray-500">
                        Stay logged in on multiple devices at the same time.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Session timeout */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Session Timeout</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose how long your session will remain active after inactivity.
                  </p>
                  <div className="mt-2">
                    <select
                      id="session-timeout"
                      name="session-timeout"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="30m">30 minutes</option>
                      <option value="1h">1 hour</option>
                      <option value="4h">4 hours</option>
                      <option value="1d">1 day</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                <p className="mt-1 text-sm text-gray-500">Customize your experience.</p>
              </div>

              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Theme</h4>
                  <div className="mt-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          id="theme-light"
                          name="theme"
                          type="radio"
                          checked={settings.preferences.theme === 'light'}
                          onChange={() => handlePreferenceChange('theme', 'light')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="theme-light" className="ml-2 block text-sm text-gray-700">
                          Light
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="theme-dark"
                          name="theme"
                          type="radio"
                          checked={settings.preferences.theme === 'dark'}
                          onChange={() => handlePreferenceChange('theme', 'dark')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="theme-dark" className="ml-2 block text-sm text-gray-700">
                          Dark
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="theme-system"
                          name="theme"
                          type="radio"
                          checked={settings.preferences.theme === 'system'}
                          onChange={() => handlePreferenceChange('theme', 'system')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="theme-system" className="ml-2 block text-sm text-gray-700">
                          System default
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Language</h4>
                  <div className="mt-2">
                    <select
                      id="language"
                      name="language"
                      value={settings.preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {languages.map((language) => (
                        <option key={language.code} value={language.code}>
                          {language.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date format */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Date Format</h4>
                  <div className="mt-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          id="date-mm-dd-yyyy"
                          name="dateFormat"
                          type="radio"
                          checked={settings.preferences.dateFormat === 'MM/DD/YYYY'}
                          onChange={() => handlePreferenceChange('dateFormat', 'MM/DD/YYYY')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="date-mm-dd-yyyy" className="ml-2 block text-sm text-gray-700">
                          MM/DD/YYYY
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="date-dd-mm-yyyy"
                          name="dateFormat"
                          type="radio"
                          checked={settings.preferences.dateFormat === 'DD/MM/YYYY'}
                          onChange={() => handlePreferenceChange('dateFormat', 'DD/MM/YYYY')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="date-dd-mm-yyyy" className="ml-2 block text-sm text-gray-700">
                          DD/MM/YYYY
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="date-yyyy-mm-dd"
                          name="dateFormat"
                          type="radio"
                          checked={settings.preferences.dateFormat === 'YYYY-MM-DD'}
                          onChange={() => handlePreferenceChange('dateFormat', 'YYYY-MM-DD')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="date-yyyy-mm-dd" className="ml-2 block text-sm text-gray-700">
                          YYYY-MM-DD
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Time Zone</h4>
                  <div className="mt-2">
                    <select
                      id="timeZone"
                      name="timeZone"
                      value={settings.preferences.timeZone}
                      onChange={(e) => handlePreferenceChange('timeZone', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      {timeZones.map((tz) => (
                        <option key={tz.code} value={tz.code}>
                          {tz.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save button at bottom for better UX */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
        >
          {isSaving ? (
            <>
              <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Saving...
            </>
          ) : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

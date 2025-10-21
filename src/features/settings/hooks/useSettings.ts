import { useState } from 'react';

export function useSettings<T>(initialSettings: T) {
  const [settings, setSettings] = useState<T>(initialSettings);

  const updateSetting = <K extends keyof T>(key: K, value: T[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(initialSettings);
  };

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}

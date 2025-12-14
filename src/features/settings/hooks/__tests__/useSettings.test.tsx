import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSettings } from '../useSettings';

describe('useSettings', () => {
  it('should initialize with default settings', () => {
    const initialSettings = { theme: 'dark', notifications: true };
    const { result } = renderHook(() => useSettings(initialSettings));

    expect(result.current.settings).toEqual(initialSettings);
  });

  it('should update a setting', () => {
    const initialSettings = { theme: 'dark', notifications: true };
    const { result } = renderHook(() => useSettings(initialSettings));

    act(() => {
      result.current.updateSetting('theme', 'light');
    });

    expect(result.current.settings.theme).toBe('light');
  });

  it('should reset settings to initial values', () => {
    const initialSettings = { theme: 'dark', notifications: true };
    const { result } = renderHook(() => useSettings(initialSettings));

    act(() => {
      result.current.updateSetting('theme', 'light');
      result.current.resetSettings();
    });

    expect(result.current.settings).toEqual(initialSettings);
  });
});

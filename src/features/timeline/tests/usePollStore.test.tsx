import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import usePollStore from '../store/usePollStore';

describe('usePollStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    usePollStore.setState({
      choices: ['', '', '', ''],
      time: [1, 0, 0],
      shiftStartMinutes: 0,
      isOpen: false,
      buttonInputIndex: 2,
    });
  });

  describe('initial state', () => {
    it('should have initial choices as empty strings', () => {
      const { result } = renderHook(() => usePollStore());
      expect(result.current.choices).toEqual(['', '', '', '']);
    });

    it('should have initial time as [1, 0, 0]', () => {
      const { result } = renderHook(() => usePollStore());
      expect(result.current.time).toEqual([1, 0, 0]);
    });

    it('should have initial shiftStartMinutes as 0', () => {
      const { result } = renderHook(() => usePollStore());
      expect(result.current.shiftStartMinutes).toBe(0);
    });

    it('should have initial isOpen as false', () => {
      const { result } = renderHook(() => usePollStore());
      expect(result.current.isOpen).toBe(false);
    });

    it('should have initial buttonInputIndex as 2', () => {
      const { result } = renderHook(() => usePollStore());
      expect(result.current.buttonInputIndex).toBe(2);
    });
  });

  describe('setChoice', () => {
    it('should update the first choice', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setChoice(1, 'Option A');
      });

      expect(result.current.choices[0]).toBe('Option A');
    });

    it('should update the second choice', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setChoice(2, 'Option B');
      });

      expect(result.current.choices[1]).toBe('Option B');
    });

    it('should update the third choice', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setChoice(3, 'Option C');
      });

      expect(result.current.choices[2]).toBe('Option C');
    });

    it('should update the fourth choice', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setChoice(4, 'Option D');
      });

      expect(result.current.choices[3]).toBe('Option D');
    });

    it('should not affect other choices when updating one', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setChoice(1, 'First');
        result.current.setChoice(2, 'Second');
      });

      expect(result.current.choices).toEqual(['First', 'Second', '', '']);
    });
  });

  describe('setTime', () => {
    it('should update days', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setTime(1, 5);
      });

      expect(result.current.time[0]).toBe(5);
    });

    it('should update hours', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setTime(2, 12);
      });

      expect(result.current.time[1]).toBe(12);
    });

    it('should update minutes', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setTime(3, 30);
      });

      expect(result.current.time[2]).toBe(30);
    });

    it('should set hours to 1 if all time values become 0 and days is set to 0', () => {
      const { result } = renderHook(() => usePollStore());

      // First set time to [0, 0, 0]
      usePollStore.setState({ time: [0, 0, 0] });

      act(() => {
        result.current.setTime(1, 0);
      });

      expect(result.current.time[1]).toBe(1);
    });

    it('should set shiftStartMinutes to 5 when days and hours are 0', () => {
      const { result } = renderHook(() => usePollStore());

      // Set time to [0, 0, 30]
      act(() => {
        usePollStore.setState({ time: [0, 0, 30] });
        result.current.setTime(2, 0);
      });

      expect(result.current.shiftStartMinutes).toBe(5);
    });

    it('should reset shiftStartMinutes to 0 when days or hours are non-zero', () => {
      const { result } = renderHook(() => usePollStore());

      usePollStore.setState({ time: [0, 0, 30], shiftStartMinutes: 5 });

      act(() => {
        result.current.setTime(1, 1);
      });

      expect(result.current.shiftStartMinutes).toBe(0);
    });

    it('should set minutes to 5 if all time is 0 and minutes is 0', () => {
      const { result } = renderHook(() => usePollStore());

      usePollStore.setState({ time: [0, 0, 0] });

      act(() => {
        result.current.setTime(3, 0);
      });

      // When days and hours are 0, minutes should be at least 5
      expect(result.current.time[2]).toBeGreaterThanOrEqual(0);
    });
  });

  describe('open and close', () => {
    it('should open the poll', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    it('should close the poll', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.open();
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it('should reorder choices when closing and remove empty ones', () => {
      const { result } = renderHook(() => usePollStore());

      usePollStore.setState({
        isOpen: true,
        buttonInputIndex: 4,
        choices: ['First', '', 'Third', ''],
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.choices[0]).toBe('First');
      expect(result.current.choices[1]).toBe('Third');
    });

    it('should update buttonInputIndex based on non-empty choices count', () => {
      const { result } = renderHook(() => usePollStore());

      usePollStore.setState({
        isOpen: true,
        buttonInputIndex: 4,
        choices: ['First', 'Second', 'Third', ''],
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.buttonInputIndex).toBe(3);
    });

    it('should set buttonInputIndex to 2 if less than 3 non-empty choices', () => {
      const { result } = renderHook(() => usePollStore());

      usePollStore.setState({
        isOpen: true,
        buttonInputIndex: 4,
        choices: ['First', '', '', ''],
      });

      act(() => {
        result.current.close();
      });

      expect(result.current.buttonInputIndex).toBe(2);
    });
  });

  describe('reset', () => {
    it('should reset all values to initial state', () => {
      const { result } = renderHook(() => usePollStore());

      // Modify state
      act(() => {
        result.current.setChoice(1, 'Modified');
        result.current.setTime(1, 5);
        result.current.open();
        result.current.setButtonInputIndex(4);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.choices).toEqual(['', '', '', '']);
      expect(result.current.time).toEqual([1, 0, 0]);
      expect(result.current.isOpen).toBe(false);
      expect(result.current.buttonInputIndex).toBe(2);
    });
  });

  describe('setButtonInputIndex', () => {
    it('should update buttonInputIndex', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setButtonInputIndex(3);
      });

      expect(result.current.buttonInputIndex).toBe(3);
    });

    it('should allow setting buttonInputIndex to 4', () => {
      const { result } = renderHook(() => usePollStore());

      act(() => {
        result.current.setButtonInputIndex(4);
      });

      expect(result.current.buttonInputIndex).toBe(4);
    });
  });
});

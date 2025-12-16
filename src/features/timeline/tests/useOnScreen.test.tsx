import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import useOnScreen from '../hooks/useOnScreen';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

describe('useOnScreen Hook', () => {
  let intersectionCallback: (entries: IntersectionObserverEntry[]) => void;

  beforeEach(() => {
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
    mockIntersectionObserver.mockClear();

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    });

    vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return a ref and initial visibility as false', () => {
    const { result } = renderHook(() => useOnScreen());

    const [ref, isVisible] = result.current;
    expect(ref).toBeDefined();
    expect(isVisible).toBe(false);
  });

  it('should create IntersectionObserver with default options', () => {
    const { result } = renderHook(() => useOnScreen());

    // Simulate ref being attached to an element
    const mockElement = document.createElement('div');
    Object.defineProperty(result.current[0], 'current', {
      value: mockElement,
      writable: true,
    });

    // Re-render to trigger effect with element
    const { rerender } = renderHook(() => useOnScreen());
    rerender();

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('should create IntersectionObserver with custom options', () => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '10px',
      threshold: 0.5,
    };

    renderHook(() => useOnScreen(options));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options
    );
  });

  it('should observe element when ref is attached', () => {
    const { result } = renderHook(() => useOnScreen());

    // Get the ref
    const [ref] = result.current;

    // Create a mock element and attach to ref
    const mockElement = document.createElement('div');

    // Use act to update the ref
    act(() => {
      (ref as any).current = mockElement;
    });

    // Rerender to trigger the effect
    const { rerender } = renderHook(() => useOnScreen());
    rerender();

    // Should have attempted to observe
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('should update visibility when element intersects', () => {
    const { result } = renderHook(() => useOnScreen());

    // Initially not visible
    expect(result.current[1]).toBe(false);

    // Simulate intersection
    act(() => {
      intersectionCallback([
        {
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: document.createElement('div'),
          time: 0,
        },
      ]);
    });

    expect(result.current[1]).toBe(true);
  });

  it('should update visibility to false when element leaves viewport', () => {
    const { result } = renderHook(() => useOnScreen());

    // Simulate entering viewport
    act(() => {
      intersectionCallback([
        {
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: document.createElement('div'),
          time: 0,
        },
      ]);
    });

    expect(result.current[1]).toBe(true);

    // Simulate leaving viewport
    act(() => {
      intersectionCallback([
        {
          isIntersecting: false,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 0,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: document.createElement('div'),
          time: 0,
        },
      ]);
    });

    expect(result.current[1]).toBe(false);
  });

  it('should pass custom threshold to IntersectionObserver', () => {
    renderHook(() => useOnScreen({ threshold: 0.75 }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.75 }
    );
  });

  it('should pass custom rootMargin to IntersectionObserver', () => {
    renderHook(() => useOnScreen({ rootMargin: '20px' }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '20px' }
    );
  });

  it('should handle multiple threshold values', () => {
    renderHook(() => useOnScreen({ threshold: [0, 0.25, 0.5, 0.75, 1] }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
  });

  it('should handle undefined options', () => {
    renderHook(() => useOnScreen(undefined));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      undefined
    );
  });

  it('should handle empty options object', () => {
    renderHook(() => useOnScreen({}));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {}
    );
  });

  it('should toggle visibility correctly', () => {
    const { result } = renderHook(() => useOnScreen());

    // Start not visible
    expect(result.current[1]).toBe(false);

    // Enter viewport
    act(() => {
      intersectionCallback([
        {
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: document.createElement('div'),
          time: 0,
        },
      ]);
    });
    expect(result.current[1]).toBe(true);

    // Leave viewport
    act(() => {
      intersectionCallback([
        {
          isIntersecting: false,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 0,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: document.createElement('div'),
          time: 0,
        },
      ]);
    });
    expect(result.current[1]).toBe(false);

    // Enter again
    act(() => {
      intersectionCallback([
        {
          isIntersecting: true,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 0.5,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          target: document.createElement('div'),
          time: 0,
        },
      ]);
    });
    expect(result.current[1]).toBe(true);
  });

  it('should return consistent ref across renders', () => {
    const { result, rerender } = renderHook(() => useOnScreen());

    const firstRef = result.current[0];

    rerender();

    const secondRef = result.current[0];

    // The ref object itself should be the same
    expect(firstRef).toBe(secondRef);
  });

  it('should handle root option', () => {
    const rootElement = document.createElement('div');

    renderHook(() =>
      useOnScreen({
        root: rootElement,
        rootMargin: '0px',
        threshold: 0,
      })
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: rootElement,
        rootMargin: '0px',
        threshold: 0,
      }
    );
  });

  it('should handle negative rootMargin', () => {
    renderHook(() => useOnScreen({ rootMargin: '-10px' }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '-10px' }
    );
  });

  it('should handle complex rootMargin', () => {
    renderHook(() => useOnScreen({ rootMargin: '10px 20px 30px 40px' }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { rootMargin: '10px 20px 30px 40px' }
    );
  });
});

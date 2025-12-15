import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  generateFaviconWithBadge,
  updateFavicon,
  resetFavicon,
  setNotificationFavicon,
} from '../favicon';

describe('favicon utilities', () => {
  let originalHead: HTMLHeadElement;

  beforeEach(() => {
    // Setup DOM
    document.head.innerHTML = '';
    originalHead = document.head;
  });

  afterEach(() => {
    document.head.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('generateFaviconWithBadge', () => {
    it('should generate base64 SVG without notification badge', () => {
      const dataUri = generateFaviconWithBadge(false);

      expect(dataUri).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(dataUri).toContain('base64');
    });

    it('should generate base64 SVG with notification badge', () => {
      const dataUri = generateFaviconWithBadge(true);

      expect(dataUri).toMatch(/^data:image\/svg\+xml;base64,/);
      expect(dataUri).toContain('base64');

      // Decode base64 to check for notification circle
      const base64Content = dataUri.split(',')[1];
      const svgContent = atob(base64Content);
      expect(svgContent).toContain('circle');
      expect(svgContent).toContain('#FF0000');
    });

    it('should generate different data URIs with and without badge', () => {
      const withoutBadge = generateFaviconWithBadge(false);
      const withBadge = generateFaviconWithBadge(true);

      expect(withoutBadge).not.toBe(withBadge);
    });

    it('should default to no badge when no parameter provided', () => {
      const defaultFavicon = generateFaviconWithBadge();
      const noBadgeFavicon = generateFaviconWithBadge(false);

      expect(defaultFavicon).toBe(noBadgeFavicon);
    });

    it('should generate valid SVG structure', () => {
      const dataUri = generateFaviconWithBadge(false);
      const base64Content = dataUri.split(',')[1];
      const svgContent = atob(base64Content);

      expect(svgContent).toContain('<svg');
      expect(svgContent).toContain('viewBox="0 0 512 512"');
      expect(svgContent).toContain('</svg>');
      expect(svgContent).toContain('<path');
    });

    it('should include red notification circle when hasNotifications is true', () => {
      const dataUri = generateFaviconWithBadge(true);
      const base64Content = dataUri.split(',')[1];
      const svgContent = atob(base64Content);

      expect(svgContent).toContain('<circle');
      expect(svgContent).toContain('cx="420"');
      expect(svgContent).toContain('cy="92"');
      expect(svgContent).toContain('r="60"');
      expect(svgContent).toContain('fill="#FF0000"');
    });

    it('should not include circle when hasNotifications is false', () => {
      const dataUri = generateFaviconWithBadge(false);
      const base64Content = dataUri.split(',')[1];
      const svgContent = atob(base64Content);

      expect(svgContent).not.toContain('<circle');
      expect(svgContent).not.toContain('#FF0000');
    });

    it('should have correct SVG namespace', () => {
      const dataUri = generateFaviconWithBadge(false);
      const base64Content = dataUri.split(',')[1];
      const svgContent = atob(base64Content);

      expect(svgContent).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should have white fill color for main icon', () => {
      const dataUri = generateFaviconWithBadge(false);
      const base64Content = dataUri.split(',')[1];
      const svgContent = atob(base64Content);

      expect(svgContent).toContain('fill="white"');
    });
  });

  describe('updateFavicon', () => {
    it('should create and append favicon link to document head', () => {
      const dataUri = 'data:image/svg+xml;base64,test';
      updateFavicon(dataUri);

      const links = document.querySelectorAll("link[rel*='icon']");
      expect(links).toHaveLength(1);

      const link = links[0] as HTMLLinkElement;
      expect(link.rel).toBe('icon');
      expect(link.type).toBe('image/svg+xml');
      expect(link.href).toBe(dataUri);
    });

    it('should remove existing favicon links before adding new one', () => {
      // Add initial favicon
      const oldLink1 = document.createElement('link');
      oldLink1.rel = 'icon';
      oldLink1.href = 'old-favicon1.ico';
      document.head.appendChild(oldLink1);

      const oldLink2 = document.createElement('link');
      oldLink2.rel = 'shortcut icon';
      oldLink2.href = 'old-favicon2.ico';
      document.head.appendChild(oldLink2);

      expect(document.querySelectorAll("link[rel*='icon']")).toHaveLength(2);

      // Update favicon
      const newDataUri = 'data:image/svg+xml;base64,new';
      updateFavicon(newDataUri);

      const links = document.querySelectorAll("link[rel*='icon']");
      expect(links).toHaveLength(1);
      expect((links[0] as HTMLLinkElement).href).toBe(newDataUri);
    });

    it('should work when no existing favicon links exist', () => {
      expect(document.querySelectorAll("link[rel*='icon']")).toHaveLength(0);

      const dataUri = 'data:image/svg+xml;base64,test';
      updateFavicon(dataUri);

      expect(document.querySelectorAll("link[rel*='icon']")).toHaveLength(1);
    });

    it('should append link to document.head', () => {
      const dataUri = 'data:image/svg+xml;base64,test';
      const headChildCountBefore = document.head.children.length;

      updateFavicon(dataUri);

      expect(document.head.children.length).toBe(headChildCountBefore + 1);
      expect(document.head.lastElementChild?.tagName).toBe('LINK');
    });

    it('should handle multiple updates correctly', () => {
      updateFavicon('data:image/svg+xml;base64,first');
      expect(document.querySelectorAll("link[rel*='icon']")).toHaveLength(1);

      updateFavicon('data:image/svg+xml;base64,second');
      expect(document.querySelectorAll("link[rel*='icon']")).toHaveLength(1);

      const link = document.querySelector(
        "link[rel*='icon']"
      ) as HTMLLinkElement;
      expect(link.href).toBe('data:image/svg+xml;base64,second');
    });
  });

  describe('resetFavicon', () => {
    it('should update favicon in DOM without notification badge', () => {
      resetFavicon();

      const links = document.querySelectorAll("link[rel*='icon']");
      expect(links).toHaveLength(1);

      const link = links[0] as HTMLLinkElement;
      const base64Content = link.href.split(',')[1];
      const svgContent = atob(base64Content);
      expect(svgContent).not.toContain('<circle');
      expect(svgContent).not.toContain('#FF0000');
    });

    it('should update favicon in DOM', () => {
      resetFavicon();

      const links = document.querySelectorAll("link[rel*='icon']");
      expect(links).toHaveLength(1);
    });

    it('should generate favicon without notification badge', () => {
      resetFavicon();

      const link = document.querySelector(
        "link[rel*='icon']"
      ) as HTMLLinkElement;
      const base64Content = link.href.split(',')[1];
      const svgContent = atob(base64Content);

      expect(svgContent).not.toContain('#FF0000');
      expect(svgContent).not.toContain('<circle');
    });
  });

  describe('setNotificationFavicon', () => {
    it('should update favicon in DOM with notification badge', () => {
      setNotificationFavicon();

      const links = document.querySelectorAll("link[rel*='icon']");
      expect(links).toHaveLength(1);

      const link = links[0] as HTMLLinkElement;
      const base64Content = link.href.split(',')[1];
      const svgContent = atob(base64Content);
      expect(svgContent).toContain('<circle');
      expect(svgContent).toContain('#FF0000');
    });

    it('should update favicon in DOM', () => {
      setNotificationFavicon();

      const links = document.querySelectorAll("link[rel*='icon']");
      expect(links).toHaveLength(1);
    });

    it('should generate favicon with notification badge', () => {
      setNotificationFavicon();

      const link = document.querySelector(
        "link[rel*='icon']"
      ) as HTMLLinkElement;
      const base64Content = link.href.split(',')[1];
      const svgContent = atob(base64Content);

      expect(svgContent).toContain('#FF0000');
      expect(svgContent).toContain('<circle');
      expect(svgContent).toContain('cx="420"');
      expect(svgContent).toContain('cy="92"');
    });
  });

  describe('integration tests', () => {
    it('should switch between notification and normal favicon', () => {
      // Set normal favicon
      resetFavicon();
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      let svgContent = atob(link.href.split(',')[1]);
      expect(svgContent).not.toContain('<circle');

      // Set notification favicon
      setNotificationFavicon();
      link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      svgContent = atob(link.href.split(',')[1]);
      expect(svgContent).toContain('<circle');

      // Reset to normal
      resetFavicon();
      link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      svgContent = atob(link.href.split(',')[1]);
      expect(svgContent).not.toContain('<circle');
    });

    it('should always have exactly one favicon link', () => {
      resetFavicon();
      expect(document.querySelectorAll("link[rel*='icon']")).toHaveLength(1);

      setNotificationFavicon();
      expect(document.querySelectorAll("link[rel*='icon']")).toHaveLength(1);

      resetFavicon();
      expect(document.querySelectorAll("link[rel*='icon']")).toHaveLength(1);
    });

    it('should handle rapid successive updates', () => {
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          setNotificationFavicon();
        } else {
          resetFavicon();
        }
      }

      const links = document.querySelectorAll("link[rel*='icon']");
      expect(links).toHaveLength(1);
    });
  });
});

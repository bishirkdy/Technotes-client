import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbar } from './navbar';
import { testProviders } from '../../../testing/test-providers';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let originalInnerWidth: number;
  let originalInnerHeight: number;
  let originalMatchMedia: typeof window.matchMedia;
  let originalScrollY: number;

  beforeEach(async () => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    originalMatchMedia = window.matchMedia;
    originalScrollY = window.scrollY;

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: testProviders
    }).compileComponents();

    setViewport(390);
    setScrollY(0);

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: originalInnerHeight
    });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia
    });
    setScrollY(originalScrollY);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides on scroll down and reveals on scroll up when auto-hide is enabled', async () => {
    fixture.componentRef.setInput('autoHide', true);

    setScrollY(400);
    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
    fixture.detectChanges();

    expect(component.headerHidden()).toBe(true);

    const header = fixture.nativeElement.querySelector('header') as HTMLElement;
    expect(header.classList.contains('navbar-hidden')).toBe(true);

    setScrollY(120);
    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
    fixture.detectChanges();

    expect(component.headerHidden()).toBe(false);
    expect(header.classList.contains('navbar-hidden')).toBe(false);
  });

  it('does not auto-hide on desktop', async () => {
    fixture.componentRef.setInput('autoHide', true);
    setViewport(1280);

    setScrollY(400);
    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
    fixture.detectChanges();

    expect(component.headerHidden()).toBe(false);
  });

  it('does not auto-hide unless enabled', async () => {
    setScrollY(400);
    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
    fixture.detectChanges();

    expect(component.headerHidden()).toBe(false);
  });

  it('auto-hides on short landscape viewports even when wide', async () => {
    fixture.componentRef.setInput('autoHide', true);
    setViewport(1280, 500);

    setScrollY(400);
    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
    fixture.detectChanges();

    expect(component.headerHidden()).toBe(true);
  });
});

function setViewport(width: number, height = 900): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value: height
  });
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) =>
      ({
        matches: width < 1024 || (width > height && height <= 620),
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false
      }) as unknown as MediaQueryList
  });
}

function setScrollY(value: number): void {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    writable: true,
    value
  });
}

async function nextFrame(): Promise<void> {
  if (typeof requestAnimationFrame === 'function') {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    return;
  }

  await new Promise<void>(resolve => setTimeout(resolve));
}

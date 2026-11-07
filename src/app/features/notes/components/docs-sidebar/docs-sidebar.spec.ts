import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsSidebar } from './docs-sidebar';
import { testProviders } from '../../../../testing/test-providers';

describe('DocsSidebar', () => {
  let component: DocsSidebar;
  let fixture: ComponentFixture<DocsSidebar>;
  let originalInnerWidth: number;
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(async () => {
    originalInnerWidth = window.innerWidth;
    originalMatchMedia = window.matchMedia;

    await TestBed.configureTestingModule({
      imports: [DocsSidebar],
      providers: testProviders
    }).compileComponents();

    setViewport(390);

    fixture = TestBed.createComponent(DocsSidebar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('singleNote', true);
    fixture.componentRef.setInput('floatingTrigger', true);
    fixture.detectChanges();
    await nextFrame();
  });

  afterEach(() => {
    fixture.destroy();
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth
    });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the fixed contents trigger after the inline trigger scrolls away', async () => {
    const inlineTrigger = fixture.nativeElement.querySelector(
      '[data-mobile-sidebar-trigger]'
    ) as HTMLElement;

    inlineTrigger.getBoundingClientRect = () => rectWithBottom(120);
    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
    fixture.detectChanges();

    expect(component.floatingContentsVisible()).toBe(false);
    expect(fixture.nativeElement.querySelector('[data-floating-contents]')).toBeNull();

    inlineTrigger.getBoundingClientRect = () => rectWithBottom(-10);
    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
    fixture.detectChanges();

    expect(component.floatingContentsVisible()).toBe(true);

    const floatingTrigger = fixture.nativeElement.querySelector(
      '[data-floating-contents]'
    ) as HTMLButtonElement;
    expect(floatingTrigger).toBeTruthy();

    floatingTrigger.click();
    fixture.detectChanges();

    expect(component.drawerOpen()).toBe(true);
    expect(fixture.nativeElement.querySelector('#docs-sidebar-drawer')).toBeTruthy();
  });

  it('keeps the fixed trigger hidden on desktop', async () => {
    setViewport(1280);

    const inlineTrigger = fixture.nativeElement.querySelector(
      '[data-mobile-sidebar-trigger]'
    ) as HTMLElement;
    inlineTrigger.getBoundingClientRect = () => rectWithBottom(-10);

    window.dispatchEvent(new Event('scroll'));
    await nextFrame();
    fixture.detectChanges();

    expect(component.floatingContentsVisible()).toBe(false);
    expect(fixture.nativeElement.querySelector('[data-floating-contents]')).toBeNull();
  });
});

function setViewport(width: number): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width
  });
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) =>
      ({
        matches: width >= 1024 && query.includes('min-width'),
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

function rectWithBottom(bottom: number): DOMRect {
  return {
    bottom,
    top: bottom - 50,
    height: 50,
    left: 0,
    right: 300,
    width: 300,
    x: 0,
    y: bottom - 50,
    toJSON: () => ({})
  } as DOMRect;
}

async function nextFrame(): Promise<void> {
  if (typeof requestAnimationFrame === 'function') {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    return;
  }

  await new Promise<void>(resolve => setTimeout(resolve));
}

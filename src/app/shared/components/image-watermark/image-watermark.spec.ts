import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWatermark } from './image-watermark';

describe('ImageWatermark', () => {
  let fixture: ComponentFixture<ImageWatermark>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageWatermark]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageWatermark);
    fixture.detectChanges();
  });

  it('renders the transparent Scribly logo without text', () => {
    const watermark = fixture.nativeElement.querySelector('.image-watermark') as HTMLElement;
    const logo = watermark.querySelector('img') as HTMLImageElement;

    expect(watermark).toBeTruthy();
    expect(watermark.textContent?.trim()).toBe('');
    expect(logo.getAttribute('src')).toBe('logo.png');
    expect(logo.getAttribute('alt')).toBe('');
  });
});

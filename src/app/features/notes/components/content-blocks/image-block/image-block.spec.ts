import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageBlock } from './image-block';
import { testProviders } from '../../../../../testing/test-providers';

describe('ImageBlock', () => {
  let component: ImageBlock;
  let fixture: ComponentFixture<ImageBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageBlock],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(ImageBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('rejects unsupported image types before uploading', () => {
    const file = new File(['not an image'], 'notes.txt', { type: 'text/plain' });

    component.selectFile({ target: { files: [file], value: '' } } as unknown as Event);

    expect(component.error).toBe('Choose a JPEG, PNG, WebP, or GIF image.');
    expect(component.uploading).toBe(false);
  });

  it('rejects images larger than 10 MB', () => {
    const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' });

    component.selectFile({ target: { files: [file], value: '' } } as unknown as Event);

    expect(component.error).toBe('Images must be 10 MB or smaller.');
    expect(component.uploading).toBe(false);
  });

  it('emits empty data when the image is removed', () => {
    component.data = { url: 'https://res.cloudinary.com/demo/image.jpg', publicId: 'notes/demo' };
    const emitted: unknown[] = [];
    component.dataChange.subscribe(value => emitted.push(value));

    component.remove();

    expect(emitted).toEqual([
      {
        url: '',
        publicId: '',
        width: null,
        height: null,
        format: '',
        alt: '',
        caption: ''
      }
    ]);
  });
});

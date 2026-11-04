import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteReader } from './note-reader';
import { NoteSectionResponse } from '../../models/note-section-response.model';

describe('NoteReader', () => {
  let fixture: ComponentFixture<NoteReader>;

  const sections: NoteSectionResponse[] = [
    {
      id: 'section-1',
      title: 'Architecture',
      sortOrder: 0,
      children: [],
      contents: [
        {
          id: 'content-1',
          type: 8,
          sortOrder: 0,
          content: null,
          data: JSON.stringify({
            url: 'https://res.cloudinary.com/demo/diagram.png',
            publicId: 'technotes/diagram',
            alt: 'Service boundaries',
            caption: 'How the services connect'
          }),
          metadata: null
        }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteReader]
    }).compileComponents();

    fixture = TestBed.createComponent(NoteReader);
    fixture.componentRef.setInput('sections', sections);
    fixture.detectChanges();
  });

  it('renders image content with its alt text and caption', () => {
    const image: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe('https://res.cloudinary.com/demo/diagram.png');
    expect(image.getAttribute('alt')).toBe('Service boundaries');
    expect(image.classList).toContain('note-image__image');
    expect(fixture.nativeElement.textContent).toContain('How the services connect');
  });

  it('renders the Scribly logo watermark over the image', () => {
    const watermark = fixture.nativeElement.querySelector(
      '.note-image__trigger app-image-watermark'
    ) as HTMLElement;
    const logo = watermark?.querySelector('img') as HTMLImageElement;

    expect(watermark).toBeTruthy();
    expect(watermark.textContent?.trim()).toBe('');
    expect(logo.getAttribute('src')).toBe('logo.png');
    expect(logo.getAttribute('alt')).toBe('');
  });

  it('opens the full image in a lightbox and closes it', () => {
    const trigger = fixture.nativeElement.querySelector('.note-image__trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const lightbox = fixture.nativeElement.querySelector('app-image-lightbox');
    const dialog = fixture.nativeElement.querySelector('dialog.image-lightbox') as HTMLDialogElement;

    expect(lightbox).toBeTruthy();
    expect(dialog).toBeTruthy();
    expect(dialog?.hasAttribute('open')).toBe(true);
    expect(fixture.nativeElement.querySelector('app-image-lightbox app-image-watermark')).toBeTruthy();

    const close = fixture.nativeElement.querySelector(
      'app-image-lightbox button[aria-label="Close image preview"]'
    ) as HTMLButtonElement;
    close.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-image-lightbox')).toBeNull();
  });

  it('merges code language metadata into content data', () => {
    const data = fixture.componentInstance.dataOf({
      id: 'content-code',
      type: 7,
      sortOrder: 0,
      content: 'Console.WriteLine("Hello");',
      data: JSON.stringify({ code: 'Console.WriteLine("Hello");', expectedOutput: 'Hello' }),
      metadata: JSON.stringify({ language: 'csharp', filename: 'Program.cs' })
    });

    expect(data.language).toBe('csharp');
    expect(data.filename).toBe('Program.cs');
    expect(data.expectedOutput).toBe('Hello');
  });
});

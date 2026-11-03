import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ImageUploadService } from './image-upload.service';
import { testProviders } from '../../../testing/test-providers';

describe('ImageUploadService', () => {
  it('posts multipart image data to the images endpoint', () => {
    TestBed.configureTestingModule({
      providers: testProviders
    });

    const service = TestBed.inject(ImageUploadService);
    const httpMock = TestBed.inject(HttpTestingController);
    const file = new File(['png'], 'diagram.png', { type: 'image/png' });

    let response: unknown;
    service.uploadResult(file).subscribe(value => {
      response = value;
    });

    const request = httpMock.expectOne('https://localhost:7029/api/v1/images');
    expect(request.request.method).toBe('POST');
    expect(request.request.body instanceof FormData).toBe(true);
    expect((request.request.body as FormData).get('file')).toBe(file);

    request.flush({
      url: 'https://res.cloudinary.com/demo/diagram.png',
      publicId: 'technotes/diagram',
      width: 1200,
      height: 800,
      format: 'png'
    });

    expect(response).toEqual({
      url: 'https://res.cloudinary.com/demo/diagram.png',
      publicId: 'technotes/diagram',
      width: 1200,
      height: 800,
      format: 'png'
    });
  });
});

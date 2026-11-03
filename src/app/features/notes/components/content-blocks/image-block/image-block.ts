import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ImageBlockData } from '../../../models/image-block-data.model';
import { ImageUploadService } from '../../../services/image-upload.service';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

@Component({
  selector: 'app-image-block',
  imports: [FormsModule],
  templateUrl: './image-block.html'
})
export class ImageBlock {
  private readonly uploads = inject(ImageUploadService);

  @Input() data: ImageBlockData = {
    url: '',
    publicId: '',
    alt: '',
    caption: ''
  };
  @Output() dataChange = new EventEmitter<ImageBlockData>();

  uploading = false;
  progress = 0;
  error = '';
  dragging = false;

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) {
      this.upload(file);
    }
  }

  dropFile(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.upload(file);
    }
  }

  dragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  dragLeave(): void {
    this.dragging = false;
  }

  updateAlt(value: string): void {
    this.emit({ alt: value });
  }

  updateCaption(value: string): void {
    this.emit({ caption: value });
  }

  remove(): void {
    this.error = '';
    this.progress = 0;
    this.emit({
      url: '',
      publicId: '',
      width: null,
      height: null,
      format: '',
      alt: '',
      caption: ''
    });
  }

  private upload(file: File): void {
    this.error = '';

    if (!ALLOWED_TYPES.has(file.type)) {
      this.error = 'Choose a JPEG, PNG, WebP, or GIF image.';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      this.error = 'Images must be 10 MB or smaller.';
      return;
    }

    this.uploading = true;
    this.progress = 0;

    this.uploads.upload(file).subscribe({
      next: event => {
        if (event.type === HttpEventType.UploadProgress) {
          const total = event.total ?? file.size;
          this.progress = total > 0 ? Math.round((event.loaded / total) * 100) : 0;
        }

        if (event.type === HttpEventType.Response && event.body) {
          this.uploading = false;
          this.progress = 100;
          this.data = {
            ...this.data,
            ...event.body,
            alt: this.data.alt ?? '',
            caption: this.data.caption ?? ''
          };
          this.dataChange.emit({ ...this.data });
        }
      },
      error: error => {
        this.uploading = false;
        this.progress = 0;
        this.error = error?.error?.detail || error?.error?.message || 'The image could not be uploaded.';
      }
    });
  }

  private emit(patch: Partial<ImageBlockData>): void {
    this.data = { ...this.data, ...patch };
    this.dataChange.emit({ ...this.data });
  }
}

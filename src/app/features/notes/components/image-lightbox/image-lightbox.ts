import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  output
} from '@angular/core';

export interface LightboxImage {
  url: string;
  alt?: string;
  caption?: string;
}

@Component({
  selector: 'app-image-lightbox',
  templateUrl: './image-lightbox.html',
  styleUrl: './image-lightbox.css'
})
export class ImageLightbox implements AfterViewInit, OnDestroy {
  @Input({ required: true }) image!: LightboxImage;

  readonly closed = output<void>();

  @ViewChild('dialog') private dialogRef?: ElementRef<HTMLDialogElement>;
  @ViewChild('closeButton') private closeButtonRef?: ElementRef<HTMLButtonElement>;

  private previousBodyOverflow = '';

  ngAfterViewInit(): void {
    const dialog = this.dialogRef?.nativeElement;
    if (!dialog) {
      return;
    }

    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    try {
      dialog.showModal();
    } catch {
      dialog.setAttribute('open', '');
    }

    this.closeButtonRef?.nativeElement.focus();
  }

  ngOnDestroy(): void {
    const dialog = this.dialogRef?.nativeElement;
    if (dialog?.open) {
      try {
        dialog.close();
      } catch {
        dialog.removeAttribute('open');
      }
    }
    this.restoreBodyScroll();
  }

  close(): void {
    this.restoreBodyScroll();
    this.closed.emit();
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialogRef?.nativeElement) {
      this.close();
    }
  }

  private restoreBodyScroll(): void {
    document.body.style.overflow = this.previousBodyOverflow;
  }
}

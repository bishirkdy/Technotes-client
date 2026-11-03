import { Component, HostListener, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { NoteApiService } from '../../services/note-api.service';

@Component({
  selector: 'app-reading-progress',
  template: `
    @if (auth.isUserLoggedIn()) {
      <div class="flex items-center gap-3">
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div class="h-full rounded-full bg-acid-400 transition-[width] duration-300" [style.width.%]="percent()"></div>
        </div>
        <span class="w-9 text-right text-[10px] font-medium tabular-nums text-mist-400">{{ percent() }}%</span>
      </div>
    }
  `
})
export class ReadingProgress implements OnInit, OnDestroy {
  private readonly api = inject(NoteApiService);
  readonly auth = inject(AuthService);

  @Input({ required: true }) noteId = '';
  @Input() initialPercent = 0;

  readonly percent = signal(0);
  private savedPercent = 0;
  private frame = 0;

  ngOnInit(): void {
    this.savedPercent = Math.min(Math.max(this.initialPercent, 0), 100);
    this.percent.set(this.savedPercent);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      this.update();
      return;
    }

    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.update());
  }

  ngOnDestroy(): void {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.frame);
    }
    this.save(true);
  }

  private update(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const current = scrollable <= 0 ? 100 : Math.round((window.scrollY / scrollable) * 100);
    const clamped = Math.min(Math.max(current, 0), 100);

    if (clamped <= this.percent()) {
      return;
    }

    this.percent.set(clamped);
    if (clamped === 100 || clamped >= this.savedPercent + 8) {
      this.save();
    }
  }

  private save(force = false): void {
    const value = this.percent();
    if (!this.auth.isUserLoggedIn() || !this.noteId || value <= 0) {
      return;
    }

    if (!force && value <= this.savedPercent) {
      return;
    }

    this.savedPercent = Math.max(this.savedPercent, value);
    this.api.saveReadingProgress(this.noteId, value).subscribe({ error: () => undefined });
  }
}

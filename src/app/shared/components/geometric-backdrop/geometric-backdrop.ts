import { Component } from '@angular/core';

@Component({
  selector: 'app-geometric-backdrop',
  template: `
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div class="absolute inset-0 geometric-grid opacity-70"></div>
      <div class="absolute inset-0 noise-overlay"></div>

      <div class="absolute -left-40 top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-acid-400/10 blur-[120px]"></div>
      <div class="absolute -right-32 top-24 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[110px]"></div>
      <div class="absolute bottom-[-18rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-acid-400/[0.06] blur-[120px]"></div>

      <svg
        class="absolute -right-52 top-[-8rem] h-[42rem] w-[42rem] text-acid-400/[0.12]"
        viewBox="0 0 600 600"
        fill="none"
      >
        <rect x="182" y="182" width="236" height="236" stroke="currentColor" />
        <rect x="102" y="102" width="396" height="396" stroke="currentColor" stroke-dasharray="3 10" />
        <rect x="22" y="22" width="556" height="556" stroke="currentColor" stroke-dasharray="26 16" />
        <path d="M300 22v556M22 300h556" stroke="currentColor" stroke-dasharray="2 14" />
        <path d="M105 105l390 390M495 105L105 495" stroke="currentColor" opacity=".5" />
      </svg>

      <svg
        class="absolute -bottom-44 -left-44 h-[36rem] w-[36rem] text-cyan-300/[0.09] float-slower"
        viewBox="0 0 500 500"
        fill="none"
      >
        <rect x="80" y="80" width="340" height="340" stroke="currentColor" transform="rotate(18 250 250)" />
        <rect x="128" y="128" width="244" height="244" stroke="currentColor" transform="rotate(38 250 250)" />
        <rect x="198" y="198" width="104" height="104" stroke="currentColor" />
      </svg>
    </div>
  `
})
export class GeometricBackdrop {}

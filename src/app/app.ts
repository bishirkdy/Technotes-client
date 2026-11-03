import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeometricBackdrop } from './shared/components/geometric-backdrop/geometric-backdrop';
import { GlobalFeedback } from './shared/components/global-feedback/global-feedback';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GeometricBackdrop, GlobalFeedback],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

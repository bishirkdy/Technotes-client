import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';

@Component({ selector:'app-dashboard', imports:[RouterLink], templateUrl:'./dashboard.html', styleUrl:'./dashboard.css' })
export class Dashboard {
  constructor(public data: DummyDataService) {}
  get published() { return this.data.notes.filter(n => n.status === 'Published').length; }
  get favorites() { return this.data.notes.filter(n => n.favorite).length; }
  barWidth(count: number): number { return Math.min(count * 2, 100); }
}

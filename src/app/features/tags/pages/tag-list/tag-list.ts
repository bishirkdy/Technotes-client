import { Component } from '@angular/core';
import { DummyDataService } from '../../../../core/data/dummy-data.service';
@Component({
  selector: 'app-tag-list',
  imports: [],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.css',
})
export class TagList {
  constructor(public data: DummyDataService) {}
  get tags() {
    const map = new Map<string, number>();
    for (const n of this.data.notes) for (const t of n.tags) map.set(t, (map.get(t) || 0) + 1);
    return [...map].sort((a, b) => b[1] - a[1]);
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';

@Component({
  selector: 'app-my-notes',
  imports: [RouterLink],
  templateUrl: './my-notes.html',
  styleUrl: './my-notes.css',
})
export class MyNotes {
  filter = 'All';
  constructor(public data: DummyDataService) {}
  get notes() {
    return this.filter === 'All'
      ? this.data.notes
      : this.data.notes.filter((n) => n.status === this.filter || n.visibility === this.filter);
  }
}

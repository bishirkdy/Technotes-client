import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';
@Component({
  selector: 'app-shared-notes',
  imports: [RouterLink],
  templateUrl: './shared-notes.html',
  styleUrl: './shared-notes.css',
})
export class SharedNotes {
  constructor(public data: DummyDataService) {}
  get notes() {
    return this.data.notes.filter((n) => n.visibility === 'Shared' || n.visibility === 'Public');
  }
}

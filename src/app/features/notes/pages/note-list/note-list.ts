import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';
@Component({
  selector: 'app-note-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './note-list.html',
  styleUrl: './note-list.css',
})
export class NoteList {
  query = '';
  category = 'All';
  constructor(public data: DummyDataService) {}
  get notes() {
    return this.data.notes.filter(
      (n) =>
        (this.category === 'All' || n.category === this.category) &&
        (!this.query ||
          `${n.title} ${n.description} ${n.tags.join(' ')}`
            .toLowerCase()
            .includes(this.query.toLowerCase())),
    );
  }
}

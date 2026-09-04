import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css',
})

export class Search {
  query = '';
  constructor(public data: DummyDataService) {}
  get results() {
    if (!this.query.trim()) return [];
    return this.data.notes.filter((n) =>
      `${n.title} ${n.description} ${n.tags.join(' ')}`
        .toLowerCase()
        .includes(this.query.toLowerCase()),
    );
  }
}

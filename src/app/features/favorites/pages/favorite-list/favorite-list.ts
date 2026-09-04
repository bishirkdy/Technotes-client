import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';
@Component({
  selector: 'app-favorite-list',
  imports: [RouterLink],
  templateUrl: './favorite-list.html',
  styleUrl: './favorite-list.css',
})
export class FavoriteList {
  constructor(public data: DummyDataService) {}
  get notes() {
    return this.data.notes.filter((n) => n.favorite);
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';
@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  constructor(public data: DummyDataService) {}
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DummyDataService } from '../../../../core/data/dummy-data.service';
@Component({
  selector: 'app-learn-home',
  imports: [RouterLink],
  templateUrl: './learn-home.html',
  styleUrl: './learn-home.css',
})
export class LearnHome {
  constructor(public data: DummyDataService) {}
}

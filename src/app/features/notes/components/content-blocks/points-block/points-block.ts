import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-points-block',
  imports: [],
  templateUrl: './points-block.html',
  styleUrl: './points-block.css'
})
export class PointsBlock {

  @Input()
  data: any = {};

  @Output()
  dataChange = new EventEmitter<any>();

  get points(): string[] {
    return this.data.points ?? [];
  }

  addPoint(): void {
    this.updatePoints([...this.points, '']);
  }

  removePoint(index: number): void {
    const points = this.points.filter((_, i) => i !== index);
    this.updatePoints(points);
  }

  updatePoint(index: number, value: string): void {
    const points = [...this.points];
    points[index] = value;

    this.updatePoints(points);
  }

  private updatePoints(points: string[]): void {
    this.data = {
      ...this.data,
      points
    };

    this.dataChange.emit(this.data);
  }
}
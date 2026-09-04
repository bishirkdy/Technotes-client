import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsBlock } from './points-block';

describe('PointsBlock', () => {
  let component: PointsBlock;
  let fixture: ComponentFixture<PointsBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(PointsBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

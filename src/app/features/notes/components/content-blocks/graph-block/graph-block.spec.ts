import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphBlock } from './graph-block';

describe('GraphBlock', () => {
  let component: GraphBlock;
  let fixture: ComponentFixture<GraphBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

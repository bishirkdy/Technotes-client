import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTree } from './section-tree';

describe('SectionTree', () => {
  let component: SectionTree;
  let fixture: ComponentFixture<SectionTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTree],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionTree);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

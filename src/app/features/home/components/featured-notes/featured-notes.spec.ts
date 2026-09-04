import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedNotes } from './featured-notes';

describe('FeaturedNotes', () => {
  let component: FeaturedNotes;
  let fixture: ComponentFixture<FeaturedNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

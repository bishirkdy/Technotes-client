import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedNotes } from './featured-notes';
import { testProviders } from '../../../../testing/test-providers';

describe('FeaturedNotes', () => {
  let component: FeaturedNotes;
  let fixture: ComponentFixture<FeaturedNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedNotes],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

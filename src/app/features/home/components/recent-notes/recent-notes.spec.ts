import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentNotes } from './recent-notes';
import { testProviders } from '../../../../testing/test-providers';

describe('RecentNotes', () => {
  let component: RecentNotes;
  let fixture: ComponentFixture<RecentNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentNotes],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(RecentNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

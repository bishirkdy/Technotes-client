import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentNotes } from './recent-notes';

describe('RecentNotes', () => {
  let component: RecentNotes;
  let fixture: ComponentFixture<RecentNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

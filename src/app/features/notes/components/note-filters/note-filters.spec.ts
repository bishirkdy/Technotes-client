import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteFilters } from './note-filters';

describe('NoteFilters', () => {
  let component: NoteFilters;
  let fixture: ComponentFixture<NoteFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

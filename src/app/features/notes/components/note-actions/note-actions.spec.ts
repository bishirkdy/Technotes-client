import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteActions } from './note-actions';

describe('NoteActions', () => {
  let component: NoteActions;
  let fixture: ComponentFixture<NoteActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteActions],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

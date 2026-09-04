import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteContent } from './note-content';

describe('NoteContent', () => {
  let component: NoteContent;
  let fixture: ComponentFixture<NoteContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteContent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteHeader } from './note-header';

describe('NoteHeader', () => {
  let component: NoteHeader;
  let fixture: ComponentFixture<NoteHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

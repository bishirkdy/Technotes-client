import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteSection } from './note-section';

describe('NoteSection', () => {
  let component: NoteSection;
  let fixture: ComponentFixture<NoteSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteSection],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

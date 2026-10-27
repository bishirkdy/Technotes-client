import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteView } from './note-view';
import { testProviders } from '../../../../testing/test-providers';

describe('NoteView', () => {
  let component: NoteView;
  let fixture: ComponentFixture<NoteView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteView],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(NoteView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

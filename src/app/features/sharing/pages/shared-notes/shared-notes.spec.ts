import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNotes } from './shared-notes';

describe('SharedNotes', () => {
  let component: SharedNotes;
  let fixture: ComponentFixture<SharedNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionActions } from './section-actions';

describe('SectionActions', () => {
  let component: SectionActions;
  let fixture: ComponentFixture<SectionActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionActions],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

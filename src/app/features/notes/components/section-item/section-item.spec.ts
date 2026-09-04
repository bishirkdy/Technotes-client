import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionItem } from './section-item';

describe('SectionItem', () => {
  let component: SectionItem;
  let fixture: ComponentFixture<SectionItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionItem],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

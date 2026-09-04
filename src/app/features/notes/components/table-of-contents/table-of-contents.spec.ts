import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOfContents } from './table-of-contents';

describe('TableOfContents', () => {
  let component: TableOfContents;
  let fixture: ComponentFixture<TableOfContents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableOfContents],
    }).compileComponents();

    fixture = TestBed.createComponent(TableOfContents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

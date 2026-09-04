import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBlock } from './table-block';

describe('TableBlock', () => {
  let component: TableBlock;
  let fixture: ComponentFixture<TableBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(TableBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

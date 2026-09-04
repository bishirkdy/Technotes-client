import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionBlock } from './definition-block';

describe('DefinitionBlock', () => {
  let component: DefinitionBlock;
  let fixture: ComponentFixture<DefinitionBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinitionBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(DefinitionBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagList } from './tag-list';
import { testProviders } from '../../../../testing/test-providers';

describe('TagList', () => {
  let component: TagList;
  let fixture: ComponentFixture<TagList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagList],
      providers: testProviders
    }).compileComponents();

    fixture = TestBed.createComponent(TagList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { vi } from 'vitest';

import { environment } from '../../../../../environments/environment';
import { NoteCreateModel } from '../../models/note-create.model';
import { NoteResponse } from '../../models/note-response.model';
import { testProviders } from '../../../../testing/test-providers';
import { NoteEdit } from './note-edit';

describe('NoteEdit', () => {
  let component: NoteEdit;
  let fixture: ComponentFixture<NoteEdit>;
  let httpMock: HttpTestingController;
  let router: Router;

  const updateUrl = `${environment.apiUrl}/notes/note-1`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteEdit],
      providers: [
        ...testProviders,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'note-1' }) } }
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(NoteEdit);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('removes root and nested sections', () => {
    component.note = makeNote();

    component.removeSection(1);

    expect(component.note.sections.map(section => section.title)).toEqual(['Second']);

    component.removeSection(21);

    expect(component.note.sections[0].children).toEqual([]);
  });

  it('excludes a deleted section from the update request', () => {
    component.note = makeNote();

    component.removeSection(1);
    component.save();

    const request = httpMock.expectOne(updateUrl);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.sections).toHaveLength(1);
    expect(request.request.body.sections[0].title).toBe('Second');

    request.flush(makeResponse());
  });

  it('saves again instead of navigating when a section is deleted during a save', () => {
    component.note = makeNote();

    component.save();

    const firstRequest = httpMock.expectOne(updateUrl);
    expect(component.saving).toBe(true);

    component.removeSection(1);
    firstRequest.flush(makeResponse());

    const secondRequest = httpMock.expectOne(updateUrl);
    expect(secondRequest.request.body.sections).toHaveLength(1);
    expect(secondRequest.request.body.sections[0].title).toBe('Second');

    secondRequest.flush(makeResponse());

    expect(component.saving).toBe(false);
    expect(component.dirty).toBe(false);
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/notes', 'note-1']);
  });

  it('resets saving and keeps the error when an update fails', () => {
    component.note = makeNote();
    component.touch();

    component.save();

    const request = httpMock.expectOne(updateUrl);
    request.flush({ detail: 'Unable to save' }, { status: 500, statusText: 'Server Error' });

    expect(component.saving).toBe(false);
    expect(component.dirty).toBe(true);
    expect(component.error).toBe('Unable to save');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});

function makeNote(): NoteCreateModel {
  return {
    title: 'C#',
    visibility: 1,
    status: 1,
    folderId: null,
    categoryId: null,
    tags: [],
    sections: [
      {
        id: 1,
        title: 'Start Here',
        sortOrder: 0,
        children: [],
        contents: []
      },
      {
        id: 2,
        title: 'Second',
        sortOrder: 1,
        children: [
          {
            id: 21,
            title: 'Nested',
            sortOrder: 0,
            children: [],
            contents: []
          }
        ],
        contents: []
      }
    ]
  };
}

function makeResponse(): NoteResponse {
  return {
    id: 'note-1',
    title: 'C#',
    status: 1,
    visibility: 1,
    userId: 'user-1',
    folderId: null,
    categoryId: null,
    sections: []
  };
}

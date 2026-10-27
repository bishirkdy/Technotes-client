import { NoteMapperService } from './note-mapper.service';
import { NoteCreateModel } from '../models/note-create.model';
import { NoteResponse } from '../models/note-response.model';

describe('NoteMapperService', () => {
  const service = new NoteMapperService();

  const note: NoteCreateModel = {
    title: '  EF Core tips  ',
    visibility: 3,
    status: 2,
    folderId: null,
    categoryId: null,
    sections: [
      {
        id: 1,
        title: ' Queries ',
        sortOrder: 0,
        children: [],
        contents: [
          {
            id: 10,
            type: 'code',
            sortOrder: 0,
            data: { language: 'csharp', filename: 'Program.cs', code: 'var notes = await db.Notes.ToListAsync();' }
          },
          {
            id: 11,
            type: 'points',
            sortOrder: 1,
            data: { points: ['Use AsNoTracking for reads.'] }
          }
        ]
      }
    ]
  };

  it('maps editor content to API content types and keeps structured data', () => {
    const request = service.toUpdateRequest(note);

    expect(request.title).toBe('EF Core tips');
    expect(request.visibility).toBe(3);
    expect(request.status).toBe(2);
    expect(request.sections[0].title).toBe('Queries');
    expect(request.sections[0].contents[0]).toEqual({
      type: 7,
      sortOrder: 1,
      content: null,
      data: JSON.stringify({ code: 'var notes = await db.Notes.ToListAsync();' }),
      metadata: JSON.stringify({ language: 'csharp', filename: 'Program.cs' })
    });
    expect(request.sections[0].contents[1].type).toBe(3);
  });

  it('restores editor content from an API response', () => {
    const response: NoteResponse = {
      id: 'note-1',
      title: 'EF Core tips',
      status: 2,
      visibility: 3,
      userId: 'user-1',
      folderId: null,
      categoryId: null,
      sections: [
        {
          id: 'section-1',
          title: 'Queries',
          sortOrder: 1,
          children: [],
          contents: [
            {
              id: 'content-1',
              type: 7,
              sortOrder: 1,
              content: null,
              data: JSON.stringify({ code: 'db.Notes.ToList()' }),
              metadata: JSON.stringify({ language: 'csharp' })
            }
          ]
        }
      ]
    };

    const model = service.fromResponse(response);

    expect(model.title).toBe('EF Core tips');
    expect(model.sections[0].contents[0].type).toBe('code');
    expect(model.sections[0].contents[0].data.language).toBe('csharp');
    expect(model.sections[0].contents[0].data.code).toBe('db.Notes.ToList()');
  });
});

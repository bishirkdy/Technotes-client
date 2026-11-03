import { flattenNoteSections } from './note-section.helpers';
import { NoteSectionResponse } from './note-section-response.model';

describe('flattenNoteSections', () => {
  const sections: NoteSectionResponse[] = [
    {
      id: 'intro',
      title: 'Introduction',
      sortOrder: 1,
      contents: [],
      children: [
        {
          id: 'setup',
          title: 'Setup',
          sortOrder: 1,
          contents: [],
          children: []
        }
      ]
    },
    {
      id: 'basics',
      title: 'Basics',
      sortOrder: 2,
      contents: [],
      children: []
    }
  ];

  it('flattens nested sections with level and dotted numbering', () => {
    const flat = flattenNoteSections(sections);

    expect(flat.map(item => item.section.id)).toEqual(['intro', 'setup', 'basics']);
    expect(flat.map(item => item.level)).toEqual([0, 1, 0]);
    expect(flat.map(item => item.number)).toEqual(['1', '1.1', '2']);
  });

  it('creates stable section anchors', () => {
    const flat = flattenNoteSections(sections);

    expect(flat[1].anchor).toBe('section-setup');
  });

  it('tracks ancestor section ids for nested items', () => {
    const flat = flattenNoteSections(sections);

    expect(flat[0].ancestorIds).toEqual([]);
    expect(flat[1].ancestorIds).toEqual(['intro']);
  });
});

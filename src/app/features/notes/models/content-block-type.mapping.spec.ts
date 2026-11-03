import { API_TYPE_TO_CONTENT, CONTENT_TYPE_TO_API } from './content-block-type.mapping';

describe('content block type mapping', () => {
  it('maps the image block to API type 8 in both directions', () => {
    expect(CONTENT_TYPE_TO_API.image).toBe(8);
    expect(API_TYPE_TO_CONTENT[8]).toBe('image');
  });
});

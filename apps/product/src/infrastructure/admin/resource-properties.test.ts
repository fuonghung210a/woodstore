import {
  postArrayProperties,
  productArrayProperties,
} from './resource-properties';

describe('AdminJS array property configuration', () => {
  it.each([
    ['Product.tags', productArrayProperties.tags],
    ['Post.tags', postArrayProperties.tags],
    ['Post.relatedProductIds', postArrayProperties.relatedProductIds],
  ])('marks %s as a string array', (_propertyName, options) => {
    expect(options).toEqual({
      type: 'string',
      isArray: true,
    });
  });
});

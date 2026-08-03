export const productArrayProperties = {
  tags: {
    type: 'string',
    isArray: true,
  },
} as const;

export const postArrayProperties = {
  tags: {
    type: 'string',
    isArray: true,
  },
  relatedProductIds: {
    type: 'string',
    isArray: true,
  },
} as const;

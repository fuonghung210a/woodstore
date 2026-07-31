import type {
  ActionContext,
  ActionRequest,
  RecordActionResponse,
} from 'adminjs';
import {
  deleteRemovedProductImagesAfterSave,
  rememberRemovedProductImages,
} from './product-images.hooks';

const makeContext = (previousImages: string[]): ActionContext =>
  ({
    record: {
      get: jest.fn().mockReturnValue(previousImages),
    },
  }) as unknown as ActionContext;

describe('Product image AdminJS hooks', () => {
  it('remembers only images removed from an edited product', async () => {
    const request = {
      method: 'post',
      params: { resourceId: 'Product', action: 'edit' },
      payload: {
        images: [
          'https://bucket/products/kept.png',
          'https://bucket/products/new.png',
        ],
      },
    } as ActionRequest;
    const context = makeContext([
      'https://bucket/products/kept.png',
      'https://bucket/products/removed.png',
    ]);

    await rememberRemovedProductImages(request, context);

    expect(context.productImagesToDelete).toEqual([
      'https://bucket/products/removed.png',
    ]);
  });

  it('marks every previous image for deletion when the list is cleared', async () => {
    const request = {
      method: 'post',
      params: { resourceId: 'Product', action: 'edit' },
      payload: { images: [] },
    } as ActionRequest;
    const context = makeContext([
      'https://bucket/products/one.png',
      'https://bucket/products/two.png',
    ]);

    await rememberRemovedProductImages(request, context);

    expect(context.productImagesToDelete).toEqual([
      'https://bucket/products/one.png',
      'https://bucket/products/two.png',
    ]);
  });

  it('deletes removed images only after a successful save', async () => {
    const deleteFile = jest.fn().mockResolvedValue(undefined);
    const hook = deleteRemovedProductImagesAfterSave({ deleteFile });
    const context = {
      productImagesToDelete: [
        'https://bucket/products/one.png',
        'https://bucket/products/two.png',
      ],
    } as unknown as ActionContext;
    const request = {
      method: 'post',
      params: { resourceId: 'Product', action: 'edit' },
    } as ActionRequest;
    const response = {
      notice: { message: 'saved', type: 'success' },
      record: {},
    } as unknown as RecordActionResponse;

    await hook(response, request, context);

    expect(deleteFile).toHaveBeenCalledTimes(2);
    expect(deleteFile).toHaveBeenCalledWith(
      'https://bucket/products/one.png',
    );
    expect(deleteFile).toHaveBeenCalledWith(
      'https://bucket/products/two.png',
    );
  });

  it('keeps S3 files when the product save fails', async () => {
    const deleteFile = jest.fn().mockResolvedValue(undefined);
    const hook = deleteRemovedProductImagesAfterSave({ deleteFile });
    const context = {
      productImagesToDelete: ['https://bucket/products/kept.png'],
    } as unknown as ActionContext;
    const request = {
      method: 'post',
      params: { resourceId: 'Product', action: 'edit' },
    } as ActionRequest;
    const response = {
      notice: { message: 'invalid', type: 'error' },
      record: {},
    } as unknown as RecordActionResponse;

    await hook(response, request, context);

    expect(deleteFile).not.toHaveBeenCalled();
  });
});

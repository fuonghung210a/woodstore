import type {
  After,
  Before,
  RecordActionResponse,
} from 'adminjs';
import { flat } from 'adminjs';

const IMAGES_TO_DELETE_CONTEXT_KEY = 'productImagesToDelete';

type FileDeletionService = {
  deleteFile(urlOrKey: string): Promise<void>;
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === 'string' && item.length > 0,
  );
};

/**
 * AdminJS updates the record between its before/after hooks. Keep the removed
 * URLs in the shared action context so they can be deleted only after a
 * successful database update.
 */
export const rememberRemovedProductImages: Before = (request, context) => {
  if (request.method !== 'post') {
    return request;
  }

  const submittedImages = flat.get(request.payload ?? {}, 'images');
  if (submittedImages === undefined) {
    context[IMAGES_TO_DELETE_CONTEXT_KEY] = [];
    return request;
  }

  const previousImages = toStringArray(context.record?.get('images'));
  const nextImages = new Set(toStringArray(submittedImages));

  context[IMAGES_TO_DELETE_CONTEXT_KEY] = previousImages.filter(
    (url) => !nextImages.has(url),
  );

  return request;
};

export const deleteRemovedProductImagesAfterSave = (
  fileDeletionService: FileDeletionService,
): After<RecordActionResponse> => {
  return async (response, request, context) => {
    if (
      request.method !== 'post' ||
      response.notice?.type !== 'success'
    ) {
      return response;
    }

    const urls = toStringArray(
      context[IMAGES_TO_DELETE_CONTEXT_KEY],
    );

    await Promise.all(urls.map((url) => fileDeletionService.deleteFile(url)));
    return response;
  };
};

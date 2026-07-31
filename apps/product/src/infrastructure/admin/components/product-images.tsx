import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  FormGroup,
  Icon,
  Label,
  Text,
} from '@adminjs/design-system';
import { EditPropertyProps, flat, useNotice } from 'adminjs';

type UploadResponse = {
  url?: unknown;
  message?: unknown;
};

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });
  const result = (await response.json().catch(() => ({}))) as UploadResponse;

  if (!response.ok || typeof result.url !== 'string') {
    throw new Error(
      typeof result.message === 'string'
        ? result.message
        : `Không thể upload ${file.name}`,
    );
  }

  return result.url;
};

const ProductImages = ({
  property,
  record,
  onChange,
}: EditPropertyProps): React.JSX.Element => {
  const addNotice = useNotice();
  const [isUploading, setIsUploading] = useState(false);
  const imagesValue = flat.get(record.params, property.path);
  const images = Array.isArray(imagesValue)
    ? imagesValue.filter((url): url is string => typeof url === 'string')
    : [];

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    setIsUploading(true);
    const results = await Promise.allSettled(files.map(uploadImage));
    const uploadedUrls = results.flatMap((result) =>
      result.status === 'fulfilled' ? [result.value] : [],
    );
    const failedUploads = results.filter(
      (result) => result.status === 'rejected',
    );

    if (uploadedUrls.length > 0) {
      onChange(property.path, [...images, ...uploadedUrls]);
      addNotice({
        message: `Đã upload ${uploadedUrls.length} ảnh`,
        type: 'success',
      });
    }

    if (failedUploads.length > 0) {
      const firstFailure = failedUploads[0] as PromiseRejectedResult;
      addNotice({
        message:
          firstFailure.reason instanceof Error
            ? firstFailure.reason.message
            : `${failedUploads.length} ảnh upload thất bại`,
        type: 'error',
      });
    }

    setIsUploading(false);
  };

  const removeImage = (indexToRemove: number): void => {
    onChange(
      property.path,
      images.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <FormGroup>
      <Label>{property.label}</Label>
      <Box mb="lg">
        <input
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
          disabled={isUploading}
          multiple
          onChange={handleUpload}
          type="file"
        />
        <Text color="grey60" mt="sm">
          JPG, PNG, WEBP, GIF, SVG hoặc AVIF — tối đa 5MB mỗi ảnh.
        </Text>
      </Box>

      {isUploading && (
        <Text mb="lg">
          <Icon icon="Fade" spin /> Đang upload ảnh…
        </Text>
      )}

      <Box
        display="grid"
        gridGap="lg"
        gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))"
      >
        {images.map((url, index) => (
          <Box
            border="default"
            borderColor="grey40"
            key={`${url}-${index}`}
            overflow="hidden"
            p="sm"
          >
            <img
              alt={`Ảnh sản phẩm ${index + 1}`}
              src={url}
              style={{
                display: 'block',
                height: 140,
                objectFit: 'cover',
                width: '100%',
              }}
            />
            <Text
              mt="sm"
              overflow="hidden"
              textOverflow="ellipsis"
              title={url}
              whiteSpace="nowrap"
            >
              {url}
            </Text>
            <Button
              mt="sm"
              onClick={() => removeImage(index)}
              size="sm"
              type="button"
              variant="danger"
            >
              <Icon icon="TrashCan" />
              Bỏ ảnh
            </Button>
          </Box>
        ))}
      </Box>

      {images.length > 0 && (
        <Text color="grey60" mt="lg">
          Ảnh bị bỏ sẽ được xóa khỏi S3 sau khi lưu sản phẩm thành công.
        </Text>
      )}
    </FormGroup>
  );
};

export default ProductImages;

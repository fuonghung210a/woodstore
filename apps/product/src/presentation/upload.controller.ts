import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { S3Service } from '../infrastructure/storage/s3.service';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload ảnh lên S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File ảnh (jpg, png, webp, gif, svg, avif) — tối đa 5MB',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Upload thành công, trả về URL ảnh' })
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'FILE_REQUIRED',
        message: 'Vui lòng chọn file để upload',
      });
    }

    // Kiểm tra extension
    const originalName = file.originalname.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      originalName.endsWith(ext),
    );
    if (!hasValidExtension) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'INVALID_FILE_TYPE',
        message: `Chỉ hỗ trợ định dạng: ${ALLOWED_EXTENSIONS.join(', ')}`,
      });
    }

    // Kiểm tra kích thước
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'FILE_TOO_LARGE',
        message: 'File tối đa 5MB',
      });
    }

    const url = await this.s3Service.uploadFile(
      file.buffer,
      file.originalname,
      'products',
    );

    return { url };
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreatePostSchema, CreatePostDto } from './dto/create-post.dto';
import { UpdatePostSchema, UpdatePostDto } from './dto/update-post.dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { ApiZodBody } from './decorators/api-zod-body.decorator';
import { CreatePostCommand } from '../application/commands/create-post.command';
import { UpdatePostCommand } from '../application/commands/update-post.command';
import { SoftDeletePostCommand } from '../application/commands/soft-delete-post.command';
import { GetPostQuery } from '../application/queries/get-post.query';
import { GetPostBySlugQuery } from '../application/queries/get-post-by-slug.query';
import { ListPostsQuery } from '../application/queries/list-posts.query';
import { ListPublishedPostsQuery } from '../application/queries/list-published-posts.query';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @ApiZodBody(CreatePostSchema, 'Thông tin bài viết cần tạo')
  @ApiResponse({ status: 201, description: 'Bài viết đã được tạo' })
  create(
    @Body(new ZodValidationPipe(CreatePostSchema)) body: CreatePostDto,
  ) {
    return this.commandBus.execute(new CreatePostCommand(body));
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách bài viết' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['DRAFT', 'PUBLISHED'] })
  @ApiQuery({ name: 'tag', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('tag') tag?: string,
  ) {
    return this.queryBus.execute(
      new ListPostsQuery(
        { search, status, tag },
        { page: Number(page) || 1, limit: Number(limit) || 20 },
      ),
    );
  }

  @Get('published')
  @ApiOperation({ summary: 'Bài viết đã xuất bản (cho website)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findPublished(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.queryBus.execute(
      new ListPublishedPostsQuery({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      }),
    );
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Chi tiết bài viết theo slug (cho website)' })
  @ApiParam({ name: 'slug', description: 'Slug bài viết' })
  findBySlug(@Param('slug') slug: string) {
    return this.queryBus.execute(new GetPostBySlugQuery(slug));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết bài viết' })
  @ApiParam({ name: 'id', description: 'UUID bài viết' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài viết' })
  findById(@Param('id') id: string) {
    return this.queryBus.execute(new GetPostQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @ApiParam({ name: 'id', description: 'UUID bài viết' })
  @ApiZodBody(UpdatePostSchema, 'Thông tin bài viết cần cập nhật')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePostSchema)) body: UpdatePostDto,
  ) {
    return this.commandBus.execute(new UpdatePostCommand(id, body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá bài viết (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID bài viết' })
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new SoftDeletePostCommand(id));
  }
}

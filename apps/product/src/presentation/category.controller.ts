import {
  Controller,
  Get,
  Post,
  Patch,
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
import {
  CreateCategorySchema,
  CreateCategoryDto,
} from './dto/create-category.dto';
import {
  UpdateCategorySchema,
  UpdateCategoryDto,
} from './dto/update-category.dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { ApiZodBody } from './decorators/api-zod-body.decorator';
import { CreateCategoryCommand } from '../application/commands/create-category.command';
import { UpdateCategoryCommand } from '../application/commands/update-category.command';
import { GetCategoryQuery } from '../application/queries/get-category.query';
import { ListCategoriesQuery } from '../application/queries/list-categories.query';
import { FindCategoryChildrenQuery } from '../application/queries/find-category-children.query';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  @ApiZodBody(CreateCategorySchema, 'Thông tin danh mục cần tạo')
  @ApiResponse({ status: 201, description: 'Danh mục đã được tạo' })
  create(
    @Body(new ZodValidationPipe(CreateCategorySchema)) body: CreateCategoryDto,
  ) {
    return this.commandBus.execute(new CreateCategoryCommand(body));
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách danh mục' })
  @ApiQuery({
    name: 'onlyActive',
    required: false,
    type: Boolean,
    description: 'Chỉ lấy danh mục đang hoạt động',
  })
  findAll(@Query('onlyActive') onlyActive?: string) {
    return this.queryBus.execute(
      new ListCategoriesQuery(onlyActive === 'true'),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết danh mục' })
  @ApiParam({ name: 'id', description: 'UUID danh mục' })
  @ApiResponse({ status: 200, description: 'Thông tin danh mục' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  findById(@Param('id') id: string) {
    return this.queryBus.execute(new GetCategoryQuery(id));
  }

  @Get(':id/children')
  @ApiOperation({ summary: 'Danh mục con' })
  @ApiParam({ name: 'id', description: 'UUID danh mục cha' })
  findChildren(@Param('id') id: string) {
    return this.queryBus.execute(new FindCategoryChildrenQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  @ApiParam({ name: 'id', description: 'UUID danh mục' })
  @ApiZodBody(UpdateCategorySchema, 'Thông tin danh mục cần cập nhật')
  @ApiResponse({ status: 200, description: 'Danh mục đã được cập nhật' })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCategorySchema)) body: UpdateCategoryDto,
  ) {
    return this.commandBus.execute(new UpdateCategoryCommand(id, body));
  }
}

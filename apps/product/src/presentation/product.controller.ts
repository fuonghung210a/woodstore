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
import { CreateProductSchema, CreateProductDto } from './dto/create-product.dto';
import { UpdateProductSchema, UpdateProductDto } from './dto/update-product.dto';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { ApiZodBody } from './decorators/api-zod-body.decorator';
import { CreateProductCommand } from '../application/commands/create-product.command';
import { UpdateProductCommand } from '../application/commands/update-product.command';
import { SoftDeleteProductCommand } from '../application/commands/soft-delete-product.command';
import { GetProductQuery } from '../application/queries/get-product.query';
import { ListProductsQuery } from '../application/queries/list-products.query';
import { FindFeaturedProductsQuery } from '../application/queries/find-featured-products.query';
import { SearchProductsByWoodSpeciesQuery } from '../application/queries/search-products-by-wood-species.query';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  @ApiZodBody(CreateProductSchema, 'Thông tin sản phẩm cần tạo')
  @ApiResponse({ status: 201, description: 'Sản phẩm đã được tạo' })
  create(
    @Body(new ZodValidationPipe(CreateProductSchema)) body: CreateProductDto,
  ) {
    return this.commandBus.execute(new CreateProductCommand(body));
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách sản phẩm' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.queryBus.execute(
      new ListProductsQuery(
        {},
        { page: Number(page) || 1, limit: Number(limit) || 20 },
      ),
    );
  }

  @Get('featured')
  @ApiOperation({ summary: 'Sản phẩm nổi bật' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findFeatured(@Query('limit') limit?: string) {
    return this.queryBus.execute(
      new FindFeaturedProductsQuery(limit ? Number(limit) : 10),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  @ApiParam({ name: 'id', description: 'UUID sản phẩm' })
  @ApiResponse({ status: 200, description: 'Thông tin sản phẩm' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  findById(@Param('id') id: string) {
    return this.queryBus.execute(new GetProductQuery(id));
  }

  @Get('by-wood/:species')
  @ApiOperation({ summary: 'Tìm theo loại gỗ' })
  @ApiParam({ name: 'species', description: 'Loại gỗ (HUONG, TRAC, MUN, ...)' })
  findByWoodSpecies(@Param('species') species: string) {
    return this.queryBus.execute(
      new SearchProductsByWoodSpeciesQuery(species),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @ApiParam({ name: 'id', description: 'UUID sản phẩm' })
  @ApiZodBody(UpdateProductSchema, 'Thông tin sản phẩm cần cập nhật')
  @ApiResponse({ status: 200, description: 'Sản phẩm đã được cập nhật' })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateProductSchema)) body: UpdateProductDto,
  ) {
    return this.commandBus.execute(new UpdateProductCommand(id, body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xoá sản phẩm (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID sản phẩm' })
  @ApiResponse({ status: 200, description: 'Sản phẩm đã được xoá' })
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new SoftDeleteProductCommand(id));
  }
}

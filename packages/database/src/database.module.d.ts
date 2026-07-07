import { DynamicModule } from '@nestjs/common';
import { DbConfig } from './types';
export declare class DatabaseModule {
    static forRoot(config: DbConfig): DynamicModule;
}

import { Module } from '@nestjs/common';
import { AdminModule as AdminJSModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { PrismaService } from '@woodshop/database';

// Kết nối AdminJS với Prisma
AdminJS.registerAdapter({ Database, Resource });

/**
 * @adminjs/prisma@3 được viết cho Prisma 4 (dùng client._baseDmmf).
 * Prisma 5 thay bằng _runtimeDataModel — cấu trúc gần giống, chỉ thiếu
 * `_baseDmmf` và model.name. Patch thủ công cho tương thích.
 */
function patchPrismaForAdminJS(prisma: PrismaService) {
  const anyPrisma = prisma as any;

  // Prisma 5 không còn _baseDmmf (API Prisma 4) — dựng lại từ _runtimeDataModel
  if (!anyPrisma._baseDmmf && anyPrisma._runtimeDataModel) {
    const { models, enums } = anyPrisma._runtimeDataModel;

    // Models trong Prisma 5 thiếu `name` — thêm từ key của map
    const modelMap: Record<string, unknown> = {};
    for (const [key, model] of Object.entries<any>(models ?? {})) {
      modelMap[key] = { ...model, name: key };
    }

    anyPrisma._baseDmmf = {
      modelMap,
      datamodelEnumMap: enums,
    };
  }

  return anyPrisma._baseDmmf.modelMap;
}

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || 'admin@woodshop.com',
  password: process.env.ADMIN_PASSWORD || 'woodshop123',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve({ email });
  }
  return null;
};

@Module({
  imports: [
    AdminJSModule.createAdminAsync({
      useFactory: (prisma: PrismaService) => {
        const modelMap = patchPrismaForAdminJS(prisma);

        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: { model: modelMap.Product, client: prisma },
                options: {
                  properties: {
                    price: { type: 'number' },
                    lengthCm: { type: 'number' },
                    widthCm: { type: 'number' },
                    heightCm: { type: 'number' },
                    weightKg: { type: 'number' },
                  },
                },
              },
              { resource: { model: modelMap.Category, client: prisma } },
              { resource: { model: modelMap.Post, client: prisma } },
            ],
          },
          auth: {
            authenticate,
            cookieName: 'woodshop_admin',
            cookiePassword:
              process.env.ADMIN_COOKIE_SECRET || 'woodshop-cookie-secret',
          },
        };
      },
      inject: [PrismaService],
    }),
  ],
})
export class AdminPanelModule {}

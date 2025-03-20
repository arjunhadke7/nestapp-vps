import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';

import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    VisitsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminsSchema } from './admins.model';

@Module({
  exports: [AdminsService],
  imports: [MongooseModule.forFeature([{ name: 'Admin', schema: AdminsSchema }])],
  controllers: [AdminsController],
  providers: [AdminsService]
})
export class AdminsModule {}

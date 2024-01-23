import { Module } from '@nestjs/common';
import { CrudController } from './crud.controller';
import { CrudService } from './crud.service';
import { AddWizard } from './wizards/add.wizard';
import { GeneratePostNumberWizard } from './wizards/generatePostNumber.wizard';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [],
  imports: [UsersModule],
  providers: [CrudService, CrudController, AddWizard, GeneratePostNumberWizard],
})
export class CrudModule {}

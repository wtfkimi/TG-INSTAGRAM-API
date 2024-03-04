import { Module } from '@nestjs/common';
import { CrudController } from './crud.controller';
import { CrudService } from './crud.service';
import { AddWizard } from './wizards/add.wizard';
import { GeneratePostNumberWizard } from './wizards/generatePostNumber.wizard';
import { UsersModule } from '../users/users.module';
import { AccountsModule } from '../accounts/accounts.module';
import { SendMessageToChannelWizard } from './wizards/sendMessageToChannel.wizard';

@Module({
  controllers: [],
  imports: [UsersModule, AccountsModule],
  providers: [CrudService, CrudController, AddWizard, GeneratePostNumberWizard, SendMessageToChannelWizard],
})
export class CrudModule {}

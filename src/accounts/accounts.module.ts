import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsSchema } from './accounts.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Account', schema: AccountsSchema }])],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService]
})
export class AccountsModule {}

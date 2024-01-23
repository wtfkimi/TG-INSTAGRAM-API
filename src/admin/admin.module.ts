import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AccountsModule } from '../accounts/accounts.module';
import { AddAccountWizard } from './wizards/addAccount.wizard';
import { AdminsModule } from '../admins/admins.module';
import { DeleteAccountWizard } from './wizards/deleteAccount.wizard';
import { InsertAdminDbAccWizard } from './wizards/insertAdminDbAcc.wizard';
import { RemoveAdminDbAccWizard } from './wizards/removeAdminDbAcc';

@Module({
  controllers: [],
  imports: [AccountsModule, AdminsModule],
  providers: [AdminService, AdminController, AddAccountWizard, DeleteAccountWizard, InsertAdminDbAccWizard, RemoveAdminDbAccWizard],
})
export class AdminModule {}

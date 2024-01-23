import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { Accounts } from '../../accounts/accounts.model';
import { AdminService } from '../admin.service';


@Wizard('removeAdminDbAcc')
export class RemoveAdminDbAccWizard {


  constructor(private readonly adminService: AdminService) {
  }
  @WizardStep(0)
  async enterNameAccount(@Ctx() ctx: Scenes.WizardContext) {
    if (!ctx.state.isAdmin) {
      return;
    }
    await ctx.reply('🧑‍💻 <i>Write username of admin</i>', {parse_mode: 'HTML'});
    ctx.wizard.next();
  }

  @WizardStep(1)
  async addAccountsToDb(@Ctx() ctx: Scenes.WizardContext) {
    if (!ctx.message) {
      await ctx.reply('❌ <i>ERROR: please write correct username. Repeat action "Delete admin in database" to correct delete</i>',);
    }
    let username = ctx.message['text'];
    await this.adminService.removeAdminDbAcc(ctx, true, username);
    await ctx.scene.leave();
  }
}
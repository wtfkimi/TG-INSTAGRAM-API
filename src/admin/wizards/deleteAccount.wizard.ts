import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { Accounts } from '../../accounts/accounts.model';
import { AdminService } from '../admin.service';

@Wizard('rmDbAcc')
export class DeleteAccountWizard {
  constructor(private readonly adminService: AdminService) {}
  @WizardStep(0)
  async enterNameAccount(@Ctx() ctx: Scenes.WizardContext) {
    if (!ctx.state.isAdmin) {
      return;
    }
    await ctx.reply('🧑‍💻 <i>Write username of account</i>', {
      parse_mode: 'HTML',
    });
    ctx.wizard.next();
  }

  @WizardStep(1)
  async addAccountsToDb(@Ctx() ctx: Scenes.WizardContext) {
    if (!ctx.message) {
      await ctx.reply(
        '❌ <i>ERROR: please write correct accounts. Repeat action "Delete accounts to database" to correct accounts</i>',
      );
    }
    let account = ctx.message['text'];
    await this.adminService.deleteDbAcc(ctx, account);
    await ctx.scene.leave();
  }
}

import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { Accounts } from '../../accounts/accounts.model';
import { AdminService } from '../admin.service';


@Wizard('insertAdminDbAcc')
export class InsertAdminDbAccWizard {


  constructor(private readonly adminService: AdminService) {
  }

  username: string;
  userId: string;
  @WizardStep(0)
  async enterNameAccount(@Ctx() ctx: Scenes.WizardContext) {
    if (!ctx.state.isAdmin) {
      return;
    }
    await ctx.reply('🧑‍💻 <i>Write username of admin</i>', {parse_mode: 'HTML'});
    ctx.wizard.next();
  }

  @WizardStep(1)
  async enterUserId(@Ctx() ctx: Scenes.WizardContext) {
    if (!ctx.message) {
      await ctx.reply('❌ <i>ERROR: please write correct username. Repeat action "Insert admin in database" to correct insert</i>',);
    }
    this.username = ctx.message['text'];
    await ctx.reply('🧑‍💻 <i>Write user id of admin</i>', {parse_mode: 'HTML'});
    ctx.wizard.next();
  }
  @WizardStep(2)
  async insertAdminToDb(@Ctx() ctx: Scenes.WizardContext) {
    if (!ctx.message) {
      await ctx.reply('❌ <i>ERROR: please write correct accounts. Repeat action "Delete accounts to database" to correct accounts</i>',);
    }
    this.userId = ctx.message['text'];
    await this.adminService.insertAdminDbAcc(ctx, true, this.username, this.userId);
    await ctx.scene.leave();
  }
}
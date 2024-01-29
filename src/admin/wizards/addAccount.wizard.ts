import { Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { Accounts } from '../../accounts/accounts.model';
import { AdminService } from '../admin.service';

@Wizard('addDbAcc')
export class AddAccountWizard {
  constructor(private readonly adminService: AdminService) {}
  @WizardStep(0)
  async enterAccount(@Ctx() ctx: Scenes.WizardContext) {
    if (!ctx.state.isAdmin) {
      return;
    }
    await ctx.reply(
      '<i>If you want add only one account, please use this format:</i>',
      { parse_mode: 'HTML' },
    );
    await ctx.reply(
      '```\n{"username": "nameOfInstAccount", "password": "admin", "proxy": "http://77.47.247.254:51523"}```',
      { parse_mode: 'MarkdownV2' },
    );
    await ctx.reply(
      '<i>If you want add bulk accounts, please use this format:</i>',
      { parse_mode: 'HTML' },
    );
    await ctx.reply(
      '```\n{"bulk": "true", "accounts": [{"username": "nameOfInstAccount", "password": "admin", "proxy": "http://77.47.247.254:51523"}]}```',
      { parse_mode: 'MarkdownV2' },
    );
    ctx.wizard.next();
  }

  @WizardStep(1)
  async addAccountsToDb(@Ctx() ctx: Scenes.WizardContext) {
    if (!ctx.message) {
      await ctx.reply(
        '❌ <i>ERROR: please write correct accounts. Repeat action "Add accounts to database" to correct accounts</i>',
      );
    }
    let accounts = ctx.message['text'];
    let json;
    try {
      json = JSON.parse(accounts);
    } catch (e) {
      await ctx.reply(
        '❌ <i>ERROR: impossible to parse json, please past code as Above</i>',
        { parse_mode: 'HTML' },
      );
      await ctx.scene.leave();
    }
    if (json.bulk) {
      const acs = json['accounts'] as Accounts[];
      let acsNew: Accounts[] = [];
      for (let acc of acs) {
        if (!acc.username || !acc.password || !acc.proxy) {
          await ctx.reply(
            '❌ <i>ERROR: please write correct accounts. Repeat action "Add accounts to database" to correct accounts</i>',
          );
        }
        acsNew.push({
          username: acc.username,
          password: acc.password,
          proxy: acc.proxy,
          status: 'working',
        });
      }
      await this.adminService.addDbAccBulk(ctx, acsNew);
    } else {
      if (!json.username || !json.password || !json.proxy) {
        await ctx.reply(
          '❌ <i>ERROR: please write correct accounts. Repeat action "Add accounts to database" to correct accounts</i>',
        );
      }
      await this.adminService.addDbAcc(ctx, json);
    }

    await ctx.scene.leave();
  }
}

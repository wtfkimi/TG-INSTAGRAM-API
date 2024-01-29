import { Injectable } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import {
  loginAdminInlineKeyboard,
} from '../keyboards/inline_keyboards';
import { Accounts } from '../accounts/accounts.model';
import { AdminsService } from '../admins/admins.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly accountService: AccountsService,
    private readonly adminsService: AdminsService,
  ) {}

  async getDbAcc(@Ctx() ctx: Context, isAdmin: boolean) {
    if (!isAdmin) {
      await ctx.answerCbQuery();
      return;
    }
    const accounts = await this.accountService.getAllAccounts();
    if (accounts.length > 0) {
      for (let acc of accounts) {
        await ctx.reply(
          `📇 <i>Username: ${acc.username}</i>\n🔑 <i>Password: ${acc.password}</i>\n🌐 <i>Proxy: ${acc.proxy}</i>\n🔋 <i>Status: ${acc.status}</i>`,
          { parse_mode: 'HTML' },
        );
      }
      await ctx.answerCbQuery();
    } else {
      await ctx.reply('❌ <i>ERROR: accounts not found</i>', {
        parse_mode: 'HTML',
      });
      await ctx.answerCbQuery();
    }
  }

  async addDbAcc(@Ctx() ctx: Context, acc: Accounts) {
    await this.accountService.insertAccount(acc);
    await this.getDbAcc(ctx, true);
  }

  async addDbAccBulk(@Ctx() ctx: Context, acc: Accounts[]) {
    await this.accountService.insertAccountBulk(acc);
    await ctx.reply('✅ <i>Accounts added to database</i>', {
      parse_mode: 'HTML',
    });
  }

  async deleteDbAcc(@Ctx() ctx: Context, username: string) {
    const account = await this.accountService.deleteAccountByUsername(username);
    if (account === null) {
      await ctx.reply('❌ <i>ERROR: account not found</i>', {
        parse_mode: 'HTML',
      });
      return;
    }
    await ctx.reply(`✅ <i>Account ${account} deleted from database</i>`, {
      parse_mode: 'HTML',
    });
  }

  async show(@Ctx() ctx: Context, isAdmin: boolean) {
    if (!isAdmin) {
      return;
    }
    await ctx.replyWithPhoto({
      source:
        'C:\\Users\\v.bondariev\\WebstormProjects\\TG-INST\\inst-tg-project\\src\\img\\admin-sticker.png',
    });
    await ctx.reply(
      `✅ <b>You are logged in: ${ctx.message.from.username}</b>`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: loginAdminInlineKeyboard,
        },
      },
    );
  }

  async insertAdminDbAcc(
    @Ctx() ctx: Context,
    isAdmin: boolean,
    username: string,
    userId: string,
  ) {
    if (!isAdmin) {
      return;
    }
    const added = await this.adminsService.insertAdmin(username, userId);
    if (added === 'already added') {
      await ctx.reply('🧑‍💻 <i>Admin already added</i>', { parse_mode: 'HTML' });
    }
    await ctx.reply('🧑‍💻 <i>Admin successfully added</i>', {
      parse_mode: 'HTML',
    });
  }

  async removeAdminDbAcc(
    @Ctx() ctx: Context,
    isAdmin: boolean,
    username: string,
  ) {
    if (!isAdmin) {
      return;
    }
    const isFound = await this.adminsService.deleteAdminByUsername(username);
    if (!isFound) {
      await ctx.reply('🧑‍💻 <i>Admin not found</i>', { parse_mode: 'HTML' });
    }
    await ctx.reply('🧑‍💻 <i>Admin successfully removed</i>', {
      parse_mode: 'HTML',
    });
  }
}

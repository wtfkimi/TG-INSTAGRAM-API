import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { Context as Ctx, InjectBot } from 'nestjs-telegraf';
import { serviceButtons } from '../app.buttons';
import { generateRegisteredUsersKeyboard, loginInlineKeyboard } from '../keyboards/inline_keyboards';

@Injectable()
export class LoginService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {

  }

  async show(@Ctx() ctx: Context): Promise<void> {
    await ctx.replyWithPhoto({
      source:
        'C:\\Users\\v.bondariev\\WebstormProjects\\TG-INST\\inst-tg-project\\src\\img\\telegram_logo_instagram.png',
    });
    await ctx.reply(
      `✅ <b>You are logged in: ${ctx.message.from.username}</b>`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: loginInlineKeyboard,
        },
      },
    );
  }

  //-4164807109 - ADMINS-TELEGRAM
  async userWantRegister(@Ctx() ctx: Context): Promise<void> {
    await this.bot.telegram.sendMessage('-4164807109', '<b>👋 New user want to register</b>', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: generateRegisteredUsersKeyboard(ctx.message.from.username, String(ctx.message.from.id))
      }
    })
  }
}

import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { Context as Ctx, InjectBot } from 'nestjs-telegraf';
import { generateRegisteredUsersKeyboard, loginInlineKeyboard } from '../keyboards/inline_keyboards';

@Injectable()
export class LoginService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {

  }

  async show(@Ctx() ctx: Context, registrationSent: boolean = false, userId?: number | string): Promise<void> {
    if (registrationSent && userId) {
      await this.bot.telegram.sendPhoto(userId, {
        source:
          '',
      });
      await this.bot.telegram.sendMessage(userId, '✅ <b>You are logged in</b>', {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: loginInlineKeyboard
        }
      });
    }else {
      await ctx.replyWithPhoto({
        source:
          '',
      });
      await ctx.reply(
        `✅ <b>You are logged in</b>`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: loginInlineKeyboard,
          },
        },
      );
    }

  }

  async userWantRegister(@Ctx() ctx: Context): Promise<void> {
    await this.bot.telegram.sendMessage('-4164807109', '<b>👋 New user want to register</b>', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: generateRegisteredUsersKeyboard(ctx.message.from.username, String(ctx.message.from.id))
      }
    })
  }

}

import { Wizard, WizardStep, Context as Ctx } from 'nestjs-telegraf';
import { Scenes } from 'telegraf';
import { LoginService } from './login.service';
import { loginInlineKeyboard } from '../keyboards/inline_keyboards';

@Wizard('login')
export class LoginWizard {
  private username: string;
  private password: string;
  constructor(private readonly loginService: LoginService) {}
  @WizardStep(0)
  async enterLogin(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply('👨‍💻 <i>Enter your login</i>', { parse_mode: 'HTML' });
    ctx.wizard.next();
  }

  @WizardStep(1)
  async saveLogin(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.reply('🔐 <b>Enter your password</b>', { parse_mode: 'HTML' });
    if (ctx.message) {
      this.username = ctx.message['text'];
    } else {
      await ctx.reply(
        '❌ <i>ERROR: please write correct login. Repeat action "Login" to correct login</i>',
        { parse_mode: 'HTML' },
      );
      await ctx.scene.leave();
    }
    ctx.wizard.next();
  }

  @WizardStep(2)
  async savePasswordAndValidate(@Ctx() ctx: Scenes.WizardContext) {
    this.password = ctx.message['text'];
    if (this.username == 'admin' && this.password == 'admin') {
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
      // await this.loginService.show(ctx)
      await ctx.scene.leave();
    } else {
      await ctx.reply('❌ <b>Wrong login or password</b>', {
        parse_mode: 'HTML',
      });
      await ctx.scene.reenter();
    }
  }
}

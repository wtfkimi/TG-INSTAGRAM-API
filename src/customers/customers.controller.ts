import { Action, Ctx, InjectBot, Update } from 'nestjs-telegraf';
import { CustomersService } from './customers.service';
import { Context, Telegraf } from 'telegraf';
import { LoginService } from '../login/login.service';

@Update()
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly loginService: LoginService,
    @InjectBot() private readonly bot: Telegraf<Context>
  ) {}


  @Action(/\/acceptRegistration(.+)/)
  async acceptRegistration(@Ctx() ctx: Context) {
    const callbackData = ctx.callbackQuery['data'] as String;
    const id = callbackData.match(/\/username:(\w+)\/userId:(\d+)/)[2];
    const userCanBeRegister = await this.customersService.changeStatusWorked(id);
    if (userCanBeRegister) {
      await this.bot.telegram.sendMessage(id, '✅ <b>Your request is accepted.</b>', {'parse_mode': 'HTML'});
      await this.loginService.show(ctx, true, id);
      await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
      await ctx.replyWithHTML('✅ <b>User is registered and added to db</b>');
    }
  }

  @Action(/\/rejectRegistration(.+)/)
  async rejectRegistration(@Ctx() ctx: Context) {
    const id = ctx.from.id;
    await this.customersService.deleteUserById(id.toString());
    await this.bot.telegram.sendMessage(id, '❌ <b>Your request is rejected.</b>', {'parse_mode': 'HTML'});
  }
}

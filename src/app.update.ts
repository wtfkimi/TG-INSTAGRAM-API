import { AppService } from './app.service';
import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Scenes, Telegraf } from 'telegraf';
import { LoginService } from './login/login.service';
import { AdminsService } from './admins/admins.service';
import { CustomersService } from './customers/customers.service';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
    private readonly loginService: LoginService,
    private readonly adminsService: AdminsService,
    private readonly customersService: CustomersService,
  ) {}

  @Start()
  async startCommand(ctx: Scenes.SceneContext) {
    await ctx.replyWithHTML(
      `<b>👋 Hello <i>${ctx.message.from.username ? ctx.message.from.username : "user who didn't set username"}</i></b>`,
    );
    const statusUser = await this.customersService.getCustomerStatusByUserId(String(ctx.message.from.id));
    if (statusUser === 'QUEUE') {
      await ctx.replyWithHTML('<b> 🔜 <i>Your request is in queue, wait for approve</i></b>');
    }else {
      if (statusUser === 'WORKED') {
        await this.loginService.show(ctx)
      }else {
        await this.customersService.insertCustomer({username: ctx.message.from.username, userId: String(ctx.message.from.id), status: 'QUEUE'});
        await this.loginService.userWantRegister(ctx);
        await ctx.replyWithHTML(
          `<b>⌛ <i>You are not registered user, request to register sent to admins</i></b>`,
        );
      }
    }
  }
}

import { AppService } from './app.service';
import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Scenes, Telegraf } from 'telegraf';
import { LoginService } from './login/login.service';
import { AdminsService } from './admins/admins.service';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
    private readonly loginService: LoginService,
    private readonly adminsService: AdminsService,
  ) {}

  @Start()
  async startCommand(ctx: Scenes.SceneContext) {
    await ctx.replyWithHTML(
      `<b>👋 Hello <i>${ctx.message.from.username ? ctx.message.from.username : "user who didn't set username"}</i></b>`,
    );
    const isAdmin = await this.adminsService.isAdmin(ctx.message.from.username, String(ctx.message.from.id))

    if (isAdmin) {
      await this.loginService.show(ctx)
    }else {
      await this.loginService.userWantRegister(ctx);
      await ctx.replyWithHTML(
        `<b>👋 You are not registered user, request to register sent to admins</i></b>`,
      );
    }
  }
}

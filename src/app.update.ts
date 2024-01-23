import { AppService } from './app.service';
import { InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Scenes, Telegraf } from 'telegraf';
import { LoginService } from './login/login.service';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
    login: LoginService,
  ) {}

  @Start()
  async startCommand(ctx: Scenes.SceneContext) {
    await ctx.replyWithHTML(
      `<b>👋 Hello <i>${ctx.message.from.username ? ctx.message.from.username : "user who didn't set username"}</i></b>`,
    );
    await ctx.scene.enter('login');
  }
}

import { InjectBot, Update, Ctx, Action } from 'nestjs-telegraf';
import { CrudService } from './crud.service';
import { Context, Scenes, Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';

@Update()
export class CrudController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    readonly crudService: CrudService,
    readonly usersService: UsersService,
  ) {}

  @Action('/add')
  async add(ctx: Scenes.SceneContext) {
    await ctx.scene.enter('/add');
  }

  @Action('/show')
  async show(@Ctx() ctx: Context) {
    await this.crudService.showProfiles(ctx);
  }

  @Action(/\/profile(.+)/)
  async onProfileActionShow(ctx: Context) {
    const callbackData = ctx.callbackQuery['data'] as String;
    const name = callbackData.match(/\/profile(.+)/)[1];
    await this.crudService.onProfileActionShow(ctx, name);
  }

  @Action(/\/delete(.+)/)
  async delete(@Ctx() ctx: Context) {
    const callbackData = ctx.callbackQuery['data'] as String;
    const name = callbackData.match(/\/delete(.+)/)[1];
    await this.crudService.deleteProfile(ctx, name);
  }

  @Action(/\/generatePost(.+)/)
  async generatePost(@Ctx() ctx: Context) {
    const callbackData = ctx.callbackQuery['data'] as String;
    const name = callbackData.match(/\/generatePost(.+)/)[1];
    const isUserInData = await this.usersService.getUserByUsername(name);
    if (isUserInData === null) {
      await this.crudService.sendMessageUserNotInData(ctx);
      return false;
    } else {
      await this.crudService.generatePost(ctx, name);
    }
  }

  @Action(/\/postNumber(.+)/)
  async generatePostNumber(@Ctx() ctx: Scenes.SceneContext) {
    const callbackData = ctx.callbackQuery['data'] as String;
    const name = callbackData.match(/\/postNumber(.+)/)[1];
    const isUserInData = await this.usersService.getUserByUsername(name);
    if (isUserInData === null) {
      await this.crudService.sendMessageUserNotInData(ctx);
      return false;
    } else {
      ctx.scene.state['name'] = name;
      await ctx.scene.enter('/postNumber');
    }
  }

  @Action('/channelMsg')
  async channelMsg(@Ctx() ctx: Context) {
    console.log(ctx.update);
    await this.bot.telegram.sendMessage('-1002069053046', 'test message');
  }
}

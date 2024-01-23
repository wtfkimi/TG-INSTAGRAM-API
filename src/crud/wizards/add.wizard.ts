import { Wizard, WizardStep } from 'nestjs-telegraf';
import { CrudService } from '../crud.service';
import { Context as Ctx } from 'nestjs-telegraf/dist/decorators/params/context.decorator';
import { Scenes } from 'telegraf';
import { loginInlineKeyboard } from '../../keyboards/inline_keyboards';

@Wizard('/add')
export class AddWizard {
  constructor(private readonly crudService: CrudService) {}
  name: string;
  @WizardStep(0)
  async enterNameInstagram(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.answerCbQuery(); // ��������� ������� ������;
    await ctx.reply(
      '📷 <i>Please enter name of instagram account like "@end1fromearth"</i>',
      { parse_mode: 'HTML' },
    );
    ctx.wizard.next();
    // await ctx.scene.leave();
    // await ctx.scene.reenter();
  }
  @WizardStep(1)
  async checkInstagramName(@Ctx() ctx: Scenes.WizardContext) {
    if (ctx.message) {
      let instagramName = ctx.message['text'];
      await ctx.reply(
        '📇 <i>Please enter channelId like "Chat id: -1002069053046"</i>',
        { parse_mode: 'HTML' },
      );
      this.name = instagramName;
      ctx.wizard.next();
    } else {
      await ctx.reply(
        '☹️ <i>ERROR: please write correct instagram name. Repeat action "Add instagram name" to correct adding of the name</i>',
        { parse_mode: 'HTML' },
      );
      await ctx.scene.leave();
    }
  }

  @WizardStep(2)
  async addInstagramName(@Ctx() ctx: Scenes.WizardContext) {
    const regex = /^-\d{13}$/;
    if (ctx.message && regex.test(ctx.message['text'])) {
      let channelId = ctx.message['text'];
      await this.crudService.checkNameInstagramAndAdd(
        this.name,
        channelId,
        ctx,
      );
      await ctx.scene.leave();
    } else {
      await ctx.reply(
        '✖️<i>Please enter channelId like "Chat id: -1002069053046", repeat action on "Add instagram name"</i>',
        { parse_mode: 'HTML' },
      );
      await ctx.scene.leave();
    }
  }
}

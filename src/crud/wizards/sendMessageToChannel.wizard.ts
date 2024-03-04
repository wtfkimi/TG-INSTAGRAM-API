import { Wizard, WizardStep } from 'nestjs-telegraf';
import { CrudService } from '../crud.service';
import { Context as Ctx } from 'nestjs-telegraf/dist/decorators/params/context.decorator';
import { Scenes } from 'telegraf';

@Wizard('/sendPostToGroup')
export class SendMessageToChannelWizard {
  constructor(private readonly crudService: CrudService) {}
  name: string;
  groupId: string
  @WizardStep(0)
  async enterNameInstagram(@Ctx() ctx: Scenes.WizardContext) {
    await ctx.answerCbQuery(); // обработка нажатия кнопки;
    this.name = ctx['match'][1];
    this.groupId = ctx.scene.session['group']
    await ctx.reply('👨‍💻 <i>Please enter post number of instagram account</i>', {
      parse_mode: 'HTML',
    });
    ctx.wizard.next();
  }
  @WizardStep(1)
  async checkInstagramName(@Ctx() ctx: Scenes.WizardContext) {
    if (ctx.message) {
      if (
        ctx.message['text'].startsWith('0') &&
        isNaN(Number(ctx.message['text']))
      ) {
        await ctx.replyWithHTML(
          '❌ <i>ERROR: please write correct post number. Repeat action "Generate post by number" if you want correct generated post</i>',
        );
        await ctx.scene.leave();
      } else {
        await this.crudService.generatePost(
          ctx,
          this.name,
          Number(ctx.message['text']),
          false,
          true,
          this.groupId
        );
        await ctx.scene.leave();
      }
    } else {
      await ctx.reply(
        '❌ <i>ERROR: please write correct instagram name. Repeat action "Add instagram name" to correct adding of the name</i>',
        { parse_mode: 'HTML' },
      );
      await ctx.scene.leave();
    }
  }
}

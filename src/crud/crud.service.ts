import { Injectable } from '@nestjs/common';
import { Instagram } from '../instagram/Instagram';
import { Context } from 'telegraf';
import { Context as Ctx } from 'nestjs-telegraf';
import {
  generateKeyboardNames,
  userAddedKeyboard,
} from '../keyboards/inline_keyboards';
import { UserFeedResponseItemsItem } from 'instagram-private-api';
import { PostProcessing } from '../instagram/PostProcessing';

const LOGIN_ERROR = 'ERROR WHILE LOGIN';
const NO_PICTURE = 'NO_PICTURE';
const NO_POSTS = 'NO_POSTS';

@Injectable()
export class CrudService {
  data: string[] = ['end1fromearth', 'iaroslavskuka'];

  async checkNameInstagramAndAdd(instagramName: string, @Ctx() ctx: Context) {
    Instagram.generateState('tr14.88');
    const user = await Instagram.login('tr14.88', '081917vLl*');

    if (user === 'ERROR WHILE LOGIN') {
      await ctx.replyWithHTML('❌ <i>ERROR WHILE LOGIN</i>');
      return;
    }
    const userSearchedPK = await Instagram.searchUser(
      instagramName.replace('@', ''),
    );

    if (userSearchedPK === 'ERROR WHILE SEARCHING USER') {
      await ctx.replyWithHTML('❌ <i>ERROR WHILE SEARCHING USER</i>');
      return;
    }

    if (userSearchedPK === 'ERROR_PRIVATE') {
      await ctx.replyWithHTML('❌ <i>ERROR: USER IS PRIVATE</i>');
      return;
    }

    this.data.push(userSearchedPK.username);
    await ctx.replyWithHTML(`✅ <i>USER FOUND ${userSearchedPK.username}</i>`);
  }

  async showProfiles(@Ctx() ctx: Context): Promise<void> {
    if (this.data.length === 0) {
      await ctx.replyWithHTML(
        '❌ <i>ERROR WHILE GETTING NAMES, PLEASE ADD NAMES</i>',
      );
      await ctx.answerCbQuery();
      return;
    }
    const keyboards = generateKeyboardNames(this.data);
    await ctx.replyWithPhoto({
      source:
        'C:\\Users\\v.bondariev\\WebstormProjects\\TG-INST\\inst-tg-project\\src\\img\\users.png',
    });
    await ctx.reply('<i>Users</i>', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboards,
      },
    });
    await ctx.answerCbQuery();
  }

  async onProfileActionShow(ctx: Context, name: string) {
    await ctx.sendChatAction('typing');

    if (this.data.indexOf(name) === -1) {
      return await this.replyAndAnswer(
        ctx,
        '<i>🚫User not found, please get all users again</i>',
      );
    }

    Instagram.generateState('tr14.88');
    const user = await Instagram.login('tr14.88', '081917vLl*');

    if (user === LOGIN_ERROR) {
      return await this.replyAndAnswer(ctx, '❌ <i>ERROR WHILE LOGIN</i>');
    }

    const link = await Instagram.getImageProfile(name);

    if (link === NO_PICTURE) {
      return await this.replyAndAnswer(
        ctx,
        '❌ <i>ERROR WHILE GETTING PICTURE</i>',
      );
    }

    await ctx.replyWithPhoto(`${link}`);
    await ctx.reply(`<i><b>${name}</b></i>`, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: userAddedKeyboard(name),
      },
    });
    await ctx.answerCbQuery();
  }

  // Extracted repeated code into a method, this improves maintainability and readability
  private async replyAndAnswer(
    ctx: Context,
    message: string,
    needAnswerForCbQuery: boolean = true,
  ) {
    await ctx.replyWithHTML(message);
    if (needAnswerForCbQuery) {
      return await ctx.answerCbQuery();
    }
  }

  async deleteProfile(ctx: Context, name: string) {
    const index = this.data.indexOf(name);
    if (index > -1) {
      this.data.splice(index, 1);
      await ctx.replyWithHTML(
        `✅ <i>USER ${name} DELETED. Get names instagram again</i>`,
      );
      await ctx.answerCbQuery();
    } else {
      await ctx.replyWithHTML(
        '❌ <i>ERROR WHILE DELETING, USER ALREADY DELETED</i>',
      );
      await ctx.answerCbQuery();
    }
  }

  async generatePost(
    ctx: Context,
    name: string,
    postNumber: number = 0,
    needAnswerForCbQuery: boolean = true,
  ) {
    await ctx.sendChatAction('typing');

    if (this.data.indexOf(name) === -1) {
      return await this.replyAndAnswer(
        ctx,
        '<i>🚫User not found, please get all users again</i>',
        needAnswerForCbQuery,
      );
    }

    Instagram.generateState('tr14.88');
    const user = await Instagram.login('tr14.88', '081917vLl*');

    if (user === LOGIN_ERROR) {
      return await this.replyAndAnswer(
        ctx,
        '❌ <i>ERROR WHILE LOGIN</i>',
        needAnswerForCbQuery,
      );
    }

    let post = await Instagram.getPost(name, postNumber);

    if (post === NO_POSTS) {
      return await this.replyAndAnswer(
        ctx,
        '❌ <i>ERROR WHILE GETTING POSTS</i>',
        needAnswerForCbQuery,
      );
    }

    post = post as UserFeedResponseItemsItem;

    const generatedPost = PostProcessing.generatePost(post);
    if (typeof generatedPost.photo !== 'string') {
      const photo = generatedPost.photo.reduce((acc, item) => {
        acc.push({ type: 'photo', media: item });
        return acc;
      }, []);
      photo[photo.length - 1] = {
        type: 'photo',
        media: photo[photo.length - 1].media,
        caption: `📅<b>${generatedPost.date}</b>\n🔥<i>${generatedPost.desc}</i>🔥`,
        parse_mode: 'HTML',
      };
      await ctx.replyWithMediaGroup(photo, {});
      if (needAnswerForCbQuery) {
        await ctx.answerCbQuery();
      }
    } else {
      await ctx.replyWithMediaGroup([
        {
          type: 'photo',
          media: generatedPost.photo,
          caption: `📅<b>${generatedPost.date}</b>\n🔥<i>${generatedPost.desc}</i>🔥`,
          parse_mode: 'HTML',
        },
      ]);
      if (needAnswerForCbQuery) {
        await ctx.answerCbQuery();
      }
    }
  }

  async checkUserInData(name: string) {
    return this.data.indexOf(name) > -1 ? 'USER_FOUND' : 'USER_NOT_FOUND';
  }

  async sendMessageUserNotInData(ctx: Context) {
    await ctx.replyWithHTML(
      '❌ <i>Probably user was deleted, press Get names instagram</i>',
    );
    await ctx.answerCbQuery();
  }
}

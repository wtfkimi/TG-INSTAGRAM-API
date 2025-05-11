import { Injectable } from '@nestjs/common';
import { Instagram } from '../instagram/Instagram';
import { Context, Telegraf } from 'telegraf';
import { Context as Ctx, InjectBot } from 'nestjs-telegraf';
import {
  generateKeyboardNames,
  userAddedKeyboard,
} from '../keyboards/inline_keyboards';
import { UserFeedResponseItemsItem } from 'instagram-private-api';
import { PostProcessing } from '../instagram/PostProcessing';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accounts.service';
import { Accounts } from '../accounts/accounts.model';

const LOGIN_ERROR = 'ERROR WHILE LOGIN';
const NO_PICTURE = 'NO_PICTURE';
const NO_POSTS = 'NO_POSTS';

@Injectable()
export class CrudService {
  data: string[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly accountService: AccountsService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async checkNameInstagramAndAdd(
    instagramName: string,
    channelId: string,
    @Ctx() ctx: Context,
  ) {
    const users = await this.usersService.getAllUsers();
    const include = users.map((user) => user.username).includes(instagramName);
    const includeChannel = users
      .map((user) => user.channel)
      .includes(channelId);
    if (include || includeChannel) {
      await ctx.replyWithHTML(
        '❌ <i>ERROR: USER ALREADY ADDED OR CHANNEL DUPLICATE</i>',
      );
      return;
    }
    const user = await this.improvedLoginToInstagram(ctx);

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

    await this.usersService.insertUser(instagramName, channelId);
    await ctx.replyWithHTML(
      `✅ <i>USER FOUND and ADDED ${userSearchedPK.username}</i>`,
    );
  }

  async showProfiles(@Ctx() ctx: Context): Promise<void> {
    const users = await this.usersService.getAllUsers();
    if (users.length === 0) {
      await ctx.replyWithHTML(
        '❌ <i>ERROR WHILE GETTING NAMES, PLEASE ADD NAMES</i>',
      );
      await ctx.answerCbQuery();
      return;
    }
    this.data = users.map((user) => user.username);
    const keyboards = generateKeyboardNames(this.data);
    this.data = [];
    await ctx.replyWithPhoto({
      source:
        '..',
    });
    await ctx.reply('<i>Users</i>', {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboards,
      },
    });
    await ctx.answerCbQuery();
  }

  async improvedLoginToInstagram(@Ctx() ctx: Context) {
    const acc = await this.tookAccountFromDb();
    let user;
    let quantityError = 0;
    if (acc.length === 0) {
      await ctx.replyWithHTML('❌ <i>ERROR WHILE LOGIN: NO ACCOUNTS</i>');
      return LOGIN_ERROR;
    }
    for (let account of acc) {
      Instagram.generateState(account.username);
      user = await Instagram.login(
        account.username,
        account.password,
        account.proxy,
      );
      if (user === LOGIN_ERROR) {
        await ctx.replyWithHTML('❌ <i>ERROR WHILE LOGIN</i>');
        await this.accountService.updateAccountStatus(
          account.username,
          'failed',
        );
        if (quantityError === 3) {
          await ctx.reply(
            '❌ <i>ERROR WHILE LOGIN: PROBLEM WITH INSTAGRAM ACCOUNT OR PROXY, PLEASE ADD NEW ACCOUNTS</i>',
          );
        }
        quantityError++;
      }
      if (user !== LOGIN_ERROR) {
        return user;
      }
    }
    return LOGIN_ERROR;
  }

  async onProfileActionShow(ctx: Context, name: string) {
    await ctx.sendChatAction('typing');

    const userExist = await this.usersService.getUserByUsername(name);
    if (userExist === null) {
      await this.sendMessageUserNotInData(ctx);
      return;
    }

    const user = await this.improvedLoginToInstagram(ctx);

    if (user === LOGIN_ERROR) {
      return await this.replyAndAnswer(ctx, '❌ <i>ERROR WHILE LOGIN</i>');
    }

    const link = await Instagram.getImageProfile(
      userExist.username.replace('@', ''),
    );

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
        inline_keyboard: userAddedKeyboard(userExist.username),
      },
    });
    await ctx.answerCbQuery();
  }

  // Extracted repeated code into a method, this improves maintainability and readability;
  private async replyAndAnswer(
    ctx: Context,
    message: string,
    needAnswerForCbQuery: boolean = true,
  ) {
    await ctx.replyWithHTML(message);
    if (needAnswerForCbQuery) {
      // return await ctx.answerCbQuery();
    }
  }

  async deleteProfile(ctx: Context, name: string) {
    const user = await this.usersService.getUserByUsername(name);
    if (user !== null) {
      await this.usersService.deleteUserByUsername(name);
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
    sendToGroup: boolean = false,
    groupId: string = ''
  ) {
    await ctx.sendChatAction('typing');
    const userExist = await this.usersService.getUserByUsername(name);
    if (userExist === null) {
      return await this.replyAndAnswer(
        ctx,
        '<i>🚫User not found, please get all users again</i>',
        needAnswerForCbQuery,
      );
    }

    const user = await this.improvedLoginToInstagram(ctx);
    if (user === LOGIN_ERROR) {
      return await this.replyAndAnswer(
        ctx,
        '❌ <i>ERROR WHILE LOGIN</i>',
        needAnswerForCbQuery,
      );
    }

    let post = await Instagram.getPost(name.replace('@', ''), postNumber);

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
      if (sendToGroup) {
        await this.bot.telegram.sendMediaGroup(groupId, [...photo]);
      }else {
        await ctx.replyWithMediaGroup(photo, {});
      }
      if (needAnswerForCbQuery) {
        await ctx.answerCbQuery();
      }
    } else {
      if (sendToGroup) {
        await this.bot.telegram.sendMediaGroup(groupId, [{
            type: 'photo',
            media: generatedPost.photo,
            caption: `📅<b>${generatedPost.date}</b>\n🔥<i>${generatedPost.desc}</i>🔥`,
            parse_mode: 'HTML'
        }]);
      }else {
        await ctx.replyWithMediaGroup([
          {
            type: 'photo',
            media: generatedPost.photo,
            caption: `📅<b>${generatedPost.date}</b>\n🔥<i>${generatedPost.desc}</i>🔥`,
            parse_mode: 'HTML',
          },
        ]);
      }
      if (needAnswerForCbQuery) {
        await ctx.answerCbQuery();
      }
    }
  }

  async sendMessageUserNotInData(ctx: Context) {
    await ctx.replyWithHTML(
      '❌ <i>Probably user was deleted, press Get names instagram</i>',
    );
    await ctx.answerCbQuery();
  }

  async tookAccountFromDb(): Promise<Accounts[]> {
    return await this.accountService.getAllWorkingAccounts();
  }
}

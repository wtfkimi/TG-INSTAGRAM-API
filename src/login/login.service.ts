import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { Context as Ctx } from 'nestjs-telegraf';
import { serviceButtons } from '../app.buttons';

@Injectable()
export class LoginService {
  async show(@Ctx() ctx: Context): Promise<void> {
    await ctx.sendMessage('🛠️', serviceButtons());
  }
}

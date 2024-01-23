import { AdminService } from './admin.service';
import { AccountsService } from '../accounts/accounts.service';
import { Action, Ctx, Hears, Update } from 'nestjs-telegraf';
import { Context, Scenes } from 'telegraf';
import { AdminsService } from '../admins/admins.service';

@Update()
export class AdminController {

  constructor(readonly adminService: AdminService, readonly accountService: AccountsService, readonly adminsService: AdminsService) {
  }


  @Hears('/admin')
  async admin(@Ctx() ctx: Scenes.SceneContext) {
    const isAdmin = await this.adminsService.isAdmin(ctx.from.username, `${ctx.from.id}`);
    await this.adminService.show(ctx, isAdmin);
  }

  @Action('/getDbAcc')
  async getDbAcc(@Ctx() ctx: Context) {
    await ctx.sendChatAction('typing');
    const isAdmin = await this.adminsService.isAdmin(ctx.from.username, `${ctx.from.id}`);
    await this.adminService.getDbAcc(ctx, isAdmin);
  }

  @Action('/addDbAcc')
  async addDbAcc(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.sendChatAction('typing');
    ctx.state.isAdmin = await this.adminsService.isAdmin(ctx.from.username, `${ctx.from.id}`)
    await ctx.scene.enter('addDbAcc');
  }
  @Action('/rmDbAcc')
  async deleteDbAcc(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.sendChatAction('typing');
    ctx.state.isAdmin = await this.adminsService.isAdmin(ctx.from.username, `${ctx.from.id}`);
    await ctx.scene.enter('rmDbAcc');
  }

  @Action('/insertAdminDbAcc')
  async insertAdminDbAcc(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.sendChatAction('typing');
    ctx.state.isAdmin = await this.adminsService.isAdmin(ctx.from.username, `${ctx.from.id}`);
    await ctx.scene.enter('insertAdminDbAcc');
  }

  @Action('/removeAdminDbAcc')
  async removeAdminDbAcc(@Ctx() ctx: Scenes.SceneContext) {
    await ctx.sendChatAction('typing');
    ctx.state.isAdmin = await this.adminsService.isAdmin(ctx.from.username, `${ctx.from.id}`);
    await ctx.scene.enter('removeAdminDbAcc');
  }
}

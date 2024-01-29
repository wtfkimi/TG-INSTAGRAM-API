import { Action, Ctx, Update } from 'nestjs-telegraf';
import { CustomersService } from './customers.service';
import { Context } from 'telegraf';

@Update()
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
  ) {}


  @Action(/\/acceptRegistration(.+)/)
  async acceptRegistration(@Ctx() ctx: Context) {
    const callbackData = ctx.callbackQuery['data'] as String;
    const name = callbackData.match(/\/acceptRegistration(.+)/)[1];
    console.log(name);

  }

  @Action(/\/rejectRegistration(.+)/)
  async rejectRegistration() {

  }
}

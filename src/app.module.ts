import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { LoginModule } from './login/login.module';
import { session } from 'telegraf';
import { LoginService } from './login/login.service';
import { CrudModule } from './crud/crud.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { AccountsModule } from './accounts/accounts.module';
import { AdminModule } from './admin/admin.module';
import { AccountsController } from './accounts/accounts.controller';
import { AdminsModule } from './admins/admins.module';

// const sessions = new LocalSession({database: 'session_db.json'})
@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [session()],
      token: '6623959724:AAE-bys8euDD52L-0jNkXw9J3JALsRYWU3Q',
    }),
    LoginModule,
    CrudModule,
    MongooseModule.forRoot(
      'mongodb+srv://telegram-api-instagram:gzgANpO4h7PbNlMF@cluster0.wopcspp.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
    AccountsModule,
    AdminModule,
    AdminsModule,
  ],
  controllers: [UsersController, AccountsController],
  providers: [AppUpdate, AppService, LoginService],
})
export class AppModule {}

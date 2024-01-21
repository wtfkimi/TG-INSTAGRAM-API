import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { LoginModule } from './login/login.module';
import { session } from 'telegraf';
import { LoginService } from './login/login.service';
import { CrudModule } from './crud/crud.module';
import { MongooseModule } from '@nestjs/mongoose';

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
      'mongodb+srv://end1fromearth:081917vLl@cluster0.wopcspp.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
  controllers: [],
  providers: [AppUpdate, AppService, LoginService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { LoginWizard } from './login.wizard';
import { LoginService } from './login.service';

@Module({
  controllers: [],
  providers: [LoginService, LoginWizard],
})
export class LoginModule {}

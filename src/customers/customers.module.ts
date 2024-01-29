import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersSchema } from './customers.model';

@Module({
  exports: [CustomersService], // 👈 export for DI
  imports: [MongooseModule.forFeature([{ name: 'Customer', schema: CustomersSchema }])],
  controllers: [],
  providers: [CustomersService, CustomersController]
})
export class CustomersModule {}

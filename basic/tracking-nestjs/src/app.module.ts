import {Module} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {TrackingModule} from './tracking/tracking.module';
import {ConfigModule} from '@nestjs/config';
import {OrderModule} from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TrackingModule,
    OrderModule,
  ],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TwitterGateway } from './modules/twitter.gateway';
import { TwitterService } from './modules/twitter.service';
import { TwitterController } from './modules/twitter.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    ScheduleModule.forRoot({})
  ],
  controllers: [AppController,TwitterController],
  providers: [TwitterService,TwitterGateway, AppService],
})
export class AppModule {}

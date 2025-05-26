import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TwitterGateway } from './modules/twitter.gateway';
import { TwitterService } from './modules/twitter.service';
import { TwitterController } from './modules/twitter.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweets, UserSchema } from './db/tweets.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRoot('mongodb+srv://tweetsget:SUz2OTbFrI0zJ7Lw@cluster0.x9hleaq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
      maxPoolSize: 10,        // Maximum connections in pool
        minPoolSize: 2,         // Minimum connections in pool
        maxIdleTimeMS: 30000,
       serverSelectionTimeoutMS: 5000,  // How long to try selecting server
        socketTimeoutMS: 45000,          // How long to wait for socket
        connectTimeoutMS: 10000,   
         compressors: ['zlib'],
        zlibCompressionLevel: 6,
    }),
    MongooseModule.forFeature([{ name: Tweets.name, schema: UserSchema, collection: 'tweets' }]),
    ScheduleModule.forRoot({})
  ],
  controllers: [AppController,TwitterController],
  providers: [TwitterService,TwitterGateway, AppService],
})
export class AppModule {}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as qs from 'querystring';
import { Server } from 'socket.io';
import { TwitterGateway } from './twitter.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubDocument, Subscriber, TweetDocument, Tweets } from './../db/tweets.schema';

@Injectable()
export class TwitterService implements OnModuleInit {
   constructor(
    private readonly config: ConfigService, 
    @InjectModel(Tweets.name) private tweetModel: Model<TweetDocument>,
      @InjectModel(Subscriber.name) private subModel: Model<SubDocument>,
  ) {}
  private subscriptions = new Map<string, string>(); // userId -> username

  private io: Server;
  setSocketServer(io: Server) {
    this.io = io;
  }
  
    async getBearerToken(): Promise<string> {
    const apiKey = this.config.get('TWITTER_API_KEY');
    const apiSecret = this.config.get('TWITTER_API_SECRET');
    const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');


    try {
      const response = await axios.post(
        'https://api.x.com/oauth2/token',
        qs.stringify({ grant_type: 'client_credentials' }),
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        },
      );
  
      return response.data.access_token;
    
    return ''
    } catch (err) {
      console.error('Failed to get bearer token:', err.response?.data || err.message);
      throw err;
    }
  }

 async subscribe(username:string){
 
    const sub=   await this.subModel.find()
       if(sub.length>0){
      await this.subModel.findOneAndUpdate({username:sub[0].username},{username:username})
    }else{
      await this.subModel.insertOne({username:username})
    }
    
   
  }

  async fetchTweets(username: any): Promise<any> {
    try {
        console.log('Fetching tweets for:', username);
      const response = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&tweet.fields=id,created_at,text`,
        { headers: { Authorization: `Bearer ${await this.getBearerToken()}` } }
      );
      return response.data;
    } catch (error) {
        console.error('Error fetching tweets', error);
      console.warn('Twitter API failed, falling back to scraping.');
   
    }
}
  

addSubscription(userId: string, username: string) {
    this.subscriptions.set(userId, username);
  }

  getSubscribedUsername(userId: string) {
    return this.subscriptions.get(userId);
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkForNewTweets(username: string) {
     try {   
           const handles = await this.subModel.find();
         if(handles.length>0){
                const result = await this.fetchTweets(handles[0].username);
      console.log('Fetched tweets:', result);
    if (result&&result.data) {
        this.io.emit('tweet',result.data.map((result)=>{
        return  {
            text: result.text,
            created_at: result.created_at,
            author:handles[0],
        }
    }) );
     const saved =  await  this.tweetModel.insertMany(result.data.map((result)=>{
        return  {
            text: result.text,
            tweetId: result.id,
            createdAt: result.created_at,
            author:handles[0],
          }}), {ordered: false});
          console.log('Saved tweets:', saved);
         return result.data.map((result)=>{
        return  {
            text: result.text,
            created_at: result.created_at,
            author:username,
        }
    }) 
    }else{
      const existingTweets = await this.tweetModel.find({
        
      }).sort({_id:-1})
      this.io.emit('tweet',existingTweets.map((result)=>{
        return{
            text: result.text,
            created_at: result.created_at,
            author:result.author,
        }
      }))
     
    }
         }
     } catch (error) {
    console.error('Error fetching tweets', error);
     }
  }


   async getSavedTweets() {
    
     try {
      const result = await this.tweetModel.find({}).sort({_id:-1});
    if (result) {
        this.io.emit('tweet',result.map((result)=>{
        return  {
            text: result.text,
            created_at: result.created_at,
            author:result.author,
        }
    }) ); 
         return result.map((result)=>{
        return  {
            text: result.text,
            created_at: result.created_at,
            author:result.author,
        }
    }) 
    }else{
          this.io.emit('tweet'
            ,[])
        return [];
    }
     } catch (error) {
    console.error('Error fetching tweets', error);
     }
  }




  async onModuleInit() {
    this.addSubscription('123','jmait_aa')
  
  }
}



                                                                                                           
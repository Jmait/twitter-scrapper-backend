import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as qs from 'querystring';
import { Server } from 'socket.io';
import { TwitterGateway } from './twitter.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
const handles = ['elonmusk'];
@Injectable()
export class TwitterService implements OnModuleInit {
   constructor(
    private readonly config: ConfigService, 
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

  subscribe(username:string){
    if (handles.length>0) {
     handles.pop()
    }
    handles.push(username);
  }

  async fetchTweets(username: string): Promise<any> {
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

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkForNewTweets(username: string) {
     try {
        
           console.log(handles)
          const result = await this.fetchTweets(handles[0]);
 
    if (result&&result.data) {
        this.io.emit('tweet',result.data.map((result)=>{
        return  {
            text: result.text,
            created_at: result.created_at,
            author:handles[0],
        }
    }) )
         return result.data.map((result)=>{
        return  {
            text: result.text,
            created_at: result.created_at,
            author:username,
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



                                                                                                           
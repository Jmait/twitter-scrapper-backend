import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TweetDocument = Tweets & Document;
export type SubDocument = Subscriber & Document;

@Schema()
export class Tweets {
  @Prop({ required: true })
  author: string;

  @Prop({ required: true, unique: true })
  tweetId: string;

  @Prop({ required: true, unique: true })
  text: string;


  @Prop({ default: Date.now })
  created_at: Date;
}

@Schema()
export class Subscriber{
  @Prop({ required: true, unique: true })
  username: string;
}
export const UserSchema = SchemaFactory.createForClass(Tweets);
export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
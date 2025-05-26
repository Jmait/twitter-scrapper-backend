import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TweetDocument = Tweets & Document;

@Schema()
export class Tweets {
  @Prop({ required: true })
  author: string;

  @Prop({ required: true, unique: true })
  text: string;


  @Prop({ default: Date.now })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(Tweets);
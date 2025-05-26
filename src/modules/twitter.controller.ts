import { Controller, Get, Param, Post } from "@nestjs/common";
import { TwitterService } from "./twitter.service";

@Controller('twitter')
export class TwitterController {
    constructor(
        private readonly twitterService: TwitterService
    ) {}
    @Get('tweets')
    async getTwitterData() {
        console.log('hello')
        const data = await this.twitterService.getSavedTweets();
        return data;
    }
    @Post('tweets/:username')
    async subscribe(@Param('username') username: string) {
        console.log('hello')
        const data = await this.twitterService.subscribe(username);
        return data;
    }
}
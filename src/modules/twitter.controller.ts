import { Controller, Get, Param } from "@nestjs/common";
import { TwitterService } from "./twitter.service";

@Controller('twitter')
export class TwitterController {
    constructor(
        private readonly twitterService: TwitterService
    ) {}
    @Get('tweets/:username')
    async getTwitterData(@Param('username') username: string) {
        const data = await this.twitterService.checkForNewTweets(username);
        return data;
    }
}
import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TwitterService } from './twitter.service';

@WebSocketGateway({ cors: true })
export class TwitterGateway implements OnGatewayInit {
  constructor(private twitterService: TwitterService) {}

  afterInit(server: Server) {
    this.twitterService.setSocketServer(server);
  }
}


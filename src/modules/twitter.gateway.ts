import { WebSocketGateway, OnGatewayInit, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TwitterService } from './twitter.service';
let connectedClient:Socket;
@WebSocketGateway({
    
  cors: {
    origin: '*', // You can restrict this to your frontend URL (e.g., 'http://localhost:3000')
   
  }
})

export class TwitterGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(private twitterService: TwitterService) {}
  
    handleConnection(client: Socket, ...args: any[]) {
      connectedClient=client;
      console.log('Client connected:', client.id);
    }

  afterInit(server: Server) {
    this.twitterService.setSocketServer(server);
  }
  emitTweets(tweets:[]){
    connectedClient.emit('tweets', tweets);
  }
}


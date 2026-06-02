import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
  path: '/ws/files'
})
export class FilesGateway {
  @WebSocketServer()
  server!: Server;

  broadcastFileUpdate(userId: string, event: 'created' | 'deleted' | 'updated', file: any) {
    this.server?.to(`user_files_channel_${userId}`).emit(`files:${event}`, file);
  }

  @SubscribeMessage('joinUserFilesChannel')
  handleJoinChannel(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    client.join(`user_files_channel_${data.userId}`);
  }
}

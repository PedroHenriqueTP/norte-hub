import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true, path: '/ws/gym' })
export class GymGateway {
  @WebSocketServer()
  server!: Server;

  broadcastCheckIn(tenantId: string, checkIn: any) {
    this.server?.to(`gym_channel_${tenantId}`).emit('checkin:new', checkIn);
  }

  @SubscribeMessage('joinGymChannel')
  handleJoin(@MessageBody() data: { tenantId: string }, @ConnectedSocket() client: Socket) {
    client.join(`gym_channel_${data.tenantId}`);
  }
}

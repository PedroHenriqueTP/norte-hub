import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrderWithDetails } from './entities/order.entity';

@WebSocketGateway({
  cors: true,
  path: '/ws/orders'
})
export class OrdersGateway {
  @WebSocketServer()
  server!: Server;

  broadcast(order: OrderWithDetails) {
    this.server?.emit('orders:created', order); // Global broadcast
    this.server?.to(`order_${order.id}`).emit('orders:updated', order); // Room broadcast
  }

  @SubscribeMessage('joinOrderRoom')
  handleJoinRoom(@MessageBody() data: { orderId: string }, @ConnectedSocket() client: Socket) {
    client.join(`order_${data.orderId}`);
  }

  @SubscribeMessage('driverLocation')
  handleDriverLocation(@MessageBody() data: { orderId: string, lat: number, lng: number }) {
    this.server.to(`order_${data.orderId}`).emit('driver:location', data);
  }
}


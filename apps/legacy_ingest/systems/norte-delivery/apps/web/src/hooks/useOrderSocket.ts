import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useOrderSocket(orderId: string) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [liveOrder, setLiveOrder] = useState<any>(null);
    const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (!orderId) return;

        // Connect to the custom path defined in NestJS Gateway
        const socketInstance = io(SOCKET_URL, {
            path: '/ws/orders', // Must match Gateway configuration
            transports: ['websocket', 'polling'],
        });

        socketInstance.on('connect', () => {
            console.log('🔌 Connected to Order Socket');
            socketInstance.emit('joinOrderRoom', { orderId });
        });

        socketInstance.on('orders:updated', (updatedOrder: any) => {
            console.log('📦 Order Updated:', updatedOrder);
            setLiveOrder(updatedOrder);
        });

        socketInstance.on('driver:location', (location: any) => {
            console.log('📍 Driver Location:', location);
            setDriverLocation(location);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [orderId]);

    return { socket, liveOrder, driverLocation };
}

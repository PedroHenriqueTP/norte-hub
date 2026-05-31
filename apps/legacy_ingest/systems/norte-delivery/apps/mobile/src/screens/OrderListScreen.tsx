import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { api } from '../services/api';

const StatusBadge = ({ status }: { status: string }) => {
    let color = 'bg-yellow-100 text-yellow-800';
    if (status === 'PREPARING') color = 'bg-orange-100 text-orange-800';
    if (status === 'READY') color = 'bg-green-100 text-green-800';
    if (status === 'COMPLETED') color = 'bg-gray-200 text-gray-600';

    return (
        <View className={`px-2 py-1 rounded-full border border-transparent ${color.split(' ')[0]}`}>
            <Text className={`text-xs font-bold ${color.split(' ')[1]}`}>{status}</Text>
        </View>
    );
};

export const OrderListScreen = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        setLoading(true);
        const data = await api.fetchOrders();
        setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View className="flex-1 bg-background pt-12 px-4">
            <StatusBar barStyle="dark-content" />

            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Text className="text-2xl font-bold text-main">Pedidos</Text>
                    <Text className="text-muted text-sm font-medium">{orders.length} ativo{orders.length !== 1 ? 's' : ''} agora</Text>
                </View>
                <TouchableOpacity
                    className="bg-surface-strong p-2 rounded-full border border-border"
                    onPress={loadOrders}
                >
                    <Text className="text-main font-bold px-2">R</Text>
                </TouchableOpacity>
            </View>

            {loading && orders.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#ea580c" />
                    <Text className="text-muted mt-4">Carregando pedidos...</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={() => (
                        <View className="items-center mt-20">
                            <Text className="text-muted">Nenhum pedido encontrado.</Text>
                        </View>
                    )}
                    renderItem={({ item }) => {
                        const formatCurrency = (val: string | number) => {
                            return typeof val === 'number'
                                ? `R$ ${val.toFixed(2).replace('.', ',')}`
                                : `R$ ${val}`;
                        };

                        const itemsText = item.items?.map((i: any) => `${i.quantity}x ${i.product?.name || 'Produto'}`).join(', ') || 'Sem itens';

                        return (
                            <TouchableOpacity className="bg-surface-contrast p-4 rounded-2xl border border-border mb-4 active:bg-surface shadow-sm">
                                <View className="flex-row justify-between items-start mb-2">
                                    <Text className="text-main font-bold text-lg">#{item.incrementalId?.toString().padStart(4, '0') || item.id.slice(0, 4)}</Text>
                                    <StatusBadge status={item.status} />
                                </View>

                                <Text className="text-main font-semibold text-base mb-1">{item.user?.name || 'Cliente Oculto'}</Text>
                                <Text className="text-muted text-sm mb-3" numberOfLines={2}>{itemsText}</Text>

                                <View className="flex-row justify-between items-center border-t border-border pt-3">
                                    <Text className="text-muted text-xs font-medium">Total</Text>
                                    <Text className="text-accent font-bold text-lg">{formatCurrency(item.total)}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            )}
        </View>
    );
};

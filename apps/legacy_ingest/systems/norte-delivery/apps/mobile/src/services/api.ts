import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_URL = Platform.select({
    android: 'http://10.0.2.2:3333',
    ios: 'http://localhost:3333',
    default: 'http://localhost:3333',
});

const TOKEN_KEY = 'auth_token';
const TENANT_KEY = 'tenant_id';

async function getAuthHeaders() {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const tenantId = await SecureStore.getItemAsync(TENANT_KEY);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    // We also send tenantId explicitly, though backend can decode it from token now.
    // Useful if we have strict header checking or for debugging.
    if (tenantId) {
        headers['x-tenant-id'] = tenantId;
    }

    return headers;
}

export const api = {
    login: async (email: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha no login');
            }

            const data = await response.json();
            // Save Session
            if (data.access_token) {
                await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
                // JWT payload has tenantId, but assuming backend returns user object with tenantId too
                if (data.user?.tenantId) {
                    await SecureStore.setItemAsync(TENANT_KEY, data.user.tenantId);
                }
            }
            return data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },

    register: async (data: { organizationName: string; name: string; email: string; password: string }) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha no cadastro');
        }
        return await response.json();
    },

    logout: async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(TENANT_KEY);
    },

    fetchOrders: async () => {
        try {
            const headers = await getAuthHeaders();
            const response = await fetch(`${API_URL}/orders`, { headers });

            if (response.status === 401) {
                // TODO: Handle Logout / Redirect
                throw new Error('Unauthorized');
            }

            if (!response.ok) throw new Error('Falha ao buscar pedidos');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error; // Propagate error so UI can show retry
        }
    }
};

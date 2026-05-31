import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

export function LoginScreen({ navigation }: any) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [orgName, setOrgName] = useState('');

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preencha email e senha.');
            return;
        }

        if (isRegistering && (!name || !orgName)) {
            Alert.alert('Erro', 'Preencha todos os campos para cadastro.');
            return;
        }

        setLoading(true);
        try {
            if (isRegistering) {
                await api.register({
                    email,
                    password,
                    name,
                    organizationName: orgName
                });
                Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.');
                setIsRegistering(false);
            } else {
                await api.login(email, password);
                // Navigate to App
                navigation.replace('OrderList');
            }
        } catch (error: any) {
            Alert.alert('Erro na Autenticação', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-background px-6">
            <View className="w-full max-w-sm">
                <Text className="text-3xl font-bold text-main mb-2 text-center">
                    {isRegistering ? 'Criar Conta' : 'Delivery SaaS'}
                </Text>
                <Text className="text-muted mb-8 text-center">
                    {isRegistering ? 'Cadastre sua organização' : 'Gerencie seus pedidos'}
                </Text>

                {isRegistering && (
                    <>
                        <TextInput
                            className="bg-white border border-border rounded-lg p-4 mb-4 text-main placeholder:text-muted"
                            placeholder="Nome da Organização (Tenant)"
                            value={orgName}
                            onChangeText={setOrgName}
                            autoCapitalize="words"
                            placeholderTextColor="#9c6644"
                        />
                        <TextInput
                            className="bg-white border border-border rounded-lg p-4 mb-4 text-main placeholder:text-muted"
                            placeholder="Seu Nome"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#9c6644"
                        />
                    </>
                )}

                <TextInput
                    className="bg-white border border-border rounded-lg p-4 mb-4 text-main placeholder:text-muted"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9c6644"
                />

                <TextInput
                    className="bg-white border border-border rounded-lg p-4 mb-6 text-main placeholder:text-muted"
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#9c6644"
                />

                <TouchableOpacity
                    className="bg-accent rounded-lg p-4 items-center shadow-sm active:opacity-90"
                    onPress={handleAuth}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-invert font-bold text-lg">
                            {isRegistering ? 'Cadastrar' : 'Entrar'}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="mt-6 p-2"
                    onPress={() => setIsRegistering(!isRegistering)}
                >
                    <Text className="text-accent text-center font-medium">
                        {isRegistering ? 'Já tem conta? Fazer Login' : 'Não tem conta? Crie sua organização'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

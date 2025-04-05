import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export const LoginScreen = ({ navigation }: any) => {
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const data = await api<{ token: string }>('/auth/login', 'POST', {
        apelido,
        senha
      });
      
      await login(data.token);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };
  
  return (
    <View>
      <TextInput
        placeholder="Apelido"
        value={apelido}
        onChangeText={setApelido}
      />
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Button
        title="Criar Conta"
        onPress={() => navigation.navigate('CreateAccount')}
      />
    </View>
  );
};
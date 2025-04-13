import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import * as SecureStore from 'expo-secure-store';

export const CreateAccountScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCPF = (text: string) => {
    const cleanText = text.replace(/\D/g, '');
    
    const limitedText = cleanText.slice(0, 11);
    
    let formattedCPF = '';
    
    if (limitedText.length <= 3) {
      formattedCPF = limitedText;
    } else if (limitedText.length <= 6) {
      formattedCPF = `${limitedText.slice(0, 3)}.${limitedText.slice(3)}`;
    } else if (limitedText.length <= 9) {
      formattedCPF = `${limitedText.slice(0, 3)}.${limitedText.slice(3, 6)}.${limitedText.slice(6)}`;
    } else {
      formattedCPF = `${limitedText.slice(0, 3)}.${limitedText.slice(3, 6)}.${limitedText.slice(6, 9)}-${limitedText.slice(9)}`;
    }
    
    return formattedCPF;
  };

  const handleCPFChange = (text: string) => {
    const formattedCPF = formatCPF(text);
    setCpf(formattedCPF);
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      if (!nome || !cpf || !apelido || !senha) {
        throw new Error('Preencha todos os campos');
      }
      
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(cpf)) {
        throw new Error('CPF inválido. Use o formato XXX.XXX.XXX-XX');
      }

      const response = await api('/contas', 'POST', {
        nome,
        cpf, 
        apelido,
        senha
      });

      await SecureStore.setItemAsync('userData', JSON.stringify({
        nome,
        apelido,
        cpf
      }));

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Conta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={nome}
        onChangeText={setNome}
      />
      
      <TextInput
        style={styles.input}
        placeholder="CPF (XXX.XXX.XXX-XX)"
        value={cpf}
        onChangeText={handleCPFChange}
        keyboardType="numeric"
        maxLength={14} 
      />
      
      <TextInput
        style={styles.input}
        placeholder="Apelido (username)"
        value={apelido}
        onChangeText={setApelido}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      
      <Button
        title={loading ? "Criando..." : "Criar Conta"}
        onPress={handleCreateAccount}
        disabled={loading}
      />
      
      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
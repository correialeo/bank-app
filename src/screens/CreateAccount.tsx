import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, Text, StyleSheet, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { api } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '@/utils/styles';

export const CreateAccountScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
    if (errors.cpf) {
      setErrors({...errors, cpf: ''});
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!cpfRegex.test(cpf)) {
      newErrors.cpf = 'CPF inválido. Use o formato XXX.XXX.XXX-XX';
    }
    
    if (!apelido.trim()) {
      newErrors.apelido = 'Apelido é obrigatório';
    }
    
    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.logo}>FiapBank</Text>
            <Text style={styles.title}>Criar Nova Conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <TextInput
                style={[styles.input, errors.nome ? styles.inputError : null]}
                placeholder="Digite seu nome completo"
                placeholderTextColor={COLORS.placeholderText}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  if (errors.nome) setErrors({...errors, nome: ''});
                }}
              />
              {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>CPF</Text>
              <TextInput
                style={[styles.input, errors.cpf ? styles.inputError : null]}
                placeholder="XXX.XXX.XXX-XX"
                placeholderTextColor={COLORS.placeholderText}
                value={cpf}
                onChangeText={handleCPFChange}
                keyboardType="numeric"
                maxLength={14}
              />
              {errors.cpf ? <Text style={styles.errorText}>{errors.cpf}</Text> : null}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Apelido (username)</Text>
              <TextInput
                style={[styles.input, errors.apelido ? styles.inputError : null]}
                placeholder="Escolha um nome de usuário"
                placeholderTextColor={COLORS.placeholderText}
                value={apelido}
                onChangeText={(text) => {
                  setApelido(text);
                  if (errors.apelido) setErrors({...errors, apelido: ''});
                }}
                autoCapitalize="none"
              />
              {errors.apelido ? <Text style={styles.errorText}>{errors.apelido}</Text> : null}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                style={[styles.input, errors.senha ? styles.inputError : null]}
                placeholder="Crie uma senha segura"
                placeholderTextColor={COLORS.placeholderText}
                secureTextEntry
                value={senha}
                onChangeText={(text) => {
                  setSenha(text);
                  if (errors.senha) setErrors({...errors, senha: ''});
                }}
              />
              {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}
            </View>
            
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleCreateAccount}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.buttonText} />
              ) : (
                <Text style={styles.buttonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.placeholderText,
    marginBottom: 32,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  primaryButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
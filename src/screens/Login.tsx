import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, Text, StyleSheet, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { COLORS } from '@/utils/styles';

export const LoginScreen = ({ navigation }: any) => {
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { login } = useAuth();

  const validateLogin = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!apelido.trim()) {
      newErrors.apelido = 'Apelido é obrigatório';
    }
    
    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) {
      return;
    }
    
    setLoading(true);
    try {
      const data = await api<{ token: string }>('/auth/login', 'POST', {
        apelido,
        senha
      });
      
      await login(data.token);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Falha na autenticação');
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
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Entre com seus dados para continuar</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Apelido</Text>
              <TextInput
                style={[styles.input, errors.apelido ? styles.inputError : null]}
                placeholder="Digite seu nome de usuário"
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
                placeholder="Digite sua senha"
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
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.buttonText} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('CreateAccount')}
            >
              <Text style={styles.secondaryButtonText}>Criar nova conta</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
  },
});
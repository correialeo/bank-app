import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { COLORS } from '@/utils/styles';
import { TransferResponse } from '@/utils/types';

export const NewTransactionScreen = () => {
  const navigation = useNavigation();
  const [destinatario, setDestinatario] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const [saldo, setSaldo] = useState(0);
  const [errors, setErrors] = useState({
    destinatario: '',
    valor: '',
    categoria: '',
  });

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const response = await api<{ saldo: number }>('/contas/saldo', 'GET');
        setSaldo(response.saldo);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o saldo da conta');
      }
    };
    
    fetchSaldo();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { destinatario: '', valor: '', categoria: '' };

    if (!destinatario.trim()) {
      newErrors.destinatario = 'O apelido do destinatário é obrigatório';
      isValid = false;
    }

    const valorNumerico = parseCurrency(valor);
    if (isNaN(valorNumerico)) {
      newErrors.valor = 'Informe um valor válido';
      isValid = false;
    } else if (valorNumerico <= 0) {
      newErrors.valor = 'O valor deve ser maior que zero';
      isValid = false;
    } else if (valorNumerico > saldo) {
      newErrors.valor = 'Saldo insuficiente para esta transação';
      isValid = false;
    }

    if (!categoria.trim()) {
      newErrors.categoria = 'A categoria é obrigatória';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const valorNumerico = parseCurrency(valor);
      
      const response = await api<TransferResponse>('/transferencias', 'POST', {
        contaDestino: destinatario,
        valor: valorNumerico,
        descricao: descricao.trim() || 'Transferência',
        categoria: categoria.trim(),
      });

      Alert.alert(
        'Transferência realizada',
        'Sua transferência foi realizada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error: any) {
      const errorMessage = error?.message || 'Não foi possível realizar a transferência. Tente novamente.';
      Alert.alert('Erro na transferência', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (text: string) => {
    let cleanText = text.replace(/[^0-9]/g, '');
    
    cleanText = cleanText.replace(/^0+/, '');
    
    if (cleanText.length === 0) cleanText = '0';
    if (cleanText.length === 1) cleanText = '0' + cleanText;
    
    const cents = parseInt(cleanText, 10);
    const formatted = (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    setValor(formatted);
  };

  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Transferência</Text>
        <View style={styles.placeholderView} />
      </View>
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.balanceCard}>
            <Ionicons name="wallet-outline" size={24} color={COLORS.secondary} style={styles.balanceIcon} />
            <Text style={styles.balanceLabel}>Saldo disponível</Text>
            <Text style={styles.balanceValue}>
              R$ {saldo.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Apelido do Destinatário</Text>
            <View style={[styles.inputContainer, errors.destinatario ? styles.inputError : null]}>
              <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite o apelido do destinatário"
                placeholderTextColor={COLORS.inputPlaceholder}
                value={destinatario}
                onChangeText={(text) => {
                  setDestinatario(text);
                  if (errors.destinatario) setErrors({...errors, destinatario: ''});
                }}
                autoCapitalize="none"
              />
            </View>
            {errors.destinatario ? (
              <Text style={styles.errorText}>{errors.destinatario}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Valor (R$)</Text>
            <View style={[styles.inputContainer, errors.valor ? styles.inputError : null]}>
              <Ionicons name="cash-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="0,00"
                placeholderTextColor={COLORS.inputPlaceholder}
                value={valor}
                onChangeText={formatCurrency}
                keyboardType="numeric"
                returnKeyType="done"
              />
            </View>
            {errors.valor ? (
              <Text style={styles.errorText}>{errors.valor}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição (opcional)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="create-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Motivo da transferência"
                placeholderTextColor={COLORS.inputPlaceholder}
                value={descricao}
                onChangeText={setDescricao}
                multiline
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoria</Text>
            <View style={[styles.inputContainer, errors.categoria ? styles.inputError : null]}>
              <Ionicons name="pricetag-outline" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Moradia, Alimentação..."
                placeholderTextColor={COLORS.inputPlaceholder}
                value={categoria}
                onChangeText={(text) => {
                  setCategoria(text);
                  if (errors.categoria) setErrors({...errors, categoria: ''});
                }}
              />
            </View>
            {errors.categoria ? (
              <Text style={styles.errorText}>{errors.categoria}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, loading ? styles.buttonDisabled : null]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={20} color={COLORS.text} style={{marginRight: 8}} />
                <Text style={styles.buttonText}>Transferir Agora</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholderView: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  balanceIcon: {
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: `${COLORS.primary}80`,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});
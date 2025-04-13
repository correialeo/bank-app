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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';

interface TransferResponse {
  mensagem: string;
  id: string;
}

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

  console.log(valor)

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Enviar Dinheiro</Text>

          <View style={styles.saldoContainer}>
            <Text style={styles.saldoText}>
              Saldo disponível: R$ {saldo.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Apelido do Destinatário</Text>
            <TextInput
              style={[styles.input, errors.destinatario ? styles.inputError : null]}
              placeholder="Digite o apelido do destinatário"
              value={destinatario}
              onChangeText={setDestinatario}
              autoCapitalize="none"
            />
            {errors.destinatario ? (
              <Text style={styles.errorText}>{errors.destinatario}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Valor (R$)</Text>
            <TextInput
              style={[styles.input, errors.valor ? styles.inputError : null]}
              placeholder="0,00"
              value={valor}
              onChangeText={formatCurrency}
              keyboardType="numeric"
              returnKeyType="done"
            />
            {errors.valor ? (
              <Text style={styles.errorText}>{errors.valor}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Descrição (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Motivo da transferência"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoria</Text>
            <TextInput
              style={[styles.input, errors.categoria ? styles.inputError : null]}
              placeholder="Ex: Moradia, Alimentação..."
              value={categoria}
              onChangeText={setCategoria}
            />
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
              <Text style={styles.buttonText}>Transferir</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saldoContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    alignItems: 'center',
  },
  saldoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2196F3',
  },
});
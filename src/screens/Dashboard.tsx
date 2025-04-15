import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { useAuth } from '@/contexts/AuthContext';
import { TransactionItem } from '../components/TransactionItem';
import { COLORS } from '@/utils/styles';
import { SaldoResponse, Transacao } from '@/utils/types';

export const DashboardScreen = ({ navigation }: any) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [mostraSaldo, setMostraSaldo] = useState(true);
  const { logout } = useAuth();

  const carregarDados = async (forcarAtualizacao = false) => {
    try {
      const [respostaSaldo, respostaExtrato] = await Promise.all([
        api<SaldoResponse>('/contas/saldo?tipo=todas', 'GET'),
        api<Transacao[]>('/contas/extrato?tipo=todas', 'GET')
      ]);
      
      setSaldo(respostaSaldo.saldo);
      setTransacoes(respostaExtrato);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus dados financeiros');
    } finally {
      if (forcarAtualizacao) setAtualizando(false);
      else setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleAtualizar = () => {
    setAtualizando(true);
    carregarDados(true);
  };

  const handleTransactionPress = (transaction: Transacao) => {
    navigation.navigate('TransactionDetails', { transaction });
  };

  const toggleMostraSaldo = () => {
    setMostraSaldo(!mostraSaldo);
  };

  const Cabecalho = () => (
    <View style={styles.cabecalhoContainer}>
      <View style={styles.perfil}>
        <TouchableOpacity style={styles.perfilBtn} onPress={() => {}}>
          <Ionicons name="person-circle-outline" size={32} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sairBtn} onPress={() => logout()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.saudacao}>Olá</Text>
      
      <View style={styles.saldoContainer}>
        <View style={styles.saldoHeader}>
          <Text style={styles.saldoLabel}>Saldo disponível</Text>
          <TouchableOpacity onPress={toggleMostraSaldo}>
            <Ionicons 
              name={mostraSaldo ? "eye-outline" : "eye-off-outline"} 
              size={22} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.saldoValor}>
          {mostraSaldo 
            ? `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
            : '••••••'}
        </Text>
      </View>
      
      <Text style={styles.historicoLabel}>Histórico</Text>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.carregandoContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            onPress={handleTransactionPress}
          />
        )}
        ListHeaderComponent={<Cabecalho />}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={handleAtualizar}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            progressBackgroundColor={COLORS.cardBackground}
          />
        }
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Ionicons name="receipt-outline" size={40} color={COLORS.textSecondary} />
            <Text style={styles.textoListaVazia}>Nenhuma transação encontrada</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity 
        style={styles.novaTransacaoBtn} 
        onPress={() => navigation.navigate('NewTransaction')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={26} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cabecalhoContainer: {
    backgroundColor: COLORS.primary,
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  perfil: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  perfilBtn: {
    padding: 4,
  },
  sairBtn: {
    padding: 4,
  },
  saudacao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  saldoContainer: {
    marginBottom: 24,
  },
  saldoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  saldoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  saldoValor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  historicoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
  },
  listaVazia: {
    padding: 32,
    alignItems: 'center',
  },
  textoListaVazia: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  novaTransacaoBtn: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 999,
  },
});
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View, Text } from 'react-native';
import { api } from '../services/api';
import { TransactionItem } from '../components/TransactionItem';

interface SaldoResponse {
  saldo: number;
}

interface ExtratoResponse {
  transacoes: Array<{
    id: string;
    valor: number;
    data: string;
    descricao: string;
    tipo: 'credito' | 'debito';
  }>;
}

interface Transacao {
  id: string;
  valor: number;
  data: string;
  descricao: string;
  tipo: 'credito' | 'debito';
}

export const DashboardScreen = () => {
  const [saldo, setSaldo] = useState(0);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const loadData = async () => {
    try {
      const [saldoRes, extratoRes] = await Promise.all([
        api<SaldoResponse>('/contas/saldo', 'GET'),
        api<ExtratoResponse>('/contas/extrato', 'GET'),
      ]);
      
      setSaldo(saldoRes.saldo);
      setTransacoes(extratoRes.transacoes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={transacoes}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      ListHeaderComponent={
        <View>
          <Text>Saldo Atual: R$ {saldo.toFixed(2)}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <TransactionItem
          valor={item.valor}
          data={item.data}
          descricao={item.descricao}
          tipo={item.tipo}
        />
      )}
    />
  );
};
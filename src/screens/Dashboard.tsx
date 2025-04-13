import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Transacao {
  id: number;
  valor: number;
  data: string;
  descricao: string;
  categoria: string;
  tipo: string;
  contraparte: {
    apelido: string;
    nome: string;
  };
}

interface SaldoResponse {
  saldo: number;
}

export const DashboardScreen = ({ navigation }: any) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const { logout } = useAuth();

  const carregarDados = async (forcarAtualizacao = false) => {
    try {
      // Carrega saldo e extrato simultaneamente
      const [respostaSaldo, respostaExtrato] = await Promise.all([
        api<SaldoResponse>('/contas/saldo?tipo=todas', 'GET'),
        api<Transacao[]>('/contas/extrato?tipo=todas', 'GET')
      ]);
      
      setSaldo(respostaSaldo.saldo);
      setTransacoes(respostaExtrato);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const Cabecalho = () => (
    <View style={styles.cabecalho}>
      <Text style={styles.tituloSaldo}>
        Saldo Total: R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </Text>
    </View>
  );

  const renderizarItem = ({ item }: { item: Transacao }) => (
    <View style={styles.item}>
      <View style={styles.colunaData}>
        <Text style={styles.data}>{formatarData(item.data)}</Text>
      </View>
      
      <View style={styles.colunaPrincipal}>
        <Text style={styles.descricao} numberOfLines={1}>
          {item.descricao}
        </Text>
        <Text style={styles.categoria}>{item.categoria}</Text>
      </View>

      <View style={styles.colunaValor}>
        <Text style={item.tipo === 'enviada' ? styles.valorNegativo : styles.valorPositivo}>
          R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.carregandoContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Sair" onPress={() => logout()} />
      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderizarItem}
        ListHeaderComponent={<Cabecalho />}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={handleAtualizar}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Text style={styles.textoListaVazia}>Nenhuma transação encontrada</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.newTransactionButton} 
        onPress={() => navigation.navigate('NewTransaction')}
        activeOpacity={0.8}
      >
        <Ionicons name="cash-outline" size={22} color="white" />
        <Text style={styles.buttonText}>Nova Transferência</Text>
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  cabecalho: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    elevation: 2,
  },
  tituloSaldo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
  },
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    elevation: 2,
  },
  colunaData: {
    width: 70,
    marginRight: 12,
    justifyContent: 'center',
  },
  colunaPrincipal: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  colunaValor: {
    width: 100,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  data: {
    fontSize: 14,
    color: '#757575',
  },
  descricao: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  categoria: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 4,
  },
  valorPositivo: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  valorNegativo: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '500',
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  textoListaVazia: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoNovaTransacao: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  newTransactionButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 999,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
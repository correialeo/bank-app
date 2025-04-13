import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Transaction {
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

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
}) => {
  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(transaction)}>
      <View style={styles.colunaData}>
        <Text style={styles.data}>{formatarData(transaction.data)}</Text>
      </View>
      
      <View style={styles.colunaPrincipal}>
        <Text style={styles.descricao} numberOfLines={1}>
          {transaction.descricao}
        </Text>
        <Text style={styles.categoria}>{transaction.categoria}</Text>
      </View>

      <View style={styles.colunaValor}>
        <Text style={transaction.tipo === 'enviada' ? styles.valorNegativo : styles.valorPositivo}>
          R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type TransactionItemProps = {
  valor: number;
  data: string;
  descricao: string;
  tipo: 'credito' | 'debito';
};

export const TransactionItem = ({ valor, data, descricao, tipo }: TransactionItemProps) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.data}>{new Date(data).toLocaleDateString()}</Text>
      <Text>{descricao}</Text>
    </View>
    <Text style={[styles.valor, tipo === 'credito' ? styles.credito : styles.debito]}>
      R$ {valor.toFixed(2)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  data: {
    color: '#666',
    fontSize: 12,
  },
  valor: {
    fontWeight: 'bold',
  },
  credito: {
    color: 'green',
  },
  debito: {
    color: 'red',
  },
});
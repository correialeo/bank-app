import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionItemProps {
  valor: number;
  data: string;
  descricao: string;
  tipo: 'credito' | 'debito';
  categoria: string;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  valor,
  data,
  descricao,
  tipo,
  categoria,
}) => {
  const formattedDate = format(parseISO(data), "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR,
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.description}>{descricao}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text
          style={[
            styles.value,
            tipo === 'credito' ? styles.creditValue : styles.debitValue,
          ]}
        >
          {tipo === 'credito' ? '+' : '-'}{' '}
          R$ {Math.abs(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  leftContent: {
    flex: 1,
    paddingRight: 8,
  },
  rightContent: {
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditValue: {
    color: '#27ae60', 
  },
  debitValue: {
    color: '#e74c3c', 
  },
});
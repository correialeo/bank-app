import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Props } from '@/utils/types';

export const TransactionDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { transaction } = route.params;

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#2196F3" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Detalhes da Transação</Text>
        <Text 
          style={[
            styles.valorDetalhado, 
            transaction.tipo === 'enviada' ? styles.valorNegativo : styles.valorPositivo
          ]}
        >
          {transaction.tipo === 'enviada' ? '-' : '+'} R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View style={styles.card}>
        <DetailItem label="Descrição" value={transaction.descricao} />
        <DetailItem label="Data e Hora" value={formatarData(transaction.data)} />
        <DetailItem label="Categoria" value={transaction.categoria} />
        <DetailItem label="Tipo" value={transaction.tipo === 'enviada' ? 'Transferência Enviada' : 'Transferência Recebida'} />
        <DetailItem label="ID da Transação" value={`#${transaction.id}`} isLast />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informações da Contraparte</Text>
        <DetailItem label="Nome" value={transaction.contraparte.nome} />
        <DetailItem label="Apelido" value={transaction.contraparte.apelido} isLast />
      </View>
    </ScrollView>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const DetailItem = ({ label, value, isLast = false }: DetailItemProps) => (
  <View style={[styles.detailItem, isLast ? null : styles.borderBottom]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  valorDetalhado: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  valorPositivo: {
    color: '#4CAF50',
  },
  valorNegativo: {
    color: '#F44336',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailItem: {
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#212121',
  }
});
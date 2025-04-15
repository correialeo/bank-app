import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Props } from '@/utils/types';
import { COLORS } from '@/utils/styles';

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
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
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
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text,
  },
  valorDetalhado: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  valorPositivo: {
    color: COLORS.secondary,
  },
  valorNegativo: {
    color: COLORS.error,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: COLORS.text,
  },
  detailItem: {
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBorder,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.25,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  }
});
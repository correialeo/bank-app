import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/styles';

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
    });
  };

  const getIconName = () => {
    if (transaction.tipo === 'enviada') {
      return 'arrow-up-outline';
    } else {
      return 'arrow-down-outline';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => onPress(transaction)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <View style={[
          styles.iconCircle, 
          transaction.tipo === 'enviada' ? styles.iconNegative : styles.iconPositive
        ]}>
          <Ionicons 
            name={getIconName()} 
            size={16} 
            color={COLORS.text} 
          />
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.descricaoContainer}>
          <Text style={styles.descricao} numberOfLines={1}>
            {transaction.descricao}
          </Text>
          <Text style={styles.data}>{formatarData(transaction.data)}</Text>
        </View>
        
        <View style={styles.detalhesContainer}>
          <Text style={styles.categoria}>{transaction.categoria}</Text>
          <Text style={transaction.tipo === 'enviada' ? styles.valorNegativo : styles.valorPositivo}>
            {transaction.tipo === 'enviada' ? '-' : '+'} 
            R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLORS.cardBackground,
    flexDirection: 'row',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  iconContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPositive: {
    backgroundColor: COLORS.success + '30', 
  },
  iconNegative: {
    backgroundColor: COLORS.error + '30', 
  },
  contentContainer: {
    flex: 1,
  },
  descricaoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  descricao: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  data: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  detalhesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  categoria: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  valorPositivo: {
    fontSize: 16,
    color: COLORS.success,
    fontWeight: '500',
  },
  valorNegativo: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '500',
  },
});
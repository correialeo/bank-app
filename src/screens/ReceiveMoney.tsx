import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

interface UserInfo {
  id: string;
  nome: string;
  apelido: string;
  documento: string;
}

export const ReceiveMoneyScreen = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await api<UserInfo>('/contas/perfil', 'GET');
        console.log('User Info:', response);
        setUserInfo(response);
      } catch (error) {
        console.error('Erro ao carregar informações do usuário:', error);
        Alert.alert(
          'Erro',
          'Não foi possível carregar suas informações. Tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleShareInfo = async () => {
    if (!userInfo) return;

    try {
      await Share.share({
        message: `Olá! Meu apelido no banco é: ${userInfo.apelido}. Você pode me enviar dinheiro usando esse apelido.`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="arrow-down-circle" size={64} color="#2196F3" />
        </View>

        <Text style={styles.title}>Receba Dinheiro</Text>
        <Text style={styles.subtitle}>
          Compartilhe seu apelido para receber transferências
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{userInfo?.nome}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Apelido</Text>
            <Text style={styles.infoValueHighlight}>{userInfo?.apelido}</Text>
          </View>

          {userInfo?.documento && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Documento</Text>
              <Text style={styles.infoValue}>
                {userInfo.documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShareInfo}>
          <Ionicons name="share-social-outline" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Compartilhar Meus Dados</Text>
        </TouchableOpacity>

        <Text style={styles.instructions}>
          Peça para a pessoa enviar dinheiro usando seu apelido como identificador. O valor será
          creditado imediatamente em sua conta.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  infoValueHighlight: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  additionalInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});
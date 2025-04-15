import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { COLORS } from '@/utils/styles';
import { UserInfo } from '@/utils/types';

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
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Receber Dinheiro</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="arrow-down" size={38} color={COLORS.text} />
          </View>
        </View>

        <Text style={styles.title}>Receba Transferências</Text>
        <Text style={styles.subtitle}>
          Compartilhe seu apelido para receber pagamentos
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{userInfo?.nome}</Text>
          </View>

          <View style={styles.infoItemHighlight}>
            <Text style={styles.infoLabel}>Apelido</Text>
            <View style={styles.nickContainer}>
              <Text style={styles.infoValueHighlight}>{userInfo?.apelido}</Text>
              <TouchableOpacity onPress={handleShareInfo} style={styles.copyButton}>
                <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
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
          <Ionicons name="share-social-outline" size={20} color={COLORS.text} />
          <Text style={styles.shareButtonText}>Compartilhar Meus Dados</Text>
        </TouchableOpacity>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>Como receber dinheiro</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Compartilhe seu apelido com quem deseja receber dinheiro
            </Text>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text style={styles.stepText}>
              A outra pessoa fará uma transferência usando seu apelido
            </Text>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.stepText}>
              O valor será creditado imediatamente em sua conta
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoItemHighlight: {
    marginBottom: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  nickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  infoValueHighlight: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  copyButton: {
    padding: 8,
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  instructionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
});
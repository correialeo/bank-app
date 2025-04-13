import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { RootNav } from '@/navigation/RootNav';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

const COLORS = {
  primary: '#8A05BE', 
  background: '#121212',
};

const AppInner = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: COLORS.background 
      }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <RootNav />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
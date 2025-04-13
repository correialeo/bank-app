import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '@/screens/Login';
import { DashboardScreen } from '@/screens/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { CreateAccountScreen } from '@/screens/CreateAccount';
import { ReceiveMoneyScreen } from '@/screens/ReceiveMoney';
import { NewTransactionScreen } from '@/screens/NewTransaction';
import { ActivityIndicator, View } from 'react-native';
import { TransactionDetailsScreen } from '@/screens/TransactionDetails';

// Auth Stack para usuários não autenticados
const AuthStack = createStackNavigator();
export const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
  </AuthStack.Navigator>
);

const Tab = createBottomTabNavigator();
export const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Receber dinheiro" component={ReceiveMoneyScreen} />
    <Tab.Screen name="Nova Transação" component={NewTransactionScreen} />
  </Tab.Navigator>
);

const AppStack = createStackNavigator();
export const AppNavigator = () => (
  <AppStack.Navigator screenOptions={{ headerShown: false }}>
    <AppStack.Screen name="Main" component={TabNavigator} />
    <AppStack.Screen 
      name="TransactionDetails" 
      component={TransactionDetailsScreen} 
      options={{ 
        presentation: 'card',  
        headerShown: false 
      }} 
    />
  </AppStack.Navigator>
);

const RootStack = createStackNavigator();
export const RootNav = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="App" component={AppNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};
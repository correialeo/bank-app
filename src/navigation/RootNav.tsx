import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '@/screens/Login';
import { DashboardScreen } from '@/screens/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { CreateAccountScreen } from '@/screens/CreateAccount';
import { ReceiveMoneyScreen } from '@/screens/ReceiveMoney';
import { NewTransactionScreen } from '@/screens/NewTransaction';
import { ActivityIndicator, View } from 'react-native';

const AuthStack = createStackNavigator();
export const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
  </AuthStack.Navigator>
);

// Telas Principais
const Tab = createBottomTabNavigator();
export const AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="ReceiveMoney" component={ReceiveMoneyScreen} />
    <Tab.Screen name="NewTransaction" component={NewTransactionScreen} />
  </Tab.Navigator>
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
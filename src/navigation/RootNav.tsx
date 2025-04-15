import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '@/screens/Login';
import { DashboardScreen } from '@/screens/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { CreateAccountScreen } from '@/screens/CreateAccount';
import { ReceiveMoneyScreen } from '@/screens/ReceiveMoney';
import { NewTransactionScreen } from '@/screens/NewTransaction';
import { ActivityIndicator, View, Platform } from 'react-native';
import { TransactionDetailsScreen } from '@/screens/TransactionDetails';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/utils/styles';

const AuthStack = createStackNavigator();
export const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      cardStyle: {
        backgroundColor: COLORS.background,
      },
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
  </AuthStack.Navigator>
);

const Tab = createBottomTabNavigator();
export const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: {
        backgroundColor: COLORS.cardBackground,
        borderTopWidth: 0,
        height: 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingTop: 10,
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'ReceiveMoney') {
          iconName = focused ? 'arrow-down-circle' : 'arrow-down-circle-outline';
        } else if (route.name === 'NewTransaction') {
          iconName = focused ? 'arrow-up-circle' : 'arrow-up-circle-outline';
        }

        return <Ionicons name={iconName as any} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen} 
      options={{ tabBarLabel: "Início" }}
    />
    <Tab.Screen 
      name="ReceiveMoney" 
      component={ReceiveMoneyScreen} 
      options={{ tabBarLabel: "Receber" }}
    />
    <Tab.Screen 
      name="NewTransaction" 
      component={NewTransactionScreen} 
      options={{ tabBarLabel: "Transferir" }}
    />
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
        presentation: 'modal',
        cardStyle: {
          backgroundColor: COLORS.background,
        },
      }} 
    />
  </AppStack.Navigator>
);

const RootStack = createStackNavigator();
export const RootNav = () => {
  const { isAuthenticated, isLoading } = useAuth();

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
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="App" component={AppNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};
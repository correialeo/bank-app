import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '@/screens/Login';
import { DashboardScreen } from '@/screens/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { CreateAccountScreen } from '@/screens/CreateAccount';

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
    {/* <Tab.Screen name="SendMoney" component={SendMoneyScreen} /> */}
    {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
  </Tab.Navigator>
);

const RootStack = createStackNavigator();
export const RootNav = () => {
  const { isAuthenticated } = useAuth(); 

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
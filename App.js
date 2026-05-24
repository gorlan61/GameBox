import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { AuthProvider, useAuthContext } from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import AddLogScreen from "./src/screens/AddLogScreen";
import MyLogsScreen from "./src/screens/MyLogsScreen";

const Stack = createStackNavigator();

// ─────────────────────────────────────────────
// Loading Screen — auth durumu kontrol edilirken
// ─────────────────────────────────────────────
function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <Text style={styles.loadingLogo}>🎮</Text>
      <ActivityIndicator
        size="large"
        color="#6366f1"
        style={{ marginTop: 24 }}
      />
      <Text style={styles.loadingText}>Yükleniyor...</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Root Navigator — session durumuna göre ekran seçer
// ─────────────────────────────────────────────
function RootNavigator() {
  const { session, loading } = useAuthContext();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#0f172a" },
        animationEnabled: true,
      }}
    >
      {session ? (
        // ── Giriş yapılmış → Home + uygulama ekranları
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="AddLog" component={AddLogScreen} />
          <Stack.Screen name="MyLogs" component={MyLogsScreen} />
        </>
      ) : (
        // ── Giriş yapılmamış → Login ve Register görünür
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Ana App Bileşeni
//
// Katman sırası (dıştan içe):
//   GestureHandlerRootView   ← react-native-gesture-handler gereksinimi
//     AuthProvider           ← useAuth hook'u tek yerden yönetilir
//       NavigationContainer  ← React Navigation kök context'i
//         RootNavigator      ← session'a göre ekran seçimi
// ─────────────────────────────────────────────
export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

// ─────────────────────────────────────────────
// Stiller
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingLogo: {
    fontSize: 64,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#64748b",
    letterSpacing: 0.5,
  },
});

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { useAuthContext } from "../contexts/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuthContext();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    Alert.alert("Çıkış Yap", "Hesabından çıkmak istediğine emin misin?", [
      {
        text: "İptal",
        style: "cancel",
      },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut();
            console.log("✅ Çıkış başarılı, Login ekranına yönlendiriliyor...");
          } catch (error) {
            console.log("❌ Çıkış hatası:", error.message);
            Alert.alert("Hata", "Çıkış yapılırken bir sorun oluştu.");
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🎮</Text>
          <Text style={styles.title}>GameBox</Text>
          <Text style={styles.subtitle}>Ana Ekran</Text>
        </View>

        {/* Kullanıcı Kartı */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Hoş geldin! 👋</Text>
            <Text style={styles.userLabel}>Giriş yapılan hesap</Text>
            <Text
              style={styles.userEmail}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user?.email ?? "—"}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Aktif</Text>
          </View>
        </View>

        {/* Bilgi Kartları */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔐</Text>
            <Text style={styles.infoLabel}>Oturum</Text>
            <Text style={styles.infoValue}>Açık</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📡</Text>
            <Text style={styles.infoLabel}>Supabase</Text>
            <Text style={styles.infoValue}>Bağlı</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🧭</Text>
            <Text style={styles.infoLabel}>Navigator</Text>
            <Text style={styles.infoValue}>Stack</Text>
          </View>
        </View>

        {/* ── Navigasyon Butonları ── */}
        <Text style={styles.navSectionTitle}>Ne yapmak istiyorsun?</Text>
        <View style={styles.navSection}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Search")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.navIconWrapper, { backgroundColor: "#1e1b4b" }]}
            >
              <Text style={styles.navButtonIcon}>🔍</Text>
            </View>
            <View style={styles.navButtonContent}>
              <Text style={styles.navButtonTitle}>Oyun Ara</Text>
              <Text style={styles.navButtonDesc}>
                Oyun veritabanında başlığa göre ara
              </Text>
            </View>
            <Text style={styles.navChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("AddLog")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.navIconWrapper, { backgroundColor: "#064e3b" }]}
            >
              <Text style={styles.navButtonIcon}>📝</Text>
            </View>
            <View style={styles.navButtonContent}>
              <Text style={styles.navButtonTitle}>Log Ekle</Text>
              <Text style={styles.navButtonDesc}>
                Oynadığın oyunu kaydet ve puanla
              </Text>
            </View>
            <Text style={styles.navChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("MyLogs")}
            activeOpacity={0.7}
          >
            <View
              style={[styles.navIconWrapper, { backgroundColor: "#1e1b4b" }]}
            >
              <Text style={styles.navButtonIcon}>📋</Text>
            </View>
            <View style={styles.navButtonContent}>
              <Text style={styles.navButtonTitle}>Loglarım</Text>
              <Text style={styles.navButtonDesc}>
                Tüm oyun kayıtlarını görüntüle
              </Text>
            </View>
            <Text style={styles.navChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Çıkış Butonu */}
        <TouchableOpacity
          style={[styles.signOutButton, signingOut && styles.buttonDisabled]}
          onPress={handleSignOut}
          disabled={signingOut}
          activeOpacity={0.8}
        >
          {signingOut ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.signOutIcon}>🚪</Text>
              <Text style={styles.signOutText}>Çıkış Yap</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f8fafc",
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Kullanıcı Kartı
  userCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#10b981",
    padding: 20,
    marginBottom: 20,
    gap: 12,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    alignItems: "center",
    gap: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10b981",
  },
  userLabel: {
    fontSize: 11,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 8,
  },
  userEmail: {
    fontSize: 15,
    color: "#f8fafc",
    fontWeight: "500",
    marginTop: 2,
    maxWidth: "100%",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  statusText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "600",
  },

  // Bilgi Grid
  infoGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  infoIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 10,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },

  // Navigasyon Butonları
  navSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  navSection: {
    gap: 10,
    marginBottom: 28,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 14,
    gap: 14,
  },
  navIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  navButtonIcon: {
    fontSize: 22,
  },
  navButtonContent: {
    flex: 1,
    gap: 3,
  },
  navButtonTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f8fafc",
  },
  navButtonDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 17,
  },
  navChevron: {
    fontSize: 26,
    color: "#475569",
    fontWeight: "300",
  },

  // Çıkış Butonu
  signOutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 52,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signOutIcon: {
    fontSize: 18,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

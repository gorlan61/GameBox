import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useAuthContext } from "../contexts/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Eksik Bilgi", "Email ve şifre alanlarını doldurun.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Geçersiz Email", "Lütfen geçerli bir email adresi girin.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Şifre Çok Kısa", "Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Şifre Uyumsuz", "Girdiğiniz şifreler birbirini tutmuyor.");
      return;
    }

    setLoading(true);
    try {
      const data = await signUp(email.trim(), password);

      if (data?.user && !data.session) {
        // Email doğrulama aktifse session hemen gelmez
        Alert.alert(
          "Kayıt Başarılı! 🎉",
          `${email.trim()} adresine bir doğrulama maili gönderildi.\n\nMaili onayladıktan sonra giriş yapabilirsiniz.`,
          [
            {
              text: "Giriş Ekranına Git",
              onPress: () => navigation.navigate("Login"),
            },
          ],
        );
      } else if (data?.session) {
        // Email doğrulama kapalıysa direkt session gelir
        Alert.alert("Kayıt Başarılı! 🎉", "Hesabın oluşturuldu, hoş geldin!");
      }
    } catch (error) {
      let errorMessage = error.message;

      if (error.message.includes("User already registered")) {
        errorMessage = "Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.";
      } else if (error.message.includes("Password should be")) {
        errorMessage = "Şifre en az 6 karakter olmalıdır.";
      } else if (error.message.includes("Unable to validate email")) {
        errorMessage = "Geçersiz email adresi.";
      }

      Alert.alert("Kayıt Hatası", errorMessage);
      console.log("❌ Kayıt hatası:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🎮</Text>
            <Text style={styles.title}>GameBox</Text>
            <Text style={styles.subtitle}>Yeni hesap oluştur</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor="#475569"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <TextInput
                style={styles.input}
                placeholder="En az 6 karakter"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre Tekrar</Text>
              <TextInput
                style={[
                  styles.input,
                  confirmPassword.length > 0 &&
                    password !== confirmPassword &&
                    styles.inputError,
                ]}
                placeholder="Şifreni tekrar gir"
                placeholderTextColor="#475569"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="new-password"
                editable={!loading}
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.errorHint}>Şifreler uyuşmuyor</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.link}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 40,
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    letterSpacing: 0.5,
  },

  // Form
  form: {
    gap: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#f8fafc",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorHint: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 6,
    marginLeft: 4,
  },

  // Button
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#4338ca",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    color: "#64748b",
    fontSize: 14,
  },
  link: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "700",
  },
});

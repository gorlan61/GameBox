import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useAuthContext } from "../contexts/AuthContext";

// ─────────────────────────────────────────────
// Rating Slider — PanResponder tabanlı, 0.5-5 arası
// ─────────────────────────────────────────────
function RatingSlider({ value, onChange }) {
  const [containerWidth, setContainerWidth] = useState(0);
  const widthRef = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const MIN = 0.5,
    MAX = 5,
    STEP = 0.5;

  function clamp(raw) {
    const stepped = Math.round(raw / STEP) * STEP;
    return Math.max(MIN, Math.min(MAX, stepped));
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        if (widthRef.current === 0) return;
        const x = Math.max(0, Math.min(e.nativeEvent.locationX, widthRef.current));
        const ratio = x / widthRef.current;
        onChangeRef.current(clamp(MIN + ratio * (MAX - MIN)));
      },
      onPanResponderMove: (e) => {
        if (widthRef.current === 0) return;
        const x = Math.max(0, Math.min(e.nativeEvent.locationX, widthRef.current));
        const ratio = x / widthRef.current;
        onChangeRef.current(clamp(MIN + ratio * (MAX - MIN)));
      },
    })
  ).current;

  const fillRatio = containerWidth > 0 ? (value - MIN) / (MAX - MIN) : 0;
  const fillWidth = fillRatio * containerWidth;
  const thumbLeft = Math.max(0, fillWidth - 14);

  return (
    <View
      style={styles.sliderWrapper}
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width;
        setContainerWidth(e.nativeEvent.layout.width);
      }}
      {...panResponder.panHandlers}
    >
      {/* Track */}
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: fillWidth }]} />
      </View>
      {/* Thumb */}
      {containerWidth > 0 && (
        <View style={[styles.sliderThumb, { left: thumbLeft }]} />
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Star Display — sayısal puanı yıldız olarak gösterir
// ─────────────────────────────────────────────
function StarDisplay({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <Text style={styles.stars}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
    </Text>
  );
}

// ─────────────────────────────────────────────
// Ana Ekran
// ─────────────────────────────────────────────
export default function AddLogScreen({ navigation }) {
  const { user } = useAuthContext();

  // Oyun seçimi
  const [gameQuery, setGameQuery] = useState("");
  const [gameResults, setGameResults] = useState([]);
  const [gameLoading, setGameLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  // Form alanları
  const [rating, setRating] = useState(3.0);
  const [playedDate, setPlayedDate] = useState("");
  const [review, setReview] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Kayıt durumu
  const [saving, setSaving] = useState(false);

  // ── Oyun Arama ──
  async function searchGames(text) {
    setGameQuery(text);
    if (text.trim().length < 2) {
      setGameResults([]);
      return;
    }
    setGameLoading(true);
    const { data, error } = await supabase
      .from("games")
      .select("id, title, genre, release_year")
      .ilike("title", `%${text.trim()}%`)
      .order("release_year", { ascending: false })
      .limit(10);

    if (error) {
      console.log("❌ Oyun arama hatası:", error.message);
    } else {
      setGameResults(data ?? []);
    }
    setGameLoading(false);
  }

  function selectGame(game) {
    setSelectedGame(game);
    setGameQuery("");
    setGameResults([]);
  }

  function clearGame() {
    setSelectedGame(null);
    setGameQuery("");
    setGameResults([]);
  }

  // ── Kaydet ──
  async function handleSave() {
    if (!selectedGame) {
      Alert.alert("Eksik Bilgi", "Lütfen bir oyun seçin.");
      return;
    }

    if (playedDate && !/^\d{4}-\d{2}-\d{2}$/.test(playedDate)) {
      Alert.alert(
        "Geçersiz Tarih",
        "Tarih formatı YYYY-MM-DD olmalıdır.\nÖrnek: 2024-03-15"
      );
      return;
    }

    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const { error } = await supabase.from("game_logs").insert({
        user_id: user.id,
        game_id: selectedGame.id,
        rating: rating,
        review: review.trim() || null,
        played_date: playedDate || null,
        tags: tags,
      });

      if (error) throw error;

      console.log("✅ Log kaydedildi:", selectedGame.title, "→", rating, "⭐");

      Alert.alert(
        "Kaydedildi! 🎉",
        `"${selectedGame.title}" için ${rating}/5 puanın loglandı.`,
        [
          {
            text: "Tamam",
            onPress: () => {
              // Formu temizle
              setSelectedGame(null);
              setGameQuery("");
              setRating(3.0);
              setPlayedDate("");
              setReview("");
              setTagsInput("");
            },
          },
          {
            text: "Loglarıma Git",
            onPress: () => navigation.navigate("MyLogs"),
          },
        ]
      );
    } catch (error) {
      console.log("❌ Log kayıt hatası:", error.message);
      Alert.alert("Kayıt Hatası", error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Ekle</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── BÖLÜM: Oyun Seçimi ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>🎮 Oyun</Text>

            {selectedGame ? (
              // Seçili oyun göster
              <View style={styles.selectedGameCard}>
                <View style={styles.selectedGameInfo}>
                  <Text style={styles.selectedGameTitle} numberOfLines={1}>
                    {selectedGame.title}
                  </Text>
                  <Text style={styles.selectedGameMeta}>
                    {selectedGame.genre} • {selectedGame.release_year}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.changeGameBtn}
                  onPress={clearGame}
                >
                  <Text style={styles.changeGameText}>Değiştir</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Arama inputu
              <View>
                <View style={styles.searchRow}>
                  <Text style={styles.searchIconText}>🔍</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Oyun adını yaz..."
                    placeholderTextColor="#475569"
                    value={gameQuery}
                    onChangeText={searchGames}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {gameLoading && (
                    <ActivityIndicator size="small" color="#6366f1" />
                  )}
                </View>

                {/* Dropdown sonuçları */}
                {gameResults.length > 0 && (
                  <View style={styles.dropdown}>
                    <ScrollView
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="always"
                      style={{ maxHeight: 220 }}
                      showsVerticalScrollIndicator={false}
                    >
                      {gameResults.map((game, index) => (
                        <TouchableOpacity
                          key={game.id}
                          style={[
                            styles.dropdownItem,
                            index < gameResults.length - 1 &&
                              styles.dropdownItemBorder,
                          ]}
                          onPress={() => selectGame(game)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.dropdownTitle} numberOfLines={1}>
                            {game.title}
                          </Text>
                          <Text style={styles.dropdownMeta}>
                            {game.genre} • {game.release_year}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {gameQuery.length >= 2 &&
                  !gameLoading &&
                  gameResults.length === 0 && (
                    <Text style={styles.noResultText}>Sonuç bulunamadı</Text>
                  )}
              </View>
            )}
          </View>

          {/* ── BÖLÜM: Puan ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>⭐ Puan</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
                <Text style={styles.ratingMax}> / 5</Text>
              </View>
            </View>

            <RatingSlider value={rating} onChange={setRating} />

            <View style={styles.sliderTicks}>
              {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((v) => (
                <TouchableOpacity key={v} onPress={() => setRating(v)}>
                  <Text
                    style={[
                      styles.tickLabel,
                      rating === v && styles.tickLabelActive,
                    ]}
                  >
                    {v % 1 === 0 ? v : ""}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <StarDisplay rating={rating} />
          </View>

          {/* ── BÖLÜM: Tarih ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📅 Oynama Tarihi</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD  (örn: 2024-03-15)"
              placeholderTextColor="#475569"
              value={playedDate}
              onChangeText={setPlayedDate}
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="next"
            />
          </View>

          {/* ── BÖLÜM: Yorum ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>💬 Yorum</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Bu oyun hakkında düşüncelerini yaz..."
              placeholderTextColor="#475569"
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              returnKeyType="default"
            />
            <Text style={styles.charCount}>{review.length} karakter</Text>
          </View>

          {/* ── BÖLÜM: Etiketler ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>🏷️ Etiketler</Text>
            <TextInput
              style={styles.input}
              placeholder="Virgülle ayır: harika, zorlayıcı, hikaye-odaklı"
              placeholderTextColor="#475569"
              value={tagsInput}
              onChangeText={setTagsInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
            {/* Mevcut etiket önizlemesi */}
            {tagsInput.trim().length > 0 && (
              <View style={styles.tagPreview}>
                {tagsInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t.length > 0)
                  .map((tag, i) => (
                    <View key={i} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{tag}</Text>
                    </View>
                  ))}
              </View>
            )}
          </View>

          {/* ── Kaydet Butonu ── */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.saveIcon}>💾</Text>
                <Text style={styles.saveText}>Logu Kaydet</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Stiller
// ─────────────────────────────────────────────
const COLORS = {
  bg: "#0f172a",
  surface: "#1e293b",
  border: "#334155",
  primary: "#6366f1",
  primaryDark: "#4338ca",
  success: "#10b981",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  placeholder: "#475569",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
  },
  backText: {
    fontSize: 22,
    color: COLORS.textSecondary,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
  },

  // Bölümler
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  // Oyun arama
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIconText: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  // Dropdown
  dropdown: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  dropdownMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  noResultText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    paddingVertical: 8,
  },

  // Seçili oyun
  selectedGameCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.success,
    borderRadius: 10,
    padding: 14,
    gap: 12,
  },
  selectedGameInfo: {
    flex: 1,
  },
  selectedGameTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  selectedGameMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  changeGameBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  changeGameText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },

  // Rating
  ratingBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  ratingMax: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  stars: {
    marginTop: 10,
    fontSize: 22,
    color: "#facc15",
    letterSpacing: 2,
  },

  // Slider
  sliderWrapper: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: "#818cf8",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  sliderTicks: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginTop: 4,
  },
  tickLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    width: 20,
  },
  tickLabelActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  // Input
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 13,
  },
  charCount: {
    marginTop: 6,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "right",
  },

  // Tags
  tagPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tagChip: {
    backgroundColor: "#312e81",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  tagChipText: {
    fontSize: 12,
    color: "#a5b4fc",
    fontWeight: "500",
  },

  // Save Button
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 56,
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveIcon: {
    fontSize: 18,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

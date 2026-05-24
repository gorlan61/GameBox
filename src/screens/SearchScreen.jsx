import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { supabase } from "../lib/supabase";

// ─────────────────────────────────────────────
// Oyun Kartı
// ─────────────────────────────────────────────
function GameCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.cover_image }}
        style={styles.cover}
        resizeMode="cover"
      />

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.cardMeta}>
          {item.genre ? (
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{item.genre}</Text>
            </View>
          ) : null}
          <Text style={styles.yearText}>{item.release_year}</Text>
        </View>

        <Text style={styles.devText} numberOfLines={1}>
          🏢 {item.developer}
        </Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// Boş / İlk Durum
// ─────────────────────────────────────────────
function EmptyState({ hasSearched, query }) {
  if (!hasSearched) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🎮</Text>
        <Text style={styles.emptyTitle}>Oyun Ara</Text>
        <Text style={styles.emptyDesc}>
          Aramak istediğin oyunun adını yaz
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>😕</Text>
      <Text style={styles.emptyTitle}>Sonuç Bulunamadı</Text>
      <Text style={styles.emptyDesc}>
        "{query}" için hiç oyun bulunamadı.{"\n"}
        Farklı bir arama dene.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Ana Ekran
// ─────────────────────────────────────────────
export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch(text) {
    setQuery(text);

    if (text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const { data, error } = await supabase
      .from("games")
      .select("id, title, cover_image, genre, developer, release_year")
      .ilike("title", `%${text.trim()}%`)
      .order("release_year", { ascending: false })
      .limit(25);

    if (error) {
      console.log("❌ Arama hatası:", error.message);
      setResults([]);
    } else {
      setResults(data ?? []);
      console.log(
        `🔍 "${text}" için ${data?.length ?? 0} oyun bulundu`
      );
    }

    setLoading(false);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  }

  function handleGamePress(game) {
    console.log("🎮 Oyun seçildi — id:", game.id, "| title:", game.title);
    // Detay ekranı ileride eklenecek:
    // navigation.navigate("GameDetail", { game });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Oyun Ara</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Arama Kutusu ── */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Oyun adı gir..."
            placeholderTextColor="#475569"
            value={query}
            onChangeText={handleSearch}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sonuç sayısı */}
        {hasSearched && !loading && (
          <Text style={styles.resultCount}>
            {results.length} sonuç bulundu
          </Text>
        )}
      </View>

      {/* ── İçerik ── */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Aranıyor...</Text>
        </View>
      ) : (
        <FlashList
          data={results}
          keyExtractor={(item) => item.id}
          estimatedItemSize={88}
          renderItem={({ item }) => (
            <GameCard item={item} onPress={handleGamePress} />
          )}
          ListEmptyComponent={
            <EmptyState hasSearched={hasSearched} query={query} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Stiller
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "#f8fafc",
    fontWeight: "bold",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 40,
  },

  // Search
  searchWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#f8fafc",
    padding: 0,
  },
  clearIcon: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
  },
  resultCount: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "right",
    letterSpacing: 0.3,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748b",
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 32,
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 10,
    overflow: "hidden",
  },
  cover: {
    width: 60,
    height: 80,
    backgroundColor: "#0f172a",
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f8fafc",
    lineHeight: 20,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  genreBadge: {
    backgroundColor: "#312e81",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  genreText: {
    fontSize: 11,
    color: "#a5b4fc",
    fontWeight: "600",
  },
  yearText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  devText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: "#334155",
    paddingHorizontal: 12,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#cbd5e1",
  },
  emptyDesc: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 4,
  },
});

import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { supabase } from "../lib/supabase";
import { useAuthContext } from "../contexts/AuthContext";

// ─────────────────────────────────────────────
// Yardımcı: Puanı yıldız dizisine çevir
// ─────────────────────────────────────────────
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  return (
    <View style={styles.starsRow}>
      {Array(full)
        .fill(null)
        .map((_, i) => (
          <Text key={`f${i}`} style={styles.starFull}>
            ★
          </Text>
        ))}
      {half === 1 && <Text style={styles.starHalf}>⯨</Text>}
      {Array(empty)
        .fill(null)
        .map((_, i) => (
          <Text key={`e${i}`} style={styles.starEmpty}>
            ★
          </Text>
        ))}
      <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Log Kartı
// ─────────────────────────────────────────────
function LogCard({ log, onDelete }) {
  const game = log.games;
  const reviewPreview = log.review
    ? log.review.slice(0, 80) + (log.review.length > 80 ? "…" : "")
    : null;

  const formattedDate = log.played_date
    ? new Date(log.played_date).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <View style={styles.card}>
      {/* Sol: Kapak görseli */}
      <View style={styles.coverWrapper}>
        {game?.cover_image ? (
          <Image
            source={{ uri: game.cover_image }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverPlaceholderIcon}>🎮</Text>
          </View>
        )}
      </View>

      {/* Sağ: Bilgiler */}
      <View style={styles.cardContent}>
        {/* Oyun adı */}
        <Text style={styles.gameTitle} numberOfLines={2}>
          {game?.title ?? "Bilinmeyen Oyun"}
        </Text>

        {/* Puan */}
        <StarRating rating={log.rating ?? 0} />

        {/* Tarih */}
        {formattedDate && (
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>{formattedDate}</Text>
          </View>
        )}

        {/* Yorum önizleme */}
        {reviewPreview && (
          <Text style={styles.reviewText} numberOfLines={2}>
            {reviewPreview}
          </Text>
        )}

        {/* Tag'ler */}
        {log.tags && log.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {log.tags.slice(0, 3).map((tag, i) => (
              <View key={i} style={styles.tagChip}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {log.tags.length > 3 && (
              <Text style={styles.tagMore}>+{log.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>

      {/* Sil butonu */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(log.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// Boş Durum
// ─────────────────────────────────────────────
function EmptyState({ onAddLog }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Henüz log yok</Text>
      <Text style={styles.emptyDesc}>
        Oynadığın oyunları kaydetmeye başla!
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={onAddLog}>
        <Text style={styles.emptyButtonText}>+ İlk Logu Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// Ana Ekran
// ─────────────────────────────────────────────
export default function MyLogsScreen({ navigation }) {
  const { user } = useAuthContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ── Logları Supabase'den çek ──
  const fetchLogs = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("game_logs")
        .select(
          `
          id,
          rating,
          review,
          played_date,
          tags,
          created_at,
          games (
            id,
            title,
            cover_image,
            genre,
            release_year
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.log("❌ Log çekme hatası:", fetchError.message);
        setError(fetchError.message);
      } else {
        console.log(`✅ ${data?.length ?? 0} log yüklendi`);
        setLogs(data ?? []);
      }

      setLoading(false);
      setRefreshing(false);
    },
    [user.id]
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── Log Sil ──
  async function handleDelete(logId) {
    Alert.alert("Logu Sil", "Bu log kaydını silmek istediğine emin misin?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          const { error: deleteError } = await supabase
            .from("game_logs")
            .delete()
            .eq("id", logId)
            .eq("user_id", user.id);

          if (deleteError) {
            Alert.alert("Hata", "Log silinemedi: " + deleteError.message);
          } else {
            setLogs((prev) => prev.filter((l) => l.id !== logId));
            console.log("🗑 Log silindi:", logId);
          }
        },
      },
    ]);
  }

  // ── Render ──
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loglarım</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loglar yükleniyor…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loglarım</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Bir hata oluştu</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchLogs()}>
            <Text style={styles.retryText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
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
        <Text style={styles.headerTitle}>Loglarım</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddLog")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Özet */}
      {logs.length > 0 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            <Text style={styles.summaryCount}>{logs.length}</Text> oyun kaydedildi
          </Text>
          {logs.length > 0 && (
            <Text style={styles.summaryAvg}>
              Ort.{" "}
              <Text style={styles.summaryCount}>
                {(
                  logs.reduce((sum, l) => sum + (l.rating ?? 0), 0) / logs.length
                ).toFixed(1)}
              </Text>{" "}
              ⭐
            </Text>
          )}
        </View>
      )}

      {/* Liste */}
      <FlashList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LogCard log={item} onDelete={handleDelete} />
        )}
        estimatedItemSize={140}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchLogs(true)}
            tintColor="#6366f1"
            colors={["#6366f1"]}
          />
        }
        ListEmptyComponent={
          <EmptyState onAddLog={() => navigation.navigate("AddLog")} />
        }
      />
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: 0.5,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 24,
  },

  // Özet Çubuğu
  summaryBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  summaryText: {
    fontSize: 13,
    color: "#64748b",
  },
  summaryAvg: {
    fontSize: 13,
    color: "#64748b",
  },
  summaryCount: {
    color: "#6366f1",
    fontWeight: "700",
  },

  // Liste
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },

  // Log Kartı
  card: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 12,
    overflow: "hidden",
    padding: 12,
    gap: 12,
  },

  // Kapak Görseli
  coverWrapper: {
    width: 72,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  coverPlaceholderIcon: {
    fontSize: 28,
  },

  // Kart İçeriği
  cardContent: {
    flex: 1,
    gap: 6,
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f8fafc",
    lineHeight: 20,
  },

  // Yıldız Puanı
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  starFull: {
    color: "#f59e0b",
    fontSize: 14,
  },
  starHalf: {
    color: "#f59e0b",
    fontSize: 14,
  },
  starEmpty: {
    color: "#334155",
    fontSize: 14,
  },
  ratingNumber: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  // Meta
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaIcon: {
    fontSize: 11,
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
  },

  // Yorum
  reviewText: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 18,
    fontStyle: "italic",
  },

  // Tag'ler
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
  },
  tagChip: {
    backgroundColor: "#0f172a",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#334155",
  },
  tagText: {
    fontSize: 10,
    color: "#6366f1",
    fontWeight: "600",
  },
  tagMore: {
    fontSize: 10,
    color: "#64748b",
    alignSelf: "center",
  },

  // Sil Butonu
  deleteButton: {
    alignSelf: "flex-start",
    padding: 4,
  },
  deleteIcon: {
    fontSize: 16,
  },

  // Boş Durum
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f8fafc",
  },
  emptyDesc: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 16,
    backgroundColor: "#6366f1",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // Loading / Error
  loadingText: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
  },
  errorDesc: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#6366f1",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

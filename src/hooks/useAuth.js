import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Uygulama açıldığında mevcut session'ı kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Auth state değişikliklerini dinle (giriş, çıkış, token yenileme)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 Auth state değişti:', _event, session ? session.user.email : 'null');
      setSession(session);
      setLoading(false);
    });

    // Cleanup: component unmount olduğunda listener'ı kaldır
    return () => subscription.unsubscribe();
  }, []);

  // ──────────────────────────────────────────────
  // Kayıt Ol
  // ──────────────────────────────────────────────
  async function signUp(email, password) {
    console.log('📝 Kayıt deneniyor:', email);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log('❌ Kayıt hatası:', error.message);
      throw error;
    }
    console.log('✅ Kayıt başarılı:', data.user?.email);
    return data;
  }

  // ──────────────────────────────────────────────
  // Giriş Yap
  // ──────────────────────────────────────────────
  async function signIn(email, password) {
    console.log('🔑 Giriş deneniyor:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log('❌ Giriş hatası:', error.message);
      throw error;
    }
    console.log('✅ Giriş başarılı:', data.user?.email);
    return data;
  }

  // ──────────────────────────────────────────────
  // Çıkış Yap
  // ──────────────────────────────────────────────
  async function signOut() {
    console.log('👋 Çıkış yapılıyor...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('❌ Çıkış hatası:', error.message);
      throw error;
    }
    console.log('✅ Çıkış başarılı');
  }

  return {
    session,
    loading,
    user: session?.user ?? null,
    signUp,
    signIn,
    signOut,
  };
}

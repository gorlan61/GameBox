-- ============================================================
-- GameBox — Supabase Database Setup
-- SQL Editor'da bu dosyayı çalıştırın (tamamını seçip Run)
-- ============================================================


-- ────────────────────────────────────────────
-- 1) TABLOLAR
-- ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.games (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  cover_image   TEXT,
  genre         TEXT,
  developer     TEXT,
  release_year  INTEGER,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.game_logs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id      UUID        NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  rating       NUMERIC(3,1)
                 CHECK (rating >= 0.5 AND rating <= 5.0),
  review       TEXT,
  played_date  DATE,
  tags         TEXT[]      DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ────────────────────────────────────────────
-- 2) İNDEKSLER
-- ────────────────────────────────────────────

-- Oyun adına göre ILIKE araması için
CREATE INDEX IF NOT EXISTS idx_games_title
  ON public.games (lower(title));

-- Kullanıcıya göre log filtreleme için
CREATE INDEX IF NOT EXISTS idx_game_logs_user_id
  ON public.game_logs (user_id);

-- Oyuna göre log filtreleme için
CREATE INDEX IF NOT EXISTS idx_game_logs_game_id
  ON public.game_logs (game_id);

-- Tarihe göre sıralama için
CREATE INDEX IF NOT EXISTS idx_game_logs_created_at
  ON public.game_logs (created_at DESC);


-- ────────────────────────────────────────────
-- 3) ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────

ALTER TABLE public.games     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_logs ENABLE ROW LEVEL SECURITY;

-- games: herkes okuyabilir, sadece servis role yazabilir
CREATE POLICY "games_public_select"
  ON public.games FOR SELECT
  USING (true);

-- game_logs: kullanıcı yalnızca kendi kayıtlarına erişebilir
CREATE POLICY "logs_select_own"
  ON public.game_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "logs_insert_own"
  ON public.game_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "logs_update_own"
  ON public.game_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "logs_delete_own"
  ON public.game_logs FOR DELETE
  USING (auth.uid() = user_id);


-- ────────────────────────────────────────────
-- 4) ÖRNEK OYUN VERİSİ (15 popüler oyun)
-- ────────────────────────────────────────────

INSERT INTO public.games
  (title, cover_image, genre, developer, release_year, description)
VALUES

  (
    'The Last of Us Part I',
    'https://placehold.co/300x400/1e293b/94a3b8?text=The+Last+of+Us',
    'Action-Adventure',
    'Naughty Dog',
    2013,
    'Hayatta kalanların dolu, tehlikeli bir dünyada geçen, Joel ve Ellie''nin hikâyesi.'
  ),

  (
    'God of War (2018)',
    'https://placehold.co/300x400/1e293b/94a3b8?text=God+of+War',
    'Action-Adventure',
    'Santa Monica Studio',
    2018,
    'Kratos, oğlu Atreus ile İskandinav mitolojisinin derinliklerine doğru zorlu bir yolculuğa çıkar.'
  ),

  (
    'Minecraft',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Minecraft',
    'Sandbox',
    'Mojang Studios',
    2011,
    'Sonsuz, prosedürel üretilmiş dünyalarda inşa et, keşfet ve hayatta kal.'
  ),

  (
    'Grand Theft Auto V',
    'https://placehold.co/300x400/1e293b/94a3b8?text=GTA+V',
    'Action',
    'Rockstar Games',
    2013,
    'Los Santos''ta üç farklı suçlunun birbirine kenetlenen hikâyesi.'
  ),

  (
    'Red Dead Redemption 2',
    'https://placehold.co/300x400/1e293b/94a3b8?text=RDR2',
    'Action-Adventure',
    'Rockstar Games',
    2018,
    'Modern çağın şafağında Amerika''nın kalbinde geçen destansı bir hayatta kalma hikâyesi.'
  ),

  (
    'The Witcher 3: Wild Hunt',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Witcher+3',
    'RPG',
    'CD Projekt Red',
    2015,
    'Canavarlar avcısı Geralt, savaşın kasıp kavurduğu bir kıtada kayıp evlatlığını arar.'
  ),

  (
    'Cyberpunk 2077',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Cyberpunk+2077',
    'RPG',
    'CD Projekt Red',
    2020,
    'Dünyanın en tehlikeli şehri Gece Kenti''nde ölümsüzlüğün tek yolunu arayan paralı asker V''nin hikâyesi.'
  ),

  (
    'Elden Ring',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Elden+Ring',
    'Action RPG',
    'FromSoftware',
    2022,
    'Ara Topraklar''da parçalanan Elden Ring''i yeniden birleştirmek için çıkılan zorlu yolculuk.'
  ),

  (
    'The Legend of Zelda: Breath of the Wild',
    'https://placehold.co/300x400/1e293b/94a3b8?text=BotW',
    'Action-Adventure',
    'Nintendo EPD',
    2017,
    'Link, unutulmuş anılarını toparlarken Hyrule Krallığı''nı yüz yıl sonra felaketten kurtarmaya çalışır.'
  ),

  (
    'Horizon Zero Dawn',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Horizon+ZD',
    'Action RPG',
    'Guerrilla Games',
    2017,
    'Makine yaratıkların hüküm sürdüğü yeniden yabanileşmiş bir dünyada Aloy''un kökenleri keşfetme yolculuğu.'
  ),

  (
    'Sekiro: Shadows Die Twice',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Sekiro',
    'Action',
    'FromSoftware',
    2019,
    'Sengoku dönemi Japonya''sında efendisinin intikamını almak için çıkan tek kollu şinobinin hikâyesi.'
  ),

  (
    'Hollow Knight',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Hollow+Knight',
    'Metroidvania',
    'Team Cherry',
    2017,
    'Hallownest''in derinliklerinde, çökmüş böcek krallığının sırlarını keşfeden küçük bir şövalye.'
  ),

  (
    'Celeste',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Celeste',
    'Platformer',
    'Maddy Makes Games',
    2018,
    'Madeline, iç şeytanlarıyla yüzleşerek Celeste Dağı''nın zirvesine ulaşmaya çalışır.'
  ),

  (
    'Disco Elysium',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Disco+Elysium',
    'RPG',
    'ZA/UM',
    2019,
    'Hafızasını yitirmiş bir dedektifin kimliğini ve bir cinayetin sırrını aradığı çığır açan RPG.'
  ),

  (
    'Detroit: Become Human',
    'https://placehold.co/300x400/1e293b/94a3b8?text=Detroit',
    'Adventure',
    'Quantic Dream',
    2018,
    'Gelecekte üç androidin bakış açısından anlatılan, her kararın sonucu değiştirdiği interaktif drama.'
  );


-- ────────────────────────────────────────────
-- 5) KONTROL SORGUSU
-- (Başarılı kurulum sonrası 15 satır dönmeli)
-- ────────────────────────────────────────────

SELECT id, title, genre, release_year
FROM public.games
ORDER BY release_year DESC;

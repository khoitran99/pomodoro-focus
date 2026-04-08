const remoteMediaBaseUrl = (
  import.meta.env.VITE_MEDIA_BASE_URL ||
  import.meta.env.VITE_S3_BASE_URL ||
  ""
)
  .trim()
  .replace(/\/$/, "");

const remoteBackgroundFiles = [
  "anne-roston-zq-yhUkIyuI-unsplash.jpg",
  "clark-tibbs-oqStl2L5oxI-unsplash.jpg",
  "cristina-gottardi-CSpjU6hYo_0-unsplash.jpg",
  "daniel-velasquez-vJ2sZzL1wSc-unsplash.jpg",
  "garrett-parker-DlkF4-dbCOU-unsplash.jpg",
  "grant-ritchie-x1w_Q78xNEY-unsplash.jpg",
  "ian-dooley-DuBNA1QMpPA-unsplash.jpg",
  "julien-moreau-688Fna1pwOQ-unsplash.jpg",
  "karan-verma-_OALPYswQNg-unsplash.jpg",
  "matteo-catanese-PI8Hk-3ZcCU-unsplash.jpg",
  "matthew-hicks-k9oaPaG8EQw-unsplash.jpg",
  "milad-fakurian-DjjaZybYx4I-unsplash.jpg",
  "milad-fakurian-u8Jn2rzYIps-unsplash.jpg",
  "morgan-housel-iuSqwzGZv8M-unsplash.jpg",
  "nasa-V4ZksNimxLk-unsplash.jpg",
  "nick-fewings-DdIGZjmQzdA-unsplash.jpg",
  "nir-himi-SDKQYT69cSQ-unsplash.jpg",
  "piotr-chrobot-6oUsyeYXgTg-unsplash.jpg",
  "robert-lukeman-_RBcxo9AU-U-unsplash.jpg",
  "roger-starnes-sr-eMBS95ath_o-unsplash.jpg",
  "sebastian-svenson-LpbyDENbQQg-unsplash.jpg",
  "the-blowup-UN4PadDppAU-unsplash.jpg",
  "warren-umoh-aQVnWyP3AYA-unsplash.jpg",
] as const;

const remoteAudioFiles = [
  "(free) lofi type beat - be mine just mine (prod. yusei) [NzNQR0930V8].webm",
  "Afternoon [mq2E-G4B4Gs].webm",
  "Are You Lost [PJgEu_Ecuf8].webm",
  "Autumn day [xz0wad5gI0M].webm",
  "Best Mistake [1IK2humPjXY].webm",
  "Better Days [OxVK-U7g1Z4].webm",
  "Birds [xoopso_csJE].webm",
  "Blankets [HdXrkgZP438].webm",
  "Blind In Love [q3JP5qzbiEs].webm",
  "Breathin [jgtdtxl5N1Y].webm",
  "Bubble Gum [4ptgVKcTYsE].webm",
  "Call Me [xQnj-Gr2QB4].webm",
  "Childish Gambino - Redbone ｜ Lofi cover ｜ Instrumental ｜ AKAIA Music [CWUxKMF2w2U].webm",
  "Chill Day [XmN4pI0oD88].webm",
  "Christmas in my heart [8N4PDLZzGgc].webm",
  "Coffee Break [CUEHRYaTM1k].webm",
  "Coldest End [Rnm9AvnqtOg].webm",
  "Comfort Chain [UCHLxIN0_ag].webm",
  "Daybreak [y3PKcVd7UtM].webm",
  "Depths of Love [7DQqQqQ_hNU].webm",
  "Do you remember me？ [PT0X1zW8o0o].webm",
  "Dreaming [DFVuYoDVS_g].webm",
  "Dreams [tLcfHqjDpBg].webm",
  "Eddie Rohosy - Night Ride [vr9SR6hmTPw].webm",
  "Eternal Youth [_BWPNPtsZm8].webm",
  "Eyes Blue Like The Atlantic (feat. Subvrbs) [wORxUmEEOfA].webm",
  "Get You The Moon [JtN3eRbSHEM].webm",
  "Happiness [jpyuupOLCXo].webm",
  "I Dream [PaA05dKUBQk].webm",
  "I Need You [g3Uw9Dibq4E].webm",
  "I Need a Girl [cX_cEXDIrvk].webm",
  "I said I love you [BV848IMQc5s].webm",
  "I'll Keep You Safe [0I6fwrzXShk].webm",
  "I've loved you since I met you [XAqrhLKd75E].webm",
  "Inside [gz0PkovaTko].webm",
  "It's gonna be alright [O4inb_I9zqs].webm",
  "Ji-Eun's Sunset [Ej_onDLqCPA].webm",
  "Last Goodbye [mf7wKbBEfZ0].webm",
  "Lie [ih8ekUnyq3I].webm",
  "Like The Sun [zALMCUQB1r0].webm",
  "Like a Dream [MvavkqPG4wY].webm",
  "Live Stream Music [3gTxknlzan0].webm",
  "Love In Your Eyes [Ib91lUpV7EM].webm",
  "Lunar Drive [WryLH9_cRkM].webm",
  "Mirage [q7Al09rkX38].webm",
  "Moon [7z4mcZnQaoQ].webm",
  "Moon [ZScsZoy9ujI].webm",
  "My Girl [er-cuNAnYcI].webm",
  "My dear [vFExlJBGA78].webm",
  "ON TOP [GyJH6UnPfKg].webm",
  "Only Hope [sZ2wKK5gglw].webm",
  "Only to Love You Well [GxJtkQVWkhk].webm",
  "Peaceful Sleep [XPpYWLl-O10].webm",
  "Pink Tears [K82e0BrjYs0].webm",
  "Rain [Xvx6lmSpe0g].webm",
  "Rainforest [Arx6UcDo0T0].webm",
  "Reflection [BswAghW4930].webm",
  "Relax your mind [ckmjdMD_r-w].webm",
  "Replay [dy1T4wqUQps].webm",
  "School Rooftop - Slowed Down Version [olQa3ATtzVI].webm",
  "Silhouettes [9mX2Hy7ReNc].webm",
  "Smile [TtANRh9ewO4].webm",
  "Snowman [3lUtzMrRV04].webm",
  "Sorry [NC0UuxiJA98].webm",
  "Sorry, I Like You [oeLf0DX70Q0].webm",
  "Soulful [fs0BCIUQ7Ws].webm",
  "Steven Universe [7_RVoLCx7MU].webm",
  "Still Miss You [6Z-bYvUQhg0].webm",
  "Still [1FxeCa6kypU].webm",
  "Summer Night [G2PMT-RYBtE].webm",
  "Sweetly [jVOnPgW34TI].webm",
  "Swimming [c9JHPPCXbVM].webm",
  "The Girl I Haven't Met [Ggddxkj8tU0].webm",
  "Thermal Baths [So9dRN3kg3I].webm",
  "Time [G6XJ4HkCbPA].webm",
  "Velocities [JgI6z6aQhEA].webm",
  "Velvet Garden [ULgPNlTfinM].webm",
  "We are strangers again [TCimw5U31Ww].webm",
  "When I See You [xbxW2_icZjM].webm",
  "When i was sad [4xCz4hILDek].webm",
  "Where are you now [tfk6S0OkvJY].webm",
  "Ylang Ylang [kBGBybrkttA].webm",
  "You're Beautiful [GjsSQKs5N_k].webm",
  "You're my little flower [2oXgogB73Vk].webm",
  "Your Light [x7j4yvUq08k].webm",
  "aruarian dance [qYcoJpqCha4].webm",
  "bossa uh [FSnuF1FPSIU].webm",
  "faces [S8p0crahq3A].webm",
  "for when it’s warmer [hG6YzmvbosI].webm",
  "in your arms [Ce6so35INYU].webm",
  "island [Q2DY47zWSpU].webm",
  "just with my guitar [M0ecZFXs-VM].webm",
  "kudasaibeats - the girl i haven't met [XDpoBc8t6gE].webm",
  "snowfall [OtLcqr3RQJY].webm",
  "someone [0MUqeshR4w0].webm",
] as const;

export interface ThemeAsset {
  id: string;
  name: string;
  fullSrc: string;
  thumbnailSrc: string;
}

export interface AudioTrackManifest {
  id: string;
  name: string;
  src: string;
}

export const hasRemoteMedia = remoteMediaBaseUrl.length > 0;

function cleanDisplayName(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/-[A-Za-z0-9_-]+-unsplash/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toThemeId(filename: string) {
  return `bg-${filename.toLowerCase().replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]+/g, "-")}`;
}

function encodeAssetPath(filename: string) {
  return filename
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildRemoteMediaUrl(folder: string, filename: string) {
  return `${remoteMediaBaseUrl}/${folder}/${encodeAssetPath(filename)}`;
}

function buildLocalMediaUrl(folder: string, filename: string) {
  return `/${folder}/${encodeAssetPath(filename)}`;
}

export const themes: ThemeAsset[] = hasRemoteMedia
  ? remoteBackgroundFiles.map((filename) => ({
      id: toThemeId(filename),
      name: cleanDisplayName(filename) || "Background",
      fullSrc: buildRemoteMediaUrl("background", filename),
      thumbnailSrc: buildRemoteMediaUrl("thumbnails", filename),
    }))
  : remoteBackgroundFiles.map((filename) => ({
      id: toThemeId(filename),
      name: cleanDisplayName(filename) || "Background",
      fullSrc: buildLocalMediaUrl("background", filename),
      thumbnailSrc: buildLocalMediaUrl("thumbnails", filename),
    }));

export const imageThemes = themes.reduce<Record<string, string>>(
  (accumulator, theme) => {
    accumulator[theme.id] = theme.fullSrc;
    return accumulator;
  },
  {},
);

export const audioTracks: AudioTrackManifest[] = hasRemoteMedia
  ? remoteAudioFiles.map((filename) => ({
      id: filename,
      name: cleanDisplayName(filename) || "Unknown Track",
      src: buildRemoteMediaUrl("music", filename),
    }))
  : remoteAudioFiles.map((filename) => ({
      id: filename,
      name: cleanDisplayName(filename) || "Unknown Track",
      src: buildLocalMediaUrl("music", filename),
    }));

import React, { useState, useEffect, useRef } from "react";
import {
  Grid3x3, Rows, SlidersHorizontal, X, ChevronLeft, ChevronRight,
  Plus, Trash2, Music, Volume2, VolumeX, Upload,
} from "lucide-react";

/**
 * PHASE 10 — Gallery + Story + Music
 *
 * gallery      -> { id, image_url, caption, sort_order }
 * story_items  -> { id, date, title, description, image_url, sort_order }
 * weddings     -> music_url, music_enabled, music_volume  (added in Phase 6 schema)
 */

function useGoogleFonts() {
  useEffect(() => {
    const id = "wedding-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const seedPhotos = [
  { id: 1, url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop", caption: "الخطوبة" },
  { id: 2, url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop", caption: "جلسة تصوير" },
  { id: 3, url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=600&auto=format&fit=crop", caption: "" },
  { id: 4, url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop", caption: "" },
  { id: 5, url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop", caption: "" },
  { id: 6, url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop", caption: "" },
];

const seedStory = [
  { id: 1, date: "2021", title: "أول لقاء ❤️", description: "التقينا لأول مرة في حفل صديق مشترك." },
  { id: 2, date: "2023", title: "بداية قصتنا", description: "قررنا أن نبدأ رحلتنا معاً." },
  { id: 3, date: "2025", title: "الخطوبة 💍", description: "تقدم محمد لخطبة سارة أمام العائلتين." },
  { id: 4, date: "2026", title: "يومنا الكبير 💒", description: "زفافنا الذي طال انتظاره." },
];

/* ------------------------------- Gallery ------------------------------- */
function Lightbox({ photos, index, onClose, onNav }) {
  if (index === null) return null;
  const photo = photos[index];
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 left-4 text-white"><X size={24} /></button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        className="absolute right-4 text-white top-1/2 -translate-y-1/2"
      >
        <ChevronRight size={28} />
      </button>
      <img src={photo.url} alt={photo.caption} className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
      <button
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
        className="absolute left-4 text-white top-1/2 -translate-y-1/2"
      >
        <ChevronLeft size={28} />
      </button>
      {photo.caption && (
        <p className="absolute bottom-6 text-white text-sm">{photo.caption}</p>
      )}
    </div>
  );
}

function GallerySection({ photos }) {
  const [view, setView] = useState("grid"); // grid | masonry | slider
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const nav = (dir) =>
    setLightboxIndex((i) => (i + dir + photos.length) % photos.length);

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs">قصتنا ❤️ — معرض الصور</p>
        <div className="flex gap-1 bg-white rounded-full border border-[#E7D9BE] p-1">
          {[["grid", Grid3x3], ["masonry", Rows], ["slider", SlidersHorizontal]].map(([id, Icon]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center ${view === id ? "bg-[#1E1A16] text-white" : "text-[#1E1A16]/50"}`}
            >
              <Icon size={13} />
            </button>
          ))}
        </div>
      </div>

      {view === "grid" && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p, i) => (
            <button key={p.id} onClick={() => setLightboxIndex(i)} className="aspect-square rounded-lg overflow-hidden">
              <img src={p.url} alt={p.caption} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {view === "masonry" && (
        <div className="columns-2 md:columns-3 gap-2 [&>*]:mb-2">
          {photos.map((p, i) => (
            <button key={p.id} onClick={() => setLightboxIndex(i)} className="block w-full rounded-lg overflow-hidden break-inside-avoid">
              <img
                src={p.url}
                alt={p.caption}
                className="w-full object-cover hover:opacity-90 transition-opacity"
                style={{ height: i % 3 === 0 ? "220px" : "150px" }}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {view === "slider" && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setLightboxIndex(i)}
              className="shrink-0 w-40 h-52 rounded-xl overflow-hidden snap-start"
            >
              <img src={p.url} alt={p.caption} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <Lightbox photos={photos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={nav} />
    </div>
  );
}

/* -------------------------------- Story -------------------------------- */
function StoryEditor({ items, setItems }) {
  const update = (id, patch) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
  const add = () =>
    setItems((prev) => [...prev, { id: Date.now(), date: "", title: "", description: "" }]);

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs">قصة الحب — الخط الزمني</p>
        <button onClick={add} className="flex items-center gap-1 text-xs bg-[#1E1A16] text-white px-3 py-1.5 rounded-full">
          <Plus size={12} /> إضافة حدث
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <div key={it.id} className="bg-white rounded-xl border border-[#E7D9BE] p-4 flex gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex gap-2">
                <input
                  value={it.date}
                  onChange={(e) => update(it.id, { date: e.target.value })}
                  placeholder="السنة"
                  className="w-20 border border-[#E7D9BE] rounded-lg px-2 py-1.5 text-xs"
                />
                <input
                  value={it.title}
                  onChange={(e) => update(it.id, { title: e.target.value })}
                  placeholder="العنوان"
                  className="flex-1 border border-[#E7D9BE] rounded-lg px-2 py-1.5 text-sm"
                />
              </div>
              <textarea
                value={it.description}
                onChange={(e) => update(it.id, { description: e.target.value })}
                placeholder="الوصف"
                rows={2}
                className="w-full border border-[#E7D9BE] rounded-lg px-2 py-1.5 text-xs resize-none"
              />
            </div>
            <button onClick={() => remove(it.id)} className="text-[#5B1F23]/60 hover:text-[#5B1F23] shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {/* preview timeline */}
      <div className="mt-6 relative pr-4 border-r-2 border-[#E7D9BE]">
        {items.map((it) => (
          <div key={it.id} className="relative pb-6 last:pb-0">
            <span className="absolute -right-[21px] top-1 w-3 h-3 rounded-full bg-[#B8935A] border-2 border-[#F6F1E7]" />
            <p className="text-[#B8935A] text-xs mb-0.5">{it.date}</p>
            <p className="text-[#1E1A16] text-sm" style={{ fontFamily: "'Aref Ruqaa', serif" }}>{it.title}</p>
            {it.description && <p className="text-[#1E1A16]/60 text-xs mt-0.5">{it.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Music -------------------------------- */
function MusicPanel({ enabled, setEnabled, volume, setVolume, fileName, setFileName }) {
  const inputRef = useRef(null);
  return (
    <div dir="rtl" className="bg-white rounded-2xl border border-[#E7D9BE] p-5" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="flex items-center gap-2 mb-4">
        <Music size={16} className="text-[#B8935A]" />
        <p className="text-[#1E1A16] text-sm">الموسيقى الخلفية</p>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 border border-dashed border-[#E7D9BE] rounded-xl py-4 text-xs text-[#1E1A16]/60 mb-4"
      >
        <Upload size={14} />
        {fileName ? fileName : "رفع ملف MP3"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg"
        className="hidden"
        onChange={(e) => e.target.files[0] && setFileName(e.target.files[0].name)}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-[#1E1A16]/70">تفعيل الموسيقى</span>
        <button
          onClick={() => setEnabled((v) => !v)}
          className={`w-10 h-6 rounded-full relative transition-colors ${enabled ? "bg-[#B8935A]" : "bg-[#1E1A16]/15"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${enabled ? "right-0.5" : "right-4.5"}`} style={{ right: enabled ? "2px" : "18px" }} />
        </button>
      </div>

      <div>
        <div className="flex justify-between text-[11px] text-[#1E1A16]/60 mb-1">
          <span>مستوى الصوت</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          disabled={!enabled}
          className="w-full accent-[#B8935A] disabled:opacity-40"
        />
      </div>

      <div className="flex items-center gap-2 mt-4 text-[11px] text-[#1E1A16]/40">
        {enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
        هكذا سيظهر زر التحكم في الصوت للمدعو داخل الدعوة (لن تبدأ الموسيقى قبل أول تفاعل).
      </div>
    </div>
  );
}

export default function GalleryStoryMusicDemo() {
  useGoogleFonts();
  const [tab, setTab] = useState("gallery");
  const [story, setStory] = useState(seedStory);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [fileName, setFileName] = useState("");

  return (
    <div dir="rtl" className="min-h-screen bg-[#F6F1E7] px-6 py-10" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="max-w-md mx-auto">
        <p className="text-[#B8935A] tracking-[0.3em] text-xs mb-2">PHASE 10 — GALLERY / STORY / MUSIC</p>
        <div className="flex gap-2 mb-6">
          {[["gallery", "معرض الصور"], ["story", "قصتنا"], ["music", "الموسيقى"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-3 py-1.5 rounded-full text-xs ${tab === id ? "bg-[#1E1A16] text-white" : "bg-white border border-[#E7D9BE] text-[#1E1A16]/70"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "gallery" && <GallerySection photos={seedPhotos} />}
        {tab === "story" && <StoryEditor items={story} setItems={setStory} />}
        {tab === "music" && (
          <MusicPanel
            enabled={musicEnabled}
            setEnabled={setMusicEnabled}
            volume={volume}
            setVolume={setVolume}
            fileName={fileName}
            setFileName={setFileName}
          />
        )}
      </div>
    </div>
  );
}

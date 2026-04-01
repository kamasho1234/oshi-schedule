"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { OshiForm } from "@/components/oshi/OshiForm";
import { useOshi } from "@/hooks/useOshi";
import { OSHI_GENRE_LABELS } from "@/lib/constants";
import { formatDate, generateId, getNow } from "@/lib/utils";
import { compressImage } from "@/lib/image";
import type { Oshi, OshiImage } from "@/types";
import Link from "next/link";

/* SNS platform icon components (inline, matching SnsLinkList) */
const platformIcons: Record<string, React.ReactNode> = {
  twitter: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  instagram: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  tiktok: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  other: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
};

export default function OshiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getById, edit, remove } = useOshi();
  const [oshi, setOshi] = useState<Oshi | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [isPhotosOpen, setIsPhotosOpen] = useState(false);
  const [isPhotoEditing, setIsPhotoEditing] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const oshiRef = useRef<Oshi | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getById(id);
      setOshi(data);
      oshiRef.current = data;
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async (updated: Oshi) => {
    await edit(updated);
    setOshi(updated);
    oshiRef.current = updated;
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    await remove(id);
    router.push("/oshi");
  };

  // --- Photo management ---
  const allPhotos: OshiImage[] = [];
  if (oshi) {
    if (oshi.image) allPhotos.push({ id: "main", data: oshi.image, createdAt: oshi.createdAt });
    if (oshi.images) oshi.images.forEach((img) => { if (img.data !== oshi.image) allPhotos.push(img); });
  }

  const savePhotos = async (mainImage: string | undefined, gallery: OshiImage[]) => {
    const current = oshiRef.current;
    if (!current) return;
    const updated = { ...current, image: mainImage, images: gallery, updatedAt: getNow() };
    await edit(updated);
    setOshi(updated);
    oshiRef.current = updated;
  };

  const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const current = oshiRef.current;
    if (!e.target.files || !current) return;
    const newImgs: OshiImage[] = [];
    for (const file of Array.from(e.target.files)) {
      newImgs.push({ id: generateId(), data: await compressImage(file), createdAt: getNow() });
    }
    await savePhotos(current.image, [...(current.images || []), ...newImgs]);
    e.target.value = "";
  };

  const handleDeletePhoto = async (imageId: string) => {
    const current = oshiRef.current;
    if (!current) return;
    if (imageId === "main") {
      await savePhotos(undefined, current.images || []);
    } else {
      await savePhotos(current.image, (current.images || []).filter((img) => img.id !== imageId));
    }
  };

  const handleMovePhoto = async (fromIdx: number, toIdx: number) => {
    if (!oshiRef.current || fromIdx === toIdx) return;
    const items = [...allPhotos];
    const [moved] = items.splice(fromIdx, 1);
    items.splice(toIdx, 0, moved);
    const newMain = items[0]?.data;
    const newGallery = items.slice(1).map((img) => ({
      id: img.id === "main" ? generateId() : img.id,
      data: img.data, caption: img.caption, createdAt: img.createdAt,
    }));
    await savePhotos(newMain, newGallery);
  };

  const color = oshi?.themeColor || "var(--color-primary)";

  if (loading) {
    return (
      <div className="min-h-screen bg-pageBg">
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-divider border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!oshi) {
    return (
      <div className="min-h-screen bg-pageBg">
        <div className="text-center py-16">
          <p className="text-sub">推しが見つかりません</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => router.push("/oshi")}
          >
            一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  const heroImage = oshi.image || (oshi.images && oshi.images.length > 0 ? oshi.images[0].data : null);

  return (
    <div className="min-h-screen pb-28 relative">
      {/* === Full-screen background image === */}
      <div className="fixed inset-0 z-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${oshi.themeColor || "#ec4899"}dd 0%, ${oshi.themeColor || "#ec4899"}44 50%, #000 100%)`,
            }}
          />
        )}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
      </div>

      {/* === Top navigation === */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4">
        <button
          onClick={() => router.push("/oshi")}
          className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setIsEditOpen(true)}
          className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      {/* === Main content overlaid on background === */}
      <div className="relative z-10 px-4 pt-40">
        {/* Genre + type badge */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md border border-white/20"
            style={{ backgroundColor: `${oshi.themeColor || "#ec4899"}88`, color: "#fff" }}
          >
            {OSHI_GENRE_LABELS[oshi.genre]}
          </span>
          {oshi.oshiType === "group" && (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md border border-white/20 bg-white/15 text-white">
              👥 グループ
            </span>
          )}
        </div>

        {/* Name */}
        <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
          {oshi.name}
        </h1>
        {oshi.oshiType !== "group" && oshi.group && (
          <p className="text-base text-white/70 mt-1 font-medium">{oshi.group}</p>
        )}

        {/* SNS icon row */}
        {oshi.snsLinks.length > 0 && (
          <div className="flex items-center gap-2.5 mt-5">
            {oshi.snsLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white backdrop-blur-md border border-white/25 transition-transform hover:scale-110"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                title={link.label || link.platform}
              >
                {platformIcons[link.platform] || platformIcons.other}
              </a>
            ))}
          </div>
        )}

        {/* Info cards area */}
        <div className="mt-8 space-y-3">
          {/* Birthday */}
          {oshi.birthday && oshi.showBirthday !== false && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${oshi.themeColor || "#ec4899"}66` }}
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 22h20" />
                  <path d="M3.5 22v-6a1 1 0 011-1h15a1 1 0 011 1v6" />
                  <path d="M5 15v-2a1 1 0 011-1h12a1 1 0 011 1v2" />
                  <path d="M12 4v8" />
                  <path d="M12 4c-.5-1.5-2-2-2-2s1 .5 2 2z" />
                  <path d="M12 4c.5-1.5 2-2 2-2s-1 .5-2 2z" />
                  <path d="M8 12v3" />
                  <path d="M16 12v3" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-white/50 font-medium">Birthday</p>
                <p className="text-sm text-white font-semibold">{formatDate(oshi.birthday)}</p>
              </div>
            </div>
          )}

          {/* Members (group type) */}
          {oshi.oshiType === "group" && oshi.members && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Members</h3>
              <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                {oshi.members}
              </p>
            </div>
          )}

          {/* Memo */}
          {oshi.memo && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Memo</h3>
              <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                {oshi.memo}
              </p>
            </div>
          )}

          {/* Photo wall section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handleAddPhotos} className="hidden" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setIsPhotosOpen(!isPhotosOpen)}
                className="flex items-center gap-2 text-left flex-1"
              >
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-bold text-white">フォトウォール</span>
                <span className="text-xs text-white/50">{allPhotos.length}枚</span>
                <svg className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isPhotosOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isPhotosOpen && (
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {allPhotos.length > 1 && (
                    <button
                      onClick={() => setIsPhotoEditing(!isPhotoEditing)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                      style={{ backgroundColor: isPhotoEditing ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.1)", color: isPhotoEditing ? "#fca5a5" : "rgba(255,255,255,0.6)" }}
                    >
                      {isPhotoEditing ? "完了" : "並替"}
                    </button>
                  )}
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            {isPhotosOpen && (
              <div className="px-3 pb-3">
                {allPhotos.length === 0 ? (
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="w-full py-8 rounded-xl border border-dashed border-white/20 text-white/40 text-sm"
                  >
                    タップして画像を追加
                  </button>
                ) : isPhotoEditing ? (
                  /* Edit mode - list */
                  <div className="space-y-1.5">
                    {allPhotos.map((photo, idx) => (
                      <div key={photo.id} className="flex items-center gap-2 p-1.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                        <img src={photo.data} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        <span className="flex-1 text-xs text-white/60">{idx === 0 ? "メイン" : `${idx + 1}`}</span>
                        <button
                          onClick={() => handleMovePhoto(idx, idx - 1)}
                          disabled={idx === 0}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 disabled:opacity-20"
                          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button
                          onClick={() => handleMovePhoto(idx, idx + 1)}
                          disabled={idx === allPhotos.length - 1}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 disabled:opacity-20"
                          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400/70 hover:text-red-300"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* View mode - grid */
                  <>
                    <div className="grid grid-cols-3 gap-1.5">
                      {allPhotos.map((photo, idx) => (
                        <div key={photo.id} className="relative">
                          <img
                            src={photo.data}
                            alt=""
                            className="w-full aspect-square object-cover rounded-lg"
                            style={idx === 0 ? { border: `2px solid ${oshi.themeColor || "#ec4899"}` } : undefined}
                          />
                          {idx === 0 && (
                            <span
                              className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white leading-none"
                              style={{ backgroundColor: oshi.themeColor || "#ec4899" }}
                            >
                              メイン
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/oshi/${oshi.id}/photos`}
                      className="block text-center text-xs text-white/60 hover:text-white/90 mt-2.5 py-1 transition-colors"
                    >
                      すべての写真を見る →
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Delete area */}
          <div className="pt-4">
            {isDeleteConfirm ? (
              <div className="space-y-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-red-400/30">
                <p className="text-sm text-red-300 text-center">
                  「{oshi.name}」を削除しますか？この操作は取り消せません。
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setIsDeleteConfirm(false)}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    className="flex-1"
                  >
                    削除する
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsDeleteConfirm(true)}
                className="w-full text-center text-sm text-red-300/60 hover:text-red-300 py-2 transition-colors"
              >
                この推しを削除
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="推しを編集"
      >
        <OshiForm
          initial={oshi}
          onSave={handleSave}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>
    </div>
  );
}

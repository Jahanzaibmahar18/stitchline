import { useEffect, useRef, useState } from "react";
import { api, mediaUrl, uploadImage } from "../../api/admin/client";

export default function ProductImageFields({
  image,
  gallery,
  onImageChange,
  onGalleryChange,
}) {
  const [media, setMedia] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [target, setTarget] = useState("primary"); // primary | gallery
  const [showLibrary, setShowLibrary] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);

  const galleryList = Array.isArray(gallery)
    ? gallery
    : String(gallery || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  useEffect(() => {
    api("/api/admin/media")
      .then((res) => setMedia(res.data.items || []))
      .catch(() => setMedia([]));
  }, []);

  const applyPath = (path) => {
    if (!path) return;
    if (target === "primary") {
      onImageChange(path);
      if (!galleryList.includes(path)) {
        onGalleryChange([...galleryList, path]);
      }
    } else {
      if (!galleryList.includes(path)) {
        onGalleryChange([...galleryList, path]);
      }
      if (!image) onImageChange(path);
    }
    setMessage("Image applied.");
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage("");
    try {
      const res = await uploadImage(file);
      applyPath(res.data.url);
      setMedia((prev) => {
        if (prev.some((m) => m.url === res.data.url)) return prev;
        return [{ name: res.data.name, url: res.data.url }, ...prev];
      });
    } catch (err) {
      setMessage(err.message || "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleUrlAdd = () => {
    const value = urlInput.trim();
    if (!value) return;
    applyPath(value);
    setUrlInput("");
  };

  const removeGalleryItem = (path) => {
    const next = galleryList.filter((g) => g !== path);
    onGalleryChange(next);
    if (image === path) {
      onImageChange(next[0] || "");
    }
  };

  return (
    <div className="rounded-lg border border-[#E4D2BA] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[#4A250F]">
        Product images
      </h3>

      <div className="mb-3 flex flex-wrap gap-2 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="image-target"
            checked={target === "primary"}
            onChange={() => setTarget("primary")}
          />
          Set as primary
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="image-target"
            checked={target === "gallery"}
            onChange={() => setTarget("gallery")}
          />
          Add to gallery
        </label>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowLibrary((v) => !v)}
          className="rounded-md border border-[#D9BFA0] px-3 py-2 text-sm text-[#4A250F]"
        >
          {showLibrary ? "Hide media library" : "Gallery / Media"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="rounded-md border border-[#D9BFA0] px-3 py-2 text-sm text-[#4A250F] disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Image URL or /media/filename.jpeg"
          className="min-w-[220px] flex-1 rounded-md border border-[#D9BFA0] px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleUrlAdd}
          className="rounded-md bg-[#4A250F] px-3 py-2 text-sm text-[#FAF3E8]"
        >
          Add URL
        </button>
      </div>

      {message ? (
        <p className="mb-3 text-xs text-[#765236]">{message}</p>
      ) : null}

      {showLibrary ? (
        <div className="mb-4 max-h-56 overflow-y-auto rounded-md border border-[#E4D2BA] bg-[#FAF3E8] p-3">
          {media.length === 0 ? (
            <p className="text-sm text-[#765236]">No media files found.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {media.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => applyPath(item.url)}
                  className="overflow-hidden rounded border border-[#D9BFA0] bg-white"
                  title={item.name}
                >
                  <img
                    src={mediaUrl(item.url)}
                    alt={item.name}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-[#765236]">
            Primary preview
          </p>
          {image ? (
            <img
              src={mediaUrl(image)}
              alt="Primary"
              className="h-40 w-full rounded-md object-cover bg-[#EFE3D2]"
            />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md bg-[#EFE3D2] text-sm text-[#765236]">
              No primary image
            </div>
          )}
          <input
            value={image}
            onChange={(e) => onImageChange(e.target.value)}
            className="mt-2 w-full rounded-md border border-[#D9BFA0] px-3 py-2 text-sm"
            placeholder="/media/bag1.jpeg"
            required
          />
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-[#765236]">
            Gallery preview
          </p>
          <div className="grid grid-cols-3 gap-2">
            {galleryList.length ? (
              galleryList.map((src) => (
                <div key={src} className="relative">
                  <img
                    src={mediaUrl(src)}
                    alt=""
                    className="aspect-square w-full rounded object-cover bg-[#EFE3D2]"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(src)}
                    className="absolute right-1 top-1 rounded bg-white/90 px-1 text-xs text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex h-24 items-center justify-center rounded-md bg-[#EFE3D2] text-sm text-[#765236]">
                No gallery images
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/db";
import MediaGallery from "@/components/admin/MediaGallery";

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({
    where: { deletedAt: null },
    orderBy: { uploadedAt: "desc" },
    take: 100,
    select: {
      id: true,
      fileName: true,
      mimeType: true,
      size: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-5 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-mono text-brand uppercase tracking-wider">MEDIA MANAGEMENT</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-0.5">Media Library</h1>
          <p className="text-xs text-gray-400 mt-1">{assets.length} assets catalogued in repository</p>
        </div>
        <label className="cursor-pointer px-5 py-2.5 rounded-full bg-brand text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20">
          + Upload Asset
          <input type="file" className="hidden" multiple accept="image/*,.pdf,.docx" />
        </label>
      </div>

      {/* Upload Dropzone */}
      <div className="border-2 border-dashed border-brand/30 rounded-2xl p-10 text-center bg-brand/5 hover:bg-brand/10 transition-colors cursor-pointer">
        <span className="text-brand font-mono text-3xl block mb-2">🖼️</span>
        <p className="text-sm font-semibold text-white mb-1">Drag & drop files here to upload</p>
        <p className="text-xs text-gray-400">Supported: JPG, PNG, WebP, SVG, PDF, DOCX · Max 10MB each</p>
      </div>

      {/* Media Gallery */}
      <MediaGallery initialAssets={assets} />
    </div>
  );
}

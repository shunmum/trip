import { Camera, Image as ImageIcon } from 'lucide-react';

export function MemoryPage() {
  return (
    <div className="p-4 space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">思い出</h2>
        <p className="text-sm text-gray-600 mt-1">旅行の写真と感想を振り返る</p>
      </div>

      {/* Photo Grid Placeholder */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-bold text-gray-800">写真ギャラリー</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <div
              key={index}
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors font-medium flex items-center justify-center gap-2">
          <Camera className="w-5 h-5" />
          <span>写真を追加</span>
        </button>
      </section>

      {/* Trip Stats (Optional fun section) */}
      <section className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">旅行の記録</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">12</div>
            <div className="text-sm text-gray-600 mt-1">訪れた場所</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-600">45</div>
            <div className="text-sm text-gray-600 mt-1">撮った写真</div>
          </div>
        </div>
      </section>
    </div >
  );
}

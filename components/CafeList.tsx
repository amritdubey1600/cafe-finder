import { CafeType } from "@/app/page";
import { Coffee, AlertCircle, Loader2, RefreshCcw, ChevronRight } from "lucide-react";

export default function CafeList({
  cafes, 
  loading, 
  error,
  onCafeClick
}: {
  cafes: CafeType[], 
  loading?: boolean, 
  error?: string | null,
  onCafeClick?: (cafe: CafeType) => void
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Nearby Cafes</h2>
          <span className="bg-pink-100 text-pink-700 text-sm font-semibold px-3 py-1 rounded-full">
            {cafes.length}
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading cafes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center p-4 mb-4">
              <AlertCircle className="w-14 h-14 text-red-500" />
            </div>
            <p className="text-red-600 font-medium mb-2">Error</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 hover:cursor-pointer text-white rounded-lg transition-colors font-medium"
            >
              <RefreshCcw className="w-4 h-4"/>
              <span>Refresh Application</span>
            </button>
          </div>
        ) : cafes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Coffee className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No cafes found</p>
            <p className="text-sm text-gray-400">Try moving the map or selecting a different location</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cafes.map((cafe) => (
              <div
                key={cafe.id}
                onClick={() => onCafeClick?.(cafe)}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-pink-300 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-pink-100 transition-colors">
                    <Coffee className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors truncate">
                      {cafe.name || "Unnamed Cafe"}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
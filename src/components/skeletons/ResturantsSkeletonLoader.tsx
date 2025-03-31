const ResturantSkeletonCard = () => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between animate-pulse">
            <div className="flex items-start sm:items-center gap-4 w-full">
            <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
                <div className="w-40 h-4 bg-gray-200 rounded"></div>
                <div className="w-32 h-3 bg-gray-200 rounded"></div>
                <div className="flex gap-2 mt-3">
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
            </div>
            </div>
            <div className="w-10 h-4 bg-gray-200 rounded mt-3 sm:mt-0"></div>
        </div>
    )
}
  
export default ResturantSkeletonCard
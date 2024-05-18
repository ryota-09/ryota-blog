const SkeltonCard = () => {
  return (
    <div className="bg-white border-2 border-gray-200 overflow-hidden p-6 h-full flex flex-col">
      <div className="block text-lg md:text-xl leading-tight font-medium transition duration-200 bg-gray-200 h-6 w-full mb-4 animate-pulse" />
      <div className="flex gap-4 h-full flex-col-reverse md:flex-row">
        <div className="md:w-[70%] flex flex-col justify-between">
          <div>
            <div className="mt-2 bg-gray-200 h-4 w-full animate-pulse" />
            <div className="mt-2 bg-gray-200 h-4 w-full animate-pulse" />
            <div className="mt-2 bg-gray-200 h-4 w-full animate-pulse" />
          </div>
          <div className="flex justify-end">
            <div className="mt-4 bg-gray-200 h-8 w-32 animate-pulse" />
          </div>
        </div>
        <div className="bg-gray-200 w-full h-[200px] md:h-full mt-2 animate-pulse block md:w-[45%] lg:w-[28%] xl:w-[45%]" />
      </div>
    </div>
  )
}
export default SkeltonCard
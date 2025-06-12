const Loading = () => {
  return (
    <aside className='h-[180px] flex border'>
      <div className='flex-1 my-1 md:my-4 px-2 md:px-6'>
        <div className='rounded h-8 bg-gray-200 mt-2 md:mt-4 animate-pulse'></div>
        <div className='rounded h-8 bg-gray-200 mt-2 md:mt-4 animate-pulse'></div>
        <div className='rounded w-1/5 h-8 bg-gray-200 mt-2 md:mt-4 animate-pulse'></div>
      </div>
      <div className="w-1/3">
        <div className=' rounded h-[117px] bg-gray-200 mt-2 md:mt-4 animate-pulse'></div>
      </div>
    </aside>
  );
}
export default Loading
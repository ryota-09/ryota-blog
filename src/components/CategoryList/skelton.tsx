const Skelton = () => {
  return (
    <ul className="divide-y-0 md:divide-y divide-gray-200 dark:divide-gray-600 flex flex-wrap gap-4 md:gap-0 md:flex-col">
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index} className="p-2 md:p-4 flex items-center justify-center md:justify-start gap-2">
          <div className="md:w-full md:bg-transparent rounded-full md:rounded-none">
            <div className="bg-gray-200 dark:bg-gray-600 w-24 md:w-full h-8 rounded-full md:rounded-none animate-pulse"></div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Skelton
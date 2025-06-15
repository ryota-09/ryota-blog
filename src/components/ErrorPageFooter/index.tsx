interface ErrorPageFooterProps {
  locale: string;
}

const ErrorPageFooter = ({ locale }: ErrorPageFooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-600 py-8">
      <div className="container mx-auto px-2 md:px-0">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {currentYear} {locale === 'en' ? "Ryota's Web Engineer Blog" : 'Ryota-Blog'}</p>
          <p className="mt-2">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default ErrorPageFooter;
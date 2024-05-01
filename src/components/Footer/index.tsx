const Footer = () => {
  return (
    <footer className="bg-white py-4 shadow-inner">
      <div className="container mx-auto flex justify-between items-center">
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Portfolio</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
          </ul>
        </nav>
        <div className="text-gray-600">
          © Copyright 2024 りたぷるぐ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
export default Footer;
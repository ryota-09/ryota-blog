"use client"
import React, { useEffect, useState } from 'react';

const FixedButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        // エントリーが見えるときは非表示、見えないときは表示
        setIsVisible(!entries[0].isIntersecting);
      },
      {
        root: null, // ビューポートを基準に
        threshold: 0.1, // 10%が見えたらcallbackを呼び出す
      }
    );

    // 画面の上から800pxの位置にダミー要素を設置
    const observedElement = document.createElement('div');
    observedElement.style.position = 'absolute';
    observedElement.style.top = '400px';
    observedElement.style.height = '1px';
    observedElement.style.width = '100%';
    document.body.appendChild(observedElement);

    observer.observe(observedElement);

    return () => {
      observer.disconnect();
      document.body.removeChild(observedElement);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`fixed bottom-4 right-4 bg-secondary text-white px-2 py-2 rounded-lg shadow-lg transition-opacity duration-300 hover:bg-opacity-80 active:bg-primary ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={scrollToTop}
      style={{ transition: 'opacity 0.3s' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-chevron-right"
      >
        <path d="m9 18 6-6-6-6" transform="rotate(-90 12 12)"></path>
      </svg>
    </button>
  );
};

export default FixedButton;

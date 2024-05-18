"use client"
import React, { useState } from 'react';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="relative flex bg-transparent flex-grow">
      <div
        className={`absolute inset-0 ${activeTab === 2 ? 'bg-[#3ea8ff]' : 'bg-base-color'
          } rounded-sm transition-all duration-300 w-1/2`}
        style={{
          transform: activeTab === 1 ? 'translateX(0%)' : 'translateX(100%)',
        }}
      />
      <button
        className={`relative z-10 px-4 py-2 transition-all duration-300 text-center w-1/2 ${ 'text-txt-base'
          }`}
        onClick={() => setActiveTab(1)}
      >
        Blogs
      </button>
      <button
        className={`relative z-10 px-4 py-2 transition-all duration-300 text-center w-1/2 ${activeTab === 2 ? 'text-white' : 'text-txt-base'
          }`}
        onClick={() => setActiveTab(2)}
      >
        Zenn
      </button>
    </div>
  );
};

export default Tabs
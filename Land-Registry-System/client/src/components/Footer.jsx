import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0c0e14] mt-20 border-t border-[#1d1f27] flex flex-col md:flex-row justify-between items-center px-8 py-6 w-full">
      <span className="text-sm font-bold text-[#e5e4ed]">DLR</span>
      <span className="font-inter text-xs uppercase tracking-widest text-[#e5e4ed]/40">
        © 2026 Digital Land Registry. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;

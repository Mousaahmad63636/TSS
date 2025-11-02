import React from 'react';
import Image from 'next/image';

const FloatingWhatsApp = ({ phoneNumber }) => {
  const handleClick = () => {
    const formattedNumber = phoneNumber.replace(/\s+/g, '');
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200"
      aria-label="Contact us on WhatsApp"
    >
      <Image
        src="/whatsapp-icon.png"
        alt="WhatsApp"
        width={64}
        height={64}
        className="w-full h-full rounded-full"
        priority={false}
      />
    </button>
  );
};

export default FloatingWhatsApp;

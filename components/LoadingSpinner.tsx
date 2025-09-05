import React from 'react';

const LoadingSpinner: React.FC = () => {
  const messages = [
    "SEO-experts raadplegen...",
    "Metatags en zoekwoorden analyseren...",
    "Controleren op mobielvriendelijkheid...",
    "Verse koffie zetten voor onze AI...",
    "De optimalisaties optimaliseren...",
  ];
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-12 space-y-4 animate-fade-in">
      <div className="w-16 h-16 border-4 border-yellow-brand border-dashed rounded-full animate-spin"></div>
      <p className="text-lg text-gray-400 transition-opacity duration-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
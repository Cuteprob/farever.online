'use client'

import { FC, useEffect, useState } from 'react';
import { toast } from "sonner"

interface ShareButtonsProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'compact'
}

const ShareButtons: FC<ShareButtonsProps> = ({
  title = 'Play Sprunksters',
  description = 'Create amazing music with Sprunksters!',
  variant = 'default'
}) => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareData = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title)} - ${encodeURIComponent(currentUrl)}`,
    vk: `http://vk.com/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}`,
    copyLink: async () => {
      try {
        await navigator.clipboard.writeText(currentUrl);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  const buttonClass = variant === 'compact' 
    ? "p-2 bg-card hover:bg-card/80 rounded-lg transition-colors"
    : "flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium transition-colors hover:bg-primary bg-primary/70 text-primary-foreground min-w-[100px] md:min-w-[120px]";

  const openShareWindow = (url: string) => {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      url,
      'share-dialog',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  if (variant === 'compact') {
    return (
      <div className="flex gap-">
        <button 
          onClick={() => openShareWindow(shareData.facebook)}
          className={buttonClass}
          aria-label="Share on Facebook"
        >
          <img src="/share_icons/facebook.png" alt="Facebook" className="w-8 h-8 hover:scale-110 transition-transform shadow-lg rounded-lg transform hover:-translate-y-1 hover:brightness-110 active:translate-y-0.5" />
        </button>
        <button 
          onClick={() => openShareWindow(shareData.twitter)}
          className={buttonClass}
          aria-label="Share on Twitter"
        >
          <img src="/share_icons/twitter.png" alt="Twitter" className="w-8 h-8 hover:scale-110 transition-transform shadow-lg rounded-lg transform hover:-translate-y-1 hover:brightness-110 active:translate-y-0.5" />
        </button>
        <button 
          onClick={() => openShareWindow(shareData.reddit)}
          className={buttonClass}
          aria-label="Share on Reddit"
        >
          <img src="/share_icons/reddit.png" alt="Reddit" className="w-8 h-8 hover:scale-110 transition-transform shadow-lg rounded-lg transform hover:-translate-y-1 hover:brightness-110 active:translate-y-0.5" />
        </button>
        <button 
          onClick={() => openShareWindow(shareData.vk)}
          className={buttonClass}
          aria-label="Share on VK"
        >
          <img src="/share_icons/vk.png" alt="VK" className="w-8 h-8 hover:scale-110 transition-transform shadow-lg rounded-lg transform hover:-translate-y-1 hover:brightness-110 active:translate-y-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap justify-center">
      <div className="inline-flex flex-wrap justify-center gap-0 max-w-4xl w-full">
        <button 
          onClick={() => openShareWindow(shareData.facebook)}
          className={`${buttonClass} rounded-l-lg`}
          aria-label="Share on Facebook"
        >
          <img src="/share_icons/facebook.png" alt="Facebook" className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button 
          onClick={() => openShareWindow(shareData.twitter)}
          className={buttonClass}
          aria-label="Share on Twitter"
        >
          <img src="/share_icons/twitter.png" alt="Twitter" className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Tweet</span>
        </button>

        <button 
          onClick={() => openShareWindow(shareData.reddit)}
          className={buttonClass}
          aria-label="Share on Reddit"
        >
          <img src="/share_icons/reddit.png" alt="Reddit" className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button 
          onClick={() => openShareWindow(shareData.whatsapp)}
          className={buttonClass}
          aria-label="Share on WhatsApp"
        >
          <img src="/share_icons/whatsapp.png" alt="WhatsApp" className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <button 
          onClick={shareData.copyLink}
          className={`${buttonClass} rounded-r-lg`}
          aria-label="Copy Link"
        >
          <img src="/share_icons/share.png" alt="Copy Link" className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Copy Link</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;

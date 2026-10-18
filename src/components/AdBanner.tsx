import React, { useEffect, useRef } from 'react';
import { AdConfiguration } from '../types';

interface AdBannerProps {
  network?: 'adsterra' | 'monetag';
  placement?: 'banner' | 'social_bar';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  network = 'adsterra',
  placement = 'banner',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Get ad config
  const getConfig = (): AdConfiguration => {
    try {
      const saved = localStorage.getItem('abacus_ad_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      adsterraEnabled: true,
      monetagEnabled: true,
      adsterraNativeBannerKey: import.meta.env.VITE_ADSTERRA_NATIVE_BANNER_KEY || '4a9b8c7d6e5f4123890abc',
      adsterraSocialBarKey: import.meta.env.VITE_ADSTERRA_SOCIAL_BAR_KEY || '',
      monetagZoneId: import.meta.env.VITE_MONETAG_ZONE_ID || '8934521',
      monetagInPagePushKey: import.meta.env.VITE_MONETAG_IN_PAGE_PUSH_KEY || '',
      testMode: true
    };
  };

  const config = getConfig();

  useEffect(() => {
    if (config.testMode || !containerRef.current) return;

    // Live mode script injection
    const container = containerRef.current;
    container.innerHTML = '';

    if (network === 'adsterra' && config.adsterraEnabled) {
      const atScript = document.createElement('script');
      atScript.type = 'text/javascript';
      atScript.innerHTML = `
        atOptions = {
          'key': '${config.adsterraNativeBannerKey}',
          'format': 'iframe',
          'height': 90,
          'width': 728,
          'params': {}
        };
      `;
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${config.adsterraNativeBannerKey}/invoke.js`;
      invokeScript.async = true;

      container.appendChild(atScript);
      container.appendChild(invokeScript);
    } else if (network === 'monetag' && config.monetagEnabled) {
      const monetagScript = document.createElement('script');
      monetagScript.src = config.monetagInPagePushKey || `https://al5sm.com/pfe/current/tag.min.js?z=${config.monetagZoneId}`;
      monetagScript.setAttribute('data-cfasync', 'false');
      monetagScript.async = true;
      container.appendChild(monetagScript);
    }
  }, [config.testMode, config.adsterraEnabled, config.monetagEnabled, config.adsterraNativeBannerKey, config.monetagZoneId, config.monetagInPagePushKey, network]);

  if (config.testMode) {
    return (
      <div className={`w-full p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400 select-none ${className}`}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-[11px] text-amber-300">
            [{network === 'adsterra' ? 'Adsterra Ad Placement' : 'Monetag MultiTag'}]
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            (To show live ads, update keys in Monetization Settings &amp; turn off Test Mode)
          </span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
          Sandbox Mode
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full min-h-[60px] flex items-center justify-center overflow-hidden ${className}`}
    />
  );
};

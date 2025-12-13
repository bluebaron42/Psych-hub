import React from 'react';

// --- SUB-APP REGISTRY ---
// Import your new topic apps here and add them to the registry object.
// The key must match the module name in App.tsx (e.g., "Memory", "Social Influence").

export const TOPIC_APP_REGISTRY: Record<string, React.FC<{onBack: () => void}>> = {
  // Future examples:
  // "Memory": MemoryApp,
  // "Attachment": AttachmentApp,
};

export const TOPIC_IFRAME_URLS: Record<string, string> = {
  "Schizophrenia": "/modules/schizophrenia/index.html",
};

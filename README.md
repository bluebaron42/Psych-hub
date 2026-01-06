<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1cZAfyRf7_-1XrgOTej4eUY7WfDS5xZjS

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Mobile Optimization (Global)

- A global mobile override is injected into all embedded module pages loaded via iframes to improve responsiveness without editing each module.
- The injection adds/updates a viewport meta tag and attaches a shared stylesheet located at [public/mobile-override.css](public/mobile-override.css).
- Implementation lives in [services/mobileOptimization.ts](services/mobileOptimization.ts) and is called when iframes load in [App.tsx](App.tsx).
- This approach works for same-origin modules served under `public/modules/*`. Cross-origin modules cannot be modified by the parent page.

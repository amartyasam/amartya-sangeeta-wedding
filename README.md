# Odia Wedding Invitation — GitHub Pages

A responsive, single-page wedding invitation inspired by the supplied Maharaja's Dream reference: tap-to-open ceremonial doors, long scrolling invitation, countdown, scratch-to-reveal date, couple section, event schedule, venue and RSVP. The visual language is adapted to Jagannath Temple-inspired architecture, Odia script and Pattachitra-inspired ornamentation.

## Preview locally
Open `index.html` in a browser. Internet access is needed for the Google Fonts stylesheet. Music is optional; add your own licensed MP3 as `assets/wedding-music.mp3`.

## Personalize
Edit `config.js`:
- Couple names and parents
- Wedding date/time and venue/address
- Event dates and locations
- Google Maps destination URL
- WhatsApp number (country code + number, digits only)

Replace the CSS portrait placeholders in `index.html` with your own couple photographs when ready. Add a licensed instrumental MP3 at `assets/wedding-music.mp3` if you want background music. Browsers only start audio after the guest taps the opening button.

## Publish publicly with GitHub Pages
1. Create a new **public** repository on GitHub, e.g. `odia-wedding-invite`.
2. Upload all files and folders from this project (`index.html`, `style.css`, `script.js`, `config.js`, `assets/`, `README.md`) to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish. Your public URL will look like `https://YOUR-USERNAME.github.io/odia-wedding-invite/`.

No backend or build step is required. The invitation is static and works on GitHub Pages.

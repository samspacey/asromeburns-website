# As Rome Burns - Musician Website Template

A clean, dark-themed website template for bands and musicians. Built with vanilla HTML, CSS, and JavaScript—no frameworks, no build tools, ready to deploy to GitHub Pages.

## 🎸 Features

- **Responsive design** - Looks great on desktop, tablet, and mobile
- **Custom music player** - HTML5 audio with playlist support
- **Shows/Events page** - With Google Calendar integration
- **Newsletter signup** - Ready for Formspree, Mailchimp, or any form service
- **Social media integration** - Instagram, YouTube, Spotify, TikTok
- **Dark theme with gold accents** - Bold, rock-oriented aesthetic
- **No dependencies** - Pure HTML/CSS/JS, fast loading

## 📁 Project Structure

```
as-rome-burns-site/
├── index.html          # Home page
├── music.html          # Music player page
├── shows.html          # Shows/events page
├── band.html           # About/band page
├── css/
│   └── style.css       # All styles
├── js/
│   └── player.js       # Music player logic
├── music/              # Your MP3 files go here
└── images/             # Your images go here
```

## 🚀 Quick Start

### 1. Clone or download this template

### 2. Add your content

**Images:**
- Replace placeholder images with your own band photos
- Add images to the `/images` folder
- Update `src` attributes in HTML files

**Music:**
- Add your MP3 files to the `/music` folder
- Update the tracks array in `js/player.js`:

```javascript
const tracks = [
  {
    title: "Your Song Title",
    artist: "Your Band Name",
    src: "music/your-song.mp3",
    duration: "3:45"
  },
  // Add more tracks...
];
```

**Newsletter:**
- Sign up for [Formspree](https://formspree.io) (free tier available)
- Replace `YOUR_FORM_ID` in the form action URLs with your actual form ID:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

**Social Links:**
- Update all social media URLs in the footer sections

**Show Listings:**
- Edit `shows.html` to add your upcoming gigs
- Update dates, venues, and ticket links

### 3. Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push this code to the repository
3. Go to **Settings → Pages**
4. Under "Source", select **Deploy from a branch**
5. Select `main` branch and `/ (root)` folder
6. Click Save
7. Your site will be live at `https://yourusername.github.io/repository-name`

### 4. Custom Domain (Optional)

To use your own domain (e.g., asromeburns.com):

1. Add a `CNAME` file to the root with your domain:
   ```
   asromeburns.com
   ```
2. Configure DNS with your domain registrar:
   - Add an A record pointing to GitHub's IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or add a CNAME record pointing to `yourusername.github.io`

## 🔧 Customization

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {
  --color-bg: #0a0a0a;           /* Main background */
  --color-gold: #f5c518;          /* Accent color */
  --color-text: #f0f0f0;          /* Text color */
  /* ... more variables */
}
```

### Fonts

The template uses Google Fonts (Bebas Neue + Outfit). To change:

1. Pick fonts from [Google Fonts](https://fonts.google.com)
2. Update the `@import` in `css/style.css`
3. Update `--font-display` and `--font-body` variables

### Music Hosting Alternatives

If you don't want to self-host MP3s (bandwidth/storage concerns):

1. **Embed Spotify/Apple Music** - Replace the player with embed codes
2. **Use SoundCloud** - Embed their player
3. **Bandcamp** - Embed Bandcamp player for sales
4. **External CDN** - Host files on a CDN like Cloudflare R2 or Backblaze B2

## 📧 Form Service Alternatives

- [Formspree](https://formspree.io) - Free tier, easy setup
- [Getform](https://getform.io) - Good free tier
- [Netlify Forms](https://www.netlify.com/products/forms/) - If hosting on Netlify
- [Buttondown](https://buttondown.email) - Email-focused, good for newsletters

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

This template is free to use for personal and commercial projects. Attribution appreciated but not required.

---

Built with 🔥 for As Rome Burns

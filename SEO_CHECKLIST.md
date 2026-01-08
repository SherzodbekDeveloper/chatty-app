# SEO Checklist

Before deploying to production, make sure to update the following:

## 1. Update Meta Tags in `frontend/index.html`

Replace all instances of `https://your-domain.com/` with your actual domain:

- [ ] Line 26: `og:url` - Update to your production URL
- [ ] Line 32: `og:image` - Add your Open Graph image URL (recommended: 1200x630px)
- [ ] Line 37: `twitter:url` - Update to your production URL
- [ ] Line 48: `twitter:image` - Add your Twitter card image URL (recommended: 1200x600px)
- [ ] Line 55: `canonical` - Update to your production URL

## 2. Update robots.txt

Update `frontend/public/robots.txt`:

- [ ] Replace `https://your-domain.com/` with your actual domain
- [ ] Create and add sitemap.xml URL if you generate one

## 3. Create Social Media Images

Create and upload:

- [ ] Open Graph image (1200x630px) - for Facebook, LinkedIn sharing
- [ ] Twitter card image (1200x600px) - for Twitter sharing
- [ ] Favicon (32x32px or 16x16px) - update `/vite.svg` with your logo

## 4. Generate Sitemap (Optional but Recommended)

Create a `sitemap.xml` file in `frontend/public/` with your main routes:

- `/`
- `/login`
- `/signup`

## 5. Add Analytics (Optional)

Consider adding:

- [ ] Google Analytics
- [ ] Google Search Console verification
- [ ] Facebook Pixel (if needed)

## 6. Performance Optimization

- [ ] Test with Lighthouse (aim for 90+ scores)
- [ ] Optimize images (use WebP format)
- [ ] Enable compression on server
- [ ] Set up CDN for static assets

## 7. Structured Data (Optional)

Consider adding JSON-LD structured data for better search engine understanding.

## Quick Update Script

You can use find/replace in your editor:

- Find: `https://your-domain.com/`
- Replace: `https://your-actual-domain.com/`

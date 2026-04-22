═══════════════════════════════════════════════════════════════
     LUXE — White-Label Fashion Ecommerce Platform
     README & DEPLOYMENT GUIDE
═══════════════════════════════════════════════════════════════

VERSION: 1.0.0
DEFAULT ADMIN PASSWORD: admin1234
ADMIN LOGIN URL: admin-login.html (hidden dot in footer)

───────────────────────────────────────────────────────────────
TABLE OF CONTENTS
───────────────────────────────────────────────────────────────

  1. Quick Start
  2. File Structure
  3. Deploying to GitHub Pages
  4. Connecting a Custom Domain
  5. Using the Admin Panel
  6. Changing the Admin Password
  7. Customizing the Store
  8. Managing Products
  9. Managing Homepage Cards
 10. Payment Setup
 11. Hiding / Changing the Admin URL
 12. White-Label Reselling Guide
 13. FAQ & Troubleshooting

───────────────────────────────────────────────────────────────
1. QUICK START
───────────────────────────────────────────────────────────────

Step 1 — Extract the ZIP
  Unzip the file to a folder on your computer.

Step 2 — Open locally (optional test)
  Open "index.html" directly in your browser (Chrome/Edge/Firefox).
  Everything works without a web server.

Step 3 — Upload to GitHub Pages (see Section 3)

Step 4 — Log in to Admin Panel
  Go to: yoursite.com/admin-login.html
  Password: admin1234
  ⚠ Change this immediately! (See Section 6)

Step 5 — Customize your store
  From the Admin Panel, update branding, colors, products,
  and all content — no code required.


───────────────────────────────────────────────────────────────
2. FILE STRUCTURE
───────────────────────────────────────────────────────────────

  luxestore/
  ├── index.html              ← Homepage
  ├── admin-login.html        ← Secret admin login (hidden)
  ├── css/
  │   └── style.css           ← Main stylesheet
  ├── js/
  │   ├── store.js            ← Core data engine
  │   └── main.js             ← Homepage logic
  ├── pages/
  │   ├── products.html       ← Shop / product listing
  │   ├── product.html        ← Single product detail
  │   ├── cart.html           ← Shopping cart
  │   ├── checkout.html       ← Checkout form
  │   ├── order-confirm.html  ← Order confirmation
  │   ├── about.html          ← About page
  │   ├── contact.html        ← Contact page
  │   ├── wishlist.html       ← Wishlist
  │   ├── faq.html            ← FAQ
  │   ├── shipping.html       ← Shipping policy
  │   ├── returns.html        ← Returns policy
  │   ├── privacy.html        ← Privacy policy
  │   └── terms.html          ← Terms of service
  ├── admin/
  │   ├── dashboard.html      ← Admin overview
  │   ├── products.html       ← Product management
  │   ├── cards.html          ← Homepage card manager
  │   ├── orders.html         ← Order management
  │   ├── branding.html       ← Store name, logo, contact
  │   ├── design.html         ← Colors and fonts
  │   ├── content.html        ← Text and page content
  │   ├── images.html         ← Image management
  │   ├── pages.html          ← Navigation page manager
  │   ├── payment.html        ← Payment methods
  │   ├── newsletter.html     ← Subscriber list
  │   ├── messages.html       ← Contact form messages
  │   ├── settings.html       ← Password & data settings
  │   ├── css/admin.css       ← Admin stylesheet
  │   └── js/admin.js         ← Admin utilities
  ├── data/
  │   ├── config.json         ← Default config (loaded once)
  │   ├── products.json       ← Default products (loaded once)
  │   └── cards.json          ← Default cards (loaded once)
  └── assets/
      └── icons/


───────────────────────────────────────────────────────────────
3. DEPLOYING TO GITHUB PAGES (FREE HOSTING)
───────────────────────────────────────────────────────────────

Prerequisites: Free GitHub account at github.com

Step 1 — Create a new GitHub repository
  a. Go to github.com and sign in
  b. Click the "+" icon → "New repository"
  c. Name it: "luxestore" (or your store name)
  d. Make it PUBLIC (required for free GitHub Pages)
  e. Click "Create repository"

Step 2 — Upload your files
  OPTION A — Using GitHub website (easiest):
  a. On your new repository page, click "Add file" → "Upload files"
  b. Drag and drop ALL files and folders from the extracted ZIP
  c. Scroll down, click "Commit changes"
  d. Wait 1-2 minutes for upload to complete

  OPTION B — Using GitHub Desktop app (recommended for large files):
  a. Download GitHub Desktop from desktop.github.com
  b. Clone your repository to your computer
  c. Copy all extracted files into the cloned folder
  d. In GitHub Desktop: click "Commit to main" → "Push origin"

  OPTION C — Using Git command line:
  cd path/to/luxestore
  git init
  git add .
  git commit -m "Initial store upload"
  git branch -M main
  git remote add origin https://github.com/YOURUSERNAME/luxestore.git
  git push -u origin main

Step 3 — Enable GitHub Pages
  a. In your repository, go to Settings → Pages
  b. Under "Source", select: Deploy from a branch
  c. Select branch: "main", folder: "/ (root)"
  d. Click Save
  e. Wait 2-5 minutes

Step 4 — Access your live site
  Your store is now live at:
  https://YOURUSERNAME.github.io/luxestore/

  ⚠ IMPORTANT: On GitHub Pages, the /data/*.json files are
  loaded only once on first visit. After that, all data lives
  in the visitor's browser localStorage. This is by design
  for static hosting compatibility.


───────────────────────────────────────────────────────────────
4. CONNECTING A CUSTOM DOMAIN
───────────────────────────────────────────────────────────────

Step 1 — Purchase a domain (e.g. from Namecheap, GoDaddy)

Step 2 — Add domain to GitHub Pages
  a. Repository → Settings → Pages
  b. Under "Custom domain", enter: yourdomain.com
  c. Click Save

Step 3 — Configure DNS at your domain registrar
  Add these DNS records:

  Type    Name    Value
  ────────────────────────────────────
  A       @       185.199.108.153
  A       @       185.199.109.153
  A       @       185.199.110.153
  A       @       185.199.111.153
  CNAME   www     YOURUSERNAME.github.io

Step 4 — Wait 24-48 hours for DNS propagation

Step 5 — Enable HTTPS
  In Repository → Settings → Pages → check "Enforce HTTPS"


───────────────────────────────────────────────────────────────
5. USING THE ADMIN PANEL
───────────────────────────────────────────────────────────────

Accessing the Admin Panel:
  URL: yoursite.com/admin-login.html
  OR: Click the tiny dot (●) in the bottom-right of any page footer

Default Password: admin1234

Admin Panel Sections:
  ◈ Dashboard    — Overview of orders, revenue, products
  📦 Orders      — View, update status, export to CSV
  👗 Products    — Add/edit/delete products with images
  ▤ Cards        — Manage homepage category/promo cards
  ✦ Branding     — Store name, logo, footer, social links
  🎨 Design      — Colors, fonts, presets
  ✏ Content      — Hero text, about page, policies
  🖼 Images      — Hero/about background images
  📄 Pages       — Navigation menu control
  💳 Payment     — COD, Bank Transfer, EasyPaisa, JazzCash
  ✉ Newsletter   — View/export subscriber emails
  💬 Messages    — Contact form submissions
  ⚙ Settings    — Password, backup, reset

Security Features:
  - Admin session stored in sessionStorage (clears on tab close)
  - 30-minute inactivity auto-logout
  - Direct /admin/* URL access redirects to login
  - Zero admin UI visible to public visitors


───────────────────────────────────────────────────────────────
6. CHANGING THE ADMIN PASSWORD
───────────────────────────────────────────────────────────────

Method 1 — Via Admin Panel (recommended):
  1. Log in to Admin Panel
  2. Go to Settings (⚙ icon in sidebar)
  3. Enter your current password
  4. Enter and confirm new password
  5. Click "Update Password"

Method 2 — Browser Console (emergency reset):
  1. Open your site in a browser
  2. Press F12 → Console tab
  3. Type: localStorage.setItem('luxe_admin_pw', 'NEWPASSWORD')
  4. Press Enter

⚠ IMPORTANT: Change the default password "admin1234" immediately
after deployment. Anyone who knows the admin URL and default
password could access your admin panel.


───────────────────────────────────────────────────────────────
7. CUSTOMIZING THE STORE (Admin Panel Guide)
───────────────────────────────────────────────────────────────

BRANDING (Admin → Branding):
  - Change store name, tagline, logo text
  - Upload a logo image (replaces text logo)
  - Edit browser tab title
  - Set announcement banner text & colors
  - Add contact email, phone, address
  - Add social media links (Instagram, Facebook)
  - Enable WhatsApp order button with your number

DESIGN (Admin → Design & Colors):
  - Choose from 5 color presets (Luxury, Rose, Forest, Cobalt, Midnight)
  - Customize all 8 color variables with color pickers
  - Select heading and body fonts (7 options each)
  - Toggle dark mode and newsletter popup features

CONTENT (Admin → Content):
  - Edit hero banner heading, subheading, button text
  - Edit about page content
  - Set newsletter popup text
  - Edit FAQ, Shipping, Returns, Privacy, Terms pages

IMAGES (Admin → Images):
  - Upload hero banner background image
  - Upload about page image
  - Images are stored as base64 in localStorage


───────────────────────────────────────────────────────────────
8. MANAGING PRODUCTS
───────────────────────────────────────────────────────────────

Adding a Product:
  1. Go to Admin → Products
  2. Click "+ Add Product"
  3. Fill in: Name, Category, Price, Sizes, Colors, Description
  4. Add product images (URL or upload)
  5. Toggle "Feature on Homepage" if desired
  6. Click "Save Product"

Editing a Product:
  Click "Edit" on any product row

Deleting a Product:
  Click "Delete" → Confirm

Product Image Tips:
  - Enter a URL directly (e.g. from Unsplash, your CDN)
  - OR upload an image (stored as base64, ~200KB limit recommended)
  - Add multiple images — first image is the main display image

Categories:
  Default categories: Women, Men, Accessories, Other
  Products are automatically filtered by category in the shop


───────────────────────────────────────────────────────────────
9. MANAGING HOMEPAGE CARDS
───────────────────────────────────────────────────────────────

Cards are the visual category/promo blocks on the homepage.

Adding a Card:
  1. Admin → Homepage Cards
  2. Click "+ Add Card"
  3. Fill in: Title, Subtitle, Button Text, Button Link, Image

Editing: Click "Edit" on any card
Hiding: Click "Hide" — card stays in system but invisible to customers
Showing: Click "Show" to make it visible again
Duplicating: Click "Dupe" to copy a card
Reordering: Drag cards by the ⠿ handle, then click "Save Order"
Deleting: Click "Del" → Confirm

Button Link examples:
  ../pages/products.html?category=Women
  ../pages/products.html?sale=true
  ../pages/products.html
  https://instagram.com/yourbrand


───────────────────────────────────────────────────────────────
10. PAYMENT SETUP
───────────────────────────────────────────────────────────────

Go to Admin → Payment to enable and configure:

  Cash on Delivery (COD)
    Toggle on/off

  Bank Transfer
    Enable, then add:
    - Bank Name
    - Account Holder Name
    - IBAN / Account Number
    These details appear on the checkout page.

  EasyPaisa
    Enable and add your EasyPaisa number

  JazzCash
    Enable and add your JazzCash number

  Stripe / PayPal
    Marked as placeholders — to fully activate these,
    you need a backend or use Stripe Payment Links / PayPal.me

Orders are saved in localStorage and visible only in Admin → Orders.
You can export all orders to CSV from the Orders page.


───────────────────────────────────────────────────────────────
11. HIDING / CHANGING THE ADMIN ACCESS URL
───────────────────────────────────────────────────────────────

For maximum security, rename the admin login file:

Step 1 — Rename admin-login.html
  Example: rename to "backstage.html" or "manage-portal.html"

Step 2 — Update all footer links
  In index.html, find:
    <a href="admin-login.html" class="admin-access-dot"
  Change to:
    <a href="backstage.html" class="admin-access-dot"

  Repeat for all files in /pages/*.html

Step 3 — Update admin redirect
  In admin/js/admin.js, find:
    window.location.href = '../admin-login.html';
  Change to:
    window.location.href = '../backstage.html';

Step 4 — Update admin login redirect
  In admin-login.html (now renamed), find:
    window.location.href = 'admin/dashboard.html';
  (No change needed here)


───────────────────────────────────────────────────────────────
12. WHITE-LABEL RESELLING GUIDE
───────────────────────────────────────────────────────────────

This platform is designed for reselling to multiple clients.
Each customer gets the same ZIP and customizes it themselves.

What each client can customize without touching code:
  ✓ Store name, logo, colors, fonts
  ✓ All text content and page copy
  ✓ Hero and about images
  ✓ All products (add/edit/delete)
  ✓ Homepage cards/sections
  ✓ Payment methods and bank details
  ✓ Contact information and social links
  ✓ Policy pages (FAQ, Shipping, Returns, etc.)
  ✓ Navigation menu
  ✓ Admin password

How data is isolated per deployment:
  All data is stored in each visitor's browser localStorage.
  Client A's data on their hosting never mixes with Client B.
  Each customer manages their own store independently.

Suggested reselling workflow:
  1. Customer purchases your service
  2. You provide the ZIP file
  3. Customer uploads to GitHub Pages or their own hosting
  4. Customer logs in with default password (admin1234)
  5. Customer changes password immediately
  6. Customer customizes from admin panel
  7. Live store is ready in under 30 minutes


───────────────────────────────────────────────────────────────
13. FAQ & TROUBLESHOOTING
───────────────────────────────────────────────────────────────

Q: Products/customizations disappear after reopening the site
A: localStorage was cleared. This can happen if:
   - Browser privacy/incognito mode was used
   - Browser data was cleared
   - A different browser/device was used
   For persistence across browsers, you'll need a backend.

Q: Admin login not working
A: Default password is: admin1234 (case-sensitive)
   If forgotten: Open browser console (F12), type:
   localStorage.setItem('luxe_admin_pw', 'newpassword')

Q: Images not showing after upload
A: Base64 images are stored in localStorage (~5MB limit per domain).
   If images are large, use URLs instead (Unsplash, Cloudinary, etc.)

Q: The /data/*.json files — do I need to edit them?
A: No. They serve as default data loaded ONCE on first visit.
   After that, all data comes from localStorage.
   You can edit them to change the factory defaults.

Q: Can I add more product categories?
A: Yes — in Admin → Products, type any custom category.
   Then add a filter button in pages/products.html if needed.

Q: How do I add more pages to the navigation?
A: Go to Admin → Pages to show/hide existing pages.
   To add a completely new page, duplicate one of the existing
   pages in /pages/, customize its content, then add it to the
   config.json pages object and enable it in Admin → Pages.

Q: Can multiple admins log in at the same time?
A: The system supports one admin account. Admin sessions are
   browser-specific (sessionStorage), so different browsers
   would need the password to log in.

Q: How do I update the site after making changes?
A: Re-upload changed files to GitHub. localStorage data
   (products, orders, customizations) is NOT affected by
   file updates — it persists in the customer's browser.

─────────────────────────────────────────────────────────────
SUPPORT & CUSTOMIZATION

For advanced customizations (backend integration, real
payment gateways, multi-store management, database sync),
custom development services can be arranged.

Thank you for using LUXE Store Platform!
─────────────────────────────────────────────────────────────

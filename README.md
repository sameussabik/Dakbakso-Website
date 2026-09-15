# Dakbakso Website — সেটআপ গাইড (v2, multi-page)

এই ভার্সনে সাইট এখন আলাদা আলাদা পেজে ভাগ করা:
`index.html` (Home), `services.html`, `work.html`, `pricing.html`, `contact.html`, `academy.html`

সবগুলো পেজ একই `style.css` আর `script.js` শেয়ার করে।

---

## Netlify তে আগে যে "Page not found" সমস্যা হয়েছিল

এটা হয় যখন Netlify এর **Publish directory** সেটিং ভুল থাকে (যেমন কোনো সাব-ফোল্ডারের নাম বসানো থাকে অথচ `index.html` আসলে repo এর root এ)। Deploy করার সময়:

- Netlify **Site settings > Build & deploy > Build settings** এ যাও
- **Publish directory** ফিল্ড খালি রাখো, বা একটা ডট (`.`) বসাও — কারণ এই ফোল্ডারের সব ফাইল (`index.html`, `style.css`, `script.js`) সরাসরি repo এর root এ থাকা উচিত, কোনো সাব-ফোল্ডারের ভেতরে না।
- GitHub এ push করার সময় খেয়াল রেখো যেন পুরো `dakbakso-v2` ফোল্ডারের **ভেতরের জিনিসগুলো** (`index.html` সহ) সরাসরি repo এর root এ যায়, `dakbakso-v2` নামের একটা ফোল্ডারের ভেতরে না।

---

## ধাপ ১: Google Sheet বানাও

1. নতুন একটা Google Sheet খোলো।
2. প্রথম ট্যাবের নাম দাও **Orders** — `sheet-templates/Orders_template.csv` ফাইলটা **File > Import > Upload** দিয়ে import করো ("Replace current sheet" বেছে নিও)।
3. আরেকটা ট্যাব বানাও, নাম দাও **Portfolio** — `sheet-templates/Portfolio_template.csv` একইভাবে import করো।

---

## ধাপ ২: Order Form কানেক্ট করো (Apps Script)

1. Sheet এ থাকা অবস্থায়: **Extensions > Apps Script**
2. আগের কোড মুছে `google-apps-script.gs` এর পুরো কোড পেস্ট করো।
3. **Deploy > New deployment > Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Deploy করলে যে URL পাবে (শেষে `/exec`) সেটা কপি করো।
5. `script.js` এর উপরে:
   ```js
   const ORDER_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
   এখানে তোমার URL বসাও।

---

## ধাপ ৩: Portfolio Sheet পাবলিশ করো

1. **Portfolio** ট্যাবে থাকা অবস্থায়: **File > Share > Publish to web**
2. Sheet হিসেবে বেছে নাও **Portfolio**, ফরম্যাট **CSV**, তারপর **Publish**।
3. যে লিংক পাবে সেটা `script.js` এর এই লাইনে বসাও:
   ```js
   const PORTFOLIO_CSV_URL = "PASTE_YOUR_PUBLISHED_PORTFOLIO_CSV_LINK_HERE";
   ```

নতুন প্রজেক্ট যোগ করতে চাইলে শুধু Portfolio ট্যাবে নতুন row বসাও — Home আর Work দুই পেজেই অটো আপডেট হবে।

---

## ধাপ ৪ ও ৫: GitHub + Netlify

1. GitHub এ রিপো বানাও, এই ফোল্ডারের সব ফাইল push করো (root এ, কোনো সাব-ফোল্ডার ছাড়া)।
2. Netlify তে **Add new site > Import an existing project** — GitHub রিপো সিলেক্ট করো।
3. Build command খালি, **Publish directory খালি বা `.`** — Deploy করো।

---

## ব্লগ চালু করা (নতুন)

1. একই Google Sheet এ আরেকটা ট্যাব বানাও, নাম দাও **Blog**।
2. `sheet-templates/Blog_template.csv` ফাইলটা import করো (headers + একটা real sample post সহ)। কলাম: `title, category, date, summary, content, slug`
   - **slug** হলো URL-friendly নাম, যেমন `landing-page-vs-website` — স্পেস/স্পেশাল ক্যারেক্টার ছাড়া, সব lowercase, হাইফেন দিয়ে যুক্ত।
   - **content** এ প্যারাগ্রাফ আলাদা করতে দুইটা এন্টার (blank line) দাও — Sheet এর সেলের ভেতরে Alt+Enter চেপে নতুন লাইন শুরু করতে হবে।
3. **Blog** ট্যাবে থাকা অবস্থায়: **File > Share > Publish to web** — Sheet হিসেবে বেছে নাও **Blog**, ফরম্যাট **CSV**, Publish করো, লিংক কপি করো।
4. `script.js` এ এই লাইনে বসাও:
   ```js
   const BLOG_CSV_URL = "PASTE_YOUR_PUBLISHED_BLOG_CSV_LINK_HERE";
   ```

নতুন পোস্ট লিখতে চাইলে শুধু Blog ট্যাবে নতুন row যোগ করো — `blog.html` এ অটোমেটিক লিস্টে যোগ হবে, আর `post.html?slug=তোমার-slug` এ পুরো পোস্ট পড়া যাবে। কোনো কোড এডিট লাগবে না।

---

## যা এখনো ম্যানুয়ালি করতে হবে

- **Payment**: অর্ডার আসলে নিজে WhatsApp/ইমেইলে bKash/Nagad/Rocket/ব্যাংক ডিটেইলস পাঠাও।
- **Portfolio ছবি**: Google Sheet এর Portfolio ট্যাবে row যোগ করো।
- **AI Chat, Payment Gateway**: Phase 2 — sales শুরু হওয়ার পর।

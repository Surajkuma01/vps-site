# FORM & SPACE BY VPS — Architectural Studio & Construction

> Premier architectural design, luxury residential villas, high-performance commercial towers, and turnkey execution studio website across Punjab, India.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS, Cormorant Garamond & Manrope typography
* **Routing**: React Router DOM (v7) with Single Page Application (SPA) routing
* **Icons**: Lucide React
* **CMS & Persistence**: Built-in Admin Panel with LocalStorage synchronization & Google Sheets / Excel Webhook integration
* **Deployment**: Optimized for Vercel, Netlify, and Cloudflare Pages

---

## 🚀 How to Push to GitHub & Deploy on Vercel

### Step 1: Create a New GitHub Repository

1. Log into your GitHub account: [github.com](https://github.com).
2. Click the **`+`** icon in the top-right corner and select **New repository**.
3. Repository Settings:
   * **Repository name**: e.g., `form-and-space-vps` (or `suraj-site`)
   * **Visibility**: Choose **Public** or **Private**
   * **Do NOT** check "Add a README file", ".gitignore", or "license" (we already have these prepared locally).
4. Click **Create repository**.
5. Copy your repository's URL (e.g., `https://github.com/your-username/form-and-space-vps.git`).

---

### Step 2: Push Local Code to Your GitHub Repository

Open your terminal in this project directory (`c:\Users\NITIN GARG\OneDrive\Documents\Suraj_site`) and run:

```bash
# 1. Add your remote GitHub repository (replace with your copied URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 2. Push your main branch to GitHub
git push -u origin main
```

*(If prompted, sign in with your GitHub account or Personal Access Token).*

---

### Step 3: Deploy on Vercel (1-Click Deployment)

1. Go to [vercel.com](https://vercel.com) and log in (recommended: **Continue with GitHub**).
2. From the Vercel Dashboard, click **Add New...** > **Project**.
3. Under **Import Git Repository**, find your repository (`form-and-space-vps`) and click **Import**.
4. Configure Project settings (Vercel automatically detects these):
   * **Framework Preset**: `Vite`
   * **Root Directory**: `./`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Click **Deploy**.
6. Within ~60 seconds, your website will be live with a free global SSL URL: `https://your-project.vercel.app`!

---

### 🌐 Custom Domain Setup on Vercel (Optional)

1. In your Vercel Project Dashboard, navigate to **Settings** > **Domains**.
2. Enter your custom domain (e.g. `formandspace.com` or `vpsarchitects.com`).
3. Add the DNS records (CNAME or A records) shown by Vercel into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).
4. Vercel will automatically provision free, auto-renewing SSL certificates.

---

### 📂 Important Files Configured for Deployment

* **`vercel.json`**: Configures client-side rewrite rules so that refreshing any sub-page (e.g. `/projects`, `/about`, `/services`, `/admin`) never throws a 404 error.
* **`public/_redirects`**: Fallback routing rule for Netlify deployments.
* **`public/robots.txt`**: Optimizes search engine indexing while safeguarding the `/admin` route.
* **`src/config/spreadsheet.ts`**: Webhook endpoint for live Google Sheets integration.

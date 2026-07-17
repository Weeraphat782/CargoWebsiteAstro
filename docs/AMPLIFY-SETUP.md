# AWS Amplify — Marketing Site Deploy

Push to `master` on [CargoWebsiteAstro](https://github.com/Weeraphat782/CargoWebsiteAstro) triggers Amplify build + deploy.

## Quick start (คุณทำใน Console ~5 นาที)

**Blocker:** SSO role `developers-access` ยังไม่มี `amplify:CreateApp` — ถ้า Console ก็สร้างไม่ได้ ส่ง [`docs/AMPLIFY-ADMIN-REQUEST.md`](AMPLIFY-ADMIN-REQUEST.md) ให้ admin

1. Login ผ่าน https://tis-aws.awsapps.com/start → เลือ account `992382688515` → เปิด **Amplify**
2. **Create new app** → **Host web app** → GitHub → `Weeraphat782/CargoWebsiteAstro` / `master`
3. Build: ใช้ `amplify.yml` ใน repo (auto)
4. Environment variables — copy จาก `.env.amplify.example` + ใส่ `PUBLIC_SUPABASE_ANON_KEY` จาก Tr `.env.local`
5. Deploy → copy URL → ตั้ง `PUBLIC_SITE_URL` = URL นั้น → **Redeploy**
6. Webhooks → สร้าง webhook branch `master` → ใส่ใน `Tr/.env.local` เป็น `MARKETING_DEPLOY_HOOK_URL`

Repo พร้อมแล้ว (commit `64234f2`) — **push ครั้งต่อไปจะ trigger build อัตโนมัติ** หลัง connect GitHub

## One-time: Create Amplify app (Console)

Requires IAM permission `amplify:*` or admin to create the app.

1. [AWS Console](https://ap-southeast-1.console.aws.amazon.com/amplify/home?region=ap-southeast-1) → **Create new app** → **Host web app**
2. Connect **GitHub** → repo `Weeraphat782/CargoWebsiteAstro`, branch `master`
3. Build settings: use [`amplify.yml`](../amplify.yml) in repo (auto-detected)
4. Add environment variables from [`.env.amplify.example`](../.env.amplify.example)
5. Deploy → note URL e.g. `https://master.d1234abcd.amplifyapp.com`
6. Set `PUBLIC_SITE_URL` to that URL → **Redeploy this version**

## CMS rebuild webhook

1. Amplify → App → **Hosting** → **Build settings** → **Webhooks** → Create webhook (branch `master`)
2. In `Tr/.env.local` (local only until prod cutover):

   ```
   MARKETING_DEPLOY_HOOK_URL=<amplify-webhook-url>
   ```

3. Saving news/resources in CMS calls `triggerMarketingRebuild()` in Tr.

## SSO role note

If CLI shows `AccessDenied` on `amplify:CreateApp`, ask admin for **Amplify Console** access or to create the app and grant your SSO role access to that app.

## Local build check

```powershell
cd web
npm ci --legacy-peer-deps
npm run build
```

Output: `dist/`

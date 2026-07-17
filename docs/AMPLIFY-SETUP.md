# AWS Amplify — Marketing Site Deploy

Push to `master` on [CargoWebsiteAstro](https://github.com/Weeraphat782/CargoWebsiteAstro) triggers Amplify build + deploy.

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

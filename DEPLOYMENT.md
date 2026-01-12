# Vercel Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

1. ✅ **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. ✅ **Vercel CLI** - Install globally: `npm i -g vercel`
3. ✅ **Database** - PostgreSQL database (Neon, Vercel Postgres, etc.)
4. ✅ **Google OAuth** - Credentials from [Google Cloud Console](https://console.cloud.google.com)
5. ✅ **Email Service** - SMTP credentials (Gmail, SendGrid, etc.)

---

## Step 1: Environment Variables Setup

### Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env`:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXT_PUBLIC_APP_URL` - `http://localhost:3000`
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `GOOGLE_REDIRECT_URI` - `http://localhost:3000/api/auth/google/callback`
   - `SMTP_*` - Your email service credentials

### Production Environment Variables

Set these in Vercel Dashboard or via CLI:

```bash
# Database
vercel env add DATABASE_URL production

# Application URL (use your actual domain)
vercel env add NEXT_PUBLIC_APP_URL production
# Example: https://brainy.vercel.app or https://yourdomain.com

# Google OAuth
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add GOOGLE_REDIRECT_URI production
# Example: https://yourdomain.com/api/auth/google/callback

# Email (SMTP)
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_SECURE production
vercel env add SMTP_USER production
vercel env add SMTP_PASSWORD production
vercel env add SMTP_FROM production
vercel env add SMTP_FROM_NAME production

# Cookie domain (for your production domain)
vercel env add COOKIE_DOMAIN production
# Example: .yourdomain.com
```

**Important Notes:**
- `NODE_ENV` is automatically set to `production` by Vercel
- Use the Vercel dashboard for easier environment variable management: **Settings → Environment Variables**
- Remember to update `GOOGLE_REDIRECT_URI` in Google Cloud Console to match your production URL

---

## Step 2: Database Setup

### Run Migrations

Before deploying, ensure your database schema is up to date:

```bash
# Generate migration files (if needed)
npm run db:gen

# Push schema to database
npm run db:push
```

### Verify Database Connection

Test your production database connection locally:

```bash
# Temporarily set DATABASE_URL to production value
# Then run:
npm run db:studio
```

---

## Step 3: Pre-Deployment Checks

### Build Test

```bash
npm run build
```

✅ **Status:** Already verified - build successful!

### TypeScript Check

```bash
npx tsc --noEmit
```

✅ **Status:** Already verified - no type errors!

### Lint Check

```bash
npm run lint
```

---

## Step 4: Deploy to Vercel

### Option A: Deploy via CLI (Recommended)

1. **Link your project** (first time only):
   ```bash
   vercel link
   ```

2. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option B: Deploy via Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel Dashboard
3. Configure environment variables in Vercel Dashboard
4. Vercel will automatically deploy on every push to main branch

---

## Step 5: Post-Deployment Verification

### 1. Test Authentication

- ✅ Visit `/auth/login`
- ✅ Test Google OAuth login
- ✅ Verify session persistence
- ✅ Test logout functionality

### 2. Test Onboarding Flows

**Student Onboarding:**
- ✅ Navigate to `/onboarding/student/start`
- ✅ Fill in student details
- ✅ Verify email is sent
- ✅ Complete email verification

**Institution Onboarding:**
- ✅ Navigate to `/onboarding/institution/start`
- ✅ Fill in institution details
- ✅ Verify email is sent
- ✅ Complete email verification

### 3. Database Connectivity

- ✅ Create a test record
- ✅ Read/update/delete operations
- ✅ Check database logs for errors

### 4. Performance Checks

Run Lighthouse audit:
- ✅ Performance score > 90
- ✅ Accessibility score > 90
- ✅ Best Practices score > 90
- ✅ SEO score > 90

---

## Step 6: Domain Configuration (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update environment variables:
   - `NEXT_PUBLIC_APP_URL` → `https://yourdomain.com`
   - `GOOGLE_REDIRECT_URI` → `https://yourdomain.com/api/auth/google/callback`
   - `COOKIE_DOMAIN` → `.yourdomain.com`

### Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Add your production domain to **Authorized JavaScript origins**
3. Add your callback URL to **Authorized redirect URIs**

---

## Troubleshooting

### Build Fails

- Check build logs in Vercel Dashboard
- Verify all environment variables are set
- Test build locally: `npm run build`

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database firewall settings (allow Vercel IPs)
- For Neon: Enable connection pooling

### OAuth Not Working

- Verify `GOOGLE_REDIRECT_URI` matches exactly in Google Console
- Check `NEXT_PUBLIC_APP_URL` is set correctly
- Ensure cookies are enabled in browser

### Email Not Sending

- Verify SMTP credentials
- For Gmail: Use app-specific password
- Check SMTP port and security settings
- Review email service logs

---

## Monitoring & Maintenance

### Vercel Analytics

Enable analytics in Vercel Dashboard for:
- Page views
- Performance metrics
- Error tracking

### Database Monitoring

- Monitor connection pool usage
- Set up alerts for high query times
- Regular backups

### Security

- Regularly update dependencies: `npm audit`
- Monitor Vercel security advisories
- Review access logs periodically

---

## Quick Reference

### Useful Commands

```bash
# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List environment variables
vercel env ls

# Pull environment variables locally
vercel env pull

# Open project in Vercel Dashboard
vercel open
```

### Important URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com
- **Neon Dashboard**: https://console.neon.tech (if using Neon)

---

## Next Steps After Deployment

1. ✅ Set up monitoring and alerts
2. ✅ Configure custom domain (if applicable)
3. ✅ Enable Vercel Analytics
4. ✅ Set up error tracking (Sentry, etc.)
5. ✅ Configure automated backups
6. ✅ Document runbook for common issues
7. ✅ Set up staging environment for testing

---

**Need Help?**
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Community Support: https://github.com/vercel/next.js/discussions

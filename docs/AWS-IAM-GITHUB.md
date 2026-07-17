# IAM for GitHub Actions deploy (S3 + CloudFront)

Marketing site deploy needs **no Amplify**. Create an IAM user `omgexp-marketing-github` for CI only.

## Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::omgexp-marketing-site",
        "arn:aws:s3:::omgexp-marketing-site/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::992382688515:distribution/EG4RDROJ9ZNW1"
    }
  ]
}
```

Add keys to GitHub repo secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`.

## CMS rebuild PAT

Fine-grained GitHub PAT on `CargoWebsiteAstro` with **Actions: Read and write** — store in Tr as `MARKETING_GITHUB_PAT` (local only until prod cutover).

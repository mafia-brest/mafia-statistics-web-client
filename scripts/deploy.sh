npm run build
aws s3 rm s3://statistics.mafia-brest.com --recursive
aws s3 sync build/. s3://statistics.mafia-brest.com
aws cloudfront create-invalidation --distribution-id $ORIGINAL_DISTRIBUTION_ID --paths "/*"
aws cloudfront create-invalidation --distribution-id $WWW_DISTRIBUTION_ID --paths "/*"

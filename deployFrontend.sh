BUCKET=curtcommander-personal-website
aws s3 cp dist/frontend/ s3://$BUCKET --recursive
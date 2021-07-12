BUCKET=personal-website-curtcommander
aws s3 cp dist/frontend/ s3://$BUCKET --recursive
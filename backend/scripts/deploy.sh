#! /bin/bash

aws s3 cp deployment.zip s3://agricore-2478-daniel/deployment.zip

aws lambda update-function-code \
  --function-name agricore-backend \
  --s3-bucket agricore-2478-daniel \
  --s3-key deployment.zip
#!/bin/sh
echo "Running Prisma DB Push..."
npx prisma db push --accept-data-loss
echo "Starting Next.js server..."
node_modules/.bin/next start

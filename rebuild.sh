#!/bin/zsh

IP_ADDRESS=$(ipconfig getifaddr en0)
sed -i '' "s|^MACHINE_URL=.*|MACHINE_URL=$IP_ADDRESS|" .env
echo "MACHINE_URL has been set to $IP_ADDRESS"
docker-compose down && docker-compose build --no-cache && docker-compose up




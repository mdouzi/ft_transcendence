#!/bin/sh

KEY_FILE="/etc/ssl/private/myserver.key"
CSR_FILE="/tmp/myserver.csr"
CRT_FILE="/etc/ssl/certs/myserver.crt"

echo "Creating necessary directories..."
# mkdir -p /var/www/html/
mkdir -p /etc/ssl/certs /etc/ssl/private

echo "Generating private key..."
openssl genrsa -out $KEY_FILE 2048
if [ $? -eq 0 ]; then
    echo "Private key generated successfully: $KEY_FILE"
else
    echo "Failed to generate private key!"
    exit 1
fi

echo "Generating Certificate Signing Request (CSR)..."
openssl req -new -key $KEY_FILE -out $CSR_FILE \
    -subj "/C=MA/ST=tetouan-martil/L=tetouan/O=matrix/CN=ybourais.42.fr/emailAddress=inception@1337.ma"
if [ $? -eq 0 ]; then
    echo "CSR generated successfully: $CSR_FILE"
else
    echo "Failed to generate CSR!"
    exit 1
fi

echo "Generating self-signed certificate..."
openssl x509 -req -days 365 -in $CSR_FILE -signkey $KEY_FILE -out $CRT_FILE
if [ $? -eq 0 ]; then
    echo "Certificate generated successfully: $CRT_FILE"
else
    echo "Failed to generate certificate!"
    exit 1
fi

echo "Starting Nginx..."
nginx -g "daemon off;"

tail -f /dev/null



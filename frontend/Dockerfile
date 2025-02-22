# FROM alpine:3.20
FROM nginx:latest
# RUN apk add --no-cache nginx openssl

COPY ./tools/nginx.conf /etc/nginx/nginx.conf

# COPY front  /var/www/html/

COPY ./tools/ssl.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/ssl.sh

EXPOSE 443

ENTRYPOINT ["/usr/local/bin/ssl.sh"]


FROM python:3.12-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY requirements.txt .

COPY ./api/ /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY ./tools/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000


# CMD ["tail", "-f"]

# CMD["/entrypoint.sh"]
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

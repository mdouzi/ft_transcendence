# Project Setup

Follow these steps to set up the project and ensure it runs correctly:

---

## 1. Install Docker
Use the `42 wizard` tool to install Docker on your system.

[Link Text](https://github.com/0xShady/42_wizzard/blob/main/42-wizzard.sh "Hover Text")

## 2. Update `docker-compose.yml` File
Modify the paths in the `docker-compose.yml` file to match your project structure:

### For the `nginx` Service
Update the volume paths to point to your frontend directory:
```yaml
volumes:
  - /path/to/your/frontend:/var/www/html/
```

### For the `api` Service
Update the volume paths to point to your backend directory:
```yaml
volumes:
  - /path/to/your/backend:/api/
```
## 3. add `.env` file in the root of the repo

## 4. Create an Application in Intra 42
    Navigate to Settings > API > REGISER A NEW APP
```
Copy the UID and paste it into the .env file under CLIENT_UID.
Copy the Secret and paste it into the .env file under CLIENT_SECRET
Redirect Uri:  https://your-machine-ip/api/auth/callback/
```

## 5. run `./rebuild`
# ft_transcendence
# ft_transcendence

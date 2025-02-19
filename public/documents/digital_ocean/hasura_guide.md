# Hasura Installation and Backup Guide for DigitalOcean Droplet

## Prerequisites
- A DigitalOcean droplet running a recent Ubuntu/Debian-based Linux distribution
- Root or sudo access
- PostgreSQL database (can be on the same or a different server)

---

## Step 1: Install Docker and Docker Compose

### 1.1 Install Docker
```bash
# Update package index
sudo apt update

# Install Docker
sudo apt install docker.io -y

# Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker
```

### 1.2 Install Docker Compose
```bash
# Determine system architecture
ARCH=$(uname -m)
OS=$(uname -s | tr '[:upper:]' '[:lower:]')

# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.31.0/docker-compose-${OS}-${ARCH}" -o /usr/local/bin/docker-compose

# Make Docker Compose executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

---

## Step 2: Prepare Hasura Configuration

### 2.1 Create Hasura Directory
```bash
mkdir -p /root/hasura
cd /root/hasura
```

### 2.2 Create `docker-compose.yml`
Create a `docker-compose.yml` file with the following content:

```yaml
version: '3.6'
services:
  hasura:
    image: hasura/graphql-engine:v2.28.2
    restart: always
    ports:
      - "8080:8080"
    environment:
      HASURA_GRAPHQL_DATABASE_URL: postgres://username:password@host:port/database
      HASURA_GRAPHQL_ADMIN_SECRET: your_admin_secret_here
      HASURA_GRAPHQL_UNAUTHORIZED_ROLE: public
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
```

---

## Step 3: Run Hasura with Docker Compose

### 3.1 Start Hasura
```bash
# Start Hasura in detached mode
docker-compose up -d

# Check logs to confirm it's running
docker-compose logs -f
```

---

## Step 4: Ensure Automatic Startup

### 4.1 Configure Docker to Start on Boot
```bash
sudo systemctl enable docker
```

### 4.2 Reboot and Verify
```bash
# Reboot the droplet
sudo reboot

# After reboot, verify Hasura is running
docker ps
```

---

## Step 5: Access Hasura

### 5.1 Web Access
- Open `http://<your-droplet-ip>:8080` in your web browser
- Log in using the admin secret specified in `docker-compose.yml`

---

## Step 6: Install Hasura CLI
To manage metadata, install Hasura CLI:
```bash
curl -L https://github.com/hasura/graphql-engine/releases/latest/download/cli-hasura-linux-amd64 -o /usr/local/bin/hasura
chmod +x /usr/local/bin/hasura
```

Verify installation:
```bash
hasura version
```

---

## Step 7: Export and Backup Hasura Metadata

### 7.1 Create a Directory for Metadata
```bash
mkdir -p /root/hasura/metadata
```

### 7.2 Export Metadata Manually
```bash
hasura metadata export --endpoint http://<your-droplet-ip>:8080 --admin-secret 'your_admin_secret_here'
```
This will save metadata in `/root/hasura/metadata/`.

### 7.3 Automate Metadata Backup
Edit crontab:
```bash
crontab -e
```
Add this line to run a backup **every 6 hours**:
```
0 */6 * * * cd /root/hasura && hasura metadata export --endpoint http://159.65.133.226:8080 --admin-secret '6hw3$@1&xAsZpE!k@rj' >> /root/hasura/metadata/backup.log 2>&1
```
Save and exit.

To verify cron job:
```bash
crontab -l
```

---

## Step 8: Restore Metadata
If metadata is lost, restore it using:
```bash
hasura metadata apply --endpoint http://<your-droplet-ip>:8080 --admin-secret 'your_admin_secret_here'
```

---

## File and Directory Structure
- `/root/hasura/` → Main Hasura directory
  - `docker-compose.yml` → Hasura configuration
  - `config.yaml` → Hasura CLI config
  - `metadata/` → Folder storing Hasura metadata backups
    - `rest_endpoints.yaml` → REST API definitions
    - `query_collections.yaml` → Saved GraphQL queries
    - `databases/` → Database connection metadata
    - `backup.log` → Log of automated metadata backups

---

## Security Recommendations
- Use a strong, unique admin secret.
- Configure firewall rules to restrict access.
- Consider using a reverse proxy with SSL (e.g., Nginx).

---

## Troubleshooting
- Check Docker logs: `docker-compose logs`
- Ensure PostgreSQL connection details are correct
- Verify network connectivity between Hasura and PostgreSQL

---

## Updating Hasura
```bash
# Pull latest image
docker-compose pull

# Restart with new image
docker-compose up -d
```

---

## Notes
- Always keep your Docker and Hasura versions updated.
- Regularly backup your PostgreSQL database.
- Review and adjust environment variables as needed.
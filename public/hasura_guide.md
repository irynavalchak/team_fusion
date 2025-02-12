# Hasura Installation Guide for DigitalOcean Droplet

## Prerequisites
- A DigitalOcean droplet running a recent Ubuntu/Debian-based Linux distribution
- Root or sudo access
- PostgreSQL database (can be on the same or a different server)

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

#### Command Explanation

- `sudo`: Runs the command with administrative privileges, required for installing files in system directories.
- `curl`: A command-line tool to download files from URLs.
- `-L`: Ensures that `curl` follows any redirects until it reaches the final destination of the file.
- `URL`: "https://github.com/docker/compose/releases/download/2.31.0/docker-compose-$(uname -s)-$(uname -m)" - This is the download URL for Docker Compose from its official GitHub repository.
- `$(uname -s)` and `$(uname -m)`: These are shell commands that dynamically fetch your system's architecture:
  - `uname -s`: Returns your operating system (e.g., Linux or Darwin for macOS).
  - `uname -m`: Returns your machine's architecture (e.g., x86_64 for 64-bit systems).
- Together, they ensure you download the correct binary for your OS and hardware.
- `-o /usr/local/bin/docker-compose`: Specifies the output location where the downloaded file (docker-compose) will be saved. `/usr/local/bin` is a directory in your system's PATH, making the binary globally executable.

## Step 2: Prepare Hasura Configuration

### 2.1 Create Hasura Directory
```bash
mkdir -p ~/hasura
cd ~/hasura
```

#### Command Explanation

- `~` refers to the current user's home directory.
- On your system, this is `/root`, because you're logged in as the root user.
- **Final Location**: The absolute path to the Hasura folder will be `/root/hasura`

### 2.2 Create docker-compose.yml
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
      # Replace these with your actual PostgreSQL connection details
      HASURA_GRAPHQL_DATABASE_URL: postgres://username:password@host:port/database
      HASURA_GRAPHQL_ADMIN_SECRET: your_admin_secret_here
      HASURA_GRAPHQL_UNAUTHORIZED_ROLE: public
      # Optional: Enable console for development (disable in production)
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
```

## Step 3: Run Hasura with Docker Compose

### 3.1 Start Hasura
```bash
# Start Hasura in detached mode
docker-compose up -d

# Check logs to confirm it's running
docker-compose logs -f
```

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

## Step 5: Access Hasura

### 5.1 Web Access
- Open `http://<your-droplet-ip>:8080` in your web browser
- Log in using the admin secret specified in `docker-compose.yml`

## Security Recommendations
- Use a strong, unique admin secret
- Configure firewall rules to restrict access
- Consider using a reverse proxy with SSL (e.g., Nginx)

## Troubleshooting
- Check Docker logs: `docker-compose logs`
- Ensure PostgreSQL connection details are correct
- Verify network connectivity between Hasura and PostgreSQL

## Updating Hasura
```bash
# Pull latest image
docker-compose pull

# Restart with new image
docker-compose up -d
```

## Notes
- Always keep your Docker and Hasura versions updated
- Regularly backup your PostgreSQL database
- Review and adjust environment variables as needed

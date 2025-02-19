
# Deployment Guide for Node.js app (Telegram Bot) on DigitalOcean Droplet

## Deployment Process

### 1. Prepare the Repository URL
- Obtain the repository URL from GitHub (HTTPS or SSH).

### 2. Connect to the Droplet
- Log in to your DigitalOcean droplet using one of the following:
  - **Online Console**: Open the console from the DigitalOcean dashboard.
  - **Local Machine**: Use a tool like PuTTY to connect - [PuTTY Guide](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/putty/)
    
### 3. Navigate to the Desired Directory
- Move to the directory where projects are stored:
  ```bash
  cd /var/www/telegram-bots/
  ```
- Check existing directories:
  ```bash
  ls
  ```

### 4. Clone the Repository from GitHub
- Clone your GitHub repository:
  ```bash
  git clone https://github.com/your-username/your-repo.git
  ```
- Provide your GitHub username and password when prompted.

### 5. Navigate into the Project Directory
- Enter the cloned repository directory:
  ```bash
  cd your-repo
  ```
- If your bot is in a subfolder (e.g., `bot`), navigate there:
  ```bash
  cd bot
  ```

### 6. Install Dependencies
- Install all required packages:
  ```bash
  npm install
  ```

### 7. Create or Update the `.env` File
- Use `nano` to create or edit the `.env` file:
  ```bash
  nano .env
  ```
- Paste your environment variables into the file.
- Save and close:
  - Press `Ctrl + O`, then `Enter` to save.
  - Press `Ctrl + X` to exit.

### 8. Verify the `.env` File
- Ensure the `.env` file has been saved correctly:
  ```bash
  cat .env
  ```

### 9. Set a Unique Port for Your Bot
- Add or update the `PORT` variable in the `.env` file:
  ```bash
  PORT=5080
  ```

### 10. Test the Bot
- Start the bot temporarily to ensure it works:
  ```bash
  npm run start
  ```

---

## Running the Bot with PM2

### 11. Start the Bot with PM2
- Use PM2 to run your bot for better process management:
  ```bash
  pm2 start npm --name "your-bot-name" -- run start --prefix /var/www/telegram-bots/your-repo/bot
  ```

### 12. Check the Bot's Status
- View all running processes managed by PM2:
  ```bash
  pm2 list
  ```

### 13. Verify the Bot Process
- Confirm the bot is running:
  ```bash
  ps aux | grep npm
  ```

### 14. Stop or Restart the Bot
- Stop the bot:
  ```bash
  pm2 stop your-bot-name
  ```
- Restart the bot:
  ```bash
  pm2 restart your-bot-name
  ```

### 15. Ensure Bots Restart After Reboot
- Save the PM2 process list:
  ```bash
  pm2 save
  ```
- Enable PM2 to start on system boot:
  ```bash
  pm2 startup
  ```

---

## Useful Linux Commands
- **List Files/Folders**:
  ```bash
  ls
  ```

- **Navigate Directories**:
  ```bash
  cd /path/to/directory
  ```

- **Monitor Processes**:
  ```bash
  top
  ```

- **Kill a Process (if needed)**:
  ```bash
  kill <process_id>
  ```

- **Check Open Network Ports and Listening Services**:
  ```bash
  sudo ss -tulpn
  ```
---

## Update Deployed Bot

### 1. Connect to Your Droplet
- Open the terminal and connect to your droplet using `ssh` or an SSH client like PuTTY:
  ```bash
  ssh root@your_droplet_ip
  ```
- Navigate to the bot directory:
  ```bash
  cd /var/www/telegram-bots/your-bot-folder
  ```

### 2. Stop the Current Bot Instance
- Use `pm2` to stop the running bot:
  ```bash
  pm2 stop your-bot-name
  ```

### 3. Pull the Latest Changes
- Update the local repository with the latest code from GitHub:
  ```bash
  git pull origin main
  ```
  Replace `main` with the appropriate branch name if necessary.

### 4. Install New Dependencies (if any)
- If you've added or updated dependencies in `package.json`, reinstall them:
  ```bash
  npm install
  ```

### 5. Update `.env` File (if required)
- If your updated code requires changes in the `.env` file:
  - Open the `.env` file using `nano`:
    ```bash
    nano .env
    ```
  - Make the necessary changes, save (Ctrl + O), and exit (Ctrl + X).

### 6. Restart the Bot
- Restart the bot using `pm2`:
  ```bash
  pm2 restart your-bot-name
  ```

### 7. Verify the Update
- Check the logs to ensure everything is working correctly:
  ```bash
  pm2 logs your-bot-name
  ```
- Confirm the bot is running with:
  ```bash
  pm2 list
  ```

### 8. Optional: Ensure Changes Persist on Reboot
- Save the current `pm2` process state:
  ```bash
  pm2 save
  ```

---

## Key Notes
- Always **test your updates locally** before deploying to avoid issues on the server.
- Use `pm2 logs` to debug errors during or after the update.

---

## PM2 Service Management and Useful Commands

This guide covers the essential steps and commands to manage Node.js applications with PM2 on a DigitalOcean droplet.

---

### **1. Reboot and Verify**
Reboot your server:
```bash
sudo reboot
```
After rebooting, verify the processes:
```bash
pm2 list
```

---

## **2. Useful PM2 Commands**

### **Process Management**
- **Start a Process:**
  ```bash
  pm2 start npm --name "app-name" -- run start --prefix /path/to/app
  ```
- **Stop a Process:**
  ```bash
  pm2 stop app-name
  ```
- **Restart a Process:**
  ```bash
  pm2 restart app-name
  ```
- **Delete a Process:**
  ```bash
  pm2 delete app-name
  ```

### **Logs**
- **View Logs:**
  ```bash
  pm2 logs
  ```
- **View Logs for a Specific Process:**
  ```bash
  pm2 logs app-name
  ```

### **Save and Reload Processes**
- **Save Current Process List:**
  ```bash
  pm2 save
  ```
- **Reload All Processes:**
  ```bash
  pm2 reload all
  ```

### **Startup and Shutdown**
- **Check PM2 Service Status:**
  ```bash
  systemctl status pm2-root
  ```
- **Remove PM2 Startup Script:**
  ```bash
  pm2 unstartup systemd
  ```

---

## **3. Additional Notes**
- PM2 uses the file `/root/.pm2/dump.pm2` to store the process list.
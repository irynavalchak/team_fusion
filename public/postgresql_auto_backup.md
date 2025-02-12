# PostgreSQL Automatic Backup Configuration Guide

## Overview
This guide describes the automatic backup configuration for PostgreSQL databases (business_finance and discord_messages) on the DigitalOcean droplet.

## Backup Schedule
- Backups run daily at 2:00 AM
- Retention period: 7 days
- Location: `/var/backups/postgresql/`

## Configuration Files

### Backup Script
Location: `/var/backups/postgresql/backup_script.sh`

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/postgresql"
DB_USER="orbios"
DATE=$(date +%Y%m%d_%H%M)

# Backup first database
DB_NAME="business_finance"
BACKUP_NAME="${DB_NAME}_${DATE}.sql"
pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_DIR/$BACKUP_NAME

# Backup second database
DB_NAME="discord_messages"
BACKUP_NAME="${DB_NAME}_${DATE}.sql"
pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_DIR/$BACKUP_NAME

# Remove backups older than 7 days for both databases
find $BACKUP_DIR -name "business_finance*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "discord_messages*.sql" -mtime +7 -delete
```

### Database Credentials
- PostgreSQL credentials are stored in `.pgpass` file
- Location: `/root/.pgpass`
- Format for both databases:
  ```
  localhost:5432:business_finance:orbios:your_password
  localhost:5432:discord_messages:orbios:your_password
  ```
- File permissions: 600 (readable only by owner)

## Setup Instructions

1. **Create Backup Directory**
```bash
sudo mkdir -p /var/backups/postgresql
sudo chown -R postgres:postgres /var/backups/postgresql
```

2. **Create Backup Script**
```bash
sudo nano /var/backups/postgresql/backup_script.sh
# Copy the script content from above
sudo chmod +x /var/backups/postgresql/backup_script.sh
```

3. **Configure Database Authentication**
```bash
sudo nano /root/.pgpass
# Add credentials lines for both databases
chmod 600 /root/.pgpass
```

4. **Setup Cron Job**
```bash
sudo crontab -e
# Add the following line:
0 2 * * * /var/backups/postgresql/backup_script.sh
```

## Verification

1. **Check Cron Configuration**
```bash
sudo crontab -l
```

2. **Test Backup Script**
```bash
sudo /var/backups/postgresql/backup_script.sh
```

3. **Verify Backup Creation**
```bash
ls -lh /var/backups/postgresql/
```

4. **View Backup Contents**
```bash
# View entire backup file
cat /var/backups/postgresql/business_finance_YYYYMMDD_HHMM.sql
# or
cat /var/backups/postgresql/discord_messages_YYYYMMDD_HHMM.sql

# Using less for large files
less /var/backups/postgresql/business_finance_YYYYMMDD_HHMM.sql
```
When using `less`:
- Use arrow keys to scroll
- Press 'Space' for next page
- Press 'b' for previous page
- Press 'q' to quit
- Press '/' to search

## Important Notes
- Backup passwords are stored in Dropbox
- Script automatically removes backups older than 7 days for both databases
- Backup files are named: database_name_YYYYMMDD_HHMM.sql (includes time to prevent overwriting)
- Check `/var/log/syslog` for cron job execution logs
- Both databases use the same user (orbios) but have separate backup files

## Troubleshooting
1. If backups are not creating:
   - Check cron logs: `grep CRON /var/log/syslog`
   - Verify script permissions
   - Test script manually
   
2. If authentication fails:
   - Check .pgpass permissions (should be 600)
   - Verify credentials in .pgpass for both databases
   - Test database connection manually
   - Ensure .pgpass is in /root/ directory
   - Remove -W flag from pg_dump command if password prompt appears
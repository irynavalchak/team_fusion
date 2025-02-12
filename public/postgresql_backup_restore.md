# PostgreSQL Backup and Restore Guide for DigitalOcean

## Prerequisites
- PostgreSQL installed
- Database user credentials (stored in Dropbox)
- Access to DigitalOcean console

## Backup Location
The database backups are stored in the following location:
```bash
/var/backups/postgresql/
```

To prepare the backup location:
```bash
# Create backup directory
sudo mkdir -p /var/backups/postgresql

# Set correct permissions
sudo chown -R postgres:postgres /var/backups/postgresql
```

## Backup Database

1. **Open DigitalOcean Console**
   - Log in to your DigitalOcean droplet
   - Open terminal

2. **Create Database Backup**
   ```bash
   pg_dump -h localhost -U [user] -W [db_name] > /var/backups/postgresql/[db_name]_$(date +%Y%m%d).sql
   ```
   
   **Example:**
   ```bash
   pg_dump -h localhost -U orbios -W business_finance > /var/backups/postgresql/business_finance_$(date +%Y%m%d).sql
   ```

3. **Verify Backup File**
   ```bash
   # Check file size and creation date
   ls -lh /var/backups/postgresql/
   
   # View backup header to ensure proper format
   cat /var/backups/postgresql/business_finance_$(date +%Y%m%d).sql | head -n 5
   
   # Check for table definitions in backup
   grep "CREATE TABLE" /var/backups/postgresql/business_finance_$(date +%Y%m%d).sql
   ```

## Restore Database

1. **Create New Database**
   ```bash
   createdb -h localhost -U [user] -W [new_db_name]
   ```
   
   **Example:**
   ```bash
   createdb -h localhost -U orbios -W business_finance_restored
   ```

2. **Restore Backup to New Database**
   ```bash
   psql -h localhost -U [user] -W [new_db_name] < /var/backups/postgresql/[backup_file_name].sql
   ```
   
   **Example:**
   ```bash
   psql -h localhost -U orbios -W business_finance_restored < /var/backups/postgresql/business_finance_20250114.sql
   ```

## Important Notes
- Database credentials are stored in Dropbox for security
- Backups are date-stamped for easy identification
- Always verify backup integrity after creation
- Current databases: business_finance, knowledge_base, orbios
- Consider making a local copy of important backups
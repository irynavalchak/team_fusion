# How To Add Swap Space on Ubuntu 22.04

## What is Swap?

Swap is a portion of hard drive storage used by the operating system to temporarily store data that no longer fits in RAM. It provides a safety net against out-of-memory errors, allowing the system to continue running when physical memory is depleted.

## Prerequisites

- Ubuntu 22.04 system
- Root or sudo access
- Available disk space

## Step 1: Check Existing Swap

```bash
# Check swap configuration
sudo swapon --show

# Verify swap status
free -h
```

## Step 2: Check Disk Space

```bash
# View disk usage
df -h
```

## Step 3: Create Swap File

```bash
# Create swap file (adjust size as needed)
sudo fallocate -l 1G /swapfile

# Verify file creation
ls -lh /swapfile
```

## Step 4: Enable Swap File

```bash
# Set secure permissions
sudo chmod 600 /swapfile

# Create swap filesystem
sudo mkswap /swapfile

# Activate swap
sudo swapon /swapfile

# Verify swap activation
sudo swapon --show
free -h
```

## Step 5: Make Swap Permanent

```bash
# Backup fstab
sudo cp /etc/fstab /etc/fstab.bak

# Add swap to fstab
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Step 6: Tune Swap Settings

### Adjust Swappiness

```bash
# Check current swappiness
cat /proc/sys/vm/swappiness

# Set swappiness (e.g., to 10 for servers)
sudo sysctl vm.swappiness=10

# Make permanent by editing /etc/sysctl.conf
# Add: vm.swappiness=10
```

### Adjust Cache Pressure

```bash
# Check current cache pressure
cat /proc/sys/vm/vfs_cache_pressure

# Set cache pressure (e.g., to 50)
sudo sysctl vm.vfs_cache_pressure=50

# Make permanent by editing /etc/sysctl.conf
# Add: vm.vfs_cache_pressure=50
```

## Swap Size Recommendations

| System RAM | Recommended Swap |
|-----------|-----------------|
| < 2GB | 2x RAM |
| 2-8GB | Equal to RAM |
| 8-64GB | 0.5x RAM |
| > 64GB | Minimum 4GB |

## Notes

- Swap significantly slower than RAM
- Best used as a temporary memory solution
- For persistent memory issues, consider upgrading RAM

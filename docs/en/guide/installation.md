# Installation

This document explains how to install and configure DNS services.

## Requirements

- Operating System: Linux / Windows / macOS
- Network: Ensure port 53 is available

## Common DNS Servers

### BIND

BIND is the most widely used DNS server software.

```bash
# Ubuntu/Debian
sudo apt install bind9

# CentOS/RHEL
sudo yum install bind
```

### CoreDNS

CoreDNS is a flexible, extensible DNS server.

```bash
# Download CoreDNS
wget https://github.com/coredns/coredns/releases/download/v1.11.1/coredns_1.11.1_linux_amd64.tgz
tar -xzf coredns_1.11.1_linux_amd64.tgz
```

## Basic Configuration

### Configuration File Example

```conf
zone "example.com" {
    type master;
    file "/etc/bind/zones/example.com.zone";
};
```

### Zone File Example

```
$TTL 86400
@   IN  SOA ns1.example.com. admin.example.com. (
        2024010101  ; Serial
        3600        ; Refresh
        1800        ; Retry
        604800      ; Expire
        86400       ; Minimum TTL
)
    IN  NS  ns1.example.com.
    IN  A   192.168.1.1
www IN  A   192.168.1.2
```

## Verify Configuration

```bash
# Check configuration syntax
named-checkconf

# Check zone file
named-checkzone example.com /etc/bind/zones/example.com.zone
```

## Troubleshooting

### Port Already in Use

Check if port 53 is occupied:

```bash
sudo lsof -i :53
```

### Resolution Failed

1. Check firewall settings
2. Confirm DNS service is running
3. Verify configuration file syntax

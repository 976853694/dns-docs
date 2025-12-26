# DNS Record Types

DNS supports multiple record types, each with different purposes.

## Common Record Types

### A Record

Points a domain to an IPv4 address.

```
example.com.    IN  A   192.168.1.1
www.example.com. IN  A   192.168.1.2
```

### AAAA Record

Points a domain to an IPv6 address.

```
example.com.    IN  AAAA    2001:db8::1
```

### CNAME Record

Creates a domain alias pointing to another domain.

```
www.example.com.    IN  CNAME   example.com.
blog.example.com.   IN  CNAME   example.github.io.
```

> **Note**: CNAME cannot coexist with other records on the same domain.

### MX Record

Specifies mail servers. The number indicates priority (lower = higher priority).

```
example.com.    IN  MX  10  mail1.example.com.
example.com.    IN  MX  20  mail2.example.com.
```

### TXT Record

Stores text information, commonly used for domain verification, SPF, DKIM, etc.

```
example.com.    IN  TXT "v=spf1 include:_spf.google.com ~all"
```

### NS Record

Specifies authoritative DNS servers for a domain.

```
example.com.    IN  NS  ns1.example.com.
example.com.    IN  NS  ns2.example.com.
```

## Other Record Types

| Type | Purpose |
|------|---------|
| SRV | Service location record |
| PTR | Reverse lookup record |
| CAA | Certificate Authority Authorization |
| SOA | Start of Authority |

## Querying Records

Use the dig command to query different record types:

```bash
# Query A record
dig example.com A

# Query MX record
dig example.com MX

# Query all records
dig example.com ANY
```

## Best Practices

1. **Set appropriate TTL**: Use shorter TTL for frequently changing records
2. **Use CNAME for simplicity**: For CDN, cloud services, etc.
3. **Configure backup MX**: Ensure mail service high availability
4. **Add SPF/DKIM**: Prevent emails from being marked as spam

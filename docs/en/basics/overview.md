# DNS Overview

DNS (Domain Name System) is the "phone book" of the Internet, translating domain names into IP addresses.

## What is DNS

DNS is a distributed database system with the following main functions:

- **Domain Resolution**: Convert domain names to IP addresses
- **Reverse Resolution**: Convert IP addresses to domain names
- **Mail Routing**: Specify mail servers via MX records

## How DNS Works

```
User → Local DNS → Root Server → TLD Server → Authoritative Server → IP Address
```

### Resolution Process

1. **Browser Cache**: First check browser cache
2. **System Cache**: Check OS DNS cache
3. **Local DNS**: Query local DNS server
4. **Recursive Query**: Local DNS performs recursive query
5. **Return Result**: Return IP address to user

## DNS Hierarchy

```
.                    (Root)
├── com              (Top-Level Domain)
│   ├── example      (Second-Level Domain)
│   │   └── www      (Subdomain)
│   └── google
├── org
└── cn
```

## Popular DNS Servers

| Provider | IPv4 | IPv6 |
|----------|------|------|
| Google | 8.8.8.8 | 2001:4860:4860::8888 |
| Cloudflare | 1.1.1.1 | 2606:4700:4700::1111 |
| Alibaba | 223.5.5.5 | 2400:3200::1 |

## Related Concepts

- **TTL**: Time To Live, cache duration
- **SOA**: Start of Authority record
- **NS**: Name Server record

## Next Steps

Learn about [DNS Record Types](/basics/record-types) to understand the purpose of different records.

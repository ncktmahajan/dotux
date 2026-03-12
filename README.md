# nachiket.ux — Local Custom Domain

> Your own `.ux` top-level domain, running entirely on your machine (or local network).
> No ICANN. No registrar. No cloud. Just a hosts file entry and Node.js.

---

## 📁 Project Structure

```
nachiket-ux/
├── server.js              ← Main Node.js HTTP/HTTPS server
├── package.json
├── public/
│   ├── index.html         ← Landing page
│   ├── css/style.css
│   └── js/main.js
├── ssl/                   ← Drop mkcert certs here for HTTPS
│   ├── nachiket.ux.pem
│   └── nachiket.ux-key.pem
├── dns/
│   └── dnsmasq.conf       ← Network-wide DNS config
└── scripts/
    ├── setup-hosts.sh     ← macOS/Linux hosts setup
    ├── setup-hosts.ps1    ← Windows hosts setup
    └── setup-ssl.sh       ← HTTPS cert generation
```

---

## 🚀 Quick Start (3 steps)

### Step 1 — Edit your hosts file

**macOS / Linux:**
```bash
sudo bash scripts/setup-hosts.sh
# OR manually:
sudo echo "127.0.0.1    nachiket.ux" >> /etc/hosts
```

**Windows** (run PowerShell as Administrator):
```powershell
.\scripts\setup-hosts.ps1
# OR manually edit: C:\Windows\System32\drivers\etc\hosts
# Add: 127.0.0.1    nachiket.ux
```

### Step 2 — Start the server

Port 80 requires elevated privileges:

**macOS / Linux:**
```bash
sudo node server.js
# OR on a high port without sudo:
PORT=8080 node server.js
```

**Windows** (run as Administrator):
```powershell
node server.js
```

### Step 3 — Open in browser

```
http://nachiket.ux
```

That's it. ✅

---

## 🔒 Enable HTTPS (Optional)

### Install mkcert
```bash
# macOS
brew install mkcert

# Linux
apt install mkcert
# or: brew install mkcert

# Windows
choco install mkcert
```

### Generate certs
```bash
bash scripts/setup-ssl.sh
```

This creates:
- `ssl/nachiket.ux.pem`
- `ssl/nachiket.ux-key.pem`

The server detects these automatically on startup.

### Open HTTPS
```bash
sudo node server.js
# → https://nachiket.ux
```

---

## 🌐 Network-Wide Access (Every Device on WiFi)

### Install dnsmasq
```bash
# macOS
brew install dnsmasq

# Linux
sudo apt install dnsmasq
```

### Configure
1. Find your machine's local IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows
   ipconfig
   ```

2. Edit `dns/dnsmasq.conf`, replace `192.168.1.50` with your IP.

3. Apply the config:
   ```bash
   sudo cp dns/dnsmasq.conf /etc/dnsmasq.conf
   sudo systemctl restart dnsmasq
   ```

4. On each device, set DNS server to your machine's local IP.
   Now `nachiket.ux` resolves everywhere on your network.

---

## ⚙️ Server Options

| Environment Variable | Default | Description          |
|----------------------|---------|----------------------|
| `PORT`               | `80`    | HTTP port            |
| `HTTPS_PORT`         | `443`   | HTTPS port           |

```bash
PORT=3000 node server.js          # HTTP on port 3000
HTTPS_PORT=8443 node server.js    # HTTPS on port 8443
```

---

## 🔧 How It Works

```
Browser: http://nachiket.ux
         ↓
OS checks /etc/hosts
         ↓
Finds:   127.0.0.1  nachiket.ux
         ↓
Connects to localhost:80
         ↓
Node.js server handles request
         ↓
Serves files from /public/
```

**Why it's local only:** `.ux` does not exist in ICANN's global DNS root. 
Your hosts file intercepts the domain before any real DNS query fires.

---

## 🌍 Make It Public (Globally Accessible)

Option 1 — Use a real subdomain:
```
ux.nachiket.design   ← works globally, looks like a UX namespace
```

Option 2 — Tunnel your local server:
```bash
# Using ngrok
ngrok http 80
# → https://abc123.ngrok.io (temporary)

# Using cloudflared
cloudflared tunnel --url http://localhost:80
```

---

## 📦 No Dependencies

This project uses **zero npm packages**. Everything is built on Node.js core modules:
- `http` — HTTP server
- `https` — HTTPS server  
- `fs` — File serving
- `path` — Safe path resolution
- `url` — Request parsing

```bash
node server.js   # Just works. No npm install needed.
```

---

## 💡 Bonus: Build Your Own DNS Registry

Want to go deeper? You can build your own `.ux` DNS registry using:
- **CoreDNS** with a custom plugin
- **PowerDNS** with a database backend
- **A Node.js DNS server** using the `dns2` package

This is how companies like Google built `.dev` and `.app` — except they got ICANN approval and paid ~$185,000 for the TLD.

---

*nachiket.ux — localhost, but cooler.*

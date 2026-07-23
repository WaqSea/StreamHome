# Installation

This guide explains how to install StreamHome using the official automated installation scripts.

StreamHome provides automated installers for Linux and Windows. The installer downloads the latest StreamHome files, checks the system environment, prepares the required dependencies, configures the application, and starts the first-run setup process.

> [!IMPORTANT]
> StreamHome is under active development. Installation behavior, supported platforms, package requirements, and configuration steps may change between releases.
>
> Always use installation commands from the official StreamHome repository.

## Quick Installation

### Linux

Open a terminal and run:

```bash
curl -fsSL https://raw.githubusercontent.com/StreamHome/StreamHome/main/install.sh | bash
```

The installer may request administrator privileges while installing dependencies or configuring system services.

### Windows PowerShell

Open **PowerShell as Administrator** and run:

```powershell
irm https://raw.githubusercontent.com/StreamHome/StreamHome/main/install.ps1 | iex
```

Keep the terminal or PowerShell window open until the installation finishes.

## Review the Installer Before Running

The commands above download and execute the official installation script directly from GitHub.

Users who prefer to inspect the script before running it can download it first.

### Linux

```bash
curl -fsSL https://raw.githubusercontent.com/StreamHome/StreamHome/main/install.sh -o install.sh
less install.sh
bash install.sh
```

### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/StreamHome/StreamHome/main/install.ps1 -OutFile install.ps1
notepad install.ps1
.\install.ps1
```

> [!WARNING]
> Do not run StreamHome installation scripts downloaded from unofficial mirrors, shortened links, comments, messages, or third-party websites.

## Supported Operating Systems

StreamHome provides automated installation support for:

* Linux;
* Windows 10;
* Windows 11.

### Linux Distribution Support

StreamHome is designed to support Linux distributions generally rather than being restricted to a single distribution family.

The Linux installer detects the current distribution and available package manager. Supported distributions may include:

* Debian;
* Ubuntu;
* Linux Mint;
* Fedora;
* Rocky Linux;
* AlmaLinux;
* CentOS-compatible distributions;
* Arch Linux;
* Manjaro;
* openSUSE;
* Alpine Linux;
* other Linux distributions that provide the required dependencies.

Depending on the distribution, the installer may use package managers such as:

* `apt`;
* `dnf`;
* `yum`;
* `pacman`;
* `zypper`;
* `apk`.

> [!NOTE]
> Package names, repositories, dependency versions, and system-service behavior differ between Linux distributions.
>
> When automatic dependency installation is unavailable, the installer should report the missing dependency and the action required to continue.

### Windows Support

Windows installation is handled by the official PowerShell installer.

The installer prepares the Windows-compatible StreamHome environment, verifies the required dependencies, downloads the application, and starts the initial setup process.

PowerShell must be opened with administrator privileges.

## Before You Begin

Before installing StreamHome, confirm that you have:

* a supported Linux or Windows computer;
* administrator, `sudo`, or PowerShell Administrator access;
* an active internet connection;
* enough free local storage;
* a modern web browser;
* permission to modify the selected system;
* a current backup of important data.

For an internet-accessible installation, you should also prepare:

* a domain or subdomain;
* HTTPS;
* a reverse proxy;
* appropriate firewall rules.

A public domain and HTTPS are especially important when using Google Drive because the OAuth callback address must exactly match the public StreamHome address.

## System Requirements

Actual requirements depend on:

* catalog size;
* concurrent playback sessions;
* source resolution and bitrate;
* FFmpeg activity;
* adaptive playback preparation;
* cloud synchronization;
* optional HEVC optimization;
* available local storage.

| Resource          |      Minimum |                                          Recommended |
| ----------------- | -----------: | ---------------------------------------------------: |
| **CPU**           |      2 vCPUs |                                      4 or more vCPUs |
| **Memory**        |     2 GB RAM |                                     4 GB RAM or more |
| **Network**       |      20 Mbps (lower is no problem) | 1 Gbps for high-bitrate playback and cloud transfers |
| **Local storage** |        20 GB |                              50 GB or more on an SSD |
| **Architecture**  | 64-bit Linux |                        Modern x86-64 or ARM64 system |

Additional local storage may be required for:

* temporary downloads;
* FFmpeg processing;
* adaptive playback cache;
* artwork and metadata;
* database backups;
* media stored locally instead of in Google Drive.

## Required Software

The Linux installer prepares or verifies the software required by StreamHome.

Core dependencies include:

* Python 3.10 or newer;
* FFmpeg;
* FFprobe;
* Node.js;
* npm;
* Git;
* Rclone when Google Drive storage is used;
* common Linux download and archive utilities.

You normally do not need to install these manually when using the official installer.

## Before You Begin

You need:

* a Linux server or computer;
* administrator or `sudo` access;
* an active internet connection;
* enough free disk space;
* access to the StreamHome GitHub Releases page;
* a modern web browser for the setup wizard.

For a public installation, you should also prepare:

* a domain or subdomain;
* HTTPS;
* a reverse proxy;
* firewall rules;
* a current server backup.

A domain and HTTPS are especially important when connecting Google Drive because the OAuth callback must match the public StreamHome address exactly.

## 1. Download the Installer

Open the latest StreamHome release:

`https://github.com/StreamHome/StreamHome/releases`

Download the Linux installation script included with the release.

The filename may resemble:

`streamhome-install.sh`

Do not download installation scripts from unofficial mirrors, shortened links, comments, or third-party websites.

## 2. Verify the Release

Before running the installer:

1. Confirm that the release belongs to the official **StreamHome** GitHub organization.
2. Review the release notes.
3. Check whether the release is marked as alpha, beta, release candidate, or stable.
4. Verify the published checksum or signature when one is provided.
5. Read the known issues section.

> [!WARNING]
> Pre-release versions may contain incomplete features, breaking changes, or migration limitations.
>
> Do not install a pre-release version on a server containing irreplaceable data without a verified backup.

## 3. Make the Installer Executable

Open a terminal in the directory containing the downloaded installer.

Run:

```bash
chmod +x streamhome-install.sh
```

## 4. Run the Installer

Run the installer with administrator privileges:

```bash
sudo ./streamhome-install.sh
```

The installer may ask for confirmation before:

* installing system packages;
* creating StreamHome directories;
* preparing the Python environment;
* installing server dependencies;
* installing web dependencies;
* building the production web interface;
* creating environment files;
* starting StreamHome.

Do not close the terminal while installation is in progress.

## 5. Distribution Detection

The installer detects the Linux distribution and available package manager.

Depending on the system, it may use tools such as:

* `apt`;
* `dnf`;
* `yum`;
* `pacman`;
* `zypper`;
* `apk`;
* another supported package manager.

If the distribution is recognized but a dependency is unavailable, the installer should display:

* the missing dependency;
* the attempted package name;
* the detected package manager;
* the installation stage that failed;
* any manual action required.

Correct the reported issue and run the installer again.

## 6. Installation Process

During installation, StreamHome prepares the application environment.

The process includes:

1. Checking the operating system and architecture.
2. Checking administrator permissions.
3. Verifying network access.
4. Installing or validating required dependencies.
5. Preparing the StreamHome server environment.
6. Installing Python packages.
7. Installing web packages.
8. Building the production web application.
9. Creating required application directories.
10. Preparing the environment configuration.
11. Initializing the first-run setup state.
12. Starting the StreamHome services.
13. Displaying the local setup address and bootstrap code.

The installer must not print application secrets, API tokens, passwords, OAuth tokens, or recovery codes into persistent public logs.

## 7. Open StreamHome

After installation, the terminal displays the address used to continue setup.

For a local installation, the address normally resembles:

`http://SERVER_IP:3000/setup`

Examples:

`http://127.0.0.1:3000/setup`

`http://192.168.1.50:3000/setup`

For an installation behind HTTPS and a reverse proxy:

`https://watch.example.com/setup`

The StreamHome web interface uses port `3000` by default.

The FastAPI server normally runs internally on port `8000` behind the StreamHome web proxy. Port `8000` should not normally be exposed directly to the public internet.

## 8. Enter the Bootstrap Code

A new StreamHome installation begins in protected setup mode.

The installer displays a one-time bootstrap code in the terminal.

Open `/setup` in your browser and enter that code when requested.

The bootstrap code:

* is intended for the first-run setup process;
* should not be shared;
* should not be placed in screenshots;
* should not be sent through public messages;
* should not be stored in browser URLs.

If the code expires, follow the installer or server instructions to generate a new setup session.

## 9. Complete Initial Setup

The setup wizard guides you through the remaining configuration.

The complete setup may include:

1. Creating the administrator account.
2. Configuring the administrator password.
3. Enabling optional TOTP two-factor authentication.
4. Saving administrator recovery codes.
5. Configuring TMDB.
6. Generating the MediaSender ingestion token.
7. Selecting local or Google Drive storage.
8. Connecting Google Drive when required.
9. Running storage health checks.
10. Reviewing the final configuration.
11. Activating StreamHome.

Keep the following information private:

* administrator password;
* TOTP secret;
* recovery codes;
* MediaSender ingestion token;
* TMDB credentials;
* Google OAuth Client Secret;
* Google Drive refresh token;
* Rclone configuration.

## 10. Important StreamHome Paths

A standard installation uses the following application paths inside the StreamHome directory:

| Path                         | Purpose                                  |
| ---------------------------- | ---------------------------------------- |
| `.env`                       | Deployment and process configuration     |
| `server/.env`                | Server secrets and private configuration |
| `server/database.db`         | Main StreamHome database                 |
| `server/media/Movies`        | Movie directories                        |
| `server/media/Series`        | Series directories                       |
| `server/rclone/rclone.conf`  | Application-managed Rclone configuration |
| `server/temp`                | Temporary processing data                |
| `server/temp/playback_cache` | Adaptive playback cache                  |
| `server/backup`              | Local database backups                   |

Do not manually edit or delete these paths while StreamHome is running unless the documentation specifically instructs you to do so.

> [!CAUTION]
> Never publish `.env`, `server/.env`, `database.db`, `rclone.conf`, backup databases, authentication secrets, or recovery codes.

## 11. Verify the Installation

After setup is complete, verify:

* the login page opens;
* the administrator can sign in;
* the selected theme loads;
* the Admin Center opens;
* the database is writable;
* the media directories are accessible;
* FFmpeg and FFprobe are available;
* the storage health check succeeds;
* Google Drive reports a healthy connection when enabled;
* the server remains healthy after a restart.

You should also confirm that:

* no unexpected errors appear in the browser console;
* the server has enough free disk space;
* the system clock and timezone are correct;
* the reverse proxy forwards the correct host and protocol;
* HTTPS is working before exposing StreamHome publicly.

## 12. Firewall and Network Access

For a local-only installation, allow access to the StreamHome web port only from trusted local networks.

For a public installation, expose the reverse proxy over:

* TCP port `80` for HTTP redirection;
* TCP port `443` for HTTPS.

Avoid exposing the internal FastAPI port directly.

Recommended public routing:

```text
Internet
    ↓
HTTPS Reverse Proxy
    ↓
StreamHome Web — Port 3000
    ↓
Internal FastAPI — Port 8000
```

Use trusted proxy configuration and preserve:

* the original host;
* the original protocol;
* the client address when required;
* WebSocket or streaming behavior when used;
* long-running response support.

## 13. Installation Failure

When installation fails:

1. Read the first clear error shown by the installer.
2. Do not repeatedly rerun the installer without identifying the failure.
3. Confirm that the server has internet access.
4. Confirm that sufficient disk space is available.
5. Confirm that the current user has `sudo` permission.
6. Confirm that the package manager is not locked by another process.
7. Correct the dependency or repository problem.
8. Run the installer again.

A correctly designed installer should safely detect completed stages and avoid duplicating configuration when rerun.

## Common Problems

### Permission denied

Make the installer executable:

```bash
chmod +x streamhome-install.sh
```

Then run it with:

```bash
sudo ./streamhome-install.sh
```

### Command not found

Confirm that the script was downloaded successfully and that you are running it from the correct directory.

List the current directory:

```bash
ls -la
```

### Package manager is locked

Another installation or system update may be running.

Wait for the current package operation to finish before running the StreamHome installer again.

Do not forcibly delete package-manager lock files unless you understand the consequences.

### FFmpeg is unavailable

Check:

```bash
ffmpeg -version
ffprobe -version
```

If either command fails, review the package-manager error reported by the installer.

### Node.js or npm is unavailable

Check:

```bash
node --version
npm --version
```

The release installer should install a compatible Node.js version or report why it could not do so.

### Python version is unsupported

Check:

```bash
python3 --version
```

StreamHome requires Python 3.10 or newer.

### The setup page does not open

Check:

* StreamHome is running;
* port `3000` is available;
* the firewall permits access;
* the correct server IP is being used;
* the reverse proxy points to the correct local port;
* another service is not already using the configured web port.

### The setup wizard reports an invalid bootstrap code

Confirm that:

* the code belongs to the current installation;
* the complete code was entered;
* the code has not expired;
* the browser is opening the same StreamHome server that generated the code.

### Installation completes but StreamHome does not start

Review the installer output and server logs.

Check:

* Python dependencies;
* frontend build output;
* environment files;
* database permissions;
* port conflicts;
* available RAM and disk space.

Do not publish complete logs without first removing secrets, tokens, cookies, private paths, and personal information.

## Security Checklist

Before exposing StreamHome publicly, verify:

* [ ] StreamHome was downloaded from the official GitHub release.
* [ ] The installer completed without unresolved errors.
* [ ] The administrator uses a strong password.
* [ ] TOTP is enabled when appropriate.
* [ ] Recovery codes are stored offline.
* [ ] The MediaSender token is private.
* [ ] Server environment files are not publicly accessible.
* [ ] The internal API port is not exposed unnecessarily.
* [ ] HTTPS is enabled.
* [ ] Reverse proxy configuration is correct.
* [ ] Firewall rules permit only required traffic.
* [ ] Google OAuth credentials are private.
* [ ] Local database backups exist.
* [ ] Available disk space is monitored.
* [ ] StreamHome starts successfully after a server restart.

## Related Documentation

* [Getting Started](getting-started.md)
* [Initial Setup](setup.md)
* [Google Drive Integration](google-drive.md)
* [Storage](storage.md)
* [Adding Media](adding-media.md)
* [Security](security.md)
* [Backup and Recovery](backup-and-recovery.md)
* [Troubleshooting](troubleshooting.md)

---

<p align="center">
  <b>Your media. Your server. Your StreamHome.</b>
</p>

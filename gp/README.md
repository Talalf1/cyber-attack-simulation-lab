# 🛡️ Cyber Attack Simulation Lab (CASL)

> Graduation Project — Interactive Cybersecurity Training Platform

[![Educational](https://img.shields.io/badge/Purpose-Educational-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

## Overview

A complete web-based Cyber Attack Simulation Lab that provides a secure, isolated, and controlled environment for learning offensive and defensive cybersecurity techniques.

## Features

- 🖥️ **Live Dashboard** — VM status, resource usage, live threat feed
- ⚔️ **6 Attack Simulations** — Port Scan, Brute Force, Metasploit, Phishing, Ransomware, Privilege Escalation
- 📡 **Wazuh SIEM Monitoring** — Real-time log stream and alert table
- 📊 **Reports & Analytics** — Charts, session history, AI threat analysis
- 🗺️ **Network Topology** — Animated interactive network map
- 🎓 **Interactive Attack Guide** — Type real commands and learn step by step
- 📖 **Project Documentation** — All chapters beautifully formatted

## Demo Login

| Email | Password | Role |
|-------|----------|------|
| admin@casl.lab | Admin@2024 | Lab Admin |
| analyst@casl.lab | Analyst@2024 | Security Analyst |

## Virtual Lab Architecture

```
Kali Linux (Attacker) ──→ Windows Server 2022 (Victim) ──→ Wazuh SIEM
192.168.100.10              192.168.100.20                  192.168.100.30
                    ──→ Ubuntu Server 22.04 (Victim)
                            192.168.100.21
All inside VirtualBox Internal Network [ISOLATED]
```

## Tech Stack

- HTML5, CSS3 (Glassmorphism Dark Theme), Vanilla JavaScript
- Chart.js, FontAwesome, JetBrains Mono
- localStorage for state management

## Ethical Notice

> All attack simulations are for **educational purposes only** and must be run in an **isolated virtual environment**. Never use these techniques on systems you don't own.

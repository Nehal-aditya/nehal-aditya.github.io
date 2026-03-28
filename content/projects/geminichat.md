---
title: "Gemini chat"
date: 2026-01-01
draft: false
weight: 2
---

# GeminiChat

GeminiChat is a cross‑platform chatbot application powered by Google’s Gemini API.  
It is being developed in **two parallel implementations**, each exploring different strengths in architecture and workflow.

---

## 🌐 Nuxt + Tauri Version
- **Frontend:** Nuxt.js  
- **Desktop shell:** Tauri (Rust + Node)  
- **Highlights:**  
  - Web‑first architecture with rapid prototyping.  
  - Lightweight binaries thanks to Tauri’s Rust core.  
  - Flexible styling and hot‑reload from the Nuxt ecosystem.  
- **Repository:** [geminichat](https://github.com/Nehal-aditya/geminichat)

---

## 💻 .NET + Avalonia Version
- **Frontend/UI:** Avalonia UI  
- **Core:** .NET C#  
- **Highlights:**  
  - Native cross‑platform desktop experience with strongly typed workflows.  
  - Optimized for ARM64 hardware and bandwidth‑constrained environments.  
  - Reproducible packaging pipelines with MSI/EXE installers.  
- **Repository:** [geminichat‑net](https://github.com/Nehal-aditya/geminichat-net)

---

## 📦 Downloads
- **Windows builds** are available now.  
- **macOS and Linux precompiled binaries** are coming soon.  

---

## 🔄 Why Two Versions?
- **Nuxt + Tauri**: Best suited for developers who want web‑centric workflows and rapid iteration.  
- **.NET + Avalonia**: Ideal for those who prefer native desktop performance, reproducible builds, and strong typing.  

Both versions evolve in parallel, offering different perspectives on building accessible, efficient chatbot applications.

# Installation Guide

This document explains how to deploy the documentation system to GitHub Pages.

## Prerequisites

- GitHub account
- Basic Git knowledge

## Deployment Steps

### 1. Fork or Clone the Repository

```bash
git clone https://github.com/your-username/docs-system.git
cd docs-system
```

### 2. Modify Configuration

Edit the `config/config.json` file:

```json
{
  "title": "Your Documentation Title",
  "description": "Documentation description",
  "defaultLang": "en",
  "languages": ["zh", "en"],
  "repo": "https://github.com/your-username/your-repo"
}
```

### 3. Add Documentation

Add Markdown files under the `docs/` directory:

```
docs/
├── zh/
│   └── guide/
│       └── your-doc.md
└── en/
    └── guide/
        └── your-doc.md
```

### 4. Update Navigation

Edit `config/nav.json` to add navigation links for new documents.

### 5. Enable GitHub Pages

1. Go to repository Settings
2. Find the Pages option
3. Select `main` branch as Source
4. Save and wait for deployment

## Local Preview

Simply open the `index.html` file in your browser to preview.

> **Note**: Due to browser security restrictions, some features may be limited in local preview. Consider using a local server.

## FAQ

### Document Loading Failed

Check if the file path is correct and ensure the Markdown file exists in the corresponding directory.

### Search Not Working

Make sure you have updated the `config/search-index.json` file.

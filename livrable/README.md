# Livrable/

Ce dossier contient tout ce que Jarvis produit pour Christophe : applications, outils, scripts, automatisations, sites web.

---

## Règle d'or

| Direction | Emplacement |
|-----------|-------------|
| **Inputs** (documents que tu fournis à Claude) | `context/import/` |
| **Outputs** (ce que Claude produit pour toi) | `livrable/` |

---

## Organisation

```
livrable/
├── applications/     # Applications web ou desktop complètes
├── outils/           # Configurations, templates, dashboards, fichiers de travail
├── scripts/          # Scripts ponctuels (Python, JS, Bash, etc.)
├── automatisations/  # Flows n8n, scénarios Zapier/Make, webhooks
└── site-web/         # Sites vitrines, landing pages, portfolios
```

---

## Convention de nommage des projets

Format : `AAAA-MM_NOM-PROJET_TYPE`

Exemples :
- `2026-06_tableau-bord-obm_notion`
- `2026-07_prospection-linkedin_script`
- `2026-07_site-vitrine-obm_nextjs`

Règles :
- Date en préfixe (permet le tri chronologique automatique)
- Nom court, en minuscules, avec tirets
- Type en suffixe (outil, script, app, flow, etc.)
- Pas d'espaces, pas d'accents

---

## Création d'un livrable

1. Choisir le bon sous-dossier thématique
2. Créer un dossier au format `AAAA-MM_NOM-PROJET_TYPE`
3. Y déposer les fichiers produits
4. Si le projet grossit, ajouter un README dans le dossier du projet

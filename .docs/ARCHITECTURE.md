# Architecture OBM-OS — Jarvis Starter Kit

## Vue d'ensemble

Ce workspace est le système opérationnel de Christophe Lachaud (OBM freelance). Il s'articule autour de trois couches : le contexte (qui je suis et où j'en suis), les opérations (skills et agents pour exécuter), et la connaissance (méthodes, templates, SOPs).

---

## Arborescence principale

```
.
├── CLAUDE.md                  # Fondation : chargé à chaque session, source de vérité unique
├── OBM-OS.md                  # Règles de fonctionnement du système OBM-OS
├── AGENTS.md                  # Vue lisible de l'équipe d'agents IA
├── ROADMAP.md                 # Feuille de route des lots de construction
│
├── context/
│   ├── CONTEXT.md             # Profil complet, objectifs, projets en cours
│   ├── HISTORY.md             # Journal des sessions et décisions
│   └── import/                # Documents externes à analyser (PDFs, exports)
│
├── .claude/
│   ├── agents/                # Sous-agents spécialisés (operations.md, etc.)
│   ├── commands/              # Commandes slash (/prime, /update, /morning, /commit)
│   └── skills/                # Skills actifs (voir liste ci-dessous)
│
├── knowledge/                 # Méthodes et connaissances de référence
│   ├── automatisation/
│   ├── marketing/
│   ├── obm-elite/
│   ├── operations/
│   ├── outils/
│   └── vente/
│
├── templates/                 # Documents modèles réutilisables
├── sop/                       # Procédures opérationnelles standard
├── clients/                   # Dossiers clients (un sous-dossier par client)
├── labs/                      # Idées et expérimentations non validées
├── livrable/                  # Projets et livrables en cours (ex : MVP BTP)
└── .docs/                     # Documentation interne du système
    └── ARCHITECTURE.md        # Ce fichier
```

---

## Composants clés

### CLAUDE.md — La fondation
Chargé automatiquement à chaque session Claude Code. Contient le profil de Christophe, les directives de collaboration, la structure du workspace et les commandes disponibles. Ne jamais le vider manuellement.

### OBM-OS.md — Le système
Décrit les règles de classement, les rôles de chaque dossier, et la logique de fonctionnement de l'OBM-OS. Référence avant toute création de ressource.

### .claude/agents/ — Les sous-agents
Agents spécialisés invocables depuis Claude Code :
- `operations.md` : suivi de missions clients (CheckOps, ateliers, comptes rendus)

### .claude/skills/ — Les skills actifs
| Skill | Rôle |
|---|---|
| `meeting-intelligence` | Analyse toute réunion (transcription, PDF, notes) |
| `diagnostic-ia-client` | Anime le diagnostic IA en 6 grilles |
| `evaluation-flux-revenus` | Atelier flux de revenus en live |
| `checkops-client` | Crée le dossier de suivi client vierge |
| `fiche-client-base` | Génère la fiche client de base |
| `devis-proposition-commerciale` | Devis + proposition après appel Fathom |
| `weekly-plan-client-notion` | Plan hebdomadaire client dans Notion |
| `recherche-actualites` | Veille personnalisée (/morning) |

### context/ — Le contexte vivant
- `CONTEXT.md` : mis à jour par `/update` quand un changement significatif est détecté
- `HISTORY.md` : journal évolutif, jamais édité manuellement
- `import/` : zone de dépôt pour les documents externes à analyser

### knowledge/ — La connaissance
Méthodes et formations classées par domaine. Consultées en lecture seule par les skills et agents. Toute nouvelle ressource doit respecter la règle de classement de `OBM-OS.md`.

---

## Flux de session type

```
/prime
  → Lecture CLAUDE.md + CONTEXT.md + HISTORY.md
  → Résumé du contexte + confirmation de disponibilité

[Travail : client, prospection, atelier, veille...]

/update
  → Mise à jour CONTEXT.md et HISTORY.md si changements détectés

/commit
  → Sauvegarde Git locale + push GitHub + copie OneDrive
```

---

## Règles d'architecture

1. Toute nouvelle ressource (knowledge, template, SOP, skill) respecte la règle de classement dans `OBM-OS.md`.
2. Les skills vivent dans `.claude/skills/` et sont auto-détectés par leur en-tête frontmatter.
3. Les sous-agents vivent dans `.claude/agents/` — un fichier par agent, format markdown.
4. Les dossiers clients suivent le modèle `clients/_modele-client/`.
5. `CLAUDE.md` et `CONTEXT.md` sont les seuls fichiers à modifier régulièrement via `/update`.
6. `labs/` est la seule zone libre : tout ce qui n'est pas validé y reste.

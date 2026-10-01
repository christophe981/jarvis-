---
name: fathom-compte-rendu-client
description: Récupère automatiquement la transcription et le résumé d'un appel enregistré dans Fathom (via URL ou call ID), l'analyse avec le skill meeting-intelligence, et propose la mise à jour du dossier client Jarvis (actions, décisions, statut, historique). Utiliser quand Christophe dit "voici le lien Fathom de l'appel", colle une URL fathom.video, ou demande de faire le compte-rendu d'un appel client enregistré. Ce skill ne publie rien et ne modifie aucun fichier sans validation explicite.
---

# Fathom vers compte-rendu client — OBM OS

## Pourquoi ce Skill existe

Le skill `meeting-intelligence` analyse un contenu de réunion fourni manuellement. Ce skill est le maillon qui manquait : il va chercher directement la transcription dans Fathom via MCP, puis passe le contenu à `meeting-intelligence` pour analyse, et propose enfin la mise à jour du dossier client Jarvis. Il ferme la boucle entre l'appel enregistré et le dossier client à jour.

## Déclencheurs

Utiliser ce skill quand Christophe :
- dit "voici le lien Fathom de l'appel" ou colle une URL `fathom.video` ;
- dit "fais le compte-rendu de l'appel avec [client]" sans coller de transcription ;
- dit "mets à jour le dossier [client] avec l'appel d'aujourd'hui" ;
- donne un call ID Fathom (numérique) ou un lien de partage Fathom.

## Ce que ce Skill fait

1. Récupère la transcription et le résumé depuis Fathom via MCP.
2. Passe le contenu à `meeting-intelligence` pour une analyse structurée.
3. Présente le compte-rendu (décisions, actions, questions ouvertes, prochaines étapes).
4. Propose de mettre à jour le dossier client dans `clients/` si un client est identifié.
5. Attend la validation explicite avant toute écriture.

## Ce que ce Skill ne fait pas

- Il ne modifie aucun fichier sans validation explicite de Christophe.
- Il ne publie, ne transmet et ne partage aucune information client.
- Il ne décide pas à la place de Christophe.
- Il ne crée pas de nouveau dossier client automatiquement (seulement si le dossier existe déjà).

## Workflow détaillé

### Étape 1 — Résolution de l'enregistrement Fathom

Selon l'entrée fournie :

- **URL directe** (`https://fathom.video/calls/...` ou lien `/share/...`) :
  → Appeler `mcp__claude_ai_Fathom__get_recording_by_url` avec l'URL.
  → Récupérer le `recording_id` et l'URL canonique.

- **Call ID numérique seul** :
  → Appeler `mcp__claude_ai_Fathom__get_recording_by_call_id` avec le call ID.
  → Si "not found", réessayer avec ce même nombre comme `recording_id` directement.

- **Recherche par nom de client ou date** :
  → Appeler `mcp__claude_ai_Fathom__list_meetings` ou `mcp__claude_ai_Fathom__search_meetings`.
  → Présenter les résultats à Christophe pour confirmation avant de continuer.

### Étape 2 — Récupération du contenu

Avec le `recording_id` et l'URL canonique :
1. Appeler `mcp__claude_ai_Fathom__get_meeting_summary` → résumé structuré.
2. Appeler `mcp__claude_ai_Fathom__get_meeting_transcript` → transcription horodatée.

Si l'un des deux est indisponible, continuer avec ce qui est accessible et le signaler.

### Étape 3 — Analyse avec meeting-intelligence

Passer le contenu récupéré au skill `meeting-intelligence` pour en extraire :
- contexte et participants ;
- objectifs de la réunion ;
- besoins exprimés (explicites vs hypothèses) ;
- blocages identifiés ;
- décisions actées ;
- actions avec responsable et échéance si mentionnés ;
- questions ouvertes ;
- prochaines étapes recommandées.

Appliquer toutes les règles de qualité de `meeting-intelligence` : distinguer faits et hypothèses, ne pas inventer, signaler les manques.

### Étape 4 — Présentation du compte-rendu

Afficher le compte-rendu structuré avec les sections : Contexte, Décisions, Actions, Questions ouvertes, Prochaines étapes.

Indiquer clairement si des informations manquaient dans la transcription ou le résumé.

### Étape 5 — Proposition de mise à jour du dossier client (Human Gate)

Si un client est identifiable (nom dans la réunion ou dossier `clients/` existant) :

1. Identifier le dossier client dans `clients/<slug>/`.
2. Proposer une mise à jour précise : fichier concerné, section, contenu proposé.
3. **Attendre la validation explicite** avant toute écriture.
4. Sur validation : écrire uniquement les sections approuvées, ne jamais écraser le contenu existant sans confirmation.

Si aucun dossier client correspondant n'existe : signaler et demander si Christophe veut en créer un (via le skill `fiche-client-base`), ne pas créer automatiquement.

## Human Gates

- **Avant toute écriture dans `clients/`** : présenter le contenu proposé et attendre une validation explicite.
- **Avant de créer un nouveau dossier client** : toujours demander.
- **En cas de doute sur l'identification du client** : demander confirmation, ne pas déduire.

## Sources consultables (lecture seule)

- `clients/<slug>/` : dossier du client concerné (pour contexte et mise à jour).
- `CLAUDE.md` : contexte Christophe.
- `context/CONTEXT.md` : objectifs et projets en cours.

## Règles de qualité

- Ne jamais exposer les informations d'un client à un autre.
- Toujours distinguer ce qui vient de la transcription (fait) de ce qui est déduit (hypothèse).
- Signaler explicitement toute contradiction entre la réunion et le dossier client existant.
- Réponses en français, directes et concises, sans tirets longs.

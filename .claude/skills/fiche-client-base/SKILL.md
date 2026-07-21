---
name: fiche-client-base
description: Crée le squelette de base d'un dossier client (CLIENT.md, objectifs.md, contacts.md, outils.md, decisions.md, roadmap.md, reunions/, livrables/) à partir du modèle clients/_modele-client/. Utiliser quand Christophe dit "crée la fiche client de [nom]", "initialise le dossier de base pour [client]", "prépare le squelette client de [nom]" ou toute demande de créer l'espace de travail d'identité d'un nouveau client. Ne pas confondre avec checkops-client (mission CheckOps en 8 documents) ni weekly-plan-client-notion (suivi hebdo dans Notion) : ce skill ne gère que les 6 fichiers d'identité de base et les 2 dossiers vides.
---

## Déclencheur

Utiliser ce skill quand Christophe dit :
- "crée la fiche client de [prénom] [nom]"
- "initialise le dossier de base pour [client]"
- "prépare le squelette client de [nom]"
- "j'ai un nouveau client, [nom]" (quand il veut d'abord la fiche d'identité, pas directement le CheckOps ou le weekly plan)

---

## Ce que le skill fait

Copie les 6 fichiers de `clients/_modele-client/` (CLIENT.md, objectifs.md, contacts.md, outils.md, decisions.md, roadmap.md) et les 2 dossiers vides (reunions/, livrables/) vers `clients/[slug-client]/`, en remplaçant les placeholders par les informations du client.

Ce skill ne crée ni CheckOps (voir `checkops-client`), ni weekly plan Notion (voir `weekly-plan-client-notion`), ni devis/proposition (voir `devis-proposition-commerciale`). Il pose juste la fiche d'identité de base.

---

## Étape 1 : Collecter les informations

Si les informations ne sont pas dans le message, demander :

```
Pour créer la fiche client, j'ai besoin de :
1. Prénom et nom du client
2. Entreprise (ou "non renseigné" si tu ne l'as pas encore)
3. Secteur d'activité (ou "non renseigné")
4. Date de démarrage (ou "aujourd'hui")
5. Une phrase de contexte sur la mission ou la relation
```

Ne jamais inventer une entreprise, un secteur ou un contexte qui n'a pas été donné : utiliser "non renseigné" plutôt que deviner.

---

## Étape 2 : Construire le slug et le dossier

- **Slug client** : prénom et nom en minuscules, sans accents, tirets entre les mots (ex : `marie-dupont`, `jean-marc-martin`). Même algorithme que le skill `checkops-client`, pour que les deux skills pointent vers le même dossier `clients/[slug]/` pour un même client.
- **Chemin** : `clients/[slug-client]/`
- Créer le dossier s'il n'existe pas. S'il existe déjà (par exemple parce que `checkops-client` a déjà créé `clients/[slug]/checkops/`), ajouter simplement les fichiers de base à côté, sans toucher au reste.

---

## Étape 3 : Générer les fichiers

Lire chaque fichier dans `clients/_modele-client/`, remplacer les placeholders suivants, et écrire le résultat dans `clients/[slug-client]/` :

| Placeholder | Valeur |
|---|---|
| `[CLIENT_PRENOM]` | Prénom du client |
| `[CLIENT_NOM]` | Nom du client |
| `[CLIENT_ENTREPRISE]` | Entreprise du client (ou "non renseigné") |
| `[CLIENT_SECTEUR]` | Secteur d'activité (ou "non renseigné") |
| `[DATE_DEBUT]` | Date de démarrage (format JJ/MM/AAAA) |
| `[DESCRIPTION_MISSION]` | La phrase de contexte fournie par Christophe |

Fichiers à générer :

| Modèle source | Fichier destination |
|---|---|
| `clients/_modele-client/CLIENT.md` | `clients/[slug]/CLIENT.md` |
| `clients/_modele-client/objectifs.md` | `clients/[slug]/objectifs.md` |
| `clients/_modele-client/contacts.md` | `clients/[slug]/contacts.md` |
| `clients/_modele-client/outils.md` | `clients/[slug]/outils.md` |
| `clients/_modele-client/decisions.md` | `clients/[slug]/decisions.md` |
| `clients/_modele-client/roadmap.md` | `clients/[slug]/roadmap.md` |

Créer aussi les dossiers vides `clients/[slug]/reunions/` et `clients/[slug]/livrables/` (avec un `.gitkeep` pour qu'ils soient suivis par Git).

---

## Étape 4 : Confirmer

Une fois les fichiers créés, afficher :

```
Fiche client créée pour [CLIENT_PRENOM] [CLIENT_NOM].

Dossier : clients/[slug]/
Fichiers générés :
- CLIENT.md (identité et contexte)
- objectifs.md
- contacts.md
- outils.md
- decisions.md
- roadmap.md
- reunions/ et livrables/ (dossiers vides prêts à remplir)

Si besoin, lance ensuite checkops-client pour la mission CheckOps ou weekly-plan-client-notion pour le suivi hebdo.
```

Proposer ensuite de faire un commit Git pour sauvegarder.

---

## Règles

- Ne jamais créer un dossier client sans une demande explicite de Christophe (règle OBM-OS.md)
- Ne jamais écraser un fichier existant dans `clients/[slug]/` sans demander confirmation
- Ne jamais inventer des informations client absentes (entreprise, secteur, contexte) : utiliser "non renseigné"
- Garder le ton de Christophe dans les messages (première personne, direct, sans blabla)
- Communiquer en français

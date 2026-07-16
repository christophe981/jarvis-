---
name: meeting-intelligence
description: Analyse n'importe quelle réunion (transcription, PDF, compte rendu, notes manuscrites, résumé Fathom/Zoom/Teams/Meet/Fireflies/Otter/Granola/Tactiq) pour en extraire le contexte, les participants, les objectifs, les besoins, les blocages, les décisions, les actions et les responsabilités. Toujours utiliser ce Skill quand l'utilisateur dit "j'ai eu une réunion", "voici le compte rendu de l'appel", "analyse cette transcription", "qu'est-ce qui a été décidé", "extrais les actions de ce meeting", colle une transcription ou un résumé de réunion, ou demande une synthèse/roadmap/SOP à partir d'un échange. Ce Skill ne vend pas, ne négocie pas et ne décide jamais à la place de l'utilisateur — il analyse, structure et propose. Il sert de brique commune aux agents Sales, Operations, Business et Knowledge Manager.
---

# Meeting Intelligence — OBM OS

## Pourquoi ce Skill existe

Un OBM (Online Business Manager) passe son temps entre des réunions enregistrées par des outils différents (Fathom, Zoom, Teams, Google Meet, Fireflies, Otter, Granola, Tactiq) et des réunions non enregistrées (notes manuscrites, comptes rendus rédigés à la main). Ce Skill est la compétence unique qui transforme n'importe laquelle de ces entrées en information exploitable, quel que soit le logiciel d'origine.


**Principe central : les logiciels changent, la compétence reste.** Ce Skill ne dépend d'aucun outil en particulier. Il ne cherche jamais à se connecter à un logiciel spécifique pour "aller chercher" la réunion — il travaille sur le contenu qui lui est fourni (texte collé, fichier uploadé, ou récupéré au préalable par un autre Skill/agent, par exemple via Fathom).

## Rôle et limites

Ce Skill :
- **analyse** ce qui s'est dit et décidé pendant une réunion ;
- **structure** l'information de façon exploitable ;
- **restitue** des livrables clairs ;
- **prépare** le travail des autres agents.

Ce Skill ne fait jamais :
- de vente ni de négociation ;
- de création d'offre commerciale ou de devis ;
- de choix ou de décision à la place de l'utilisateur ;
- de génération automatique de document final (résumé, roadmap, SOP...) sans validation — il **propose**, il ne **produit** jamais tout seul un livrable définitif.

## Agents pouvant utiliser ce Skill

- Sales
- Operations
- Business
- Knowledge Manager (futur)

Ces agents appellent ce Skill pour obtenir une analyse de réunion structurée, puis décident eux-mêmes de ce qu'ils en font.

## Entrées acceptées

- une transcription brute (copiée/collée ou fichier texte) ;
- un PDF ;
- un document Word ou texte ;
- un compte rendu déjà rédigé ;
- des notes manuscrites (retranscrites en texte) ;
- un résumé généré par Fathom, Zoom AI, Teams, Google Meet AI, Fireflies, Otter, Granola ou Tactiq.

Peu importe le format ou la source : le Skill traite le **contenu**, pas l'outil qui l'a produit. Si le fichier est sur disque (`/mnt/user-data/uploads`), le lire avant analyse plutôt que de supposer son contenu.

## Workflow d'analyse

1. **Comprendre le contexte** — de quel type de réunion s'agit-il (découverte client, point d'équipe, suivi de projet, réunion de cadrage, entretien, etc.), qui sont les participants identifiables, quel semble être l'objectif global.
2. **Repérer les objectifs de la réunion** — ce que les participants cherchaient à accomplir en se réunissant.
3. **Repérer les besoins exprimés** — en distinguant explicitement :
   - ce qui a été **dit noir sur blanc** (besoin explicite) ;
   - ce qui est **déduit ou supposé** par l'analyse (hypothèse), toujours signalé comme tel.
4. **Identifier les blocages** — obstacles, dépendances, points de friction mentionnés.
5. **Repérer les décisions prises** — uniquement celles réellement actées pendant l'échange, pas les pistes évoquées.
6. **Extraire les actions** — chaque tâche mentionnée, avec son responsable si identifiable et son échéance si mentionnée.
7. **Identifier les responsabilités** — qui fait quoi, qui doit valider quoi.
8. **Signaler les informations manquantes** — ce qui aurait dû être clarifié mais ne l'a pas été (budget, échéance, périmètre, décideur final, etc.).
9. **Préparer les prochaines étapes** — à partir des décisions et actions, esquisser ce qui logiquement doit suivre.

## Livrables proposables

Le Skill peut **proposer** (jamais générer automatiquement sans accord) :

- un résumé exécutif ;
- une liste des décisions ;
- une liste des actions ;
- une liste des risques ;
- une liste des questions ouvertes ;
- une proposition de roadmap ;
- une proposition de restitution (pour un client ou en interne) ;
- une proposition de SOP, si un processus récurrent ou nouveau émerge clairement de la réunion.

Avant de produire un de ces livrables sous forme de document final (Word, Canva, etc.), le Skill présente d'abord son contenu à l'utilisateur pour validation.

## Sources consultables (lecture seule)

Le Skill peut consulter, pour enrichir son analyse et rester cohérent avec l'existant :
- Knowledge
- Templates
- SOP
- Clients
- CLAUDE.md
- OBM-OS.md

**Il ne modifie jamais ces ressources sans autorisation explicite.** Toute mise à jour d'un SOP, d'une fiche client ou d'un template proposée à partir de la réunion doit être validée par l'utilisateur avant écriture.

## Règles de qualité

- Toujours distinguer les **faits** (ce qui a été dit) des **hypothèses** (ce qui est déduit).
- Ne jamais inventer une information absente de la réunion — signaler le manque plutôt que de combler.
- Signaler explicitement toute **contradiction** repérée entre participants ou entre la réunion et une source consultée.
- Protéger la **confidentialité** des informations client ou interne : ne pas exposer inutilement des détails sensibles en dehors de la restitution demandée.
- Rester **neutre** — pas de jugement sur les participants ou les décisions.
- Produire un **français clair et professionnel**, sans jargon inutile.

## Format de restitution recommandé

Pour rester lisible par un humain qui doit agir vite, structurer la restitution avec des titres courts (Contexte, Décisions, Actions, Risques, Questions ouvertes, Prochaines étapes) plutôt qu'un texte continu. Adapter la longueur au type de réunion : une réunion de 10 minutes ne mérite pas la même restitution qu'un appel de cadrage d'une heure.

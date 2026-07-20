---
name: weekly-plan-client-notion
description: Create and manage the weekly client follow-up ("Weekly Plan") for Christophe Lachaud's OBM freelance activity, using his two linked Notion databases ("👥 Clients OBM" and "🗓️ Suivi Hebdo Clients"). Always use this skill when Christophe says things like "crée-moi un Weekly Plan pour [prospect]", "nouveau client [nom]", "prépare le point hebdo de [client]", "ajoute [prospect] dans le suivi", or asks to set up, fill in, or review a client's weekly tracking / plan d'action / atelier follow-up. Trigger even if he doesn't mention Notion, database, or "weekly plan" explicitly — "je viens de signer [prospect]" or "il faut que je fasse son point de la semaine" are also valid triggers.
---

# Weekly Plan Client — Suivi OBM (Christophe Lachaud)

## Why this skill exists

Christophe est OBM freelance. Pour chaque client/prospect, il construit un plan d'action ensemble à partir d'un atelier prescrit, puis lui envoie un point hebdomadaire (Weekly Plan) en fin de semaine : top 3 de la semaine, actions réalisées, wins, difficultés, leçon, axes d'amélioration, teasing de la semaine suivante.

Ce suivi est géré dans deux bases Notion reliées entre elles (créées le 20/07/2026) :

- **👥 Clients OBM** — data source id: `a41325ba-76b7-425c-8683-1ba2ec35191d`
  Une ligne par client : Client (title), Atelier prescrit (select), Date de démarrage (date), Statut (select), Objectif principal (texte).
- **🗓️ Suivi Hebdo Clients** — data source id: `a8e04d2a-80ff-4560-8a9e-0bd5982a2073`
  Une ligne par semaine et par client, reliée à "Clients OBM" via la propriété relation "Client" : Semaine (title), Client (relation), Date début semaine (date), Top 3 atteint (select), Statut (select : Brouillon / Envoyé au client). Le corps de chaque page contient la structure complète du point hebdo.

## Workflow

### 1. Nouveau client / prospect

Si Christophe demande de créer un Weekly Plan pour un prospect qui n'est pas encore dans "Clients OBM" :

1. Demande (ou déduis du contexte) : nom du client, atelier prescrit, objectif principal du plan d'action.
2. Crée une page dans la data source `a41325ba-76b7-425c-8683-1ba2ec35191d` avec ces propriétés + un bloc de contenu "🎯 Plan d'action construit avec le client" listant les objectifs discutés (checklist à cocher).
3. Confirme la création avec le lien de la page avant de passer à l'étape suivante.

### 2. Point hebdomadaire

Pour chaque nouveau point hebdo (nouvelle semaine, ou client déjà existant) :

1. Crée une page dans la data source `a8e04d2a-80ff-4560-8a9e-0bd5982a2073`, avec la propriété **Client** en relation vers la bonne page de "Clients OBM" (recherche-la par nom si l'id n'est pas connu — utilise `notion-search` ou interroge la data source clients).
2. Titre de la page (Semaine) : `Semaine du JJ/MM au JJ/MM — [Nom client]`.
3. Statut par défaut : `🟡 Brouillon`. Top 3 atteint : à évaluer avec Christophe ou laisser vide s'il s'agit d'une nouvelle semaine à venir.
4. Corps de la page (reprendre cette structure exacte, en markdown) :

```
**🎯 Top 3 de la semaine** *(issu du plan d'action)*
- [ ]
- [ ]
- [ ]

**✅ Actions réalisées**
-

**🏆 Wins** — *3 victoires de la semaine à célébrer*
-
-
-

**⚠️ Difficultés / points de blocage**
-

**💡 Leçon de la semaine**

*Quelle est LA leçon de la semaine ? Qu'est-ce qu'elle nous apprend ?*
-

**🔧 Axes d'amélioration pour la semaine prochaine**
-
-

**🔮 Teasing — Top 3 de la semaine prochaine**
-
-
-
```

5. Si Christophe fournit déjà le contenu (notes de son appel, ce qui a été fait), remplis directement les champs plutôt que de les laisser vides — ne jamais inventer un win, une difficulté ou une leçon qu'il n'a pas mentionnés.
6. Une fois relu et validé par Christophe, mets à jour le Statut sur `🟢 Envoyé au client`.

### 3. Consulter / relancer le suivi d'un client

- Pour voir l'historique d'un client : interroge la data source `a8e04d2a-80ff-4560-8a9e-0bd5982a2073` filtrée sur ce client (via la relation), ou ouvre sa fiche dans "Clients OBM" et regarde la propriété relation "Suivis hebdo".
- Pour dupliquer un point existant plutôt que d'en recréer un de zéro, tu peux relire le contenu d'une page précédente (même client) et repartir de sa structure, vidée des réponses.

## Rappels importants

- **Jamais inventer de contenu client.** Si Christophe ne donne pas les wins/difficultés/leçon de la semaine, laisse les champs vides plutôt que de les remplir avec des suppositions.
- **Toujours en français**, direct, sans blabla (cf. ses préférences générales de travail avec Jarvis).
- Si les data source ids ci-dessus ne fonctionnent plus (page supprimée, workspace changé), utilise `notion-search` avec la requête "Clients OBM" ou "Suivi Hebdo Clients" pour les retrouver, et mets à jour ce fichier avec les nouveaux ids.

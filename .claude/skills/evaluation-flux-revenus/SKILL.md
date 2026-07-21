---
name: evaluation-flux-revenus
description: Anime en direct l'atelier "Évaluation des flux de revenus" (module OBM Elite, Offre Intensive) avec un client de Christophe Lachaud. Pose les questions une à une sur chaque offre/produit du client (prix, CA, marge, temps requis), remplit le tableau au fur et à mesure, calcule le CA total et les pourcentages, puis propose une analyse et des recommandations. Utiliser quand Christophe dit "on fait l'atelier flux de revenus avec [client]", "anime l'évaluation des flux de revenus de [nom]", "on commence le flux de revenus pour [client]" ou toute demande de conduire ce module en live pendant un rendez-vous. Différent de checkops-client, qui ne fait que créer le fichier vierge : ce skill le remplit en conversation avec des données réelles.
---

## Déclencheur

Utiliser ce skill quand Christophe dit :
- "on fait l'atelier flux de revenus avec [client]"
- "anime l'évaluation des flux de revenus de [nom]"
- "on commence le flux de revenus pour [client]"
- toute demande de conduire ce module en direct (en rendez-vous ou juste après, en restituant ce qui a été dit)

Prérequis : le client doit déjà avoir un dossier `clients/[slug]/`. Si `checkops/04-flux-revenus.md` n'existe pas encore, le créer à partir de `templates/checkops/04-flux-revenus.md`.

---

## Ce que le skill fait

Contrairement à `checkops-client` (qui ne crée qu'un fichier vierge avec des placeholders), ce skill mène la conversation pour remplir le tableau des offres avec de vraies données, calcule les totaux, puis rédige l'analyse et des pistes de recommandation à valider avec le client.

---

## Étape 1 : Identifier le client

- Construire le slug (prénom-nom, minuscules, sans accents, tirets) avec le même algorithme que `checkops-client`.
- Chemin cible : `clients/[slug]/checkops/04-flux-revenus.md`
- Si le fichier n'existe pas, le créer d'abord à partir de `templates/checkops/04-flux-revenus.md` (remplacer `[CLIENT_PRENOM]` et `[CLIENT_NOM]`).
- Si le fichier existe déjà avec des données réelles (pas juste des placeholders), demander confirmation avant d'écraser.

---

## Étape 2 : Collecter les offres, une par une

Pour chaque offre ou service du client, demander successivement :

1. Nom du produit / service
2. Prix HT
3. CA généré sur les 12 derniers mois (si inconnu, demander volume vendu × prix pour l'estimer)
4. Marge estimée : Haute / Moyenne / Basse
5. Temps requis pour le délivrer : Beaucoup / Moyen / Peu

Continuer tant que Christophe indique qu'il y a d'autres offres. Ne jamais inventer un chiffre non donné : si une donnée manque, la demander ou noter "non renseigné", jamais l'estimer soi-même sans le dire explicitement.

---

## Étape 3 : Calculer

Une fois toutes les offres collectées :

- **Total CA** = somme des CA de toutes les offres
- **% du CA** par offre = (CA de l'offre ÷ Total CA) × 100, arrondi à l'entier
- **Proposition "On garde ?"** (Oui / Non / À revoir) selon une logique simple, présentée comme une suggestion à valider et jamais comme une décision tranchée :
  - CA élevé + temps faible ou moyen → suggestion "Oui"
  - CA faible + temps élevé + marge basse → suggestion "À revoir" ou "Non"
  - Cas intermédiaires → "À revoir", laisser Christophe et le client trancher

---

## Étape 4 : Rédiger l'analyse

Remplir les trois sections du fichier à partir des données réelles collectées, jamais de généralités :

- **Ce qui génère le plus de revenus** : les 1 à 3 offres avec le % du CA le plus élevé
- **Ce qui prend trop de temps par rapport au CA généré** : offres à temps "Beaucoup" mais % du CA faible
- **Recommandations** : 2 à 4 pistes concrètes (garder/renforcer/arrêter/revoir le prix), présentées comme des propositions à discuter avec le client, pas comme des vérités imposées

---

## Étape 5 : Écrire et confirmer

Écrire le tableau rempli et l'analyse dans `clients/[slug]/checkops/04-flux-revenus.md`, en conservant la structure du template (tableau puis section Analyse).

Confirmer :

```
Atelier flux de revenus rempli pour [CLIENT_PRENOM] [CLIENT_NOM].

Fichier : clients/[slug]/checkops/04-flux-revenus.md
Total CA : [montant]
Offres analysées : [nombre]

À valider avec le client avant la restitution finale.
```

Proposer ensuite de faire un commit Git.

---

## Règles

- Ne jamais inventer un prix, un CA, une marge ou un temps non donné par Christophe ou le client
- Les recommandations sont des suggestions à discuter, jamais des décisions imposées (contrôle humain, voir OBM-OS.md)
- Ne jamais écraser des données déjà remplies sans confirmation
- Garder le ton de Christophe (première personne, direct, sans blabla)
- Communiquer en français

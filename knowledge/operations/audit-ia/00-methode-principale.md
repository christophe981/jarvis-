# Méthode principale : diagnostic IA

> Objectif : cadre de référence pour diagnostiquer la situation réelle d'une entreprise vis-à-vis de l'IA, avant toute recommandation d'outil. Ce fichier est le point d'entrée, il oriente vers les 6 grilles détaillées, il ne les répète pas.
> Statut : méthode de référence interne, à appliquer en mission de diagnostic IA.

## Principe fondamental

Une entreprise n'a pas un problème d'IA. Elle a des tâches qui coûtent cher et dont personne ne parle. L'IA n'est que la réponse éventuelle, jamais le point de départ.

## La faute n°1

Arriver avec une solution. Un diagnostic se mène sans jamais nommer un outil avant la dernière minute. Toute mention d'outil avant d'avoir parcouru les étapes 1 à 4 ci-dessous est une faute de méthode.

## Ce que cette méthode est, ce qu'elle n'est pas

C'est une bible de diagnostic : indicateurs observables, seuils, arbres de décision, ordres de grandeur. Ce n'est ni un catalogue d'outils, ni un formulaire à remplir mécaniquement. Les outils changent tous les six mois, les critères de décision non.

## Ordre d'usage des 6 grilles

1. [Maturité](01-maturite.md) : où en est réellement l'entreprise, indépendamment de ce qu'elle déclare.
2. [Contexte](02-contexte.md) : quel est le patrimoine informationnel propre à l'entreprise, ce qui la différencie.
3. [Données](03-donnees.md) : quelles données peuvent sortir de l'entreprise, et vers quel type d'hébergement.
4. [Automatisabilité](04-automatisabilite.md) : pour chaque tâche candidate, est-ce réellement automatisable.
5. [Outil et modèle](05-outil-modele.md) : pour chaque tâche validée à l'étape 4, quel type d'outil et quel dimensionnement.
6. [ROI et priorisation](06-roi-priorisation.md) : entre tous les chantiers qualifiés, lesquels lancer, dans quel ordre.

Cet ordre place le choix d'outil après le contexte et les données : on ne choisit un outil qu'après avoir vérifié que la tâche est automatisable et que la donnée peut légalement transiter par cet outil.

## Après le diagnostic

- Avant de lancer un chantier priorisé à l'étape 6, parcourir la [checklist des pièges](../../../sop/operations/audit-ia/checklist-pieges.md).
- Après la livraison, suivre la [checklist de suivi post-mission](../../../sop/operations/audit-ia/checklist-suivi-post-mission.md).
- Le livrable final suit la structure du [modèle de rapport de diagnostic](../../../templates/diagnostic-ia/rapport-diagnostic_modele.md).

## Repères à garder en tête

- Le modèle est public, le contexte ne l'est pas : l'avantage se joue sur ce que l'entreprise seule sait, pas sur l'accès à tel ou tel modèle.
- La valeur durable démarre au niveau 2 de maturité. Le niveau 1 se paie en abonnements, le niveau 2 se paie en processus.
- Les projets IA meurent rarement de technique. Ils meurent de cadrage, d'adoption et de mesure.

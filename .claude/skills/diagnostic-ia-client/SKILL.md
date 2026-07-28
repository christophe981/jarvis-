---
name: diagnostic-ia-client
description: Anime un diagnostic IA en direct avec un client de Christophe Lachaud, en appliquant la méthodologie de knowledge/operations/audit-ia/ (maturité, contexte métier, sensibilité des données, automatisabilité, choix d'outil, ROI et priorisation). Pose les questions calibrées de chaque grille, teste l'automatisabilité tâche par tâche, priorise les chantiers, puis restitue un diagnostic structuré avec constats, priorités, recommandations et prochaines actions. Utiliser quand Christophe dit "on fait le diagnostic IA de [client]", "anime l'audit IA avec [nom]", "on lance le diagnostic IA pour [prospect]" ou toute demande de mener ce diagnostic en direct pendant ou après un rendez-vous. Différent de meeting-intelligence (qui analyse une réunion déjà tenue, sans grille de diagnostic propre) et d'evaluation-flux-revenus (qui traite les flux de revenus, pas l'IA) : ce skill applique spécifiquement les 6 grilles du diagnostic IA.
---

## Déclencheur

Utiliser ce skill quand Christophe dit :
- "on fait le diagnostic IA de [client]"
- "anime l'audit IA avec [nom]"
- "on lance le diagnostic IA pour [prospect]"
- toute demande de mener ce diagnostic en direct, en rendez-vous ou juste après

---

## Ce que le skill fait

Conduit l'entretien de diagnostic IA en s'appuyant sur les 6 grilles de `knowledge/operations/audit-ia/`, sans en recopier le contenu ici. Ce skill lit ces fichiers au moment de l'analyse, il orchestre leur usage en conversation, il ne remplace pas la méthodologie.

---

## Étape 1 : Identifier le client et le périmètre

- Demander le nom du client ou de l'entreprise, et les tâches ou processus à examiner en priorité.
- Construire le slug (même algorithme que `checkops-client` : minuscules, sans accents, tirets).
- Si `clients/[slug]/livrables/` existe, le diagnostic y sera archivé à l'étape 5. Sinon, continuer sans dossier client et proposer d'en créer un à la fin si Christophe le souhaite (skill `fiche-client-base`).

---

## Étape 2 : Informations à demander

Poser ces questions avant de commencer l'analyse. Ne jamais inventer une réponse manquante, noter "non renseigné" :

1. Activité de l'entreprise et organisation (taille de l'équipe, répartition des rôles)
2. Usages IA déjà en place, y compris informels (abonnements personnels, scénarios d'automatisation existants)
3. Pour chaque tâche à examiner : qui la fait, à quelle fréquence, avec quelles données en entrée et en sortie
4. Budget et échéance envisagés, s'ils existent déjà

---

## Étape 3 : Étapes d'analyse, dans cet ordre

Appliquer les grilles de `knowledge/operations/audit-ia/` une à une, en gardant les réponses précédentes à portée de main pour la suite :

1. **Maturité** (`knowledge/operations/audit-ia/01-maturite.md`) : situer le niveau réel de l'entreprise
2. **Contexte** (`knowledge/operations/audit-ia/02-contexte.md`) : extraire le tacite sur les tâches prioritaires
3. **Données** (`knowledge/operations/audit-ia/03-donnees.md`) : classer la sensibilité des données concernées
4. **Automatisabilité** (`knowledge/operations/audit-ia/04-automatisabilite.md`) : passer chaque tâche aux 5 tests
5. **Outil et modèle** (`knowledge/operations/audit-ia/05-outil-modele.md`) : pour les tâches qui passent l'étape 4, déterminer famille d'outil et dimensionnement
6. **ROI et priorisation** (`knowledge/operations/audit-ia/06-roi-priorisation.md`) : classer les chantiers qualifiés dans la matrice impact/effort, chiffrer le gain des chantiers retenus

Avant de conclure, vérifier `sop/operations/audit-ia/checklist-pieges.md` sur les chantiers retenus.

---

## Étape 4 : Restituer le diagnostic

Structurer la restitution en 4 blocs distincts, jamais en un seul pavé :

- **Constats** : niveau de maturité observé, éléments de contexte/patrimoine identifiés, points de vigilance sur les données
- **Priorités** : les chantiers qui passent les 5 tests d'automatisabilité, classés par la matrice impact/effort (quick win, gros chantier, confort, à refuser)
- **Recommandations** : pour chaque chantier retenu, famille d'outil, dimensionnement, gain net chiffré (formule ROI)
- **Prochaines actions** : le premier chantier à lancer (celui qui produit un résultat visible en moins d'un mois), les pièges à surveiller, l'échéance proposée

S'appuyer sur la structure de `templates/diagnostic-ia/rapport-diagnostic_modele.md` comme trame, sans recopier ses instructions internes dans la réponse au client.

---

## Étape 5 : Sauvegarder et confirmer

Si `clients/[slug]/livrables/` existe, écrire la restitution dans `clients/[slug]/livrables/diagnostic-ia_[AAAA-MM-JJ].md`. Sinon, présenter la restitution directement en conversation et proposer de créer le dossier client si besoin.

Confirmer :

```
Diagnostic IA réalisé pour [client].

Chantiers retenus : [nombre]
Premier chantier proposé : [nom du chantier]
Fichier : [chemin, ou "non sauvegardé, pas de dossier client"]
```

Proposer ensuite de faire un commit Git si un fichier a été écrit.

---

## Règles

- Ne jamais nommer un outil avant d'avoir terminé les étapes 1 à 4 (voir la faute n°1 dans `knowledge/operations/audit-ia/00-methode-principale.md`)
- Ne jamais inventer une donnée client non fournie : utiliser "non renseigné"
- Les priorités et recommandations restent des propositions à valider avec le client, jamais des décisions imposées
- Ne pas modifier les fichiers de `knowledge/operations/audit-ia/`, `sop/operations/audit-ia/` ni `templates/diagnostic-ia/` : ce skill les lit, il ne les édite pas
- Garder le ton de Christophe (première personne, direct, sans blabla)
- Communiquer en français

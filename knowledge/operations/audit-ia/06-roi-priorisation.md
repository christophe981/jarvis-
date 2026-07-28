# Grille 6 : Priorisation et ROI

> Objectif : entre plusieurs chantiers déjà qualifiés par les grilles [Automatisabilité](04-automatisabilite.md) et [Outil et modèle](05-outil-modele.md), décider lesquels lancer et dans quel ordre. Sixième et dernière étape depuis la [méthode principale](00-methode-principale.md).

## Principe

La matrice sert à refuser, pas à ranger. Deux chantiers, pas dix.

## Matrice impact × effort

| | Effort faible | Effort fort |
|---|---|---|
| **Impact fort** | **Quick wins, on commence ici** : qualification et routage des demandes entrantes, comptes rendus de réunion diffusés automatiquement, extraction de données de factures ou de bons de commande, réponses de premier niveau préparées pour validation. Signature commune : entrée déjà numérique, erreur peu coûteuse, propriétaire clair. | **Gros chantiers, après le premier succès** : agent qui traite un dossier client de bout en bout, refonte du chiffrage avec règles tarifaires, base de connaissance unifiée sur des sources dispersées. Ne s'engagent qu'avec un sponsor, un budget et un niveau 2 de maturité déjà en place. |
| **Impact faible** | **Confort** : reformulation d'emails, traduction, mise en forme. Utile pour l'adoption et la démonstration, jamais présenté comme un résultat business. Bon terrain pour faire toucher l'IA à une équipe sceptique. | **À refuser** : chatbot public sans base de connaissance tenue à jour, automatisation d'un process cassé (on automatise le désordre), projet dont le seul objectif est de "faire de l'IA". C'est ici que se consomment les budgets qui tuent la confiance pour deux ans. |

## Chiffrer le gain : la seule formule utile

```
gain = (h/mois × coût horaire chargé) - (coût d'exécution + maintenance)
```

Deux règles d'hygiène :
- ne compter que le temps réellement libéré et réaffecté, un gain non réaffecté n'existe pas au bilan
- provisionner la maintenance, une automatisation se dérègle dès que l'outil source change

Le canevas de calcul correspondant est [calcul-roi-chantier_modele.md](../../../templates/diagnostic-ia/calcul-roi-chantier_modele.md).

## Séquencement

Un premier chantier doit produire un chiffre présentable en moins d'un mois, sur un périmètre que l'équipe touche tous les jours. Sa vraie fonction n'est pas le ROI, c'est d'acheter la légitimité du second. Un projet qui gagne 30% sur une tâche quotidienne bat un projet qui gagne 80% sur une tâche trimestrielle.

Avant de lancer un chantier priorisé ici, parcourir la [checklist des pièges](../../../sop/operations/audit-ia/checklist-pieges.md).

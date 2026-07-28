# Grille 5 : Choix de l'outil et du modèle

> Objectif : une fois une tâche validée automatisable ([grille Automatisabilité](04-automatisabilite.md)), déterminer quelle famille d'outil et quel dimensionnement utiliser. Cinquième étape depuis la [méthode principale](00-methode-principale.md).

## Principe

Choisir par nature de tâche, pas par marque. Les noms d'outils vieillissent en six mois, la question qui les sélectionne, jamais. La nature du travail impose la famille d'outil, le couple volume × complexité impose la puissance.

## Étape 1 : quelle est la nature du travail ?

| Besoin exprimé | Famille d'outil | Critère qui tranche |
|---|---|---|
| Produire un écrit à enjeu | Raisonnement long | La nuance compte plus que la vitesse : proposition, stratégie, document engageant |
| Digérer un très gros volume | Grande fenêtre | Des heures d'audio ou des milliers de pages à traiter en une seule passe |
| Trouver une info vérifiable | Recherche sourcée | Sans source cliquable, la réponse est inexploitable en interne |
| Fabriquer un outil interne | Agent de code | Le besoin est trop spécifique pour un logiciel du marché |
| Faire circuler l'information | Orchestration | La difficulté est la plomberie entre outils, pas l'intelligence |

**Signal d'alerte** : une entreprise qui fait tout passer par une seule famille d'outil. Exemple typique : résumer trois heures de réunion dans un chat généraliste, puis se plaindre que "l'IA oublie tout".

## Étape 2 : quelle puissance ? (volume × complexité)

| | Tâche simple | Tâche complexe |
|---|---|---|
| **Fort volume** | Petit modèle : tri, classement, extraction. Le coût unitaire domine tout le reste | Découper : petit modèle pour filtrer, gros modèle sur les seuls cas retenus |
| **Faible volume** | Indifférent : quelques appels par semaine, optimiser ici est une perte de temps | Gros modèle : analyse fine, document à fort enjeu, le coût est négligeable face à l'erreur |

**Le calcul qui tranche** : comparer le coût par exécution × la fréquence mensuelle, jamais le prix affiché. Une tâche à 1000 exécutions par mois change de catégorie de budget, la même à 4 exécutions n'en a aucune. Le plus gros modèle pour tout, c'est le taxi pour aller chercher le pain.

**Question à poser au client** : "combien de fois par mois cette tâche tourne-t-elle ?" S'il ne sait pas répondre, ce n'est pas encore un chantier, seulement une intuition.

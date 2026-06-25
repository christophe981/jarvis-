# /commit

> Commande pour sauvegarder tout mon workspace Jarvis : historique des versions (Git/GitHub) + copie cloud (OneDrive).
> Objectif : ne jamais perdre mes donnees et pouvoir tout recuperer sur un autre PC.

---

## Mission

Quand je lance `/commit`, execute la sequence suivante :

### Etape 1 : Lancer la sauvegarde

Lance le script de sauvegarde via PowerShell :

```
powershell -ExecutionPolicy Bypass -File "C:\Users\lacha\Downloads\jarvis-starter-kit\scripts\backup.ps1" -Message "<ARGUMENTS>"
```

- Si j'ai ecrit un message apres `/commit` (par exemple `/commit ajout de mon offre OBM`), utilise-le comme message de sauvegarde.
- Si je n'ai rien ecrit, lance le script sans `-Message` (il mettra une date automatiquement).

Le script fait trois choses dans l'ordre :
1. Enregistre une version dans Git (historique local)
2. Envoie sur GitHub si un depot est configure
3. Copie une version a jour dans OneDrive (`Jarvis-Backup`)

### Etape 2 : Me faire un compte-rendu clair

Apres execution, resume-moi simplement, en francais, ce qui s'est passe :

```
Sauvegarde terminee.

- Historique Git : [version enregistree / aucun changement]
- GitHub : [envoye / pas encore configure]
- OneDrive : [copie a jour]
```

### Etape 3 : Signaler les problemes

- Si GitHub n'est pas encore configure, rappelle-moi en une phrase que je peux le brancher quand je veux pour une recuperation facile sur un autre PC.
- Si une etape a echoue (connexion, authentification), explique-le-moi simplement et propose une solution.

---

## Regles importantes

- Communication en francais, pas de tirets longs (em dashes)
- Ne modifie pas mes fichiers de contexte, cette commande sert uniquement a sauvegarder
- Reste bref : je veux surtout savoir que mes donnees sont en securite

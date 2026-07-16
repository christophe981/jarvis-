# Skill : checkops-client

## Déclencheur

Utiliser ce skill quand Christophe dit :
- "prépare le CheckOps pour [prénom] [nom]"
- "génère le CheckOps de [client]"
- "crée le dossier client pour [prénom]"
- "démarre une mission pour [client]"
- "ouvre le CheckOps [nom]"
- toute demande de démarrer une mission Intensive ou de créer l'espace de travail d'un client

---

## Ce que le skill fait

Génère le dossier complet `clients/[slug-client]/checkops/` avec les 8 documents de la mission CheckOps, pré-remplis avec le nom du client et les dates de mission.

---

## Étape 1 : Collecter les informations

Si le prénom et le nom du client ne sont pas dans le message, demande :

```
Pour préparer le CheckOps, j'ai besoin de :
1. Prénom et nom du client
2. Date de début de mission (ou "aujourd'hui" si tu commences maintenant)
3. Date de fin prévue (ou je calcule +30 jours automatiquement)
4. Une phrase sur la mission (ex : "structurer ton activité de coaching", "optimiser ta gestion opérationnelle")
```

Si le client a déjà un dossier dans `clients/`, lire son fichier de contexte pour pré-remplir davantage.

---

## Étape 2 : Construire le slug et le dossier

- **Slug client** : prénom et nom en minuscules, sans accents, tirets entre les mots (ex : `marie-dupont`, `jean-marc-martin`)
- **Chemin** : `clients/[slug-client]/checkops/`
- Créer le dossier s'il n'existe pas

---

## Étape 3 : Générer les 8 fichiers

Lire chaque template dans `templates/checkops/`, remplacer les placeholders suivants, et écrire le fichier dans `clients/[slug-client]/checkops/` :

| Placeholder | Valeur |
|---|---|
| `[CLIENT_PRENOM]` | Prénom du client |
| `[CLIENT_NOM]` | Nom du client |
| `[DATE_DEBUT]` | Date de début (format JJ/MM/AAAA) |
| `[DATE_FIN]` | Date de fin (format JJ/MM/AAAA) |
| `[DESCRIPTION_MISSION]` | La phrase de mission fournie par Christophe |

Fichiers à générer :

| Template source | Fichier destination |
|---|---|
| `templates/checkops/00-index.md` | `clients/[slug]/checkops/00-index.md` |
| `templates/checkops/01-questionnaire-onboarding.md` | `clients/[slug]/checkops/01-questionnaire-onboarding.md` |
| `templates/checkops/02-vision.md` | `clients/[slug]/checkops/02-vision.md` |
| `templates/checkops/03-audit-productivite.md` | `clients/[slug]/checkops/03-audit-productivite.md` |
| `templates/checkops/04-flux-revenus.md` | `clients/[slug]/checkops/04-flux-revenus.md` |
| `templates/checkops/05-lessentiel.md` | `clients/[slug]/checkops/05-lessentiel.md` |
| `templates/checkops/06-product-market-fit.md` | `clients/[slug]/checkops/06-product-market-fit.md` |
| `templates/checkops/08-roadmap.md` | `clients/[slug]/checkops/08-roadmap.md` |

Note : `07-checklist.md` n'est pas copié car il pointe vers la SOP de référence dans `sop/clients/checklist-methode-des-offres.md`.

---

## Étape 4 : Confirmer

Une fois les fichiers créés, afficher :

```
CheckOps créé pour [CLIENT_PRENOM] [CLIENT_NOM].

Dossier : clients/[slug]/checkops/
Fichiers générés :
- 00-index.md (page principale + RDV + actions)
- 01-questionnaire-onboarding.md (à remplir lors de l'atelier S1)
- 02-vision.md (à construire avec le client)
- 03-audit-productivite.md (à remplir en S2)
- 04-flux-revenus.md (à remplir en S2-S3)
- 05-lessentiel.md (synthèse à tenir à jour)
- 06-product-market-fit.md (à remplir en S2-S3)
- 08-roadmap.md (livrable final S4)

Prochaine étape : planifie l'Atelier Onboarding (2h) et envoie le message de bienvenue à [CLIENT_PRENOM].
```

Proposer ensuite de faire un commit Git pour sauvegarder.

---

## Règles

- Ne jamais écraser un dossier `clients/[slug]/checkops/` qui existe déjà sans demander confirmation
- Si un dossier `clients/[slug]/` existe sans `checkops/`, créer seulement le sous-dossier checkops
- Garder le ton de Christophe dans les messages (premier personne, direct, sans blabla)
- Communiquer en français

# /lot

> Orchestrateur du cycle de construction des lots du workspace OBM-OS.
> **Automation 0.6** : `status`, `resume` (lecture seule), `draft` (écriture **labs-only**), `validate` (écrit uniquement `Statut : APPROVED` dans le bloc ROADMAP après approbation humaine explicite) et `promote` (promeut le candidat vers sa destination + journalise) sont actives.
> Le chantier Automation lui-même reste **hors** de ce workflow (pilotage humain manuel jusqu'à Automation 1.0).

---

## Règle absolue (Automation 0.6)

Quand je lance `/lot <sous-commande>` :

- **`/lot status`** et **`/lot resume`** : autorisées, **lecture seule**. Elles ne créent, ne modifient, ne suppriment, ne committent et ne poussent **rien**.
- **`/lot draft`** : autorisée, **écriture uniquement sous `labs/<ID>/`** pour un BUSINESS LOT explicitement autorisé (voir « `/lot draft` »). Jamais de commit, push, backup, ni modification hors `labs/`.
- **`/lot validate`** : autorisée, **écrit uniquement `Statut : APPROVED`** dans le bloc ROADMAP du BUSINESS LOT actif, et **seulement** après approbation humaine explicite `APPROVE <ID>` (voir « `/lot validate` »). Jamais de promotion, HISTORY, commit, push.
- **`/lot promote`** : autorisée, promeut `labs/<normalized-id>/candidate/**` vers le `Fichier cible`, met le bloc ROADMAP à `COMPLETE`/`[x]` et ajoute une entrée `HISTORY` (voir « `/lot promote` »). Jamais de commit, push, backup.
- **Toute sous-commande inconnue**, ainsi que **`/lot` sans sous-commande** : répondre **exactement** :

  `UNKNOWN /lot SUBCOMMAND — NO ACTION PERFORMED`

  puis STOP sans aucune mutation.

Aucune sous-commande ne lance jamais `/commit`, `git add`, `git commit`, `git push` ni `backup.ps1`. Écritures disque autorisées : `/lot draft` sous `labs/<ID>/` ; `/lot validate` sur le seul bloc ROADMAP concerné ; `/lot promote` sur le `Fichier cible`, le bloc ROADMAP et `context/HISTORY.md`. Aucune ressource Lot 6. La barrière `LOT 6 — NOT STARTED — HUMAN AUTHORIZATION REQUIRED` de `ROADMAP.md` est respectée.

---

## Sources de vérité et priorité (obligatoire)

Lire dans cet ordre ; en cas de divergence, la source de rang supérieur prime :

1. **`ROADMAP.md`** — état déclaré de chaque lot / sous-lot (statut).
2. **`labs/`** — présence matérielle d'un brouillon (`labs/<ID>/`).
3. **`context/HISTORY.md`** — historique des actions terminées.
4. **Git** — état et version du workspace (`git status`, `git log`, `git rev-parse HEAD`).

Git ne remplace **jamais** ROADMAP pour un statut de Human Gate. HISTORY ne remplace **jamais** ROADMAP pour `APPROVED`. La mémoire conversationnelle n'est **jamais** une source de vérité.

Ne **jamais** déduire une validation humaine depuis : la mémoire conversationnelle, une session Claude antérieure, la simple existence d'un fichier, un commit Git seul, un message Git, la présence d'un brouillon, l'existence d'une destination, ou un ancien message utilisateur. Une validation humaine n'existe que si elle est **inscrite explicitement** (statut `APPROVED`/`COMPLETE` dans `ROADMAP.md`).

---

## Preflight (obligatoire pour `/lot status`, `/lot resume` et `/lot draft`)

Avant toute détermination, en lecture seule :

1. Lire la **branche courante** (`git branch --show-current`).
2. Lire **HEAD** (`git rev-parse HEAD`).
3. Lire le **remote `origin`** (`git remote -v`).
4. Vérifier que le dépôt résolu correspond bien à :

   `christophe981/jarvis-`

   Accepter une URL **HTTPS** (`https://github.com/christophe981/jarvis-`) ou **SSH** (`git@github.com:christophe981/jarvis-.git`) si elle résout vers ce même repository GitHub.

Si le remote ne correspond pas, afficher :

`STOP — UNEXPECTED WORKSPACE REMOTE`

Verdict : `BLOCKED`. Ne **jamais** tenter de modifier automatiquement le remote.

### Git — fail-closed (pour `/lot status`, `/lot resume` et `/lot draft`)

- **HEAD détachée** ⇒ afficher `STOP — WORKSPACE STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`, Verdict `BLOCKED`.
- **Conflit, fichiers unmerged, merge/rebase en cours, ou index ambigu** ⇒ afficher `STOP — WORKSPACE STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`, Verdict `BLOCKED`.
- **Working tree avec modifications non liées au cycle courant** ⇒ afficher `STOP — UNRELATED WORKING TREE CHANGES`, Verdict `BLOCKED`.

Ne rien corriger automatiquement.

---

## Git (Automation 0.4)

Lectures Git autorisées (notamment) :

- `git status --short`
- `git status`
- `git rev-parse HEAD`
- `git branch --show-current`
- `git log`
- `git diff`
- `git remote -v`

Toujours **interdits** dans Automation 0.4 (y compris pour `/lot draft`) :

- `git add`
- `git commit`
- `git push`
- `git pull`
- `git merge`
- `git rebase`
- `git reset`
- `git clean`
- `git stash`
- tout `checkout` destructif

`/lot status` et `/lot resume` ne produisent **aucune** mutation. `/lot draft` peut **écrire des fichiers uniquement sous `labs/<ID>/`** (jamais ailleurs) et ne produit **aucune** mutation Git (pas de `git add`/`commit`/`push`).

---

## Parser ROADMAP (compatibilité ancien + nouveau format)

**Ancien format** (compatibilité historique, ex. Lot 5) — une puce à case, sans champ `Statut` :

- `- [x] **<Titre>**` ⇒ statut **COMPLETE**
- `- [ ] **<Titre>**` ⇒ statut **TODO**

**Nouveau format standard** — puce à case + bloc de champs indentés :

```markdown
- [ ] **<ID> : <Titre>**
  - Statut : TODO
  - Objectif : <une phrase>
  - Action attendue : <ce qui doit être produit>
  - Destination cible : <knowledge/ | templates/ | sop/ | .claude/skills/ | .claude/agents/ | clients/ | labs/ | À DÉCIDER>
  - Critère de validation : <condition observable de fin>
  - Dépendances : <IDs ou "aucune">
```

Statuts reconnus (nouveau format), et **seules** valeurs valides : `TODO`, `DRAFTING`, `HUMAN_REVIEW`, `APPROVED`, `COMPLETE`, `BLOCKED`. Si un champ `Statut :` est présent, il **prime** sur l'état de la case ; sinon, déduire le statut de la case (`[x]`/`[ ]`).

Le **« Chantier Automation — avant Lot 6 »** est une liste d'étapes (`- [x]`/`- [ ]`), lue avec la même règle de case ; ce n'est pas un lot métier.

### Sélection de l'élément actif

L'élément actif (**Active item** / **Recovered item**) est **uniquement** l'entrée ROADMAP portant explicitement le marqueur `_(en cours)_`. Il doit exister **au maximum UNE** entrée `_(en cours)_`.

- **Exactement une** entrée porte `_(en cours)_` ⇒ elle est l'Active item / Recovered item.
- **Plusieurs** entrées portent `_(en cours)_` ⇒ afficher `STOP — WORKSPACE STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`, Verdict `BLOCKED`.
- **Aucune** entrée ne porte `_(en cours)_` ⇒ ne **jamais** choisir automatiquement le premier `TODO`, ne **jamais** passer automatiquement à l'entrée suivante ; afficher Human Gate `HUMAN DECISION REQUIRED` et `STOP — HUMAN DECISION REQUIRED`.

Une case `[ ]` signifie `TODO`, **pas** automatiquement « actif ». Cette règle s'applique au chantier Automation comme aux futurs lots métier.

### Ambiguïtés — fail-closed

- **ROADMAP.md non parseable, incomplet ou structurellement ambigu** ⇒ afficher `STOP — WORKSPACE STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`, Verdict `BLOCKED`. Ne **jamais** reconstruire ni corriger ROADMAP automatiquement.

- **Plusieurs blocs avec le même ID** ⇒ afficher `STOP — WORKSPACE STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`, Verdict `BLOCKED`.
- **Plusieurs sous-lots paraissent simultanément actifs** ⇒ afficher `STOP — WORKSPACE STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`, Verdict `BLOCKED`. Ne jamais choisir.
- **Bloc nouveau format sans ID** ⇒ afficher `STOP — WORKSPACE STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`, Verdict `BLOCKED`.
- **Valeur `Statut` inconnue** (hors liste ci-dessus) ⇒ afficher `STOP — UNKNOWN LOT STATUS`, Verdict `BLOCKED`.
- **Destination requise mais absente, inconnue ou `À DÉCIDER`** ⇒ afficher `STOP — HUMAN DESTINATION DECISION REQUIRED`, Human Gate `HUMAN DECISION REQUIRED`, Verdict `WAITING_FOR_HUMAN`.

### Client boundary

Si la destination commence par `clients/`, afficher :

`CLIENT TARGET — DEDICATED HUMAN VALIDATION REQUIRED`

Human Gate : `CLIENT VALIDATION REQUIRED`. Verdict : `WAITING_FOR_HUMAN`. Aucune écriture.

---

## Verdicts supportés (valeurs figées)

`/lot status` et `/lot resume` utilisent **exactement** l'un de :

- `READY`
- `WAITING_FOR_HUMAN`
- `BLOCKED`
- `COMPLETE`

Ne jamais inventer d'autre verdict.

---

## Track AUTOMATION — pilotage humain (règle prioritaire)

Cette règle **prime** sur les mappings de statut génériques (Next Safe Action / Reprise). Elle empêche `/lot` d'utiliser son futur workflow métier (`draft` / `validate` / `promote`) pour piloter le chantier de construction Automation lui-même (récursion interdite).

Si **`Track = AUTOMATION`** (l'entrée `_(en cours)_` appartient au « # Chantier Automation — avant Lot 6 »), les règles métier génériques :

- `TODO → /lot draft`
- `DRAFTING → HUMAN REVIEW`
- `APPROVED → /lot promote`

**ne s'appliquent pas**. Le chantier Automation reste sous pilotage **humain manuel** jusqu'à Automation 1.0. `/lot` peut uniquement **RAPPORTER** son état. Il ne doit **jamais** :

- créer un draft pour Automation 0.x ;
- proposer `/lot draft`, `/lot validate` ou `/lot promote` pour Automation 0.x ;
- créer `labs/<automation-id>/` ;
- faire progresser automatiquement 0.3 → 0.4 → 0.5 (etc.).

Dans ce cas, `/lot status` et `/lot resume` affichent le résultat fixe suivant (et **n'affichent pas** `COMMAND NOT YET IMPLEMENTED`) :

- `Destination: n/a`
- `Draft: n/a` (status) / `labs: n/a` (resume)
- `Safe next action:` / `Safe resume action:` ⇒ `STOP — AUTOMATION CHANTIER REQUIRES HUMAN CONTROL`
- `Human Gate:` (status) / `Pending Human Gate:` (resume) ⇒ `HUMAN DECISION REQUIRED`
- `Lot 6: NOT STARTED`
- `Verdict: WAITING_FOR_HUMAN`

Les mappings `TODO → /lot draft`, `DRAFTING → HUMAN REVIEW`, `HUMAN_REVIEW → validation`, `APPROVED → /lot promote` ne s'appliquent **que** lorsque `Track = BUSINESS LOT` et qu'un lot métier a été explicitement autorisé humainement. Le Lot 6 reste NOT STARTED.

---

## `/lot status` (lecture seule)

Après preflight, lire `ROADMAP.md`, `context/HISTORY.md`, l'état Git, l'arborescence `labs/`, et la « Destination cible » du sous-lot le cas échéant. Puis afficher **exactement** ce bloc, ordre des champs figé :

```text
JARVIS LOT STATUS

Workspace:
Git HEAD:
Working tree:

Track:
Active item:
Status:
Destination:
Draft:
History checkpoint:

Safe next action:

Human Gate:
Lot 6:

Verdict:
```

Contraintes de valeurs :

- **`Track`** : `AUTOMATION` | `BUSINESS LOT` | `NONE`.
- **`Human Gate`** : `NONE` | `HUMAN REVIEW` | `HUMAN VALIDATION REQUIRED` | `CLIENT VALIDATION REQUIRED` | `HUMAN DECISION REQUIRED`.
- **`Lot 6`** : afficher exactement `NOT STARTED` tant que la barrière `LOT 6 — NOT STARTED — HUMAN AUTHORIZATION REQUIRED` existe dans `ROADMAP.md`.
- **`Verdict`** : `READY` | `WAITING_FOR_HUMAN` | `BLOCKED` | `COMPLETE`.

`/lot status` ne modifie rien.

### Next Safe Action — cas explicites

**Si `Track = AUTOMATION`, appliquer d'abord la règle prioritaire « Track AUTOMATION — pilotage humain » et ignorer les cas ci-dessous.** Les cas suivants ne valent que pour `Track = BUSINESS LOT` (lot métier explicitement autorisé).

Ces textes remplissent le **champ** `Safe next action:` (valeur seule, sans répéter le libellé du champ : `Safe next action: /lot draft`, jamais `Safe next action: NEXT SAFE ACTION: /lot draft`). En Automation 0.6, `/lot draft`, `/lot validate` et `/lot promote` sont **toutes implémentées** : ne jamais afficher `COMMAND NOT YET IMPLEMENTED`.

- **TODO + aucun draft** ⇒
  `Safe next action: /lot draft`
  Verdict : `READY`.
- **TODO + `labs/<ID>/` présent ET complet** (draft valide correspondant au sous-lot, voir « `/lot draft` — Automation 0.4 » §complétude) ⇒
  `Safe next action: HUMAN REVIEW`
  Human Gate : `HUMAN REVIEW`
  Verdict : `WAITING_FOR_HUMAN`.
  Ne **plus** proposer `/lot draft`. (Le statut ROADMAP reste `TODO` : `/lot draft` ne modifie jamais ROADMAP.)
- **TODO + `labs/<ID>/` présent mais incomplet/incohérent** ⇒
  `Safe next action: STOP — DRAFT STATE INCONSISTENT`
  Human Gate : `HUMAN REVIEW`
  Verdict : `BLOCKED`.
- **DRAFTING + draft présent** ⇒
  `Safe next action: HUMAN REVIEW`
  Human Gate : `HUMAN REVIEW`
  Verdict : `WAITING_FOR_HUMAN`.
- **DRAFTING + aucun draft** ⇒
  `Safe next action: STOP — DRAFT STATE INCONSISTENT`
  Verdict : `BLOCKED`.
- **HUMAN_REVIEW** ⇒
  `Safe next action: HUMAN VALIDATION REQUIRED`
  Human Gate : `HUMAN VALIDATION REQUIRED`
  Verdict : `WAITING_FOR_HUMAN`.
- **APPROVED + cible finale non promue** ⇒
  `Safe next action: /lot promote`
  Verdict : `READY`.
- **APPROVED + cible finale déjà présente** ⇒
  `Safe next action: STOP — PROMOTION STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`
  Verdict : `BLOCKED`.
- **COMPLETE** ⇒
  `Safe next action: STOP — HUMAN DECISION REQUIRED`
  Human Gate : `HUMAN DECISION REQUIRED`
  Verdict : `COMPLETE`.
  Ne **jamais** sélectionner automatiquement le sous-lot suivant.
- **BLOCKED** ⇒
  `Safe next action: STOP — BLOCKER MUST BE RESOLVED`
  Verdict : `BLOCKED`.

---

## `/lot resume` (lecture seule)

Objectif : après fermeture de VS Code / Claude Code, reboot, changement de conversation, brouillon partiel, validation en attente, promotion déjà faite, ou commit local déjà fait — **reconstruire l'état depuis les fichiers, jamais depuis la mémoire conversationnelle**.

Le format de `/lot resume` **ne réutilise pas** le bloc `/lot status` + une ligne `Reprise`. Après preflight, afficher **exactement** cette structure, ordre des champs figé :

```text
JARVIS LOT RESUME

Workspace:
Git HEAD:
Working tree:

Recovered item:
Recovered status:

Evidence:
- ROADMAP:
- labs:
- HISTORY:
- Git:
- Destination:

Last completed checkpoint:
Pending Human Gate:
Safe resume action:

Verdict:
```

`Verdict` utilise les mêmes valeurs que `/lot status` : `READY` | `WAITING_FOR_HUMAN` | `BLOCKED` | `COMPLETE`. Aucune action n'est exécutée automatiquement pendant `/lot resume`.

### Reprise fail-closed — cas explicites

**Si `Track = AUTOMATION`, appliquer d'abord la règle prioritaire « Track AUTOMATION — pilotage humain » et ignorer les cas ci-dessous.** Les cas suivants ne valent que pour `Track = BUSINESS LOT` (lot métier explicitement autorisé).

Ces textes remplissent le **champ** `Safe resume action:` (valeur seule, sans répéter le libellé). En Automation 0.6, `/lot draft`, `/lot validate` et `/lot promote` sont **toutes implémentées** : ne jamais afficher `COMMAND NOT YET IMPLEMENTED`.

- **TODO + aucun draft** ⇒
  `Safe resume action: /lot draft`
  Verdict : `READY`.
- **TODO + `labs/<ID>/` présent ET complet** (draft valide correspondant au sous-lot) ⇒
  `Safe resume action: HUMAN REVIEW`
  Pending Human Gate : `HUMAN REVIEW`
  Verdict : `WAITING_FOR_HUMAN`.
  Ne **plus** proposer `/lot draft`. (Le statut ROADMAP reste `TODO`.)
- **TODO + `labs/<ID>/` présent mais incomplet/incohérent** ⇒
  `Safe resume action: STOP — DRAFT STATE INCONSISTENT`
  Pending Human Gate : `HUMAN REVIEW`
  Verdict : `BLOCKED`.
- **DRAFTING + draft présent** ⇒
  `Safe resume action: HUMAN REVIEW`
  Pending Human Gate : `HUMAN REVIEW`
  Verdict : `WAITING_FOR_HUMAN`.
- **DRAFTING + aucun draft** ⇒
  `Safe resume action: STOP — DRAFT STATE INCONSISTENT`
  Verdict : `BLOCKED`.
- **HUMAN_REVIEW** ⇒
  `Safe resume action: HUMAN VALIDATION REQUIRED`
  Pending Human Gate : `HUMAN VALIDATION REQUIRED`
  Verdict : `WAITING_FOR_HUMAN`.
- **APPROVED + cible finale non promue** ⇒
  `Safe resume action: /lot promote`
  Verdict : `READY`.
- **APPROVED + cible finale déjà présente** ⇒
  `Safe resume action: STOP — PROMOTION STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`
  Verdict : `BLOCKED`.
- **COMPLETE** ⇒
  `Safe resume action: STOP — HUMAN DECISION REQUIRED`
  Pending Human Gate : `HUMAN DECISION REQUIRED`
  Verdict : `COMPLETE`.
- **Working tree avec modifications non liées** ⇒
  `Safe resume action: STOP — UNRELATED WORKING TREE CHANGES`
  Verdict : `BLOCKED`.

Aucune correction automatique. `/lot resume` ne relance aucune étape et ne franchit aucun Human Gate.

---

## `/lot draft` — Automation 0.4 (écriture labs-only)

Objectif : préparer, **sous `labs/<ID>/` uniquement**, le brouillon d'un futur **BUSINESS LOT explicitement autorisé**, puis STOP sur Human Gate. `/lot draft` ne construit jamais le chantier Automation, n'ouvre jamais Lot 6, ne modifie jamais ROADMAP/HISTORY ni aucun fichier hors `labs/<ID>/`, ne commit/push/backup jamais, ne valide ni ne promeut jamais.

### Priorité absolue — Track AUTOMATION

Si **`Track = AUTOMATION`**, `/lot draft` retourne **exactement** (aucune création dans `labs/`) :

```text
STOP — AUTOMATION CHANTIER REQUIRES HUMAN CONTROL

Human Gate: HUMAN DECISION REQUIRED
Verdict: WAITING_FOR_HUMAN
```

Cette règle prime sur toute logique BUSINESS LOT. Le chantier Automation ne se construit jamais lui-même via `/lot draft`.

### Préconditions BUSINESS LOT (toutes vraies, sinon STOP fail-closed)

1. `Track = BUSINESS LOT` ;
2. exactement une entrée ROADMAP porte `_(en cours)_` ;
3. ID unique dans ROADMAP ;
4. ID valide (voir « ID ») ;
5. `Statut = TODO` ;
6. `Objectif` présent ;
7. `Action attendue` présente ;
8. `Destination cible` présente et reconnue ;
9. `Fichier cible` présent et valide (voir « Fichier cible ») ;
10. `Critère de validation` présent ;
11. `Dépendances` satisfaites ou `aucune` ;
12. champ durable présent dans le bloc ROADMAP : `Autorisation humaine : APPROVED` (valeur **exactement** `APPROVED`) ;
13. `normalized-id` sans collision (voir « ID ») ;
14. working tree compatible (voir « Working tree ») ;
15. remote conforme (preflight) ;
16. aucune barrière de sécurité (Lot 6, `clients/`).

Le marqueur `_(en cours)_` seul **ne vaut pas** autorisation. La mémoire conversationnelle **ne vaut pas** autorisation. Le champ `Autorisation humaine :` doit être **présent** et **égal exactement à `APPROVED`** ; toute autre valeur, y compris vide, déclenche :

```text
STOP — BUSINESS LOT NOT HUMAN-AUTHORIZED

Human Gate: HUMAN DECISION REQUIRED
Verdict: WAITING_FOR_HUMAN
```

### Lot 6 hard gate

LOT 6 est NOT STARTED. Même si un futur bloc Lot 6 existe, `/lot draft` refuse tant qu'une autorisation humaine explicite et durable n'a pas levé la barrière :

```text
STOP — LOT 6 NOT HUMAN-AUTHORIZED

Human Gate: HUMAN DECISION REQUIRED
Verdict: WAITING_FOR_HUMAN
```

Aucun agent Sales, aucun skill Sales, aucun draft Lot 6, aucune modification `AGENTS.md`.

### ID

L'ID ROADMAP doit respecter **exactement** `[A-Za-z0-9.-]+`. Le dossier `labs/` utilise la version **lowercase** (ex. `LOT-7.1` → `lot-7.1`). Refuser **sans normalisation destructive** (jamais supprimer silencieusement un caractère invalide) si l'ID contient `..`, `/`, `\`, `:`, des espaces, des caractères de contrôle, un chemin absolu, ou tout caractère hors `[A-Za-z0-9.-]` :

`STOP — INVALID LOT ID` (Human Gate `NONE`, Verdict `BLOCKED`).

**Fonction de normalisation** (unique et partagée par `/lot status`, `/lot resume`, `/lot draft`) : `normalized-id = lowercase(ID ROADMAP)`. Toute résolution physique du dossier draft utilise `labs/<normalized-id>/`.

**Collision d'ID normalisé** : avant toute création ou reprise, calculer `normalized-id` et vérifier qu'aucun **autre** ID ROADMAP distinct ne produit le même `normalized-id` (ex. `LOT-7.1` et `lot-7.1` → même `lot-7.1`). La vérification d'unicité couvre donc l'unicité de l'ID source **et** de l'ID normalisé. En cas de collision :

```text
STOP — NORMALIZED LOT ID COLLISION

Human Gate: HUMAN DECISION REQUIRED
Verdict: BLOCKED
```

Ne créer aucun dossier.

### Fichier cible

Le bloc ROADMAP d'un BUSINESS LOT doit porter, en plus de `Destination cible` (racine gouvernée), un champ obligatoire :

`Fichier cible : <chemin canonique final>`

Exemples : `.claude/agents/sales.md`, `.claude/skills/prospection/SKILL.md`, `sop/sales/qualification.md`, `templates/sales/brief.md`, `knowledge/sales/prospection.md`.

`Destination cible` reste la racine ; `Fichier cible` définit le chemin final exact. Le `Fichier cible` doit être relatif au workspace, situé **sous** la `Destination cible` annoncée, sans `..`, non absolu, sans sortie du workspace, ne visant ni `clients/**` ni `labs/`. Sinon :

```text
STOP — INVALID TARGET FILE PATH

Human Gate: NONE
Verdict: BLOCKED
```

### resource_type déterministe

Ne jamais demander ni inventer `resource_type` ; le dériver **exclusivement** de `Destination cible` :

- `.claude/agents/` ⇒ `agent`
- `.claude/skills/` ⇒ `skill`
- `sop/` ⇒ `sop`
- `templates/` ⇒ `template`
- `knowledge/` ⇒ `knowledge`

Toute autre racine ⇒

```text
STOP — HUMAN DESTINATION DECISION REQUIRED

Human Gate: HUMAN DECISION REQUIRED
Verdict: WAITING_FOR_HUMAN
```

### candidate_main déterministe

Construire `candidate_main` depuis `Fichier cible` : le candidat reproduit sous `candidate/` la partie du chemin cible située **après** la `Destination cible` (jamais d'invention de nom de fichier).

- `Destination cible: .claude/agents/` + `Fichier cible: .claude/agents/sales.md` ⇒ `candidate_main: sales.md`
- `Destination cible: .claude/skills/` + `Fichier cible: .claude/skills/prospection/SKILL.md` ⇒ `candidate_main: prospection/SKILL.md`
- `Destination cible: sop/` + `Fichier cible: sop/sales/qualification.md` ⇒ `candidate_main: sales/qualification.md`

### Structure du draft

```text
labs/<id-normalisé>/
  meta.md
  candidate/
    <ressource candidate>
```

`meta.md` = orchestration locale uniquement. Tout contenu futur promouvable vit sous `candidate/`.

### meta.md (8 clés exactes)

```yaml
---
id_roadmap: "<ID original>"
title: "<titre>"
resource_type: "<agent|skill|sop|template|knowledge>"
destination: "<destination finale>"
candidate_main: "<chemin relatif sous candidate/>"
head_git: "<SHA HEAD>"
validation_criterion: "<critère ROADMAP>"
draft_schema_version: "1"
---
```

`candidate_main` doit être relatif, ne jamais contenir `..`, ne jamais être absolu, et résoudre strictement sous `candidate/`. Les 8 clés sont **exactes** : ne pas ajouter `target_file` pour l'instant. La destination finale exacte reste reconstructible par `destination + candidate_main` (ex. `.claude/agents/` + `sales.md` ⇒ `.claude/agents/sales.md`), qui doit correspondre **exactement** au `Fichier cible` ROADMAP. Les métadonnées ne contiennent jamais de secret, token, mot de passe, donnée client ou contenu sensible ; elles servent uniquement à l'orchestration locale et ne deviennent pas automatiquement partie de la ressource finale.

### Destinations finales

Autorisées uniquement : `knowledge/`, `templates/`, `sop/`, `.claude/skills/`, `.claude/agents/`.

- `clients/**` ⇒
  ```text
  STOP — CLIENT FOLDER WRITE REQUIRES DEDICATED HUMAN VALIDATION

  Human Gate: CLIENT VALIDATION REQUIRED
  Verdict: WAITING_FOR_HUMAN
  ```
- `labs/` comme destination finale, ou destination inconnue / `À DÉCIDER` ⇒
  ```text
  STOP — HUMAN DESTINATION DECISION REQUIRED

  Human Gate: HUMAN DECISION REQUIRED
  Verdict: WAITING_FOR_HUMAN
  ```
- traversal (`..`) / chemin absolu / sortie du workspace ⇒
  ```text
  STOP — INVALID DRAFT OR DESTINATION PATH

  Human Gate: NONE
  Verdict: BLOCKED
  ```
- ID invalide ⇒
  ```text
  STOP — INVALID LOT ID

  Human Gate: NONE
  Verdict: BLOCKED
  ```

### Génération du candidat

Avant de générer, **lire un exemple existant du même type** (jamais inventer un format quand un exemple canonique existe) :

- **agent** : Markdown, frontmatter `name` + `description`, structure cohérente avec `.claude/agents/operations.md` ;
- **skill** : dossier sous `candidate/`, `SKILL.md`, structure/frontmatter conforme aux skills existants ;
- **SOP** : Markdown conforme aux SOP existantes ;
- **template** : format conforme aux templates existants ;
- **knowledge** : Markdown documentaire conforme aux exemples existants.

Sources de lecture autorisées : bloc ROADMAP actif, `CLAUDE.md`, `OBM-OS.md`, `.docs/ARCHITECTURE.md`, exemples pertinents du même type, knowledge pertinente. Ne **jamais** parcourir automatiquement `clients/**`, `.env`, credentials, secrets, ou fichiers sans rapport. Ressource client nécessaire ⇒ STOP + Human Gate dédié.

### Complétude du draft

Un draft est **complet** uniquement si : `meta.md` existe ; YAML parseable ; les 8 clés présentes ; valeurs correspondant au bloc ROADMAP actif ; `Fichier cible` ROADMAP présent ; `candidate_main` dérivé exactement du `Fichier cible` ; `destination + candidate_main = Fichier cible` ; `normalized-id` sans collision ; `candidate_main` safe et existant ; fichier principal non vide ; candidat entièrement résolu sous `candidate/` ; minimum structurel du type respecté :

- **agent** : frontmatter `name` + `description` ;
- **skill** : `SKILL.md` + frontmatter requis ;
- **SOP / template / knowledge** : candidat non vide, structure cohérente avec les exemples du même type.

Sinon : `STOP — DRAFT STATE INCONSISTENT`.

### Idempotence

- aucun `labs/<ID>/` ⇒ création autorisable pour un BUSINESS LOT conforme ;
- draft existant **et complet** ⇒
  ```text
  DRAFT ALREADY EXISTS — HUMAN REVIEW REQUIRED

  Human Gate: HUMAN REVIEW
  Verdict: WAITING_FOR_HUMAN
  ```
  aucun doublon, aucun overwrite ;
- draft existant **mais incomplet** ⇒
  ```text
  STOP — DRAFT STATE INCONSISTENT

  Human Gate: HUMAN REVIEW
  Verdict: BLOCKED
  ```

### Working tree

- clean ⇒ OK ;
- uniquement `labs/<ID>/**` du même sous-lot ⇒ reprise/idempotence, aucun écrasement ;
- toute autre modification ⇒
  ```text
  STOP — UNRELATED WORKING TREE CHANGES

  Verdict: BLOCKED
  ```

### ROADMAP et HISTORY

`/lot draft` ne modifie **jamais** `ROADMAP.md` ni `context/HISTORY.md`. Un BUSINESS LOT peut donc rester `Status = TODO` tout en ayant un draft valide ; `/lot status` et `/lot resume` interprètent alors le draft complet comme évidence (`Safe next/resume action: HUMAN REVIEW`), sans jamais reproposer `/lot draft`. Cette règle ne s'applique pas au Track AUTOMATION.

### Sortie après création réussie

```text
JARVIS LOT DRAFT

Workspace:
Git HEAD:

Track: BUSINESS LOT
Active item:
Status: TODO
Destination:

Draft path:
Draft files:

Validation criterion:

Human Gate: HUMAN REVIEW
Verdict: WAITING_FOR_HUMAN
```

Puis STOP. Jamais de validation automatique, de promotion, de commit, de push, de backup, ni d'ouverture du sous-lot suivant. En cas de STOP/refus, ne pas afficher de faux rapport de succès : émettre le message STOP correspondant puis les lignes `Human Gate:` et `Verdict:` adaptées.

---

## `/lot validate` — Automation 0.5 (approbation humaine explicite)

Actif **uniquement** pour `Track = BUSINESS LOT`. Sur `Track = AUTOMATION` : `STOP — AUTOMATION CHANTIER REQUIRES HUMAN CONTROL` / `HUMAN DECISION REQUIRED` / `WAITING_FOR_HUMAN`.

### Préconditions

- un seul item `_(en cours)_` ;
- draft valide présent (voir « `/lot draft` » §complétude) ;
- métadonnées cohérentes ;
- `destination + candidate_main = Fichier cible` ;
- aucune modification étrangère (working tree) ;
- lot explicitement autorisé (`Autorisation humaine : APPROVED` dans ROADMAP) ;
- aucun secret détecté dans le candidat (preflight secret, voir « Sécurité »).

Sinon : STOP fail-closed (message adapté), aucune écriture.

### Présentation puis Human Gate

`/lot validate` présente d'abord (lecture seule) : `ID`, `titre`, `destination`, `Fichier cible`, résumé du draft, `critère de validation`, diff/résumé pertinent du candidat. Puis il exige une **validation humaine explicite liée à l'ID**, sous la forme exacte :

`APPROVE <ID>`

Une réponse vague (« oui », « ok », « validé », « continue ») **ne suffit pas**. Sans approbation exacte :

```text
STOP — EXPLICIT LOT APPROVAL REQUIRED

Human Gate: HUMAN VALIDATION REQUIRED
Verdict: WAITING_FOR_HUMAN
```

### Effet de `APPROVE <ID>`

Avec l'approbation exacte, `/lot validate` modifie **uniquement** le bloc ROADMAP correspondant :

`Statut : APPROVED`

Ne pas promouvoir. Ne pas écrire `HISTORY`. Ne pas cocher `[x]`. Ne pas commit. Ne pas push. Puis STOP (`Human Gate: HUMAN DECISION REQUIRED`, `Safe next action: /lot promote`).

---

## `/lot promote` — Automation 0.5 (promotion + journalisation)

Actif **uniquement** pour `Track = BUSINESS LOT`. Sur `Track = AUTOMATION` : `STOP — AUTOMATION CHANTIER REQUIRES HUMAN CONTROL` / `HUMAN DECISION REQUIRED` / `WAITING_FOR_HUMAN`.

### Préconditions

- `Track = BUSINESS LOT` ;
- item unique `_(en cours)_` ;
- `Statut : APPROVED` inscrit dans ROADMAP ;
- draft complet et cohérent ;
- `destination + candidate_main = Fichier cible` ;
- **cible finale inexistante** ;
- aucune modification étrangère ;
- secret preflight PASS (voir « Sécurité ») ;
- lot toujours autorisé.

Si la cible finale existe déjà :

```text
STOP — TARGET FILE ALREADY EXISTS — HUMAN REVIEW REQUIRED

Verdict: BLOCKED
```

### Promotion

Sur promotion valide, copier/promouvoir **uniquement** `labs/<normalized-id>/candidate/**` vers le `Fichier cible` canonique. Ne **jamais** promouvoir `meta.md`. Puis :

1. vérifier que la cible finale existe ;
2. vérifier contenu non vide ;
3. vérifier cohérence minimale du type (agent : frontmatter `name`+`description` ; skill : `SKILL.md`+frontmatter ; sop/template/knowledge : non vide) ;
4. mettre le bloc ROADMAP à `Statut : COMPLETE` et cocher `[x]` ;
5. ajouter **une** entrée idempotente dans `context/HISTORY.md` contenant au minimum : `ID`, `titre`, `date`, `Fichier cible`, résultat `COMPLETE` ;
6. ne **pas** supprimer automatiquement le draft `labs/` ;
7. ne **pas** ouvrir automatiquement le lot suivant.

Puis afficher `Human Gate: HUMAN DECISION REQUIRED` et `Safe next action: /commit`. **Ne pas** lancer `/commit`.

### Idempotence

- ROADMAP `COMPLETE` **et** cible finale existante ⇒ `LOT ALREADY COMPLETE — NO ACTION PERFORMED` (rien refait) ;
- entrée `HISTORY` déjà présente pour cet ID ⇒ ne pas dupliquer ;
- cible présente **mais** ROADMAP non `COMPLETE` ⇒ `STOP — PROMOTION STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`.

---

## Human Approval (protection renforcée)

Seule `/lot validate`, et **uniquement** sur approbation humaine explicite `APPROVE <ID>`, inscrit `Statut : APPROVED`. Aucune autre commande ne crée, ne déduit ni n'enregistre `APPROVED`.

Une approbation ne doit **jamais** être déduite depuis : mémoire conversationnelle, ancienne session Claude, HISTORY, message Git, commit, présence d'un brouillon, existence d'une destination, réponse vague (« oui », « ok »), ou ancien message utilisateur. Pour `/lot draft`, l'éligibilité d'un BUSINESS LOT exige le champ durable `Autorisation humaine : APPROVED` dans le bloc ROADMAP ; pour `/lot validate`, l'approbation exige la commande exacte `APPROVE <ID>`.

`/lot status` et `/lot resume` peuvent uniquement **LIRE** les statuts inscrits dans `ROADMAP.md`. `/lot draft` ne modifie jamais ROADMAP.

---

## Sécurité — preflight secret (Automation 0.6)

Le dépôt est **public**. Avant toute écriture de `/lot promote` (et en contrôle dans `/lot validate`), et avant toute sauvegarde via `/commit`, un preflight secret s'applique au contenu concerné (candidat `labs/<ID>/candidate/**`, cible promue, working tree pour `/commit`).

Le preflight délègue au script `scripts/precommit-guard.ps1` lorsqu'il est disponible (exécuté par `/commit` avant `backup.ps1`). Il échoue **fermé** (aucune promotion, aucune sauvegarde) s'il détecte notamment : un fichier `.env` réel, un `*.pem` / `*.key`, un bloc de clé privée, un jeton de type `ghp_…`, `xox…`, `sk-…`, `AKIA…`, `AIza…`, ou une assignation sensible (`password=`, `api_key=`, `token=`, `secret=`) avec une valeur réelle non-placeholder. Il ignore les faux positifs documentaires (le simple mot « secret »/« secrets », `.env.example`, placeholders `<TOKEN>`, `YOUR_API_KEY`, `xxx`). En détection :

```text
STOP — POTENTIAL SECRET DETECTED
```

La valeur complète du secret n'est **jamais** imprimée. Le preflight cible de vrais identifiants, pas le mot « secrets ».

---

## Lot 6 — Hard Gate

La barrière `LOT 6 — NOT STARTED — HUMAN AUTHORIZATION REQUIRED` reste **absolue**.

Dans les rapports : `Lot 6: NOT STARTED`.

Tant que cette barrière existe, ne **jamais** proposer automatiquement : ouverture du Lot 6, agent Sales, skill Sales, draft du Lot 6, passage de Automation au Lot 6, ni modification de `AGENTS.md` liée au Lot 6.

Même si Automation devient `COMPLETE` : `STOP — HUMAN DECISION REQUIRED`. Le Lot 6 ne peut être ouvert que par une autorisation humaine explicite future.

### Sécurité d'autorisation

La simple **absence** ou **suppression** de la barrière `LOT 6 — NOT STARTED — HUMAN AUTHORIZATION REQUIRED` ne constitue **JAMAIS** une autorisation du Lot 6.

Tant qu'aucun mécanisme futur d'autorisation humaine explicite du Lot 6 n'a été défini et enregistré, le Lot 6 reste non autorisé : aucun draft Lot 6, aucun agent Sales, aucun skill Sales, aucune modification de `AGENTS.md` pour le Lot 6.

Si la barrière `NOT STARTED` disparaît sans autorisation humaine explicite identifiable : afficher `STOP — HUMAN DECISION REQUIRED`, Verdict `BLOCKED`.

---

## Intégrité Markdown

Toutes les fences Markdown de ce fichier doivent être correctement ouvertes et fermées. Ne corriger qu'une fence réellement mal formée ; ne pas réécrire inutilement le fichier.

---

## Périmètre et garde-fous

- N'agit que dans le workspace courant `christophe981/jarvis-` ; ne touche jamais à un autre dépôt.
- N'exécute aucune commande Git mutante (voir « Git (Automation 0.4) »). Écritures disque autorisées : `/lot draft` sous `labs/<ID>/` ; `/lot validate` sur le bloc ROADMAP concerné ; `/lot promote` sur le `Fichier cible`, le bloc ROADMAP et `context/HISTORY.md`.
- Propose `/commit` en fin de promotion (`Safe next action: /commit`) mais ne le lance **jamais** automatiquement ; ne lance jamais `backup.ps1`.
- Communication en français, réponses concises, pas de tirets longs.

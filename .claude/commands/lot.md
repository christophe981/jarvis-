# /lot

> Orchestrateur du cycle de construction des lots du workspace OBM-OS.
> **Automation 0.3** : seules les sous-commandes `status` et `resume` sont actives, et elles sont **STRICTEMENT EN LECTURE SEULE**.
> `draft`, `validate`, `promote` ne sont **pas** encore implémentées.

---

## Règle absolue (Automation 0.3)

Quand je lance `/lot <sous-commande>` :

- **`/lot status`** et **`/lot resume`** : autorisées, **lecture seule**. Elles ne créent, ne modifient, ne suppriment, ne committent et ne poussent **rien**.
- **`/lot draft`**, **`/lot validate`**, **`/lot promote`** : répondre **exactement** :

  `NOT IMPLEMENTED IN AUTOMATION 0.3`

  puis STOP sans aucune mutation.
- **Toute autre sous-commande inconnue**, ainsi que **`/lot` sans sous-commande** : répondre **exactement** :

  `UNKNOWN /lot SUBCOMMAND — NO ACTION PERFORMED`

  puis STOP sans aucune mutation.

Ne jamais mélanger ces deux catégories : `draft`/`validate`/`promote` renvoient `NOT IMPLEMENTED IN AUTOMATION 0.3` ; tout le reste (inconnu ou vide) renvoie `UNKNOWN /lot SUBCOMMAND — NO ACTION PERFORMED`.

Ne jamais, dans cette version : écrire un fichier, cocher une case ROADMAP, écrire dans `labs/`, `clients/**` ou ailleurs, lancer `/commit`, `git commit`, `git push`, ni décider d'ouvrir/de passer un lot. Aucune ressource Lot 6. La barrière `LOT 6 — NOT STARTED — HUMAN AUTHORIZATION REQUIRED` de `ROADMAP.md` est respectée.

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

## Preflight (obligatoire pour `/lot status` et `/lot resume`)

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

### Git — fail-closed (pour `/lot status` et `/lot resume`)

- **HEAD détachée** ⇒ afficher `STOP — WORKSPACE STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`, Verdict `BLOCKED`.
- **Conflit, fichiers unmerged, merge/rebase en cours, ou index ambigu** ⇒ afficher `STOP — WORKSPACE STATE AMBIGUOUS — HUMAN REVIEW REQUIRED`, Verdict `BLOCKED`.
- **Working tree avec modifications non liées au cycle courant** ⇒ afficher `STOP — UNRELATED WORKING TREE CHANGES`, Verdict `BLOCKED`.

Ne rien corriger automatiquement.

---

## Git en lecture seule (Automation 0.3)

Lectures Git autorisées (notamment) :

- `git status --short`
- `git status`
- `git rev-parse HEAD`
- `git branch --show-current`
- `git log`
- `git diff`
- `git remote -v`

Toujours **interdits** dans Automation 0.3 :

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

`/lot status` et `/lot resume` ne produisent **aucune** mutation Git.

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

Ces textes remplissent le **champ** `Safe next action:` (valeur seule, sans répéter le libellé du champ : `Safe next action: /lot draft`, jamais `Safe next action: NEXT SAFE ACTION: /lot draft`). Quand la commande citée n'est pas encore implémentée, afficher `COMMAND NOT YET IMPLEMENTED` **après** le bloc de rapport, sans dupliquer le libellé.

- **TODO + aucun draft** ⇒
  `Safe next action: /lot draft`
  puis (après le rapport) `COMMAND NOT YET IMPLEMENTED`
  Verdict : `READY`.
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
- **APPROVED + destination absente** ⇒
  `Safe next action: /lot promote`
  puis (après le rapport) `COMMAND NOT YET IMPLEMENTED`
  Verdict : `READY`.
- **APPROVED + destination déjà présente** ⇒
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

Ces textes remplissent le **champ** `Safe resume action:` (valeur seule, sans répéter le libellé). Quand la commande citée n'est pas encore implémentée, afficher `COMMAND NOT YET IMPLEMENTED` **après** le bloc de rapport, sans dupliquer le libellé.

- **TODO + aucun draft** ⇒
  `Safe resume action: /lot draft`
  puis (après le rapport) `COMMAND NOT YET IMPLEMENTED`
  Verdict : `READY`.
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
- **APPROVED + destination absente** ⇒
  `Safe resume action: /lot promote`
  puis (après le rapport) `COMMAND NOT YET IMPLEMENTED`
  Verdict : `READY`.
- **APPROVED + destination déjà présente** ⇒
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

## Human Approval (protection renforcée)

Automation 0.3 ne crée, ne déduit et n'enregistre **JAMAIS** `APPROVED`.

Une approbation ne doit **jamais** être déduite depuis : mémoire conversationnelle, ancienne session Claude, HISTORY, message Git, commit, présence d'un brouillon, existence d'une destination, ou ancien message utilisateur.

`/lot status` et `/lot resume` peuvent uniquement **LIRE** un statut déjà inscrit dans `ROADMAP.md`. Aucune validation n'est créée par Automation 0.3.

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
- N'exécute aucune commande Git mutante. Lectures autorisées uniquement (voir « Git en lecture seule »).
- Ne propose ni ne lance `/commit` ni `backup.ps1` en 0.3.
- Communication en français, réponses concises, pas de tirets longs.

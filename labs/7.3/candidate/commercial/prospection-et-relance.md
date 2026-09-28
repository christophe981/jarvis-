# SOP : Prospection et relance

> Rôle : procédure standard pour piloter un cycle de prospection de bout en bout.
> Couvre : identification des prospects → premier contact → relances → clôture.
> Ressources associées :
> - `templates/prospection/message-prospection-directe_modele.md` — messages à personnaliser
> - `templates/interviews/trame-appel-decouverte_modele.md` — trame de l'appel découverte
> - `templates/prospection/invitation-interview_messages.md` — invitation formelle à un entretien

---

## Vue d'ensemble du cycle

```
IDENTIFICATION → PREMIER CONTACT → RELANCE 1 → RELANCE 2 → RELANCE 3 → CLÔTURE
                                                                      ↓
                                                            APPEL DÉCOUVERTE
```

Durée d'un cycle complet : 3 à 4 semaines par prospect.
Capacité recommandée : 5 à 10 prospects actifs en parallèle maximum.

---

## Phase 1 — Identification du prospect

**Objectif : constituer une liste de prospects qualifiés avant de contacter.**

### Critères de ciblage (profil idéal)

Un prospect est éligible s'il coche au moins 3 de ces 5 critères :

- [ ] Dirigeant de TPE/PME (BTP ou secteur ciblé), 5 à 30 collaborateurs
- [ ] Signe visible d'une croissance ou d'une tension opérationnelle (recrutement, expansion, charge)
- [ ] Présent sur LinkedIn ou joignable par email professionnel
- [ ] Décideur identifié (pas un intermédiaire)
- [ ] Signal déclencheur repéré (post, recommandation, événement, offre d'emploi)

### Sources à exploiter

- LinkedIn : recherche par secteur + taille d'entreprise + région
- Recommandations du réseau personnel ou professionnel
- Événements professionnels (salons BTP, réseaux patronaux, chambres de commerce)
- Contenus publiés : posts LinkedIn qui expriment un problème opérationnel

### Fiche de suivi prospect (à créer pour chaque contact)

| Champ | Valeur |
|---|---|
| Nom / Prénom | |
| Entreprise | |
| Secteur | |
| Canal de contact | LinkedIn / Email |
| Signal déclencheur | |
| Date du 1er contact | |
| Statut actuel | IDENTIFIÉ / CONTACTÉ / RELANCÉ / APPEL / CLOS |
| Prochaine action | |
| Date prochaine action | |

---

## Phase 2 — Premier contact

**Objectif : ouvrir la relation sans vendre, déclencher une réponse.**

### Règles avant d'envoyer

- [ ] Personnaliser : prénom, secteur, déclencheur spécifique
- [ ] Choisir le bon message selon la situation (voir template)
- [ ] Vérifier : moins de 150 mots sur LinkedIn, moins de 200 mots par email
- [ ] Relire : une seule question à la fin, pas de pitch généraliste
- [ ] Valider avant envoi (ne jamais envoyer sans relecture)

### Sélection du message

| Situation | Template à utiliser |
|---|---|
| Contact froid LinkedIn | Situation 1 ou 2 du template prospection |
| Rebond sur un post LinkedIn | Situation 3 du template prospection |
| Contact chaud ou recommandé | Situation 4 du template prospection |
| Contact froid par email | Section email du template prospection |

### Après envoi

- Noter la date dans la fiche de suivi
- Passer le statut à CONTACTÉ
- Planifier la relance 1 à J+5

---

## Phase 3 — Séquence de relances

**Objectif : maximiser les chances de réponse sans devenir intrusif.**

> Règle absolue : s'arrêter après 3 relances sans réponse. Ne jamais relancer une 4e fois sans raison nouvelle (nouveau signal, recommandation, événement).

### Relance 1 — J+5

Canal : même canal que le premier contact.

Message : bref, relance le message précédent sans répéter le pitch.

> "Bonjour [PRÉNOM], je fais suite à mon message du [DATE]. Je voulais juste m'assurer qu'il vous avait bien atteint."

- [ ] Message envoyé
- [ ] Date notée dans la fiche
- [ ] Prochaine relance planifiée à J+10

### Relance 2 — J+10

Canal : changer de canal si possible (email → LinkedIn ou inversement).

Message : reconnaît l'agenda chargé, laisse une porte de sortie.

> "Bonjour [PRÉNOM], je sais que les agendas sont chargés. Si ce n'est pas le bon moment, pas de souci — juste me le dire et je ne relance plus."

- [ ] Message envoyé
- [ ] Date notée dans la fiche
- [ ] Prochaine relance planifiée à J+20

### Relance 3 — J+20 (dernière)

Canal : au choix.

Message : clôture proprement la séquence.

> "Dernier message de ma part, [PRÉNOM]. Si le sujet devient d'actualité, vous savez où me trouver."

- [ ] Message envoyé
- [ ] Date notée dans la fiche
- [ ] Statut mis à jour (CLOS ou APPEL selon la réponse)

---

## Phase 4 — Transition vers l'appel découverte

**Objectif : convertir une réponse positive en appel qualifié.**

### Critères GO (proposer l'appel)

Proposer un appel découverte si le prospect :
- répond positivement à un message (même avec une réserve ou une question)
- exprime un problème ou un besoin, même implicitement
- demande plus d'informations sur ce que je fais

### Critères NO-GO (ne pas proposer l'appel)

Ne pas proposer l'appel si :
- le prospect répond clairement que ce n'est pas son sujet
- le profil ne correspond pas à la cible (trop petit, secteur incompatible, pas décideur)
- la réponse est hostile ou désintéressée

### Proposition de l'appel

Si GO : utiliser le message d'invitation à une interview découverte (`templates/prospection/invitation-interview_messages.md`) ou proposer directement un créneau.

Durée proposée : 20 à 30 minutes.

---

## Phase 5 — Clôture du cycle

### Clôture positive (conversion)

Le cycle se clôt positivement quand :
- l'appel découverte est planifié → statut : APPEL
- l'appel a lieu → passer à la trame d'appel découverte (`templates/interviews/trame-appel-decouverte_modele.md`)

### Clôture sans suite (abandon)

Abandonner proprement après :
- 3 relances sans réponse
- une réponse négative claire
- un appel concluant que ce n'est pas la bonne cible

Clôture sans suite = mettre le statut CLOS + noter la raison dans la fiche.

> Ces contacts ne sont pas perdus. Ils peuvent être réactivés si un nouveau signal apparaît (changement de poste, nouveau projet, recommandation).

---

## Rythme hebdomadaire recommandé

| Moment | Action |
|---|---|
| Lundi matin (30 min) | Identifier 2 à 3 nouveaux prospects, noter les signaux déclencheurs |
| Lundi ou mardi | Envoyer les premiers contacts de la semaine |
| Mercredi ou jeudi | Envoyer les relances planifiées |
| Vendredi (15 min) | Mettre à jour les fiches de suivi, planifier la semaine suivante |

Objectif minimal : 2 premiers contacts par semaine + traitement des relances en cours.

---

## Règles générales

- Ne jamais envoyer un message sans relecture et validation humaine.
- Ne jamais relancer plus de 3 fois sans raison nouvelle.
- Toujours noter la date et le statut après chaque action.
- Privilégier la qualité sur la quantité : 5 prospects bien ciblés valent mieux que 20 au hasard.
- Si un prospect répond négativement : remercier, ne pas insister, clore proprement.

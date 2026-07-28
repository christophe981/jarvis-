# Grille 1 : Maturité IA

> Objectif : situer le niveau réel d'une entreprise face à l'IA, avant toute recommandation. Première étape depuis la [méthode principale](00-methode-principale.md).

## Principe

Le niveau réel d'une entreprise n'est pas celui qu'elle déclare : c'est le plus haut niveau où l'usage tient sans qu'un humain relance la machine chaque matin. On ne saute pas un niveau, on ne reste pas non plus bloqué contre un plafond une fois les conditions du niveau suivant réunies.

## Niveau 1 : Discuter

L'humain fait tout le transport de l'information.

- **Signes observables** : abonnements individuels payés à titre personnel, prompts recopiés dans un bloc-notes, chacun a "sa" méthode, aucune n'est écrite.
- **Plafond** : le gain s'arrête au temps de frappe. Il disparaît dès que la personne part en congés, rien n'est capitalisé.
- **Le pas suivant** : écrire le contexte une fois pour toutes ([grille Contexte](02-contexte.md)) et brancher l'IA sur la source de données, pas sur le copier-coller.

## Niveau 2 : Connecter

Les outils se parlent, l'IA est une étape du flux.

- **Signes observables** : des scénarios d'automatisation tournent et quelqu'un sait dire ce qui se déclenche quand. Les erreurs sont visibles quelque part.
- **Plafond** : tout cas non prévu casse le flux. Le scénario grossit, devient illisible, une seule personne sait le réparer.
- **Le pas suivant** : remplacer les branches conditionnelles par une décision confiée au modèle, avec des critères écrits et un journal des choix.

## Niveau 3 : Déléguer

Un agent tient une tâche de bout en bout.

- **Signes observables** : un périmètre est écrit noir sur blanc, avec des critères d'escalade vers l'humain et un suivi des cas traités et rattrapés.
- **Plafond** : la confiance. Sans mesure du taux d'erreur, l'équipe revérifie tout à la main, le gain est annulé.
- **Le pas suivant** : instrumenter le volume traité, le taux de reprise et le coût par cas. Élargir le périmètre seulement quand ces trois chiffres sont stables.

## Checklist : faux niveaux à ne pas prendre pour de la maturité

- [ ] Un POC présenté en comité mais jamais utilisé
- [ ] Un chatbot sur le site qui renvoie systématiquement vers le formulaire de contact
- [ ] Une licence entreprise achetée dont personne ne connaît le login
- [ ] Un "projet IA" dont le sponsor ne sait pas nommer la tâche visée

Si un seul de ces signes est présent, ce n'est pas un niveau de maturité, c'est une façade.

## Repère

La valeur durable démarre au niveau 2. Le niveau 1 se paie en abonnements, le niveau 2 se paie en processus.

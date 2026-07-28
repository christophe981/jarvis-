# Grille 3 : Sensibilité des données et hébergement

> Objectif : déterminer quelles données peuvent transiter par quel type d'outil. Troisième étape depuis la [méthode principale](00-methode-principale.md).

## Principe

La question "est-ce que c'est RGPD ?" n'a pas de réponse en soi : tout dépend de ce qu'on met dans l'outil. La réponse se lit à l'intersection du type de donnée et de l'environnement d'hébergement. En cas de doute sur la sensibilité d'une donnée, la traiter comme sensible par défaut.

## Matrice sensibilité × hébergement

| Type de donnée | Compte gratuit grand public | Offre pro / team | API entreprise ou hébergée UE |
|---|---|---|---|
| Contenu déjà public | Aucun enjeu | Aucun enjeu | Aucun enjeu |
| Interne non nominatif (process, modèles de documents) | Toléré, mais le savoir-faire fuite hors du cadre | Cadre adapté | Cadre adapté |
| Données clients nominatives (noms, emails, contrats) | À exclure : pas de base légale, pas de traçabilité | Possible si non-entraînement écrit et sous-traitance encadrée | Voie normale, avec registre à jour |
| Catégories sensibles (santé, RH, judiciaire) | Interdit de fait | À éviter | Seulement avec analyse d'impact et anonymisation |
| Secrets industriels (R&D, code, prix d'achat) | Interdit de fait | Selon les engagements de rétention | Auto-hébergé si l'enjeu est vital |

Ces repères sont à confirmer avec le juriste ou le DPO de l'entreprise, ils ne remplacent pas un avis juridique.

## Diagnostiquer la shadow IA

Interdire l'IA ne l'arrête pas, elle passe sur les téléphones personnels : tous les risques, zéro visibilité. Une interdiction sans alternative crée un usage clandestin, pas une conformité.

### Checklist : 3 indices de shadow IA

- [ ] Personne dans l'équipe ne sait nommer les outils réellement utilisés
- [ ] Aucune charte n'existe
- [ ] Les usages les plus avancés viennent de personnes que la DSI ne connaît pas

## Checklist : socle minimum à recommander

- [ ] Un environnement officiel où l'entraînement sur les données est contractuellement exclu
- [ ] Une charte d'une page qui dit ce qu'on colle et ce qu'on ne colle jamais
- [ ] Un point d'entrée pour demander un nouvel outil
- [ ] Une trace des traitements automatisés qui touchent des personnes

Le modèle de charte correspondant est [charte-ia-une-page_modele.md](../../../templates/diagnostic-ia/charte-ia-une-page_modele.md).

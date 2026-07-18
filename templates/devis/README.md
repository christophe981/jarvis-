# Modèle de devis chiffré

`devis_modele.pptx` : modèle réutilisable de devis (identité navy/orange, A4), avec le bloc client en placeholders et les prestations standard (Intensive 30j + prolongation 60j, tarif 2 650 €/mois, total 7 950 €).

## Règle importante : le devis reste en PDF, jamais dans Canva

Le devis contient un **tableau**. Or Canva **abîme les tableaux à l'import PowerPoint** : il mange des espaces entre les mots ("Structurationdesopérations", "roadmappriorisée"...) et déplace des en-têtes de colonne. Le rendu devient inutilisable.

**Donc :**
- Le `.pptx` est seulement la **source technique**.
- Le livrable est le **PDF**, généré depuis le `.pptx` avec LibreOffice (`soffice --headless --convert-to pdf`), pas via Canva.
- Pour un nouveau client : adapter le nom, l'adresse et les lignes dans la source, puis régénérer le PDF.

## Rappel du flux de vente

- **Restitution / prescription** → passe par Canva (pas de tableau, s'importe bien), présentée en visio, exportée en PDF.
- **Devis** → reste en PDF (LibreOffice), **jamais dans Canva**.

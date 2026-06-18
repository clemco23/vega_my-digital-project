# TP - Tests unitaires

## Lien du depot Git

https://github.com/clemco23/vega_my-digital-project

## Perimetre de test retenu

Le perimetre de test retenu est `backend/src/services/product.service.js`.

Ce choix est justifie par trois constats :

1. `product.service` est le service backend le plus expose fonctionnellement, avec 15 routes dediees dans `backend/src/routes/product.routes.js`.
2. Il est aussi le service le plus sollicite cote front : `frontend/src/services/product.service.js` est importe dans 7 composants/pages (`Configurator`, `RecommendationsSection`, `ProductForm`, `ProductImages`, `ProductVariants`, `ProductSetItems`, `ProductsList`).
3. Il porte une partie importante du coeur métier : lecture du catalogue, gestion admin des produits, variantes, images et composition des sets predefinis.

Ce perimetre est pertinent pour des tests unitaires car il contient :

- des cas simples de transformation de donnees (`createProduct`, `updateVariant`, `addVariant`) ;
- des appels asynchrones au stockage via Prisma ;
- des dependances a isoler avec des mocks pour verifier uniquement la logique du service.

## Strategie de test

Les tests realises restent strictement unitaires :

- Prisma est entierement mocke ;
- aucune base de donnees reelle n'est utilisee ;
- aucun appel HTTP n'est execute ;
- le comportement verifie porte uniquement sur la logique de `product.service`.

Les cas couverts melangent :

- tests simples : conversion des ids, prix, stocks et champs numeriques ;
- tests avec mocks : verification des appels Prisma et des parametres envoyes ;
- tests asynchrones : verification des promesses resolues/rejetees sur les methodes du service.

## Liste des comportements testes

Les tests ecrits couvrent les 10 comportements suivants :

1. recuperation des produits actifs avec leurs relations ;
2. recuperation des produits admin ;
3. recuperation d'un produit par id avec relations imbriquees ;
4. creation d'un produit avec normalisation des variantes et des skills ;
5. creation d'un produit sans skills ;
6. mise a jour d'un produit ;
7. mise a jour d'une variante avec normalisation numerique ;
8. ajout d'images avec positionnement initial ;
9. ajout d'images a la suite des positions existantes ;
10. rejet d'un set item si la variante est introuvable.

## Emplacement des tests

Les tests sont disponibles dans :

- `backend/tests/product.service.test.js`

Le lancement se fait avec :

```bash
cd backend
npm test
```

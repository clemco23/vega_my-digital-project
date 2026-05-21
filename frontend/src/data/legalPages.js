export const legalPages = [
  {
    path: "/mentions-legales",
    label: "Mentions l\u00e9gales",
    title: "Mentions l\u00e9gales et politique de confidentialit\u00e9",
    sections: [
      {
        heading: "1. Mentions l\u00e9gales (\u00e9diteur et h\u00e9bergeur)",
        items: [
          {
            label: "\u00c9diteur du site",
            content:
              "Le site internet www.haptokids.fr est \u00e9dit\u00e9 par la soci\u00e9t\u00e9 HAPT\u014c,  SAS au capital de 0 euros.",
          },
          {
            label: "Si\u00e8ge social",
            content: "11 rue du chemin vert, 75011 Paris",
          },
          {
            label: "Immatriculation",
            content: "RCS de PARIS sous le num\u00e9ro [Num\u00e9ro SIREN]",
          },
          {
            label: "Num\u00e9ro de TVA intracommunautaire",
            content: "FR52948140546",
          },
          {
            label: "Contact",
            content: "contact@hapto.fr / 01 02 03 04 05",
          },
          {
            label: "Directeur de la publication",
            content:
              "Lorena Ville Peguy, en qualit\u00e9 de Directrice.",
          },
          {
            label: "H\u00e9bergement du site",
            content:
              "Ce site est h\u00e9berg\u00e9 par  OVH.",
          },
          {
            label: "Adresse de l'h\u00e9bergeur",
            content: "OVH SAS, 2 rue Kellermann, 59100 Roubaix (France)",
          },
          {
            label: "Contact de l'h\u00e9bergeur",
            content: "+33 9 72 10 10 07",
          },
        ],
      },
    ],
  },
  {
    path: "/rgpd",
    label: "RGPD",
    title: "Politique de confidentialite (conformite RGPD)",
    summary:
      "Chez HAPT\u014c, la protection de votre vie privee est une priorite. En tant que marque pronant la deconnexion et la transparence, nous nous engageons a traiter vos donnees personnelles avec le plus grand soin.",
    sections: [
      {
        heading: "1. Responsable du traitement",
        paragraphs: [
          "La societe HAPT\u014c est responsable du traitement des donnees collectees sur le site www.hapto.fr.",
        ],
      },
      {
        heading: "2. Donnees collectees et finalites",
        paragraphs: [
          "Nous collectons uniquement les donnees strictement necessaires pour vous offrir la meilleure experience possible :",
        ],
        items: [
          {
            label: "Lors de l'inscription a la waitlist / newsletter",
            content:
              "Votre adresse e-mail pour vous informer du lancement et de nos nouveautes.",
          },
          {
            label: "Lors d'une commande (configurateur)",
            content:
              "Vos noms, prenoms, adresse de livraison, adresse de facturation et coordonnees de paiement pour le traitement, l'expedition de votre planche sensorielle et le service client, notamment notre programme de seconde main.",
          },
          {
            label: "Donnees de navigation (cookies)",
            content:
              "Pour assurer le bon fonctionnement du site et de notre configurateur interactif.",
          },
        ],
      },
      {
        heading: "3. Partage des donnees",
        paragraphs: [
          "Vos donnees ne sont jamais vendues a des tiers. Elles sont uniquement partagees avec nos prestataires de confiance strictement necessaires a l'execution de votre commande, par exemple les transporteurs pour la livraison et la plateforme de paiement securisee.",
        ],
      },
      {
        heading: "4. Duree de conservation",
        paragraphs: [
          "Vos donnees clients sont conservees pendant la duree de notre relation commerciale, puis archivees pour une duree de 10 ans, conformement aux obligations comptables. Les donnees liees a la newsletter sont conservees 3 ans apres votre dernier contact avec nous.",
        ],
      },
      {
        heading: "5. Vos droits",
        paragraphs: [
          "Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez d'un droit d'acces, de rectification, de portabilite, d'effacement de vos donnees, ainsi que d'un droit de limitation et d'opposition a leur traitement.",
          "Pour exercer ces droits, vous pouvez contacter Ines (Relation Client) a l'adresse suivante : contact@hapto.fr.",
        ],
      },
    ],
  },
  {
    path: "/accessibilite",
    label: "Accessibilit\u00e9",
    title: "Declaration d'accessibilite",
    summary:
      "HAPT\u014c est un projet fonde sur l'inclusivite, concu notamment pour etre un outil neuro-inclusif apaisant. Nous avons la conviction que notre presence en ligne doit refleter cette valeur.",
    sections: [
      {
        heading: "1. Etat de conformite",
        paragraphs: [
          "Le site www.hapto.fr s'engage a rendre ses sites internet accessibles conformement a l'article 47 de la loi n\u00b02005-102 du 11 fevrier 2005.",
          "A ce jour, le site est en cours d'evaluation pour sa conformite avec le Referentiel General d'Amelioration de l'Accessibilite (RGAA).",
        ],
      },
      {
        heading: "2. Nos engagements",
        paragraphs: [
          "Nous travaillons activement, avec notre developpeur Clement Boscher, a l'amelioration de l'experience utilisateur pour tous, notamment sur les contrastes de couleurs adaptes, la navigation au clavier pour le configurateur et les balises alt sur nos images de modules.",
        ],
      },
      {
        heading: "3. Contact et retours",
        paragraphs: [
          "Si vous n'arrivez pas a acceder a un contenu ou a un service de notre site, notamment notre configurateur de planche, vous pouvez nous contacter pour etre oriente vers une alternative accessible ou obtenir le contenu sous une autre forme.",
        ],
        items: [
          {
            label: "E-mail",
            content: "contact@hapto.fr",
          },
          {
            label: "Telephone",
            content: "01 02 03 04 05",
          },
        ],
      },
    ],
  },
];

export const legalPagesByPath = Object.fromEntries(
  legalPages.map((page) => [page.path, page]),
);

export const legalPages = [
  {
    path: "/mentions-legales",
    label: "Mentions légales",
    title: "Mentions légales et politique de confidentialité",
    sections: [
      {
        heading: "1. Mentions légales (éditeur et hébergeur)",
        items: [
          {
            label: "Éditeur du site",
            content:
              "Le site internet www.haptokids.fr est édité par la société HAPTŌ, SAS au capital de 0 euros.",
          },
          {
            label: "Siège social",
            content: "11 rue du chemin vert, 75011 Paris",
          },
          {
            label: "Immatriculation",
            content: "RCS de PARIS sous le numéro [Numéro SIREN]",
          },
          {
            label: "Numéro de TVA intracommunautaire",
            content: "FR52948140546",
          },
          {
            label: "Contact",
            content: "contact@hapto.fr / 01 02 03 04 05",
          },
          {
            label: "Directeur de la publication",
            content: "Lorena Ville Peguy, en qualité de Directrice.",
          },
          {
            label: "Hébergement du site",
            content: "Ce site est hébergé par OVH.",
          },
          {
            label: "Adresse de l'hébergeur",
            content: "OVH SAS, 2 rue Kellermann, 59100 Roubaix (France)",
          },
          {
            label: "Contact de l'hébergeur",
            content: "+33 9 72 10 10 07",
          },
        ],
      },
    ],
  },
  {
    path: "/rgpd",
    label: "RGPD",
    title: "Politique de confidentialité (conformité RGPD)",
    summary:
      "Chez HAPTŌ, la protection de votre vie privée est une priorité. En tant que marque prônant la déconnexion et la transparence, nous nous engageons à traiter vos données personnelles avec le plus grand soin.",
    sections: [
      {
        heading: "1. Responsable du traitement",
        paragraphs: [
          "La société HAPTŌ est responsable du traitement des données collectées sur le site www.hapto.fr.",
        ],
      },
      {
        heading: "2. Données collectées et finalités",
        paragraphs: [
          "Nous collectons uniquement les données strictement nécessaires pour vous offrir la meilleure expérience possible :",
        ],
        items: [
          {
            label: "Lors de l'inscription à la waitlist / newsletter",
            content:
              "Votre adresse e-mail pour vous informer du lancement et de nos nouveautés.",
          },
          {
            label: "Lors d'une commande (configurateur)",
            content:
              "Vos noms, prénoms, adresse de livraison, adresse de facturation et coordonnées de paiement pour le traitement, l'expédition de votre planche sensorielle et le service client, notamment notre programme de seconde main.",
          },
          {
            label: "Données de navigation (cookies)",
            content:
              "Pour assurer le bon fonctionnement du site et de notre configurateur interactif.",
          },
        ],
      },
      {
        heading: "3. Partage des données",
        paragraphs: [
          "Vos données ne sont jamais vendues à des tiers. Elles sont uniquement partagées avec nos prestataires de confiance strictement nécessaires à l'exécution de votre commande, par exemple les transporteurs pour la livraison et la plateforme de paiement sécurisée.",
        ],
      },
      {
        heading: "4. Durée de conservation",
        paragraphs: [
          "Vos données clients sont conservées pendant la durée de notre relation commerciale, puis archivées pour une durée de 10 ans, conformément aux obligations comptables. Les données liées à la newsletter sont conservées 3 ans après votre dernier contact avec nous.",
        ],
      },
      {
        heading: "5. Vos droits",
        paragraphs: [
          "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de portabilité, d'effacement de vos données, ainsi que d'un droit de limitation et d'opposition à leur traitement.",
          "Pour exercer ces droits, vous pouvez contacter Ines (Relation Client) à l'adresse suivante : contact@hapto.fr.",
        ],
      },
    ],
  },
  {
    path: "/accessibilite",
    label: "Accessibilité",
    title: "Déclaration d'accessibilité",
    summary:
      "HAPTŌ est un projet fondé sur l'inclusivité, conçu notamment pour être un outil neuro-inclusif apaisant. Nous avons la conviction que notre présence en ligne doit refléter cette valeur.",
    sections: [
      {
        heading: "1. État de conformité",
        paragraphs: [
          "Le site www.hapto.fr s'engage à rendre ses sites internet accessibles conformément à l'article 47 de la loi n°2005-102 du 11 février 2005.",
          "À ce jour, le site est en cours d'évaluation pour sa conformité avec le Référentiel Général d'Amélioration de l'Accessibilité (RGAA).",
        ],
      },
      {
        heading: "2. Nos engagements",
        paragraphs: [
          "Nous travaillons activement, avec notre développeur Clement Boscher, à l'amélioration de l'expérience utilisateur pour tous, notamment sur les contrastes de couleurs adaptés, la navigation au clavier pour le configurateur et les balises alt sur nos images de modules.",
        ],
      },
      {
        heading: "3. Contact et retours",
        paragraphs: [
          "Si vous n'arrivez pas à accéder à un contenu ou à un service de notre site, notamment notre configurateur de planche, vous pouvez nous contacter pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.",
        ],
        items: [
          {
            label: "E-mail",
            content: "contact@hapto.fr",
          },
          {
            label: "Téléphone",
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

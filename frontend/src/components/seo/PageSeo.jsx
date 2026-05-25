import { Helmet } from "react-helmet-async";

function PageSeo({
  title,
  description,
  url,
  image = "",
  imageAlt = "",
  type = "website",
}) {
  const hasImage = Boolean(image);

  return (
    <Helmet>
      <html lang="fr" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content="HAPTO" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />

      {hasImage ? <meta property="og:image" content={image} /> : null}
      {hasImage && imageAlt ? (
        <meta property="og:image:alt" content={imageAlt} />
      ) : null}

      <meta
        name="twitter:card"
        content={hasImage ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {hasImage ? <meta name="twitter:image" content={image} /> : null}
    </Helmet>
  );
}

export default PageSeo;

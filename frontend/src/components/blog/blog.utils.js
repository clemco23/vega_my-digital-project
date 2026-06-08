const METADATA_LINE_PATTERN =
  /^(titre|meta description|mots-cl[eé]s cibl[eé]s)\s*:/i;
const IMAGE_LINE_PATTERN = /^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/i;

const normalizeLine = (line) => line.replace(/\s+/g, " ").trim();

const isMetadataLine = (line) => METADATA_LINE_PATTERN.test(line);

const isSectionHeading = (line) =>
  /^(introduction|conclusion)$/i.test(line) || /^\d+\.\s+/.test(line);

const isColonSubheading = (line) => line.length <= 110 && /:$/.test(line);

const isStandaloneSubheading = (line) => {
  if (line.length > 90 || /[.!?;:]$/.test(line) || /^\d+\.\s+/.test(line)) {
    return false;
  }

  const wordCount = line.split(/\s+/).length;

  return wordCount >= 3 && wordCount <= 12;
};

const isQuoteLine = (line) =>
  /^["“].+["”]$/.test(line) || /^>+\s*/.test(line);

const isImageLine = (line) => IMAGE_LINE_PATTERN.test(line);

const cleanListItem = (line) =>
  line.replace(/^[-*•]\s*/, "").replace(/^\d+\)\s*/, "").trim();

const isListCandidateLine = (line) => {
  if (/^[-*•]\s+/.test(line) || /^\d+\)\s+/.test(line)) {
    return true;
  }

  if (/^[A-ZÀ-ÖØ-Ý][^:]{0,70}\s:\s+/.test(line)) {
    return true;
  }

  return line.length <= 220 && !/[.!?]$/.test(line);
};

const isTableCandidate = (lines) =>
  lines.length >= 6 &&
  lines.length % 2 === 0 &&
  lines.every((line) => line.length <= 96 && !/[.!?]$/.test(line));

const buildTableBlock = (lines) => ({
  type: "table",
  headers: [lines[0], lines[1]],
  rows: lines.slice(2).reduce((rows, line, index, array) => {
    if (index % 2 === 0 && array[index + 1]) {
      rows.push([line, array[index + 1]]);
    }

    return rows;
  }, []),
});

export const formatBlogDate = (value) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const getBlogExcerpt = (blog) => {
  if (blog?.metaDescription?.trim()) {
    return blog.metaDescription.trim();
  }

  const firstContentBlock = String(blog?.content || "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find(Boolean);

  if (!firstContentBlock) {
    return "Explorer l'article complet sur le journal Hapto.";
  }

  if (firstContentBlock.length <= 168) {
    return firstContentBlock;
  }

  return `${firstContentBlock.slice(0, 165).trim()}...`;
};

export const getBlogCoverImage = (blog, fallbackImage) =>
  blog?.picture || fallbackImage;

export const buildBlogContentBlocks = (content) => {
  const lines = String(content || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(normalizeLine);

  const blocks = [];
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];
    const previousBlock = blocks[blocks.length - 1];
    const followsListIntro =
      previousBlock?.type === "paragraph" &&
      /:$/.test(previousBlock.value || "");

    if (!line || isMetadataLine(line)) {
      lineIndex += 1;
      continue;
    }

    if (isImageLine(line)) {
      const [, alt, src] = line.match(IMAGE_LINE_PATTERN) || [];
      blocks.push({
        type: "image",
        alt: alt || "Illustration de l'article",
        src,
      });
      lineIndex += 1;
      continue;
    }

    if (isSectionHeading(line)) {
      blocks.push({ type: "heading", value: line });
      lineIndex += 1;
      continue;
    }

    if (
      (isColonSubheading(line) || isStandaloneSubheading(line)) &&
      previousBlock?.type !== "subheading" &&
      !followsListIntro
    ) {
      blocks.push({ type: "subheading", value: line });
      lineIndex += 1;
      continue;
    }

    if (isQuoteLine(line)) {
      blocks.push({
        type: "quote",
        value: line.replace(/^>\s*/, "").replace(/^["“]|["”]$/g, ""),
      });
      lineIndex += 1;
      continue;
    }

    const textGroup = [];

    while (lineIndex < lines.length) {
      const currentLine = lines[lineIndex];

      if (!currentLine || isMetadataLine(currentLine) || isImageLine(currentLine)) {
        break;
      }

      if (isSectionHeading(currentLine) || isQuoteLine(currentLine)) {
        break;
      }

      if (isColonSubheading(currentLine)) {
        break;
      }

      if (
        isStandaloneSubheading(currentLine) &&
        previousBlock?.type !== "subheading" &&
        !followsListIntro
      ) {
        break;
      }

      textGroup.push(currentLine);
      lineIndex += 1;
    }

    if (textGroup.length === 0) {
      lineIndex += 1;
      continue;
    }

    if (isTableCandidate(textGroup)) {
      blocks.push(buildTableBlock(textGroup));
      continue;
    }

    const shouldRenderAsList =
      textGroup.some((groupLine) => /^[-*•]\s+/.test(groupLine)) ||
      ((previousBlock?.type === "subheading" || followsListIntro) &&
        textGroup.length > 1 &&
        textGroup.every(isListCandidateLine));

    if (shouldRenderAsList) {
      blocks.push({
        type: "list",
        items: textGroup.map(cleanListItem),
      });
      continue;
    }

    textGroup.forEach((groupLine, groupIndex) => {
      blocks.push({
        type: "paragraph",
        value: groupLine,
        isLead: blocks.length === 0 || (previousBlock?.type === "heading" && groupIndex === 0),
      });
    });
  }

  return blocks;
};

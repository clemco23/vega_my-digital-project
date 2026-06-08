const METADATA_LINE_PATTERN =
  /^(titre|meta description|mots-cl[e\u00e9]s cibl[e\u00e9]s)\s*:/i;
const IMAGE_LINE_PATTERN = /^!\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/i;
const NUMBERED_LINE_PATTERN = /^\d+\.\s+/;
const INLINE_BOLD_MARKER_PATTERN = /(\*\*|__)/;
const INLINE_BOLD_PATTERN = /(\*\*|__)(.+?)\1/g;
const BULLET_ITEM_PATTERN = /^[-*\u2022]\s+/;
const UPPERCASE_LATIN_PATTERN = /^[A-Z\u00c0-\u00de]/;
const WRAPPING_PUNCTUATION_PATTERN =
  /^[("'`\u00ab\u201c]+|[),;:.!?'"`\u00bb\u201d]+$/g;

const normalizeLine = (line) => line.replace(/\s+/g, " ").trim();

const isMetadataLine = (line) => METADATA_LINE_PATTERN.test(line);

const isNumberedSectionHeading = (line) => {
  if (!NUMBERED_LINE_PATTERN.test(line)) {
    return false;
  }

  const headingValue = line.replace(NUMBERED_LINE_PATTERN, "").trim();
  const wordCount = headingValue.split(/\s+/).filter(Boolean).length;

  return (
    headingValue.length <= 90 &&
    wordCount <= 10 &&
    !/[,:;.!?]/.test(headingValue)
  );
};

const isSectionHeading = (line) =>
  /^(introduction|conclusion)$/i.test(line) || isNumberedSectionHeading(line);

const isColonSubheading = (line) => line.length <= 110 && /:$/.test(line);

const isStandaloneSubheading = (line) => {
  if (line.length > 90 || /[.!?;:]$/.test(line) || NUMBERED_LINE_PATTERN.test(line)) {
    return false;
  }

  const wordCount = line.split(/\s+/).length;

  return wordCount >= 3 && wordCount <= 12;
};

const isQuoteLine = (line) =>
  /^["\u201c].+["\u201d]$/.test(line) || /^>+\s*/.test(line);

const isImageLine = (line) => IMAGE_LINE_PATTERN.test(line);

const cleanListItem = (line) =>
  line.replace(BULLET_ITEM_PATTERN, "").replace(/^\d+\)\s*/, "").trim();

const stripEdgePunctuation = (token) =>
  token.replace(WRAPPING_PUNCTUATION_PATTERN, "");

const autoEmphasizeNumberedLead = (line) => {
  if (!NUMBERED_LINE_PATTERN.test(line) || INLINE_BOLD_MARKER_PATTERN.test(line)) {
    return line;
  }

  const numberedMatch = line.match(/^(\d+\.)\s+(.+)$/);

  if (!numberedMatch) {
    return line;
  }

  const [, itemNumber, remainder] = numberedMatch;

  if (remainder.length < 48 || !/[,:;]/.test(remainder)) {
    return line;
  }

  const words = remainder.split(/\s+/).filter(Boolean);
  const splitCandidates = [];
  const scanLimit = Math.min(words.length, 8);

  for (let index = 1; index < scanLimit; index += 1) {
    const token = stripEdgePunctuation(words[index]);

    if (UPPERCASE_LATIN_PATTERN.test(token)) {
      splitCandidates.push(index);
    }
  }

  if (splitCandidates.length === 0) {
    return line;
  }

  const splitIndex = splitCandidates[splitCandidates.length - 1];
  const titleWords = words.slice(0, splitIndex);
  const bodyWords = words.slice(splitIndex);

  if (titleWords.length < 3 || titleWords.length > 8 || bodyWords.length < 4) {
    return line;
  }

  return `**${itemNumber} ${titleWords.join(" ")}** ${bodyWords.join(" ")}`;
};

const isListCandidateLine = (line) => {
  if (BULLET_ITEM_PATTERN.test(line) || /^\d+\)\s+/.test(line)) {
    return true;
  }

  if (/^[A-Z\u00c0-\u00de][^:]{0,70}\s:\s+/.test(line)) {
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

const stripInlineFormatting = (value) =>
  String(value || "").replace(INLINE_BOLD_PATTERN, "$2");

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

  const normalizedExcerpt = stripInlineFormatting(firstContentBlock);

  if (normalizedExcerpt.length <= 168) {
    return normalizedExcerpt;
  }

  return `${normalizedExcerpt.slice(0, 165).trim()}...`;
};

export const getBlogCoverImage = (blog, fallbackImage) =>
  blog?.picture || fallbackImage;

export const buildBlogInlineParts = (value) => {
  const normalizedValue = String(value || "");
  const parts = [];
  let cursor = 0;

  normalizedValue.replace(INLINE_BOLD_PATTERN, (match, _marker, content, offset) => {
    if (offset > cursor) {
      parts.push({
        type: "text",
        value: normalizedValue.slice(cursor, offset),
      });
    }

    parts.push({
      type: "strong",
      value: content,
    });
    cursor = offset + match.length;

    return match;
  });

  if (cursor < normalizedValue.length) {
    parts.push({
      type: "text",
      value: normalizedValue.slice(cursor),
    });
  }

  return parts;
};

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
        value: line.replace(/^>\s*/, "").replace(/^["\u201c]|["\u201d]$/g, ""),
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
      textGroup.some((groupLine) => BULLET_ITEM_PATTERN.test(groupLine)) ||
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
        value: autoEmphasizeNumberedLead(groupLine),
        isLead:
          blocks.length === 0 ||
          (previousBlock?.type === "heading" && groupIndex === 0),
      });
    });
  }

  return blocks;
};

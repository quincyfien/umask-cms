import sanitizeHtml from "sanitize-html";

const ALLOWED_IFRAME_PREFIXES = [
  "https://www.youtube.com/embed/",
  "https://www.youtube-nocookie.com/embed/",
  "https://player.vimeo.com/video/",
  "https://w.soundcloud.com/player/",
  "https://www.google.com/maps/embed/",
  "https://open.spotify.com/embed/",
];

const ALLOWED_TAGS = [
  "p",
  "br",
  "hr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "u",
  "s",
  "blockquote",
  "pre",
  "code",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "figure",
  "figcaption",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "div",
  "span",
  "iframe",
];

export function sanitizeBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt", "title", "width", "height"],
      code: ["class"],
      div: ["class"],
      span: ["class"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
      iframe: [
        "src",
        "width",
        "height",
        "frameborder",
        "allow",
        "allowfullscreen",
        "title",
      ],
    },
    allowedSchemes: ["http", "https"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    disallowedTagsMode: "discard",
    exclusiveFilter: (frame) => {
      if (frame.tag !== "iframe") return false;
      const src = (frame.attribs.src as string | undefined) ?? "";
      return !ALLOWED_IFRAME_PREFIXES.some((p) => src.startsWith(p));
    },
  });
}

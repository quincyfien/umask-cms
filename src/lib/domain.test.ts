import { describe, expect, it } from "vitest";
import { slugify } from "./slug";
import { getTransition } from "./content";
import { passwordIssues } from "./password";
import { sanitizeBody } from "./sanitize";

describe("slugify", () => {
  it("lowercases and replaces non-alphanumerics with hyphens", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("  Spaced  Out  ")).toBe("spaced-out");
  });
});

describe("content transitions", () => {
  it("allows DRAFT -> REVIEW and DRAFT -> PUBLISHED", () => {
    expect(getTransition("DRAFT", "REVIEW").allowed).toBe(true);
    expect(getTransition("DRAFT", "PUBLISHED").allowed).toBe(true);
  });

  it("rejects PUBLISHED -> REVIEW", () => {
    expect(getTransition("PUBLISHED", "REVIEW").allowed).toBe(false);
  });

  it("requires a note for REVIEW -> DRAFT (reject)", () => {
    expect(getTransition("REVIEW", "DRAFT").requireNote).toBe(true);
  });
});

describe("password policy", () => {
  it("rejects weak passwords", () => {
    expect(passwordIssues("password")).not.toHaveLength(0);
    expect(passwordIssues("Password1")).not.toHaveLength(0);
  });

  it("accepts a strong password", () => {
    expect(passwordIssues("Str0ng!Pass#word")).toHaveLength(0);
  });
});

describe("sanitizer", () => {
  it("removes script tags and on* attributes", () => {
    const out = sanitizeBody('<p onclick="x()">hi<script>alert(1)</script></p>');
    expect(out).not.toContain("<script");
    expect(out).not.toContain("onclick");
  });

  it("strips disallowed iframe hosts", () => {
    const out = sanitizeBody('<iframe src="https://evil.example/embed/x"></iframe>');
    expect(out).not.toContain("iframe");
  });

  it("keeps allowed iframe hosts", () => {
    const out = sanitizeBody('<iframe src="https://www.youtube.com/embed/abc" title="x"></iframe>');
    expect(out).toContain("youtube.com/embed/abc");
  });
});

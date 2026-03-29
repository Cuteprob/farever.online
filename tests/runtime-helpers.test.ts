import test from "node:test";
import assert from "node:assert/strict";
import { normalizeHostname, sanitizeMarkdownDomProps, shouldLoadThirdPartyScripts } from "@/lib/runtime-helpers";

test("normalizeHostname strips protocol, port, path, and www prefix", () => {
  assert.equal(normalizeHostname("https://www.scritchyscratchy.click:443/path"), "scritchyscratchy.click");
});

test("shouldLoadThirdPartyScripts only enables scripts on the canonical host", () => {
  assert.equal(shouldLoadThirdPartyScripts("scritchyscratchy.click", "https://scritchyscratchy.click"), true);
  assert.equal(shouldLoadThirdPartyScripts("scritchyscratchy-click.pages.dev", "https://scritchyscratchy.click"), false);
  assert.equal(shouldLoadThirdPartyScripts("localhost:3000", "https://scritchyscratchy.click"), false);
});

test("sanitizeMarkdownDomProps removes internal react-markdown props but keeps valid DOM props", () => {
  const result = sanitizeMarkdownDomProps({
    node: { type: "element" },
    inline: true,
    index: 2,
    checked: false,
    className: "prose",
    title: "Example",
    "data-test-id": "keep-me",
  });

  assert.deepEqual(result, {
    className: "prose",
    title: "Example",
    "data-test-id": "keep-me",
  });
});

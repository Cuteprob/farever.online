import test from "node:test";
import assert from "node:assert/strict";
import { normalizeHostname, sanitizeMarkdownDomProps, shouldLoadThirdPartyScripts } from "@/lib/runtime-helpers";

test("normalizeHostname strips protocol, port, path, and www prefix", () => {
  assert.equal(normalizeHostname("https://www.farever.online:443/path"), "farever.online");
});

test("shouldLoadThirdPartyScripts only enables scripts on the canonical host", () => {
  assert.equal(shouldLoadThirdPartyScripts("farever.online", "https://farever.online"), true);
  assert.equal(shouldLoadThirdPartyScripts("farever-online.pages.dev", "https://farever.online"), false);
  assert.equal(shouldLoadThirdPartyScripts("localhost:3000", "https://farever.online"), false);
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

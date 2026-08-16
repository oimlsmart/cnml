/**
 * Tests for trust-graph path enumeration (SIGNATIF Phase 8).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  findAllPaths,
  anchorBundle,
  rootDiversity,
  strongestPathFor,
  type SignatureChainLink,
} from "./trust-graph.ts";

function link(
  subject: string,
  issuerParents: string[],
  dimension?: string,
): SignatureChainLink {
  // issuerFingerprint is derived from the single-parent case; for
  // multi-parent nodes the first parent is the claimed issuer.
  return {
    subjectFingerprint: subject,
    issuerFingerprint: issuerParents[0] ?? "",
    issuerParents,
    dimension,
  };
}

test("linear chain yields exactly one path", () => {
  // instance → model → IA → root(anchor)
  const bundle = anchorBundle(["root"], {
    ia: ["root"],
    model: ["ia"],
  });
  const paths = findAllPaths(
    { signatures: [link("instance", ["model"], "data")] },
    bundle,
  );
  assert.equal(paths.length, 1);
  assert.equal(paths[0].root_anchor_fingerprint, "root");
  assert.equal(paths[0].path_length, 3);
  assert.deepEqual(paths[0].dimensions, ["data"]);
});

test("a diamond DAG yields two paths", () => {
  //        root (anchor)
  //        /    \
  //      ia-a   ia-b
  //        \    /
  //        signer
  const bundle = anchorBundle(["root"], {
    "ia-a": ["root"],
    "ia-b": ["root"],
    signer: ["ia-a", "ia-b"],
  });
  const paths = findAllPaths({ signatures: [link("signer", ["ia-a", "ia-b"], "data")] }, bundle);
  assert.equal(paths.length, 2);
  assert.equal(rootDiversity(paths), 1); // both end at the same root
});

test("cross-recognition across two roots yields root diversity 2", () => {
  const bundle = anchorBundle(["root-oiml", "root-other"], {
    ia: ["root-oiml"],
    "ia-recognized": ["root-other"],
    signer: ["ia", "ia-recognized"],
  });
  const paths = findAllPaths({ signatures: [link("signer", ["ia", "ia-recognized"])] }, bundle);
  assert.equal(paths.length, 2);
  assert.equal(rootDiversity(paths), 2);
  const roots = paths.map((p) => p.root_anchor_fingerprint).sort();
  assert.deepEqual(roots, ["root-oiml", "root-other"]);
});

test("cycles terminate", () => {
  const bundle = anchorBundle(["root"], {
    a: ["b", "root"],
    b: ["a", "root"],
  });
  const paths = findAllPaths({ signatures: [link("s", ["a"])] }, bundle);
  // s → a → root and s → a → b → root
  assert.equal(paths.length, 2);
});

test("dead ends (unknown issuer) produce no path", () => {
  const bundle = anchorBundle(["root"], {});
  const paths = findAllPaths({ signatures: [link("orphan", ["nowhere"])] }, bundle);
  assert.equal(paths.length, 0);
});

test("multiple signatures each enumerate", () => {
  const bundle = anchorBundle(["root"], { ia: ["root"] });
  const paths = findAllPaths(
    {
      signatures: [
        link("instance", ["model"], "data"),
        link("tester", ["ia"], "person"),
      ],
    },
    bundle,
  );
  // instance has no model edge → only the tester path resolves.
  assert.equal(paths.length, 1);
  assert.deepEqual(paths[0].dimensions, ["person"]);
});

test("strongestPathFor picks the longest path attesting the dimension", () => {
  const bundle = anchorBundle(["root"], { ia: ["root"], model: ["ia"] });
  const paths = findAllPaths(
    { signatures: [link("instance", ["model"], "data")] },
    bundle,
  );
  const strongest = strongestPathFor(paths, "data");
  assert.ok(strongest);
  assert.equal(strongest.path_length, 3);
  assert.equal(strongestPathFor(paths, "person"), undefined);
});

test("custom validateLink prunes invalid edges", () => {
  const bundle = anchorBundle(["root"], { ia: ["root"], bad: ["root"] });
  const paths = findAllPaths(
    { signatures: [link("signer", ["ia", "bad"])] },
    bundle,
    (_link, parent) => parent !== "bad",
  );
  assert.equal(paths.length, 1);
  assert.equal(paths[0].root_anchor_fingerprint, "root");
});

import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";

/**
 * `file` — the base file icon, just body + folded corner. The
 * fileEnvelope motion covers both anatomical roles: the body does a
 * gentle paper-settle (scale dip + y bob) and the corner does a
 * dog-ear flick (rotate around its fold hinge).
 *
 * The same fileEnvelope motion is the host for every other file-*
 * composite. Their signatures compose `fileEnvelope` alongside their
 * own badge-subject motions (file-code's chevrons, file-search's
 * loupe, file-cog's gear, etc.).
 */
export default compose({
  motions: [fileEnvelope],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});

/**
 * The CNML brand config — the identity values the site injects into the
 * house shell's header and footer (one brand object passed to the one
 * layout mount, TODO.ia/03 item 5). The shape is the package's
 * BrandConfig (@oimlsmart/site-shell/config). No signInHref: the site
 * serves no authenticated surface, so no sign-in link renders anywhere.
 * The logo pair is the site's own CNML box mark under its public
 * directory, addressed front-door absolute so the mark renders from any
 * origin.
 */
import type { BrandConfig } from '@oimlsmart/site-shell/config'
import { SITE } from './site-meta'

export const BRAND: BrandConfig = {
  brandName: SITE.title,
  logoLight: `${SITE.url}${SITE.base}/img/oiml-logo_cnml-box-light.svg`,
  logoDark: `${SITE.url}${SITE.base}/img/oiml-logo_cnml-box-dark.svg`,
  homeHref: `${SITE.url}${SITE.base}/`,
  themeColor: '#004996',
}

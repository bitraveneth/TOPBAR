import fs from 'node:fs/promises';
import path from 'node:path';
import type { Core } from '@strapi/strapi';

type JsonRecord = Record<string, unknown>;
type JsonUnknownArray = unknown[];

const UID_NAVIGATION = 'api::navigation.navigation';
const UID_HOMEPAGE = 'api::homepage.homepage';
const UID_FOOTER = 'api::footer.footer';
const UID_SITE_SETTING = 'api::site-setting.site-setting';
const UID_PRODUCT = 'api::product.product';

async function loadJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

async function seedSingleType(strapi: Core.Strapi, uid: string, data: JsonRecord) {
  const existing = await strapi.db.query(uid).findOne({ where: {} });
  if (existing) return;

  await strapi.db.query(uid).create({
    data: {
      ...data,
      publishedAt: new Date(),
    },
  });
}

async function seedProducts(strapi: Core.Strapi, products: JsonRecord[]) {
  const count = await strapi.db.query(UID_PRODUCT).count({ where: {} });
  if (count > 0) return;

  for (const product of products) {
    const payload = {
      name: product.name,
      slug: product.slug,
      category: product.category,
      tagline: product.tagline,
      description: product.description,
      image: product.image,
      showcaseImagePosition: product.showcaseImagePosition,
      specItems: mapSpecItems(product.specs),
      featuresEditor: asArray(product.features),
      featureShowcaseEditor: asArray(product.featureShowcase),
      colorVariantsEditor: asArray(product.colorVariants),
      showProductFeaturesHeading:
        typeof product.showProductFeaturesHeading === 'boolean' ? product.showProductFeaturesHeading : true,
      featured: Boolean(product.featured),
      isNew: Boolean(product.isNew),
    };
    await strapi.db.query(UID_PRODUCT).create({
      data: {
        ...payload,
        publishedAt: new Date(),
      },
    });
  }
}

function asArray(value: unknown): JsonUnknownArray {
  return Array.isArray(value) ? value : [];
}

function mapMenuItems(nav: { primaryNav: unknown[] }) {
  return asArray(nav.primaryNav).map((item) => {
    const node = item as JsonRecord;
    return {
      label: node.label,
      path: node.path,
      children: asArray(node.children).map((group) => {
        const g = group as JsonRecord;
        return {
          title: g.title,
          links: asArray(g.links).map((link) => {
            const l = link as JsonRecord;
            return { label: l.label, path: l.path };
          }),
        };
      }),
    };
  });
}

function mapSpecItems(specs: unknown) {
  return asArray(specs).map((spec) => ({ label: String(spec) }));
}


export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Seed only when project content is still empty; this keeps later admin edits intact.
    try {
      const sourceDataDir = path.resolve(process.cwd(), '..', 'src', 'data');
      const [navigation, homeSections, products, homeBlogPreview, lovedByYou] = await Promise.all([
        loadJsonFile<{ primaryNav: unknown[] }>(path.join(sourceDataDir, 'navigation.json')),
        loadJsonFile<JsonRecord>(path.join(sourceDataDir, 'homeSections.json')),
        loadJsonFile<JsonRecord[]>(path.join(sourceDataDir, 'products.json')),
        loadJsonFile<JsonRecord>(path.join(sourceDataDir, 'homeBlogPreview.json')),
        loadJsonFile<JsonRecord>(path.join(sourceDataDir, 'lovedByYou.json')),
      ]);

      await seedSingleType(strapi, UID_NAVIGATION, {
        menuItems: mapMenuItems(navigation),
      });

      await seedSingleType(strapi, UID_HOMEPAGE, {
        heroSlidesEditor: asArray(homeSections.heroSlides),
        featuredProductsEditor: asArray(homeSections.featuredProducts),
        categoriesEditor: asArray(homeSections.categories),
        trendingEditor: asArray(homeSections.trending),
        brandValuesEditor: asArray(homeSections.brandValues),
        testimonialsEditor: asArray(homeSections.testimonials),
        topbarTagline: homeSections.topbarTagline,
        homeBlogPreview,
        lovedByYou,
        newsletter: {
          title: 'Taste the next drop first.',
          emailLabel: 'Email',
          placeholder: 'you@example.com',
          buttonJoin: 'Join Drop List',
          buttonJoined: 'Joined',
        },
      });

      await seedSingleType(strapi, UID_FOOTER, {
        columns: [
          {
            title: 'Products',
            links: [
              { label: 'TOPBAR 8000 Puffs', path: '/products/topbar-8000-puffs' },
              { label: 'TOPBAR 40000 Puffs', path: '/products/topbar-40000-puffs' },
              { label: 'All Products', path: '/products' },
            ],
          },
          {
            title: 'About Us',
            links: [
              { label: 'Our Brand', path: '/about' },
              { label: 'News & Events', path: '/news' },
              { label: 'Blog', path: '/news' },
              { label: 'Join Us', path: '/about' },
            ],
          },
          {
            title: 'Support',
            links: [
              { label: 'FAQ', path: '/support' },
              { label: 'Warranty', path: '/support' },
              { label: 'Contact Us', path: '/support' },
              { label: 'Verify Products', path: '/verify-products' },
              { label: 'Downloads', path: '/downloads' },
            ],
          },
        ],
        legalLinks: [
          { label: 'Privacy Policy', path: '/compliance' },
          { label: 'Terms of Use', path: '/compliance' },
          { label: 'Cookie Policy', path: '/compliance' },
        ],
        copyright: '© 2026 TOPBAR. All Rights Reserved.',
        giantWordmark: 'TOP BAR',
      });

      await seedSingleType(strapi, UID_SITE_SETTING, {
        siteName: 'TOPBAR',
        tagline:
          'TOPBAR is unique—built different with up to 9,900 puffs and a flavor range so wide, average disposables never had a chance.',
        settings: {
          warningBold: 'WARNING:',
          warningText: ' This product contains nicotine. Nicotine is an addictive chemical.',
          headerLogo: '/images/topbar-logo.png',
          headerLogoAlt: 'TOPBAR',
        },
      });

      await seedProducts(strapi, products);

      strapi.log.info('[seed] Step 3 content seeded into Strapi content types');
    } catch (error) {
      strapi.log.error(`[seed] Failed to seed initial content: ${String(error)}`);
    }
  },
};

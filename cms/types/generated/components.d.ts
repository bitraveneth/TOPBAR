import type { Schema, Struct } from '@strapi/strapi';

export interface FooterFooterLinkGroup extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_link_groups';
  info: {
    displayName: 'Footer Link Group';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.nav-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeBrandValue extends Struct.ComponentSchema {
  collectionName: 'components_home_brand_values';
  info: {
    displayName: 'Brand Value';
  };
  attributes: {
    keyword: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface HomeCategoryItem extends Struct.ComponentSchema {
  collectionName: 'components_home_category_items';
  info: {
    displayName: 'Category Item';
  };
  attributes: {
    image: Schema.Attribute.String;
    link: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeFeaturedProduct extends Struct.ComponentSchema {
  collectionName: 'components_home_featured_products';
  info: {
    displayName: 'Featured Product';
  };
  attributes: {
    image: Schema.Attribute.String;
    link: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    tag: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_home_hero_slides';
  info: {
    displayName: 'Hero Slide';
  };
  attributes: {
    cta: Schema.Attribute.String;
    image: Schema.Attribute.String;
    link: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    tag: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_home_testimonials';
  info: {
    displayName: 'Testimonial';
  };
  attributes: {
    author: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface HomeTextLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_home_text_link_items';
  info: {
    displayName: 'Text Link Item';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.String;
  };
}

export interface NavigationNavGroup extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_groups';
  info: {
    displayName: 'Nav Group';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.nav-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationNavItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_nav_items';
  info: {
    displayName: 'Nav Item';
  };
  attributes: {
    children: Schema.Attribute.Component<'navigation.nav-group', true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    path: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductColorVariant extends Struct.ComponentSchema {
  collectionName: 'components_product_color_variants';
  info: {
    displayName: 'Color Variant';
  };
  attributes: {
    hex: Schema.Attribute.String;
    image: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_product_feature_items';
  info: {
    displayName: 'Feature Item';
  };
  attributes: {
    alt: Schema.Attribute.String;
    className: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.String;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedNavLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_links';
  info: {
    description: 'Label and path pair';
    displayName: 'Nav Link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    path: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer.footer-link-group': FooterFooterLinkGroup;
      'home.brand-value': HomeBrandValue;
      'home.category-item': HomeCategoryItem;
      'home.featured-product': HomeFeaturedProduct;
      'home.hero-slide': HomeHeroSlide;
      'home.testimonial': HomeTestimonial;
      'home.text-link-item': HomeTextLinkItem;
      'navigation.nav-group': NavigationNavGroup;
      'navigation.nav-item': NavigationNavItem;
      'product.color-variant': ProductColorVariant;
      'product.feature-item': ProductFeatureItem;
      'shared.nav-link': SharedNavLink;
    }
  }
}

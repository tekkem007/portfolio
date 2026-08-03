import { profile, SITE_URL } from './content/profile';
import { projects, flagshipProjects } from './content/projects';

/**
 * The set of routes that get prerendered, together with the head metadata each
 * one needs. Adding a flagship project to content/projects.ts automatically
 * adds its page here — there is no second list to keep in sync.
 */

export interface RouteMeta {
  /** App path, always with a trailing slash. */
  path: string;
  /** Output file relative to dist/. */
  file: string;
  title: string;
  description: string;
  /** Absolute URL used for canonical and Open Graph. */
  canonical: string;
  /** Absolute URL of the social share image. */
  image: string;
  /** JSON-LD injected into the page. */
  jsonLd: Record<string, unknown>;
  /** Excluded from sitemap.xml (the 404 page). */
  noIndex?: boolean;
}

const socialImage = (id: string) => `${SITE_URL}/media/${id}.jpg`;

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: 'Unreal Engine Artist & Technical Artist',
  url: `${SITE_URL}/`,
  email: `mailto:${profile.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Analyzer Tensor Technologies',
  },
  alumniOf: [
    { '@type': 'EducationalOrganization', name: 'MAAC, Girish Park, Kolkata' },
    { '@type': 'EducationalOrganization', name: 'Midnapore College, Vidyasagar University' },
  ],
  knowsAbout: [
    'Unreal Engine 5',
    'Environment art',
    'Real-time lighting',
    'Lumen',
    'Blender',
    'Substance 3D Painter',
    'Real-time optimisation',
  ],
  sameAs: [profile.links.artstation, profile.links.linkedin, profile.links.github],
};

const homeRoute: RouteMeta = {
  path: '/',
  file: 'index.html',
  title: profile.seo.title,
  description: profile.seo.description,
  canonical: `${SITE_URL}/`,
  image: socialImage(projects[0].cover),
  jsonLd: personJsonLd,
};

const projectRoutes: RouteMeta[] = flagshipProjects.map((project) => ({
  path: `/work/${project.slug}/`,
  file: `work/${project.slug}/index.html`,
  title: `${project.title} — ${profile.name}`,
  description: project.summary,
  canonical: `${SITE_URL}/work/${project.slug}/`,
  image: socialImage(project.cover),
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    abstract: project.summary,
    url: `${SITE_URL}/work/${project.slug}/`,
    image: socialImage(project.cover),
    dateCreated: project.year,
    creator: { '@type': 'Person', name: profile.name, url: `${SITE_URL}/` },
    keywords: [...project.software, ...project.tags].join(', '),
    ...(project.externalUrl ? { sameAs: project.externalUrl } : {}),
  },
}));

const notFoundRoute: RouteMeta = {
  path: '/404/',
  file: '404.html',
  title: `Page not found — ${profile.name}`,
  description: 'That page does not exist.',
  canonical: `${SITE_URL}/404.html`,
  image: socialImage(projects[0].cover),
  jsonLd: personJsonLd,
  noIndex: true,
};

export const routeManifest: RouteMeta[] = [homeRoute, ...projectRoutes, notFoundRoute];

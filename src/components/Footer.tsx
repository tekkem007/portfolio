import { profile } from '../content/profile';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <p className="rights">
          © {new Date().getFullYear()} {profile.name}. All artwork shown is my own. Some environments incorporate
          licensed third-party library assets; those remain the property of their respective creators.
        </p>
        <nav aria-label="Elsewhere">
          <ul className="site-footer__links">
            <li>
              <a href={profile.links.artstation} rel="me noopener noreferrer" target="_blank">
                ArtStation
              </a>
            </li>
            <li>
              <a href={profile.links.linkedin} rel="me noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.links.github} rel="me noopener noreferrer" target="_blank">
                GitHub
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`}>Email</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

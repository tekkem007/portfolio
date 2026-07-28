import { useEffect, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { profile } from '../content/profile';

const NAV = [
  { label: 'Work', hash: '#work' },
  { label: 'Capabilities', hash: '#capabilities' },
  { label: 'Experience', hash: '#experience' },
  { label: 'About', hash: '#about' },
];

export function Header() {
  const { path } = useRouter();
  const onHome = path === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="shell site-header__inner">
        <Link to="/" className="wordmark" aria-label={`${profile.name} — home`}>
          <b>Vishnu Vardhan Tekkem</b>
          <span>{profile.role}</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__links">
            {NAV.map((item) => (
              <li key={item.hash}>
                {/* On a case-study page these must jump back to the home page
                    first, otherwise the anchor resolves against a page that has
                    no such section. */}
                <a href={onHome ? item.hash : `/${item.hash}`}>{item.label}</a>
              </li>
            ))}
          </ul>
          <a className="btn" href={onHome ? '#contact' : '/#contact'}>
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
}

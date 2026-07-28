import { Link } from '../lib/router';

export function NotFound() {
  return (
    <div className="shell notfound">
      <p className="eyebrow" style={{ justifyContent: 'center' }}>
        404
      </p>
      <h1>That page doesn't exist</h1>
      <p>
        The link may be out of date, or the page may have moved. The work is all reachable from the portfolio home page.
      </p>
      <p>
        <Link className="btn btn--primary" to="/">
          Back to the portfolio
        </Link>
      </p>
    </div>
  );
}

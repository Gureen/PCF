import { Link } from 'react-router';

/**
 * 404 page component for not found routes
 * Displays a friendly error page with an image and link back to home
 * @returns React component for the 404 error page
 */
const Page404 = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <img width={600} src="/assets/404 Error-rafiki.svg" alt="404" />
      <Link
        to="/"
        style={{
          marginTop: '20px',
          fontSize: '18px',
          textDecoration: 'none',
        }}
      >
        Let&apos;s Head Back
      </Link>
    </div>
  );
};

// biome-ignore lint/style/noDefaultExport: Pages are allowed due to routes.ts setup
export default Page404;

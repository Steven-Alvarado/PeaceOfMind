import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" style={styles.homeLink}>
        Go Back to Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center' as const,
    backgroundColor: '#f5f5f5',
    color: '#333',
    padding: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
  },
  homeLink: {
    fontSize: '1rem',
    color: '#007BFF',
    textDecoration: 'none',
    border: '1px solid #007BFF',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    backgroundColor: '#fff',
    transition: 'background-color 0.3s ease',
  },
};

export default ErrorPage;

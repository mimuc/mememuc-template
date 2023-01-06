import { Link } from 'react-router-dom';

export const ErrorPage = () => {
  const code = 'Unknown';
  // TODO: get error
  // TODO: write useful error page
  // TODO: add back button
  return (
    <div className={'flex h-screen'}>
      <div className={'inline-block mx-auto mt-80'}>
        <h1 className={'inline-block text-3xl font-bold mb-4'}>{code} Error</h1>
        <p>An error occurred.</p>
        <Link
          to={'/'}
          className={
            'underline text-blue-600 hover:text-blue-800 visited:text-purple-600 mt-8 inline-block'
          }>
          Start
        </Link>
      </div>
    </div>
  );
};

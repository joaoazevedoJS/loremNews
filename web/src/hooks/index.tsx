import { FC } from 'react';
import { PostProvider } from './usePost';

const Providers: FC = ({ children }) => {
  return <PostProvider>{children}</PostProvider>;
};

export { Providers };

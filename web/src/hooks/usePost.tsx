import { createContext, FC, useContext, useEffect, useState } from 'react';
import { IPost } from '../models/IPost';
import api from '../services/api';

interface IPostContext {
  posts: IPost[];
}

const PostContext = createContext<IPostContext>({} as IPostContext);

const PostProvider: FC = ({ children }) => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    api.get('/posts').then(response => setPosts(response.data));
  }, []);

  return (
    <PostContext.Provider value={{ posts }}>{children}</PostContext.Provider>
  );
};

function usePost(): IPostContext {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error('usePost must be used within an PostProvider');
  }

  return context;
}

export { PostProvider, usePost };

import { FC, useCallback, KeyboardEvent } from 'react';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';

import styles from '../styles/pages/Home.module.scss';

import { IPost } from '../models/IPost';
import { IUser } from '../models/IUser';

import api from '../services/api';

interface HomeProps {
  posts: IPost[];
}

const Home: FC<HomeProps> = ({ posts }) => {
  const router = useRouter();

  const handleNavigateToPost = useCallback(
    (post_id: number) => {
      router.push(`/post/${post_id}`);
    },
    [router],
  );

  const handlePressKeyboard = useCallback(
    ({ key }: KeyboardEvent, post_id: number) => {
      if (key === 'Enter') {
        handleNavigateToPost(post_id);
      }
    },
    [handleNavigateToPost],
  );

  return (
    <main className={styles.container}>
      <ul>
        {posts.map(post => (
          <li key={post.id} className={styles.listProduct}>
            <button
              type="button"
              onClick={() => handleNavigateToPost(post.id)}
              onKeyUp={event => handlePressKeyboard(event, post.id)}
            >
              <strong>{post.title}</strong>

              <p>{post.body}</p>

              {post.author && (
                <span>
                  Por{' '}
                  <Link href={`/user/${post.userId}`}>{post.author.name}</Link>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data: users } = await api.get<IUser[]>('/users');
  const postsResponse = await api.get<IPost[]>('/posts');

  const posts = postsResponse.data.map(post => {
    const userFinder = users.find(user => user.id === post.userId);

    if (userFinder) {
      post.author = userFinder;
    }

    return post;
  });

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60 * 24, // 24h,
  };
};

export default Home;

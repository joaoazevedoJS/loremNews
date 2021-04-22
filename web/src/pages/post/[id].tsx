import {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

import { useRouter } from 'next/router';
import api from '../../services/api';

import styles from '../../styles/pages/post/Post.module.scss';

import { IPost } from '../../models/IPost';
import { IUser } from '../../models/IUser';
import { IComment } from '../../models/IComment';
import { usePost } from '../../hooks/usePost';

interface PostProps {
  post: IPost;
}

const Post: FC<PostProps> = ({ post }) => {
  const router = useRouter();
  const { posts } = usePost();

  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    api
      .get<IComment[]>(`/post/${post.id}/comments`)
      .then(response => setComments(response.data));
  }, [post.id]);

  const readMore = useMemo(() => {
    const postWithoutActualPost = posts.filter(pt => pt.id !== post.id);

    const result: IPost[] = postWithoutActualPost.reduce((acc, value) => {
      if (acc.length < 4) {
        acc.push(value);
      }

      return acc;
    }, []);

    return result;
  }, [post.id, posts]);

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
      <h1>{post.title}</h1>

      {post.author && (
        <span>
          Por <Link href={`/user/${post.userId}`}>{post.author.name}</Link>
        </span>
      )}

      <p>{post.body}</p>

      <section className={styles.morePosts}>
        <h2>Leia mais</h2>

        <ul>
          {readMore.map(postMore => (
            <li key={postMore.id}>
              <button
                type="button"
                onClick={() => handleNavigateToPost(postMore.id)}
                onKeyUp={event => handlePressKeyboard(event, postMore.id)}
              >
                <strong>
                  {postMore.title.substring(0, 20)}
                  {postMore.title.length > 20 && '...'}
                </strong>

                <p>{postMore.body.substring(0, 50)}...</p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.comments}>
        <h2>Comentários</h2>

        <ul>
          {comments.map(comment => (
            <li key={comment.id}>
              <img src="/avatarDefault.png" alt="" />

              <div>
                <strong>{comment.name}</strong>

                <p>{comment.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { data: users } = await api.get<IUser[]>('/users');
    const { data: post } = await api.get<IPost>(`/posts/${params.id}`);

    const userFinder = users.find(user => user.id === post.userId);

    if (userFinder) {
      post.author = userFinder;
    }

    return {
      props: {
        post,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default Post;

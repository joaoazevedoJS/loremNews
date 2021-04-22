import { FC, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';

import api from '../../services/api';

import { usePost } from '../../hooks/usePost';

import { ButtonPost } from '../../components/ButtonPost';

import styles from '../../styles/pages/post/Post.module.scss';

import { IPost } from '../../models/IPost';
import { IUser } from '../../models/IUser';
import { IComment } from '../../models/IComment';

interface PostProps {
  post: IPost;
}

const Post: FC<PostProps> = ({ post }) => {
  const { posts } = usePost();

  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    api
      .get<IComment[]>(`/posts/${post.id}/comments`)
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
              <ButtonPost post={postMore} />
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
    const { data: post } = await api.get<IPost>(`/posts/${params.id}`);
    const { data: user } = await api.get<IUser>(`/users/${post.userId}`);

    if (user) {
      post.author = user;
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

import { GetServerSideProps } from 'next';
import { FC, useEffect, useState } from 'react';

import api from '../../services/api';

import { ButtonPost } from '../../components/ButtonPost';

import { IPost } from '../../models/IPost';
import { IUser } from '../../models/IUser';

import styles from '../../styles/pages/user/User.module.scss';

interface UserProps {
  user: IUser;
}

const User: FC<UserProps> = ({ user }) => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    api
      .get(`/users/${user.id}/posts`)
      .then(response => setPosts(response.data));
  }, [user]);

  return (
    <main className={styles.container}>
      <section className={styles.profile}>
        <img src="/avatarDefault.png" alt={user.username} />

        <div>
          <h1>{user.name}</h1>

          <span>@{user.username}</span>

          <p>
            Atualmente trabalhando em: <strong>{user.company.name}</strong>
          </p>
        </div>
      </section>

      <section className={styles.posts}>
        <h2>Post&apos;s</h2>

        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <ButtonPost post={post} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.info}>
        <h2>Informações Adicionais: </h2>

        <ul>
          <li>Website: {user.website}</li>
          <li>E-mail de contato: {user.email}</li>
          <li>Telefone: {user.phone}</li>
        </ul>
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const { data: user } = await api.get<IUser>(`/users/${params.id}`);

    return {
      props: {
        user,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default User;

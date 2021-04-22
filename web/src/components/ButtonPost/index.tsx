import { ButtonHTMLAttributes, FC, KeyboardEvent, useCallback } from 'react';
import { useRouter } from 'next/router';

import { IPost } from '../../models/IPost';

import styles from './styles.module.scss';

interface ButtonPostProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  post: IPost;
}

const ButtonPost: FC<ButtonPostProps> = ({ post, ...rest }) => {
  const router = useRouter();

  const handleNavigateToPost = useCallback(() => {
    router.push(`/post/${post.id}`);
  }, [router, post]);

  const handlePressKeyboard = useCallback(
    ({ key }: KeyboardEvent) => {
      if (key === 'Enter') {
        handleNavigateToPost();
      }
    },
    [handleNavigateToPost],
  );

  return (
    <button
      className={styles.container}
      onClick={handleNavigateToPost}
      onKeyUp={handlePressKeyboard}
      type="button"
      {...rest}
    >
      <strong>
        {post.title.substring(0, 20)}
        {post.title.length > 20 && '...'}
      </strong>

      <p>{post.body.substring(0, 50)}...</p>
    </button>
  );
};

export { ButtonPost };

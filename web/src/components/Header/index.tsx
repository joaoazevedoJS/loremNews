import { FC } from 'react';
import Link from 'next/link';

import styles from './styles.module.scss';

const Header: FC = () => {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Link href="/">
          <strong>Lorem News</strong>
        </Link>
      </div>
    </header>
  );
};

export { Header };

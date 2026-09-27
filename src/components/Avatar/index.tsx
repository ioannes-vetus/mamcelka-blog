import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export interface AvatarProps {
  src: string;
  name: string;
  role: string;
}

export default function Avatar({
  src,
  name,
  role,
}: AvatarProps): React.ReactElement {
  const resolvedSrc = useBaseUrl(src);

  return (
    <div className={styles.wrapper}>
      <div className={styles.ring}>
        <img className={styles.image} src={resolvedSrc} alt={name} />
      </div>
      <div className={styles.caption}>
        <span className={styles.name}>{name}</span>
        <span className={styles.role}>{role}</span>
      </div>
    </div>
  );
}

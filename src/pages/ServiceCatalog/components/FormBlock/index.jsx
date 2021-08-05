import React from 'react';
import styles from './formblock.module.scss';

export default function FormBlock(props) {
	const { title, className = '', style = {}, children } = props;

	return (
		<div
			className={`${styles['form-block']} ${className}`}
			style={{ ...style }}
		>
			<p className={styles['title']}>{title}</p>
			{children}
		</div>
	);
}

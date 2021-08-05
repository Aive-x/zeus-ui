import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon } from '@alifd/next';
import { Message } from '@alicloud/console-components';

import styles from './user.module.scss';
import logoutSvg from '@/assets/images/navbar/logout.svg';

import Storage from '@/utils/storage';
import { postLogout } from '@/services/user';
import messageConfig from '@/components/messageConfig';

function User(props) {
	const { nickName, className, role } = props;
	const history = useHistory();

	const logout = () => {
		postLogout().then((res) => {
			if (res.success) {
				Storage.removeLocal('token', true);
				// Storage.removeSession('token', true);
				history.push('/login');
				window.location.reload();
			} else {
				Message.show(messageConfig('error', '错误', res));
			}
		});
	};

	return (
		<div className={`${styles['nav-user-container']} ${className}`}>
			<Icon type="user-circle" />
			<ul className={styles['nav-user-operator']}>
				<li className={styles['nav-user-container-item']}>
					<p>{nickName}</p>
					<span className={styles['nav-user-role-p']}>
						{role.nickName}
					</span>
				</li>
				<li
					className={styles['nav-user-container-item']}
					onClick={logout}
				>
					<img src={logoutSvg} alt="退出" />
					退出登录
				</li>
			</ul>
		</div>
	);
}

export default User;

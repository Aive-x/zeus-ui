import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Storage from '@/utils/storage';
import { postLogin } from '@/services/user';
import styles from './login.module.scss';

export default function Login() {
	const history = useHistory();
	const [account, setAccount] = useState({
		username: '',
		password: ''
	});
	const [message, setMessage] = useState('');

	const submit = (e) => {
		e && e.preventDefault();
		setMessage('');
		const { username, password } = account;
		if (!username || !password) {
			setMessage('请输入用户名/密码');
			return;
		}
		const data = {
			username,
			password,
			language: Storage.getLocal('language') || 'ch'
		};
		postLogin(data)
			.then((res) => {
				if (res.success) {
					Storage.setLocal('token', res.data.token);
					history.push('/spaceOverview');
					window.location.reload();
				} else {
					setMessage(res.errorMsg || res.errorDetail);
				}
			})
			.catch((err) => {
				setMessage(err.data);
			});
	};

	return (
		<div className={styles['login']}>
			<form className={styles['login-form']}>
				<header className={styles['login-header']}>
					中间件平台登录
				</header>
				<div className={styles['login-form-box']}>
					<div className={styles['login-input-item']}>
						<input
							type="text"
							className={styles['login-input']}
							value={account.username}
							onChange={(e) =>
								setAccount({
									...account,
									username: e.target.value
								})
							}
							onKeyPress={(event) => {
								if (event.charCode === 13) {
									submit(event);
								}
							}}
							placeholder="请输入用户名称"
						/>
					</div>
					<div className={styles['login-input-item']}>
						<input
							type="password"
							className={styles['login-input']}
							value={account.password}
							onChange={(e) =>
								setAccount({
									...account,
									password: e.target.value
								})
							}
							onKeyPress={(event) => {
								if (event.charCode === 13) {
									submit(event);
								}
							}}
							placeholder="请输入密码"
						/>
					</div>
					<div
						className={`${styles['login-submit']} ${styles['centered-item']}`}
					>
						<p className={styles['login-message']}>{message}</p>
					</div>
					<div className={styles['login-submit']}>
						<button
							type="button"
							className={styles['login-button']}
							onClick={(e) => submit(e)}
							style={{ width: '100%' }}
						>
							登 录
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}

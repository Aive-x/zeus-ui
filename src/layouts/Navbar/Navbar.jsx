import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import storage from '@/utils/storage';
import { Nav, Select } from '@alicloud/console-components';
import User from './User/User';

import styles from './navbar.module.scss';
import './navbar.scss';
import Logo from '@/assets/images/navbar/logo-bar.svg';
import { getClusters, getNamespaces } from '@/services/common';
import {
	setCluster,
	setNamespace,
	setRefreshCluster
} from '@/redux/globalVar/var';

// 集群分区不可改变路由名单
const disabledRoute = [
	'/serviceCatalog/mysqlCreate',
	'/serviceCatalog/redisCreate',
	'/serviceCatalog/elasticsearchCreate',
	'/serviceCatalog/rocketmqCreate',
	'/instanceList/detail'
];

// 集群分区不显示路由名单
const hideRoute = ['/basicResource', '/authManage', '/platformOverview'];

const header = (
	<div className={styles['logo-box']} style={{ lineHeight: '48px' }}>
		<img className={styles['logo-png']} src={Logo} alt="" />
	</div>
);

const footer = (
	<div className={styles['action-bar']}>
		<div className={styles['action-bar-item']}>
			<User
				className={styles['module']}
				nickName={'admin'}
				role={{ nickName: '系统管理员' }}
			/>
		</div>
	</div>
);

function Navbar(props) {
	const { user, style, setCluster, setNamespace, setRefreshCluster } = props;
	const { flag } = props.globalVar;
	const location = useLocation();
	const [currentCluster, setCurrentCluster] = useState({});
	const [currentNamespace, setCurrentNamespace] = useState({});
	const [clusterList, setClusterList] = useState([]);
	const [namespaceList, setNamespaceList] = useState([]);
	// 控制集群和分区
	const [disabled, setDisabled] = useState(false);
	const [hideFlag, setHideFlag] = useState(false);

	const getClusterList = async () => {
		let res = await getClusters();
		if (res.success) {
			if (res.data.length > 0) {
				let jsonLocalCluster = storage.getLocal('cluster');
				if (
					jsonLocalCluster &&
					res.data.some((item) => {
						return item.id === JSON.parse(jsonLocalCluster).id;
					})
				) {
					setCurrentCluster(JSON.parse(jsonLocalCluster));
					setCluster(JSON.parse(jsonLocalCluster));
				} else {
					setCurrentCluster(res.data[0]);
					setCluster(res.data[0]);
					storage.setLocal('cluster', JSON.stringify(res.data[0]));
				}
			}
			setClusterList(res.data);
		}
	};

	const getNamespaceList = async (clusterId) => {
		let res = await getNamespaces({ clusterId, withQuota: true });
		if (res.success) {
			if (res.data.length > 0) {
				let jsonLocalNamespace = storage.getLocal('namespace');
				if (
					jsonLocalNamespace &&
					res.data.some((item) => {
						return (
							item.name === JSON.parse(jsonLocalNamespace).name
						);
					})
				) {
					setCurrentNamespace(JSON.parse(jsonLocalNamespace));
					setNamespace(JSON.parse(jsonLocalNamespace));
				} else {
					setCurrentNamespace(res.data[0]);
					setNamespace(res.data[0]);
					storage.setLocal('namespace', JSON.stringify(res.data[0]));
				}
			}
			setNamespaceList(res.data);
		}
	};

	const clusterHandle = (id) => {
		for (let i = 0; i < clusterList.length; i++) {
			if (clusterList[i].id === id) {
				setCurrentCluster(clusterList[i]);
				setCluster(clusterList[i]);
				storage.setLocal('cluster', JSON.stringify(clusterList[i]));
			}
		}
	};

	const namespaceHandle = (name) => {
		for (let i = 0; i < namespaceList.length; i++) {
			if (namespaceList[i].name === name) {
				setCurrentNamespace(namespaceList[i]);
				setNamespace(namespaceList[i]);
				storage.setLocal('namespace', JSON.stringify(namespaceList[i]));
			}
		}
	};

	useEffect(() => {
		getClusterList();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (flag) {
			getClusterList();
			setRefreshCluster(false);
		}
	}, [flag]);

	useEffect(() => {
		if (JSON.stringify(currentCluster) !== '{}')
			getNamespaceList(currentCluster.id);
	}, [currentCluster]);

	useEffect(() => {
		if (location && location.pathname) {
			// 是否可选择
			if (
				disabledRoute.some((item) => {
					return location.pathname.indexOf(item) > -1;
				})
			)
				setDisabled(true);
			else setDisabled(false);
			// 是否显示
			if (
				hideRoute.some((item) => {
					return location.pathname.indexOf(item) > -1;
				})
			)
				setHideFlag(true);
			else setHideFlag(false);
		}
	}, [location]);

	useEffect(() => {
		/**TODO 用户权限 */
	}, [user]);

	return (
		<div className={styles['middleware-navbar']} style={{ ...style }}>
			<Nav
				className={styles['custom-nav']}
				direction="hoz"
				type="normal"
				header={header}
				footer={footer}
				embeddable={true}
				style={{
					lineHeight: '48px',
					zIndex: 999
				}}
			>
				{hideFlag === false && (
					<>
						<Select
							className="no-shadow"
							value={currentCluster.id}
							hasBorder={false}
							disabled={disabled}
							onChange={clusterHandle}
						>
							{clusterList.map((cluster, index) => {
								return (
									<Select.Option
										key={index}
										value={cluster.id}
									>
										{cluster.nickname}
									</Select.Option>
								);
							})}
						</Select>
						<Select
							style={{ marginLeft: 16 }}
							className="no-shadow"
							value={currentNamespace.name}
							hasBorder={false}
							disabled={disabled}
							onChange={namespaceHandle}
						>
							{namespaceList.map((namespace, index) => {
								return (
									<Select.Option
										key={index}
										value={namespace.name}
									>
										{namespace.aliasName}
									</Select.Option>
								);
							})}
						</Select>
					</>
				)}
			</Nav>
		</div>
	);
}

export default connect(({ globalVar }) => ({ globalVar }), {
	setCluster,
	setNamespace,
	setRefreshCluster
})(Navbar);

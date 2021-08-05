import React from 'react';
import {
	HashRouter as Router,
	Route,
	Link,
	useHistory
} from 'react-router-dom';
import ConsoleMenu, {
	StyledComponents
} from '@alicloud/console-components-console-menu';
import { judgeArrays } from '@/utils/utils';
import styled from 'styled-components';

import './menu.scss';
import { Icon } from '@alicloud/console-components';

const subClick = (openKey, openInfo, history) => {
	if (openInfo.open) {
		switch (openInfo.key) {
			case 'workbench':
				history.push('/spaceOverview');
				break;
			case 'operations':
				history.push('/platformOverview');
				break;
			case 'management':
				history.push('/basicResource');
				break;
		}
	}
};

const mapLocationToActiveKey = (location) => {
	const pathArray = location.pathname.split('/');
	if (!location || !location.pathname || location.pathname === '/') {
		return '/spaceOverview';
	} else if (pathArray.includes('instanceList')) return '/instanceList';
	else if (pathArray.includes('serviceCatalog')) return '/serviceCatalog';
	return location.pathname;
};

const mapLocationToOpenKey = (location) => {
	const pathArray = location.pathname.split('/');
	if (!location || !location.pathname || location.pathname === '/')
		return 'workbench';
	else if (['/basicResource', '/authManage'].indexOf(location.pathname) > -1)
		return 'management';
	else if (['/platformOverview'].indexOf(location.pathname) > -1)
		return 'operations';
	else if (
		judgeArrays(pathArray, [
			'spaceOverview',
			'serviceCatalog',
			'instanceList',
			'outboundRoute'
		])
	)
		return 'workbench';
};

const Menu = () => {
	const history = useHistory();
	const renderAsLink = ({ key, label }) => {
		// eslint-disable-next-line
		return <Link to={`${key}`}>{label}</Link>;
	};
	const items = [
		{
			key: 'workbench',
			label: '工作台',
			navProps: {
				// 透传给Nav.Item组件的props
				className: 'nav-item-select-custom',
				icon: (
					<Icon
						style={{ marginRight: 8 }}
						size={14}
						className="iconfont icon-gongzuotai"
					/>
				)
			},
			items: [
				{
					key: '/spaceOverview',
					label: '空间概览',
					render: renderAsLink
				},
				{
					key: '/serviceCatalog',
					label: '服务目录',
					render: renderAsLink
				},
				{
					key: '/instanceList',
					label: '实例列表',
					render: renderAsLink
				},
				{
					key: '/outboundRoute',
					label: '对外路由',
					render: renderAsLink
				}
			]
		},
		{
			key: 'operations',
			label: '平台运维',
			navProps: {
				// 透传给Nav.Item组件的props
				className: 'nav-item-select-custom',
				icon: (
					<Icon
						style={{ marginRight: 8 }}
						size={14}
						className="iconfont icon-pingtaiyunwei"
					/>
				)
			},
			items: [
				{
					key: '/platformOverview',
					label: '资源总览',
					render: renderAsLink
				}
				// {
				// 	key: '/operationAudit',
				// 	label: '操作审计',
				// 	render: renderAsLink
				// }
			]
		},
		{
			key: 'management',
			label: '平台管理',
			navProps: {
				// 透传给Nav.Item组件的props
				className: 'nav-item-select-custom',
				icon: (
					<Icon
						style={{ marginRight: 8 }}
						size={14}
						className="iconfont icon-guanlizhongxin"
					/>
				)
			},
			items: [
				{
					key: '/basicResource',
					label: '基础资源',
					render: renderAsLink
				},
				{
					key: '/authManage',
					label: '授权管理',
					render: renderAsLink
				}
			]
		}
	];
	return (
		<Router>
			<Route>
				{({ location }) => (
					<CustomizedConsoleMenu
						header="中间件平台"
						openMode="single"
						items={items}
						onOpen={(openKey, openInfo) =>
							subClick(openKey, openInfo, history)
						}
						activeKey={mapLocationToActiveKey(location)}
						openKeys={mapLocationToOpenKey(location)}
					/>
				)}
			</Route>
		</Router>
	);
};

export default Menu;

const CustomizedConsoleMenu = styled(ConsoleMenu)`
	${StyledComponents.Item} {
		padding: 0 24px;
	}
`;

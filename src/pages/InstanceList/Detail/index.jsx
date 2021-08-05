import React, { useState, useEffect } from 'react';
import { Page } from '@alicloud/console-components-page';
import { useHistory, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { Message } from '@alicloud/console-components';
import BasicInfo from './BasicInfo/index';
import HighAvailability from './HighAvailability/index';
import BackupRecovery from './BackupRecovery/index';
import ExternalAccess from './ExternalAccess/index';
import Monitor from './Monitor/index';
import Log from './Log/index';
import ThresholdAlarm from './ThresholdAlarm/index';
import ParamterSetting from './ParamterSetting/index';
import { getMiddlewareDetail } from '@/services/middleware';
import messageConfig from '@/components/messageConfig';
import './detail.scss';

/*
 * 自定义中间tab页显示判断 后端
 * 基本信息  basic
 * 高可用性  high 未完成
 * 备份恢复  backup (目前mysql中间件特有)
 * 对外访问  ingress
 * 性能监控  monitoring
 * 日志管理  log
 * 参数设置  config
 * 阈值告警  alert
 */
const { Menu } = Page;
const InstanceDetails = (props) => {
	const {
		globalVar,
		match: {
			params: { middlewareName, type, chartName, chartVersion }
		}
	} = props;
	const [selectedKey, setSelectedKey] = useState('basicInfo');
	const [data, setData] = useState();
	const [status, setStatus] = useState();
	const [customMid, setCustomMid] = useState(false); // * 判断是否是自定义中间件
	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		if (
			JSON.stringify(globalVar.cluster) !== '{}' &&
			JSON.stringify(globalVar.namespace) !== '{}'
		) {
			getData(globalVar.cluster.id, globalVar.namespace.name);
		}
	}, [globalVar]);

	useEffect(() => {
		if (location.query) {
			let { query } = location;
			setSelectedKey(query.key);
		}
		if (location.state) {
			if (location.state.flag) {
				window.location.reload();
			}
		}
	}, [location]);

	const menuSelect = (selectedKeys) => {
		setSelectedKey(selectedKeys[0]);
	};

	const getData = (clusterId, namespace) => {
		const sendData = {
			clusterId,
			namespace,
			middlewareName,
			type
		};
		getMiddlewareDetail(sendData).then((res) => {
			if (res.success) {
				setData(res.data);
				setStatus(res.data.status || 'Failed');
				if (res.data.dynamicValues) {
					setCustomMid(true);
				} else {
					setCustomMid(false);
				}
			} else {
				Message.show(messageConfig('error', '失败', res));
			}
		});
	};

	const refresh = () => {
		getData(globalVar.cluster.id, globalVar.namespace.name);
	};

	const DetailMenu = ({ selected, handleMenu }) => (
		<Menu id="mid-menu" selectedKeys={selected} onSelect={handleMenu}>
			<Menu.Item key="basicInfo">基本信息</Menu.Item>
			<Menu.Item key="highAvailability">高可用性</Menu.Item>
			{type === 'mysql' ? (
				<Menu.Item key="backupRecovery">备份恢复</Menu.Item>
			) : null}
			<Menu.Item key="externalAccess">对外访问</Menu.Item>
			<Menu.Item key="monitor">性能监控</Menu.Item>
			<Menu.Item key="log">日志管理</Menu.Item>
			<Menu.Item key="paramterSetting">参数设置</Menu.Item>
			<Menu.Item key="alarm">阈值报警</Menu.Item>
		</Menu>
	);

	const childrenRender = (key) => {
		switch (key) {
			case 'basicInfo':
				return (
					<BasicInfo
						middlewareName={middlewareName}
						type={type}
						data={data}
						clusterId={globalVar.cluster.id}
						namespace={globalVar.namespace.name}
						chartName={chartName}
						chartVersion={chartVersion}
						customMid={customMid}
					/>
				);
			case 'highAvailability':
				return (
					<HighAvailability
						type={type}
						data={data}
						clusterId={globalVar.cluster.id}
						namespace={globalVar.namespace.name}
						chartName={chartName}
						chartVersion={chartVersion}
						onRefresh={refresh}
						customMid={customMid}
					/>
				);
			case 'backupRecovery':
				return (
					<BackupRecovery
						type={type}
						data={data}
						backup={globalVar.cluster.storage}
						clusterId={globalVar.cluster.id}
						namespace={globalVar.namespace.name}
						customMid={customMid}
					/>
				);
			case 'externalAccess':
				return (
					<ExternalAccess
						type={type}
						middlewareName={middlewareName}
						customMid={customMid}
						capabilities={(data && data.capabilities) || []}
					/>
				);
			case 'monitor':
				return (
					<Monitor
						type={type}
						middlewareName={middlewareName}
						monitor={globalVar.cluster.monitor}
						clusterId={globalVar.cluster.id}
						namespace={globalVar.namespace.name}
						customMid={customMid}
						chartVersion={chartVersion}
						capabilities={(data && data.capabilities) || []}
					/>
				);
			case 'log':
				return (
					<Log
						type={type}
						data={data}
						middlewareName={middlewareName}
						clusterId={globalVar.cluster.id}
						namespace={globalVar.namespace.name}
						customMid={customMid}
					/>
				);
			case 'paramterSetting':
				return (
					<ParamterSetting
						middlewareName={middlewareName}
						clusterId={globalVar.cluster.id}
						namespace={globalVar.namespace.name}
						type={type}
						customMid={customMid}
						capabilities={(data && data.capabilities) || []}
					/>
				);
			case 'alarm':
				return (
					<ThresholdAlarm
						middlewareName={middlewareName}
						clusterId={globalVar.cluster.id}
						namespace={globalVar.namespace.name}
						type={type}
						customMid={customMid}
						capabilities={(data && data.capabilities) || []}
					/>
				);
		}
	};

	const statusRender = (value) => {
		switch (value) {
			case 'Running':
				return '运行正常';
			case 'Creating':
				return '启动中';
			case undefined:
				return '';
			default:
				return '运行异常';
		}
	};

	return (
		<Page>
			<Page.Header
				title={
					<h1>{`${type}:${middlewareName}(${
						statusRender(status) || ''
					})`}</h1>
				}
				hasBackArrow
				renderBackArrow={(elem) => (
					<span
						className="details-go-back"
						onClick={() => history.push('/instanceList')}
					>
						{elem}
					</span>
				)}
			/>
			<Page.Content
				menu={
					<DetailMenu
						selected={selectedKey}
						handleMenu={menuSelect}
					/>
				}
			>
				{childrenRender(selectedKey)}
			</Page.Content>
		</Page>
	);
};
export default connect(
	({ globalVar }) => ({
		globalVar
	}),
	null
)(InstanceDetails);

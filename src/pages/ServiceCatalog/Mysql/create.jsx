import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import Page from '@alicloud/console-components-page';
import FormBlock from '../components/FormBlock/index';
import SelectBlock from '../components/SelectBlock/index';
import TableRadio from '../components/TableRadio/index';
import {
	Form,
	Field,
	Input,
	// Tag,
	Switch,
	Checkbox,
	Balloon,
	Icon,
	Select,
	Button,
	Message
} from '@alicloud/console-components';
import pattern from '@/utils/pattern';
import styles from './mysql.module.scss';
import {
	getNodePort,
	getStorageClass,
	postMiddleware,
	getMiddlewareDetail
} from '@/services/middleware';
import messageConfig from '@/components/messageConfig';
import transUnit from '@/utils/transUnit';

const { Item: FormItem } = Form;
const formItemLayout = {
	labelCol: {
		fixedSpan: 6
	},
	wrapperCol: {
		span: 14
	}
};
// const { Group: TagGroup, Closable: ClosableTag } = Tag;

const MysqlCreate = (props) => {
	const {
		cluster: globalCluster,
		namespace: globalNamespace
	} = props.globalVar;
	const {
		chartName,
		chartVersion,
		middlewareName,
		backupFileName
	} = useParams();
	const field = Field.useField();
	const history = useHistory();

	// 主机亲和
	const [affinity, setAffinity] = useState({
		flag: false,
		label: '',
		checked: false
	});
	const [labelList, setLabelList] = useState([]);
	const changeAffinity = (value, key) => {
		setAffinity({
			...affinity,
			[key]: value
		});
	};

	// 日志
	const [fileLog, setFileLog] = useState(false);
	// const [directory, setDirectory] = useState('');
	// const [directoryList, setDirectoryList] = useState([]);
	const [standardLog, setStandardLog] = useState(false);
	// const addDirectory = (e) => {
	// 	e && e.preventDefault();
	// 	let temp = [].concat(directoryList);
	// 	temp.push(directory);
	// 	setDirectoryList(temp);
	// 	setDirectory('');
	// };
	// const delDirectory = (index) => {
	// 	let temp = [].concat(directoryList);
	// 	temp.splice(index, 1);
	// 	setDirectoryList(temp);
	// };

	// MySQL配置
	const [version, setVersion] = useState('5.7.21');
	const versionList = [
		// 暂时隐藏8.0.21版本
		// {
		// 	label: '8.0.21',
		// 	value: '8.0.21'
		// },
		{
			label: '5.7.21',
			value: '5.7.21'
		}
	];
	const [charSet, setCharSet] = useState('utf8mb4');
	const charSetList = [
		{
			label: 'utf8mb4',
			value: 'utf8mb4'
		},
		{
			label: 'utf8',
			value: 'utf8'
		},
		{
			label: 'latin1',
			value: 'latin1'
		}
	];
	const [mode, setMode] = useState('1m-1s');
	const modeList = [
		{
			label: '主从模式',
			value: '1m-1s'
		}
	];
	const [instanceSpec, setInstanceSpec] = useState('General');
	const instanceSpecList = [
		{
			label: '通用规格',
			value: 'General'
		},
		{
			label: '自定义',
			value: 'Customize'
		}
	];
	const [specId, setSpecId] = useState('1');
	const [storageClassList, setStorageClassList] = useState([]);
	const [maxCpu, setMaxCpu] = useState({}); // 自定义cpu的最大值
	const [maxMemory, setMaxMemory] = useState({}); // 自定义memory的最大值

	useEffect(() => {
		if (globalNamespace.quotas) {
			const cpuMax =
				Number(globalNamespace.quotas.cpu[1]) -
				Number(globalNamespace.quotas.cpu[2]);
			setMaxCpu({
				max: cpuMax
			});
			const memoryMax =
				Number(globalNamespace.quotas.memory[1]) -
				Number(globalNamespace.quotas.memory[2]);
			setMaxMemory({
				max: memoryMax
			});
		}
	}, [props]);

	const handleSubmit = () => {
		field.validate((err, values) => {
			if (!err) {
				let sendData = {
					chartName: chartName,
					chartVersion: chartVersion,
					clusterId: globalCluster.id,
					namespace: globalNamespace.name,
					type: 'mysql',
					name: values.name,
					aliasName: values.aliasName,
					labels: values.labels,
					annotation: values.annotation,
					version: version,
					charSet: charSet,
					port: values.mysqlPort,
					password: values.mysqlPwd,
					mode: mode,
					filelogEnabled: fileLog,
					stdoutEnabled: standardLog,
					quota: {
						mysql: {
							storageClassName: values.storageClass,
							storageClassQuota: values.storageQuota
						}
					}
				};
				// 主机亲和
				if (affinity.flag) {
					if (affinity.label === '') {
						Message.show(
							messageConfig('error', '错误', '请选择主机亲和。')
						);
						return;
					} else {
						sendData.nodeAffinity = [
							{
								label: affinity.label,
								required: affinity.checked,
								namespace: globalNamespace.name
							}
						];
					}
				}
				// 配额
				if (instanceSpec === 'General') {
					switch (specId) {
						case '1':
							sendData.quota.mysql.cpu = 1;
							sendData.quota.mysql.memory = '2Gi';
							break;
						case '2':
							sendData.quota.mysql.cpu = 2;
							sendData.quota.mysql.memory = '4Gi';
							break;
						case '3':
							sendData.quota.mysql.cpu = 4;
							sendData.quota.mysql.memory = '16Gi';
							break;
						case '4':
							sendData.quota.mysql.cpu = 8;
							sendData.quota.mysql.memory = '32Gi';
							break;
						case '5':
							sendData.quota.mysql.cpu = 16;
							sendData.quota.mysql.memory = '64Gi';
							break;
						default:
							break;
					}
				} else if (instanceSpec === 'Customize') {
					sendData.quota.mysql.cpu = values.cpu;
					sendData.quota.mysql.memory = values.memory + 'Gi';
				}
				// 克隆实例
				if (backupFileName) {
					sendData.middlewareName = middlewareName;
					sendData.backupFileName = backupFileName;
				}
				// console.log(sendData);
				postMiddleware(sendData).then((res) => {
					if (res.success) {
						Message.show(
							messageConfig('success', '成功', {
								data: '中间件Mysql正在创建中'
							})
						);
						history.push({
							pathname: '/instanceList',
							query: { key: 'Mysql', timer: true }
						});
					} else {
						Message.show(messageConfig('error', '错误', res));
					}
				});
			}
		});
	};

	// 全局集群更新
	useEffect(() => {
		if (JSON.stringify(globalCluster) !== '{}') {
			getNodePort({ clusterId: globalCluster.id }).then((res) => {
				if (res.success) {
					setLabelList(res.data);
				}
			});
		}
	}, [globalCluster]);

	// 全局分区更新
	useEffect(() => {
		getStorageClass({
			clusterId: globalCluster.id,
			namespace: globalNamespace.name
		}).then((res) => {
			if (res.success) {
				for (let i = 0; i < res.data.length; i++) {
					if (res.data[i].type === 'CSI-LVM') {
						field.setValues({
							storageClass: res.data[i].name
						});
						break;
					}
				}
				setStorageClassList(res.data);
			} else {
				Message.show(messageConfig('error', '失败', res));
			}
		});
		if (JSON.stringify(globalNamespace) !== '{}') {
			// 克隆实例
			if (backupFileName) {
				getMiddlewareDetail({
					clusterId: globalCluster.id,
					namespace: globalNamespace.name,
					middlewareName: middlewareName,
					type: 'mysql'
				}).then((res) => {
					setInstanceSpec('Customize');
					if (res.data.nodeAffinity) {
						setAffinity({
							flag: true,
							label: res.data.nodeAffinity[0].label,
							checked: res.data.nodeAffinity[0].required
						});
					}
					if (res.data.mode) {
						setMode(res.data.mode);
					}
					if (res.data.charSet) {
						setCharSet(res.data.charSet);
					}
					if (res.data.version) {
						setVersion(res.data.version);
					}
					field.setValues({
						aliasName: res.data.aliasName,
						// name: res.data.name,
						labels: res.data.labels,
						annotation: res.data.annotation,
						mysqlPort: res.data.port,
						mysqlPwd: res.data.password,
						cpu: res.data.quota.mysql.cpu,
						memory: transUnit.removeUnit(
							res.data.quota.mysql.memory,
							'Gi'
						),
						storageClass: res.data.quota.mysql.storageClassName,
						storageQuota: transUnit.removeUnit(
							res.data.quota.mysql.storageClassQuota,
							'Gi'
						)
					});
				});
			}
		}
	}, [globalNamespace]);

	return (
		<Page>
			<Page.Header
				title="发布MySQL实例"
				className="page-header"
				hasBackArrow
				onBackArrowClick={() => {
					window.history.back();
				}}
			/>
			<Page.Content>
				<Form {...formItemLayout} field={field}>
					<FormBlock title="基础信息">
						<div className={styles['basic-info']}>
							<ul className="form-layout">
								<li className="display-flex">
									<label className="form-name">
										<span className="ne-required">
											实例名称
										</span>
									</label>
									<div className="form-content">
										<FormItem
											required
											requiredMessage="请输入实例名称"
											pattern={pattern.name}
											patternMessage="请输入由小写字母数字及“-”组成的2-40个字符"
										>
											<Input
												name="name"
												placeholder="请输入由小写字母数字及“-”组成的2-40个字符"
												trim
											/>
										</FormItem>
									</div>
								</li>
								<li className="display-flex">
									<label className="form-name">
										<span>显示名称</span>
									</label>
									<div className="form-content">
										<FormItem
											minLength={2}
											maxLength={80}
											minmaxLengthMessage="请输入由汉字、字母、数字及“-”或“.”或“_”组成的2-80个字符"
											pattern={pattern.nickname}
											patternMessage="请输入由汉字、字母、数字及“-”或“.”或“_”组成的2-80个字符"
										>
											<Input
												name="aliasName"
												placeholder="请输入由汉字、字母、数字及“-”或“.”或“_”组成的2-80个字符"
											/>
										</FormItem>
									</div>
								</li>
								<li className="display-flex">
									<label className="form-name">
										<span>标签</span>
									</label>
									<div className="form-content">
										<FormItem
											pattern={pattern.labels}
											patternMessage="请输入key=value格式的标签，多个标签以英文逗号分隔"
										>
											<Input
												name="labels"
												placeholder="请输入key=value格式的标签，多个标签以英文逗号分隔"
											/>
										</FormItem>
									</div>
								</li>
								<li className="display-flex">
									<label className="form-name">
										<span>描述</span>
									</label>
									<div className="form-content">
										<FormItem>
											<Input.TextArea
												name="annotation"
												placeholder="请输入描述信息"
											/>
										</FormItem>
									</div>
								</li>
							</ul>
						</div>
					</FormBlock>
					<FormBlock title="调度策略">
						<div className={styles['schedule-strategy']}>
							<ul className="form-layout">
								<li className="display-flex form-li">
									<label className="form-name">
										<span style={{ marginRight: 8 }}>
											主机亲和
										</span>
										<Balloon
											trigger={
												<Icon
													type="question-circle"
													size="xs"
												/>
											}
											closable={false}
										>
											勾选强制亲和时，实例只会部署在具备相应标签的主机上，若主机资源不足，可能会导致启动失败
										</Balloon>
									</label>
									<div
										className={`form-content display-flex ${styles['host-affinity']}`}
									>
										<div className={styles['switch']}>
											{affinity.flag ? '已开启' : '关闭'}
											<Switch
												checked={affinity.flag}
												onChange={(value) =>
													changeAffinity(
														value,
														'flag'
													)
												}
												size="small"
												style={{
													marginLeft: 16,
													verticalAlign: 'middle'
												}}
											/>
										</div>
										{affinity.flag ? (
											<>
												<div
													className={styles['input']}
												>
													<Select.AutoComplete
														value={affinity.label}
														onChange={(value) =>
															changeAffinity(
																value,
																'label'
															)
														}
														dataSource={labelList}
														style={{
															width: '100%'
														}}
													/>
												</div>
												<div
													className={styles['check']}
												>
													<Checkbox
														checked={
															affinity.checked
														}
														onChange={(value) =>
															changeAffinity(
																value,
																'checked'
															)
														}
														label="强制亲和"
													/>
												</div>
											</>
										) : null}
									</div>
								</li>
							</ul>
						</div>
					</FormBlock>
					<FormBlock title="日志收集">
						<div className={styles['log-collection']}>
							<ul className="form-layout">
								<li className="display-flex form-li">
									<label className="form-name">
										<span style={{ marginRight: 8 }}>
											文件日志收集
										</span>
										<Balloon
											trigger={
												<Icon
													type="question-circle"
													size="xs"
												/>
											}
											closable={false}
										>
											<span
												style={{ lineHeight: '18px' }}
											>
												开启该功能，平台会将日志目录下的文件日志收集至Elasticsearch中，可以在实例详情下的“日志管理”菜单下查看具体的日志，如果当前集群未部署/对接Elasticsearch组件，则无法启用该功能
											</span>
										</Balloon>
									</label>
									<div
										className={`form-content display-flex ${styles['file-log']}`}
									>
										<div className={styles['switch']}>
											{fileLog ? '已开启' : '关闭'}
											<Switch
												checked={fileLog}
												onChange={(value) =>
													setFileLog(value)
												}
												size="small"
												style={{
													marginLeft: 16,
													verticalAlign: 'middle'
												}}
											/>
										</div>
										{/* {fileLog ? (
											<>
												<div
													className={styles['input']}
												>
													<TagGroup
														style={{ marginTop: 4 }}
													>
														{directoryList.map(
															(item, index) => (
																<ClosableTag
																	key={index}
																	onClose={() =>
																		delDirectory(
																			index
																		)
																	}
																>
																	{item}
																</ClosableTag>
															)
														)}
													</TagGroup>
													<Input
														innerBefore={
															<Icon
																type="add"
																style={{
																	marginLeft: 8
																}}
															/>
														}
														placeholder="添加日志目录"
														value={directory}
														onChange={(value) =>
															setDirectory(value)
														}
														onKeyPress={(event) => {
															if (
																event.charCode ===
																13
															) {
																addDirectory(
																	event
																);
															}
														}}
														onBlur={(e) => {
															addDirectory(e);
														}}
													/>
												</div>
											</>
										) : null} */}
									</div>
								</li>
							</ul>
						</div>
						<div className={styles['log-collection']}>
							<ul className="form-layout">
								<li className="display-flex form-li">
									<label className="form-name">
										<span style={{ marginRight: 8 }}>
											标准日志收集
										</span>
										<Balloon
											trigger={
												<Icon
													type="question-circle"
													size="xs"
												/>
											}
											closable={false}
										>
											<span
												style={{ lineHeight: '18px' }}
											>
												开启该功能，平台会将标准输出（stdout）的日志收集至Elasticsearch中，可以在实例详情下的“日志管理”菜单下查看具体的日志，如果当前集群未部署/对接Elasticsearch组件，则无法启用该功能
											</span>
										</Balloon>
									</label>
									<div
										className={`form-content display-flex ${styles['standard-log']}`}
									>
										<div className={styles['switch']}>
											{standardLog ? '已开启' : '关闭'}
											<Switch
												checked={standardLog}
												onChange={(value) =>
													setStandardLog(value)
												}
												size="small"
												style={{
													marginLeft: 16,
													verticalAlign: 'middle'
												}}
											/>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</FormBlock>
					<FormBlock title="MySQL配置">
						<div className={styles['mysql-config']}>
							<ul className="form-layout">
								<li className="display-flex form-li">
									<label className="form-name">
										<span>版本</span>
									</label>
									<div
										className={`form-content display-flex`}
									>
										<SelectBlock
											options={versionList}
											currentValue={version}
											onCallBack={(value) =>
												setVersion(value)
											}
										/>
									</div>
								</li>
								<li className="display-flex form-li">
									<label className="form-name">
										<span>字符集</span>
									</label>
									<div
										className={`form-content display-flex`}
									>
										<SelectBlock
											options={charSetList}
											currentValue={charSet}
											onCallBack={(value) =>
												setCharSet(value)
											}
										/>
									</div>
								</li>
								<li
									className="display-flex"
									style={{ paddingTop: 8 }}
								>
									<label className="form-name">
										<span>端口号</span>
									</label>
									<div
										className="form-content"
										style={{ flex: '0 0 376px' }}
									>
										<FormItem
											min={1}
											max={65535}
											minmaxLengthMessage="端口范围为1至65535的正整数,默认为3306"
										>
											<Input
												htmlType="number"
												name="mysqlPort"
												placeholder="请输入mysql的服务端口号，默认为3306"
												trim
											/>
										</FormItem>
									</div>
								</li>
								<li className="display-flex">
									<label className="form-name">
										<span>root密码</span>
									</label>
									<div
										className="form-content"
										style={{ flex: '0 0 376px' }}
									>
										<FormItem
											pattern={pattern.mysqlPwd}
											patternMessage="由1-16位字母和数字以及特殊字符组成"
										>
											<Input
												htmlType="password"
												name="mysqlPwd"
												placeholder="请输入root密码，输入为空则由平台随机生成"
												trim
											/>
										</FormItem>
									</div>
								</li>
							</ul>
						</div>
					</FormBlock>
					<FormBlock title="规格配置">
						<div className={styles['spec-config']}>
							<ul className="form-layout">
								<li className="display-flex form-li">
									<label className="form-name">
										<span>模式</span>
									</label>
									<div
										className={`form-content display-flex`}
									>
										<SelectBlock
											options={modeList}
											currentValue={mode}
											onCallBack={(value) =>
												setMode(value)
											}
										/>
									</div>
								</li>
								<li className="display-flex form-li">
									<label className="form-name">
										<span>节点规格</span>
									</label>
									<div
										className={`form-content display-flex ${styles['instance-spec-content']}`}
									>
										<SelectBlock
											options={instanceSpecList}
											currentValue={instanceSpec}
											onCallBack={(value) =>
												setInstanceSpec(value)
											}
										/>
										{instanceSpec === 'General' ? (
											<div
												style={{
													width: 652,
													marginTop: 16
												}}
											>
												<TableRadio
													id={specId}
													isMysql={true}
													onCallBack={(value) =>
														setSpecId(value)
													}
												/>
											</div>
										) : null}
										{instanceSpec === 'Customize' ? (
											<div
												className={
													styles['spec-custom']
												}
											>
												<ul className="form-layout">
													<li className="display-flex">
														<label className="form-name">
															<span className="ne-required">
																CPU
															</span>
														</label>
														<div className="form-content">
															<FormItem
																min={0.1}
																minmaxMessage={`最小为0.1,不能超过当前分区配额剩余的最大值（${maxCpu.max}Core）`}
																required
																requiredMessage="请输入自定义CPU配额，单位为Core"
																{...maxCpu}
															>
																<Input
																	name="cpu"
																	htmlType="number"
																	min={0.1}
																	step={0.1}
																	placeholder="请输入自定义CPU配额，单位为Core"
																	trim
																/>
															</FormItem>
														</div>
													</li>
													<li className="display-flex">
														<label className="form-name">
															<span className="ne-required">
																内存
															</span>
														</label>
														<div className="form-content">
															<FormItem
																min={0.1}
																minmaxMessage={`最小为0.1,不能超过当前分区配额剩余的最大值（${maxMemory.max}Gi）`}
																required
																requiredMessage="请输入自定义内存配额，单位为Gi"
																{...maxMemory}
															>
																<Input
																	name="memory"
																	htmlType="number"
																	min={0.1}
																	step={0.1}
																	placeholder="请输入自定义内存配额，单位为Gi"
																	trim
																/>
															</FormItem>
														</div>
													</li>
												</ul>
											</div>
										) : null}
									</div>
								</li>
								<li className="display-flex">
									<label className="form-name">
										<span>存储配额</span>
									</label>
									<div
										className={`form-content display-flex`}
									>
										<FormItem
											required
											requiredMessage="请选择存储类型"
										>
											<Select
												name="storageClass"
												style={{ marginRight: 8 }}
											>
												{storageClassList.map(
													(item, index) => {
														return (
															<Select.Option
																key={index}
																value={
																	item.name
																}
															>
																{item.name}
															</Select.Option>
														);
													}
												)}
											</Select>
										</FormItem>
										<FormItem
											pattern={pattern.posInt}
											patternMessage="请输入小于21位的正整数"
											required
											requiredMessage="请输入存储配额大小（GB）"
										>
											<Input
												name="storageQuota"
												defaultValue={5}
												htmlType="number"
												min={1}
												placeholder="请输入存储配额大小"
												addonTextAfter="GB"
											/>
										</FormItem>
									</div>
								</li>
							</ul>
						</div>
					</FormBlock>
					<div className={styles['summit-box']}>
						<Form.Submit
							type="primary"
							validate
							style={{ marginRight: 8 }}
							onClick={handleSubmit}
						>
							提交
						</Form.Submit>
						<Button
							type="normal"
							onClick={() => window.history.back()}
						>
							取消
						</Button>
					</div>
				</Form>
			</Page.Content>
		</Page>
	);
};

export default connect(({ globalVar }) => ({ globalVar }), {})(MysqlCreate);

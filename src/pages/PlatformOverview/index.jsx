import './platformOverview.scss';
import React, { useEffect, useState } from 'react';
import Page from '@alicloud/console-components-page';
import HomeCard from '@/components/HomeCard';
import ExampleCharts from '@/components/ExampleCharts';
import { Radio, Pagination, Icon } from '@alicloud/console-components';
import { getPlatformOverview, getEvent } from '@/services/platformOverview';
import { getClusters } from '@/services/common';
import AlarmTimeLine from '@/components/AlarmTimeline';

const radioList = [
	{
		value: '',
		label: '全部'
	},
	{
		value: 'info',
		label: '提示'
	},
	{
		value: 'warning',
		label: '告警'
	},
	{
		value: 'critical',
		label: '严重'
	}
];
function PlatformOverview() {
	// 设置事件数据
	const [eventData, setEventData] = useState(null);
	// 顶部统计数据
	const [totalData, setTotalData] = useState({
		namespace: 0,
		cluster: 0,
		node: 0,
		except: 0
	});
	// 数据类型cup/memory
	const [dataType, setDataType] = useState('cpu');
	// 单选按钮组
	const RadioGroup = Radio.Group;
	// 图表数据
	const [chartData, setChartData] = useState({
		cluster: [],
		namespace: [],
		node: []
	});
	// 存储图表数据
	const [sourceData, setSourceData] = useState({});
	const [clusters, setClusters] = useState([]);
	const [current, setCurrent] = useState(1); // 页码 current
	const [level, setLevel] = useState(''); // level
	const [total, setTotal] = useState(10); // 总数

	const getClusterList = async () => {
		let res = await getClusters();
		if (res.success) {
			if (res.data.length > 0) {
				setClusters(res.data);
			}
		}
	};

	// 获取设置图表数据
	const getChartData = (type = 'cpu') => {
		const res = [];
		sourceData.clusters &&
			sourceData.clusters.forEach((ele) => {
				const cluster = {
					dataType: 'cluster',
					name: ele.clusterName,
					regNamespaceCount: ele.regNamespaceCount,
					instanceCount: ele.instanceCount,
					itemStyle: {
						color: ele.status ? '#5CCDBB' : '#FFC440'
					}
				};
				cluster.children = ele.namespaces.map((item) => {
					const namespa = {
						dataType: 'namespace',
						name: item.name,
						value: type === 'cpu' ? item.cpu : item.memory,
						itemStyle: {
							color: item.status ? '#5CCDBB' : '#FFC440',
							opacity: 0.85
						},
						cpu: item.cpu,
						memory: item.memory,
						instanceCount: item.instanceCount,
						instanceExceptionCount: item.instanceExceptionCount
					};
					namespa.children = item.middlewares.map((mid) => {
						return {
							dataType: 'node',
							name: mid.name,
							value:
								type === 'cpu' ? mid.totalCpu : mid.totalMemory,
							itemStyle: {
								color: mid.status ? '#5CCDBB' : '#C80000',
								opacity: 0.65
							},
							cluster: ele.clusterId,
							namespace: item.name,
							totalCpu: mid.totalCpu,
							totalMemory: mid.totalMemory,
							status: mid.status,
							nodeCount: mid.nodeCount,
							type: mid.type,
							chartName: mid.chartName,
							chartVersion: mid.chartVersion,
							imagePath: mid.imagePath
						};
					});
					return namespa;
				});
				res.push(cluster);
			});
		// 设置图表数据
		setChartData(res);
	};
	useEffect(() => {
		getPlatformOverview().then((res) => {
			setSourceData(res.data);
		});
		getClusterList();
	}, []);

	useEffect(() => {
		if (Object.keys(sourceData).length) {
			setTotalData({
				namespace: sourceData.totalNamespaceCount,
				cluster: sourceData.totalClusterCount,
				node: sourceData.totalInstanceCount,
				except: sourceData.totalExceptionCount
			});
			getChartData();
		}
	}, [sourceData]);

	useEffect(() => {
		// 请求事件数据
		if (!eventData) {
			// 直接请求
			const sendData = {
				current: current,
				size: 10,
				level: level
			};
			getEvent(sendData).then((res) => {
				setEventData(res.data ? res.data.list : []);
				setTotal(res.data.total);
			});
		}
	}, [eventData]);
	// 选择的数据类型修改
	const dataTypeChange = (checked) => {
		getChartData(checked); // 修改图表数据
		setDataType(checked); // 修改radio绑定数据
	};
	const getEventsData = ({ current, level }) => {
		const sendData = {
			current: current,
			size: 10,
			level: level
		};
		getEvent(sendData).then((res) => {
			setEventData(res.data ? res.data.list : []);
			setTotal(res.data.total);
		});
	};
	const onNormalChange = (value) => {
		setLevel(value);
		const alertData = {
			current: current,
			level: value
		};
		getEventsData(alertData);
	};
	const paginationChange = (current) => {
		setCurrent(current);
		const alertData = {
			current: current,
			level: level
		};
		getEventsData(alertData);
	};
	return (
		<Page>
			<Page.Content style={{ paddingBottom: 0 }}>
				<div className="platform_overview-content">
					<div className="left-content">
						<HomeCard
							title={'资产统计'}
							height={'147px'}
							width={'100%'}
							marginBottom={'16px'}
						>
							<div className="total">
								<div className="part part-border">
									<div
										className="part-icon"
										style={{ backgroundColor: ' #5CCDBB' }}
									>
										<Icon
											className="iconfont icon-jiqun"
											size="large"
											style={{
												color: '#FFFFFF',
												textAlign: 'center',
												lineHeight: '36px'
											}}
										/>
									</div>
									<div className="part-detail">
										<p className="value">
											{totalData.cluster}
											<span
												style={{
													opacity: 0.45,
													fontSize: 14,
													marginLeft: 4
												}}
											>
												个
											</span>
										</p>
										<p className="type">集群数</p>
									</div>
								</div>
								<div className="part part-border">
									<div
										className="part-icon"
										style={{ backgroundColor: '#A78CF3' }}
									>
										<Icon
											className="iconfont icon-namespace"
											size="large"
											style={{
												color: '#FFFFFF',
												textAlign: 'center',
												lineHeight: '36px'
											}}
										/>
									</div>
									<div className="part-detail">
										<p className="value">
											{totalData.namespace}
											<span
												style={{
													opacity: 0.45,
													fontSize: 14,
													marginLeft: 4
												}}
											>
												个
											</span>
										</p>
										<span className="type">总命名空间</span>
									</div>
								</div>
								<div className="part part-border">
									<div
										className="part-icon"
										style={{ backgroundColor: '#25B3DD' }}
									>
										<Icon
											className="iconfont icon-shili"
											size="large"
											style={{
												color: '#FFFFFF',
												textAlign: 'center',
												lineHeight: '36px'
											}}
										/>
									</div>
									<div className="part-detail">
										<p className="value">
											{totalData.node}
											<span
												style={{
													opacity: 0.45,
													fontSize: 14,
													marginLeft: 4
												}}
											>
												个
											</span>
										</p>
										<span className="type">总实例数</span>
									</div>
								</div>
								<div className="part">
									<div
										className="part-icon"
										style={{ backgroundColor: '#E9737A' }}
									>
										<Icon
											className="iconfont icon-shili"
											size="large"
											style={{
												color: '#FFFFFF',
												textAlign: 'center',
												lineHeight: '36px'
											}}
										/>
									</div>
									<div className="part-detail">
										<p className="value error-color">
											{totalData.except}
											<span
												style={{
													color: '#000000',
													opacity: 0.45,
													fontSize: 14,
													marginLeft: 4
												}}
											>
												个
											</span>
										</p>
										<span className="type">异常实例数</span>
									</div>
								</div>
							</div>
						</HomeCard>
						<HomeCard
							title={'实例情况'}
							height={'calc(100% - 163px)'}
							width={'100%'}
							action={
								<div>
									<RadioGroup
										shape="button"
										dataSource={[
											{
												value: 'cpu',
												label: 'cpu配额展示'
											},
											{
												value: 'memory',
												label: '内存配额展示'
											}
										]}
										onChange={dataTypeChange}
										value={dataType}
									/>
								</div>
							}
						>
							<div className="chart-content">
								<ExampleCharts
									chartData={chartData}
									clusters={clusters}
								/>
							</div>
						</HomeCard>
					</div>
					<div className="right-content">
						<HomeCard
							title={'告警事件（全平台）'}
							height={'100%'}
							width={'100%'}
						>
							<RadioGroup
								dataSource={radioList}
								shape="button"
								size="large"
								value={level}
								onChange={onNormalChange}
								style={{ marginTop: 16 }}
							/>
							<AlarmTimeLine
								list={eventData}
								style={{
									marginTop: 16
									// height: 'calc(100vh - 152px)'
								}}
								clusters={clusters}
								type="platform"
							/>
							<Pagination
								style={{ float: 'right' }}
								current={current}
								size="small"
								type="simple"
								shape="no-border"
								onChange={paginationChange}
								total={total}
								totalRender={(total) => `总数：${total}`}
							/>
						</HomeCard>
					</div>
				</div>
			</Page.Content>
		</Page>
	);
}
export default PlatformOverview;
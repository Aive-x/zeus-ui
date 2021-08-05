import React from 'react';
import { Icon } from '@alicloud/console-components';

export const statusRender: (value: string) => JSX.Element = (value: string) => {
	switch (value) {
		case 'Creating':
			return (
				<>
					<Icon
						type="sync-alt"
						size="xs"
						style={{ color: '#0091FF' }}
					/>{' '}
					启动中
				</>
			);
		case 'Running':
			return (
				<>
					<Icon
						type="success1"
						size="xs"
						style={{ color: '#00A700' }}
					/>{' '}
					运行正常
				</>
			);
		case 'Failed':
			return (
				<>
					<Icon
						type="warning1"
						size="xs"
						style={{ color: '#C80000' }}
					/>{' '}
					运行异常
				</>
			);
		case 'RunningError':
			return (
				<>
					<Icon
						type="warning1"
						size="xs"
						style={{ color: '#C80000' }}
					/>{' '}
					运行异常
				</>
			);
		case '':
			return <></>;
		default:
			return (
				<>
					<Icon
						type="warning1"
						size="xs"
						style={{ color: '#C80000' }}
					/>{' '}
					运行异常
				</>
			);
	}
};

// * 备份列表状态
export const statusBackupRender: (value: string) => JSX.Element = (
	value: string
) => {
	switch (value) {
		case 'Creating':
			return (
				<>
					<Icon
						type="sync-alt"
						size="xs"
						style={{ color: '#0091FF' }}
					/>{' '}
					创建中
				</>
			);
		case 'Running':
			return (
				<>
					<Icon
						type="sync-alt"
						size="xs"
						style={{ color: '#0091FF' }}
					/>{' '}
					运行中
				</>
			);
		case 'Failed':
			return (
				<>
					<Icon
						type="warning1"
						size="xs"
						style={{ color: '#C80000' }}
					/>{' '}
					运行失败
				</>
			);
		case 'Complete':
			return (
				<>
					<Icon
						type="success1"
						size="xs"
						style={{ color: '#00A700' }}
					/>{' '}
					成功完成
				</>
			);
		case 'Unknown':
			return (
				<>
					<Icon
						type="warning1"
						size="xs"
						style={{ color: '#C80000' }}
					/>{' '}
					运行状态未知
				</>
			);
		default:
			return (
				<>
					<Icon
						type="warning1"
						size="xs"
						style={{ color: '#C80000' }}
					/>{' '}
					运行异常
				</>
			);
	}
};

// * 中间件详情中报警阈值中使用
export const alarmStatusRender: (value: string) => JSX.Element = (
	value: string
) => {
	switch (value) {
		case 'ok':
			return (
				<>
					<Icon
						type="success1"
						size="xs"
						style={{ color: '#00A700' }}
					/>{' '}
					正常
				</>
			);
		case 'unknown':
			return (
				<>
					<Icon
						type="warning1"
						size="xs"
						style={{ color: '#C80000' }}
					/>{' '}
					未知
				</>
			);
		case 'creating':
			return (
				<>
					<Icon
						type="sync-alt"
						size="xs"
						style={{ color: '#0091FF' }}
					/>{' '}
					创建中
				</>
			);
		case 'deleting':
			return (
				<>
					<Icon
						type="warning1"
						size="xs"
						style={{ color: '#C80000' }}
					/>{' '}
					删除中
				</>
			);
		default:
			return (
				<>
					<Icon
						type="warning1"
						size="xs"
						style={{ color: '#C80000' }}
					/>{' '}
					未知
				</>
			);
	}
};

// * 判断两个数组中是否含有相同的元素（简单数组）
export const judgeArrays: (arr1: Array<any>, arr2: Array<any>) => boolean = (
	arr1: Array<any>,
	arr2: Array<any>
) => {
	const allArrays = [...arr1, ...arr2];
	const newArrays = Array.from(new Set(allArrays));
	return allArrays.length !== newArrays.length;
};

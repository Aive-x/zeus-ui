import { SET_CLUSTER, SET_NAMESPACE, SET_REFRESH_CLUSTER } from './var.js';
/**
 * 全局变量
 */

const defaultState = {
	cluster: {},
	namespace: {},
	flag: false // 触发集群重新获取的标识
};

export default function varReducer(state = defaultState, action) {
	const { type, data } = action;

	switch (type) {
		case SET_CLUSTER:
			return { ...state, cluster: data };
		case SET_NAMESPACE:
			return { ...state, namespace: data };
		case SET_REFRESH_CLUSTER:
			return { ...state, flag: data };
		default:
			return state;
	}
}

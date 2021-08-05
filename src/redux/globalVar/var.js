export const SET_CLUSTER = 'SET_CLUSTER';
export const SET_NAMESPACE = 'SET_NAMESPACE';
export const SET_REFRESH_CLUSTER = 'SET_REFRESH_CLUSTER';

export function setCluster(cluster) {
	return (dispatch) => {
		dispatch({
			type: SET_CLUSTER,
			data: cluster
		});
	};
}

export function setNamespace(namespace) {
	return (dispatch) => {
		dispatch({
			type: SET_NAMESPACE,
			data: namespace
		});
	};
}

export function setRefreshCluster(flag) {
	return (dispatch) => {
		dispatch({
			type: SET_REFRESH_CLUSTER,
			data: flag
		});
	};
}

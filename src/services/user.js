import Axios from './request.js';
import * as USER from './user.constants';

export const postLogin = (params) => {
	return Axios.post(USER.loginApi, params);
};

export const postLogout = (params) => {
	return Axios.post(USER.logoutApi, params);
};

export const getUserInfo = (params) => {
	return Axios.get(USER.userInfoApi, params);
};

export const getMenu = (params) => {
	return Axios.get(USER.menuApi, params);
};

export const getLicense = () => {
	return Axios.get(USER.license);
};

export const putLicense = (params) => {
	return Axios.put(USER.license, params);
};

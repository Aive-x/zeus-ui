import { api, user } from '@/api.json';

export const loginApi = `${user}/auth/login`;
export const logoutApi = `${user}/auth/logout`;
export const userInfoApi = `${api}/users/current`;
export const menuApi = `${api}/roles/{roleId}/menu`;
// lisence
export const license = `${api}/system/configs/license`;

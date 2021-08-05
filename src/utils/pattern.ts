interface patternProps {
	[propsName: string]: string;
}

const pattern: patternProps = {
	name: '^[a-z][a-z0-9-]{0,38}[a-z0-9]$',
	labels:
		'^[a-zA-Z0-9-]+[=][a-zA-Z0-9-]+([,][a-zA-Z0-9-]+[=][a-zA-Z0-9-]+)*$',
	path: '^/$|^(/[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*)+$',
	domain: '[a-z0-9]([-a-z0-9]*[a-z0-9])?(.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*',
	host:
		'^([0-9]|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.([0-9]|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.([0-9]|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.([0-9]|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])$',
	ip:
		'^([0-9]|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.([0-9]|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.([0-9]|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.([0-9]|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])$',
	posInt: '^[1-9]\\d*$',
	nickname: '^[\u4E00-\u9FA5A-Za-z0-9_.-]+$',
	mysqlPwd: '^[a-zA-Z0-9~!@#$%^&*(){}_+=<>?;:.,|-]{1,16}$'
};

export default pattern;
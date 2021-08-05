import React from 'react';
import styles from './homeMidIcon.module.scss';
import { Badge } from '@alicloud/console-components';
import { useHistory } from 'react-router-dom';
// import mq from '@/assets/images/mq.svg';
// import es from '@/assets/images/es.svg';
// import mysql from '@/assets/images/mysql.svg';
// import redis from '@/assets/images/redis.svg';
// import mqColor from '@/assets/images/mq-color.svg';
// import esColor from '@/assets/images/es-color.svg';
// import mysqlColor from '@/assets/images/mysql-color.svg';
// import redisColor from '@/assets/images/redis-color.svg';
import otherColor from '@/assets/images/nodata.svg';
import { api } from '@/api.json';

const typeMap = {
	elasticsearch: 'Elasticsearch',
	rocketmq: 'RocketMQ',
	mysql: 'Mysql',
	redis: 'Redis'
};

export default function HomeMidIcon(props) {
	const { type, count, flag, imagePath = null } = props;
	// console.log(imagePath);
	// const [picture, setPicture] = useState();
	// const [pictureColor, setPictureColor] = useState();
	const history = useHistory();
	// useEffect(() => {
	// 	switch (type) {
	// 		case 'mq':
	// 			setPicture(mq);
	// 			setPictureColor(mqColor);
	// 			break;
	// 		case 'es':
	// 			setPicture(es);
	// 			setPictureColor(esColor);
	// 			break;
	// 		case 'mysql':
	// 			setPicture(mysql);
	// 			setPictureColor(mysqlColor);
	// 			break;
	// 		case 'redis':
	// 			setPicture(redis);
	// 			setPictureColor(redisColor);
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }, [type]);

	return (
		<>
			<div
				className={styles['middleware-box']}
				onClick={() =>
					history.push({
						pathname: '/instanceList',
						query: { key: typeMap[type] || type }
					})
				}
			>
				<Badge
					count={count}
					style={{
						backgroundColor: flag ? '#00A700' : '#C80000'
					}}
					title={type}
				>
					<img
						src={
							imagePath
								? `${api}/images/middleware/${imagePath}`
								: otherColor
						}
						// style={count === 0 ? { filter: 'grayscale(10)' } : ''}
						className={count === 0 ? 'grey-img' : ''}
						// src={count === 0 ? picture : pictureColor}
						width={40}
						height={40}
						alt={type}
					/>
				</Badge>
				<p>{typeMap[type] || type}</p>
			</div>
		</>
	);
}

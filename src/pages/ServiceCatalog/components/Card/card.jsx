import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './card.module.scss';
// import mqColor from '@/assets/images/mq-color.svg';
// import esColor from '@/assets/images/es-color.svg';
// import mysqlColor from '@/assets/images/mysql-color.svg';
// import redisColor from '@/assets/images/redis-color.svg';
import otherColor from '@/assets/images/nodata.svg';
import { api } from '@/api.json';

export default function Card(props) {
	const {
		card = { name: '', chartVersion: '', type: '', description: '' }
	} = props;
	const history = useHistory();

	const toMysqlCreate = () => {
		switch (card.name) {
			case 'Mysql':
				history.push(
					`/serviceCatalog/mysqlCreate/${card.chartName}/${card.chartVersion}`
				);
				break;
			case 'Redis':
				history.push(
					`/serviceCatalog/redisCreate/${card.chartName}/${card.chartVersion}`
				);
				break;
			case 'Elasticsearch':
				history.push(
					`/serviceCatalog/elasticsearchCreate/${card.chartName}/${card.chartVersion}`
				);
				break;
			case 'RocketMQ':
				history.push(
					`/serviceCatalog/rocketmqCreate/${card.chartName}/${card.chartVersion}`
				);
				break;
			default:
				history.push(
					`/serviceCatalog/dynamicForm/${card.chartName}/${card.chartVersion}/${card.version}`
				);
				break;
		}
	};

	// const imgRender = (type) => {
	// 	switch (type) {
	// 		case 'Mysql':
	// 			return mysqlColor;
	// 		case 'Redis':
	// 			return redisColor;
	// 		case 'Elasticsearch':
	// 			return esColor;
	// 		case 'RocketMQ':
	// 			return mqColor;
	// 		default:
	// 			return otherColor;
	// 	}
	// };

	return (
		<div
			className={styles['store-box']}
			style={{ width: 'calc( 20% - 20px )' }}
		>
			<div className={styles['oper']}>
				<button onClick={toMysqlCreate}>发布</button>
			</div>
			<div className={styles['icon']}>
				{/* src={`${api}/images/middleware/${card.imagePath}`} */}
				<img
					width={60}
					height={60}
					src={
						card.imagePath
							? `${api}/images/middleware/${card.imagePath}`
							: otherColor
					}
					alt=""
				/>
			</div>
			<ul className={styles['info']}>
				{card.name && card.chartVersion ? (
					<li className={styles['name']}>
						{card.name} | {card.chartVersion}
					</li>
				) : null}
				<li className={styles['type']}>
					<span>{card.type}</span>
				</li>
				{card.description ? (
					<li className={styles['desc']}>{card.description}</li>
				) : (
					<li className={styles['desc-null']}>暂无描述</li>
				)}
			</ul>
		</div>
	);
}

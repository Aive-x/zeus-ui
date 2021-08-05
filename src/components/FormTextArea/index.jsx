import React from 'react';
import { Input, Balloon, Icon, Form } from '@alicloud/console-components';

const { Item: FormItem } = Form;

/*
	todo
	subquestion 还未处理
*/
export default function FormTextArea(props) {
	const keys = Object.keys(props);
	return (
		<div className="display-flex flex-column">
			<label
				className="dynamic-form-name"
				style={keys.includes('required') ? { paddingLeft: 8 } : {}}
			>
				<span
					className={keys.includes('required') ? 'ne-required' : ''}
				>
					{props.label}
				</span>
				{keys.includes('description') ? (
					<Balloon
						offset={[0, 15]}
						align="t"
						trigger={
							<Icon
								type="question-circle"
								size="xs"
								style={{ marginLeft: 8 }}
							/>
						}
						closable={false}
					>
						{props.description}
					</Balloon>
				) : null}
			</label>
			<div className="form-content">
				<FormItem
					required={keys.includes('required')}
					requiredMessage={
						keys.includes('required') ? `请输入${props.label}` : ''
					}
					// pattern={pattern.name}
					// patternMessage="请输入由小写字母数字及“-”组成的2-40个字符"
				>
					<Input.TextArea
						style={{ width: '390px' }}
						defaultValue={props.defaultValue}
						name={props.variable}
						// placeholder="请输入由小写字母数字及“-”组成的2-40个字符"
						trim
					/>
				</FormItem>
			</div>
		</div>
	);
}
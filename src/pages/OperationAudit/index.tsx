import React from 'react';
import { Page, Content } from '@alicloud/console-components-page';
import Table from '@/components/MidTable';

export default function OperationAudit() {
	return (
		<Page>
			<Content>
				<Table
					dataSource={[]}
					exact
					fixedBarExpandWidth={[24]}
					affixActionBar
					showColumnSetting
					showRefresh
					primaryKey="key"
				>
					<Table.Column title="协议" dataIndex="protocol" />
					<Table.Column title="协议" dataIndex="protocol" />
					<Table.Column title="协议" dataIndex="protocol" />
					<Table.Column title="协议" dataIndex="protocol" />
					<Table.Column title="协议" dataIndex="protocol" />
					<Table.Column title="协议" dataIndex="protocol" />
				</Table>
			</Content>
		</Page>
	);
}

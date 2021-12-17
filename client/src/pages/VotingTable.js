import React from 'react'
import { Button, Table, Space, Divider, Input, Layout, Typography, message } from 'antd'

export const VotingTable = (props) => {
  return (
    <div>
      <Table
        rowSelection={{
          type: 'radio',
          columnWidth: 20,
          onChange: (selectedRowKeys, selectedRows_) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows_)
          }
        }}
        columns={props.columns}
        dataSource={props.data}
        size="default"
        // TODO Set rowKey
        // rowkey={}
        title={() => props.title}
        pagination={{ hideOnSinglePage: true }}
      />
    </div>
  )
}

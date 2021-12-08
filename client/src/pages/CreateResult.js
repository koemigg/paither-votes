import React, { useState, useEffect } from 'react'
import { Result, Button, Alert, Space, Typography, Divider } from 'antd'
import { DownloadOutlined, QuestionOutlined } from '@ant-design/icons'

// TODO: Auto Download
const onDownload = (props) => {
  const now = new Date()
  const data = {
    title: `${props.title}`,
    ballotId: `${props.ballotId}`,
    address: `${props.address}`,
    endDate: `${props.endDate}`,
    publicKey: `${props.publicKey}`,
    privateKey: `${props.privateKey}`
  }
  const blob = new Blob([JSON.stringify(data, null, '  ')], { type: 'application/json;charset=utf-8' })
  const a = document.createElement('a')
  a.download = `${props.title}_parameters_by_bronco_votes_${formatDate(now)}.json`
  a.href = window.URL.createObjectURL(blob)
  a.click()
  a.remove()
}

const formatDate = (d) =>
  d.getSeconds() + '_' + d.getMinutes() + '_' + d.getHours() + '_' + d.getDate() + '_' + d.getMonth() + '_' + d.getFullYear()

// TODO: Display description
const onAboutParameters = () => {
  console.log('Description')
}

const CreateResult = (props) => {
  return (
    <>
      {/* {props.result == 'Success' ? ( */}
      <Result
        status="success"
        title="Successfully Cresated Ballot!"
        subTitle={`Ballot ID: ${props.ballotId} \nAddress: ${props.address}`}
        extra={[
          <Space size="large" align="top" direction="vertical">
            <Alert
              message="Start downloading the parameter file"
              description="Does not start? manual download 👉"
              type="info"
              action={
                <Space direction="vertical">
                  <Button onClick={onAboutParameters} size="small" type="ghost">
                    About Parameter
                    <QuestionOutlined />
                  </Button>
                  <Button onClick={onDownload} size="small" type="primary">
                    Manual download <DownloadOutlined />
                  </Button>
                </Space>
              }
              style={{ margin: 'auto', width: '100%' }}
            />
          </Space>
        ]}
      />
      {/* ) : null} */}
    </>
  )
}

export default CreateResult

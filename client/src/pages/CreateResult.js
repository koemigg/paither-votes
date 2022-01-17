import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Result, Button, Alert, Space, Typography, Divider } from 'antd'
import { DownloadOutlined, QuestionOutlined, LeftOutlined } from '@ant-design/icons'

/* global BigInt */
BigInt.prototype.toJSON = function () {
  return this.toString()
}

// TODO: Auto Download
// TODO: 復元できる情報を増やす
const onDownload = (e, props) => {
  e.preventDefault()
  const now = new Date()
  const data = {
    title: `${props.title}`,
    ballotId: `${props.ballotId}`,
    // address: `${props.address}`,
    // endDate: `${props.endDate}`,
    publicKey: `${JSON.stringify(props.publicKey)}`,
    privateKey: `${JSON.stringify(props.privateKey)}`
  }
  const blob = new Blob([JSON.stringify(data, null, '  ')], { type: 'application/json;charset=utf-8' })
  const a = document.createElement('a')
  a.download = `${props.ballotId}_${props.title}_param_bronco_votes_${formatDate(now)}.json`
  a.href = window.URL.createObjectURL(blob)
  a.click()
  a.remove()
}

const formatDate = (d) => d.getSeconds() + '_' + d.getMinutes() + '_' + d.getHours() + '_' + d.getDate() + '_' + d.getMonth() + '_' + d.getFullYear()

// TODO: Display description
const onAboutParameters = () => {
  console.log('Description')
}

const onBack = () => {
  window.location.reload()
}

export const CreateResult = (props) => {
  console.log('props: ', props)
  return (
    <>
      {props.result == 'Success' ? (
        <Result
          status="success"
          title="Successfully Created Ballot!"
          // TODO: Display address
          subTitle={`Ballot ID: ${props.ballotId}`}
          extra={[
            <Space size="large" align="top" direction="vertical">
              <Alert
                message="Start downloading the parameter file"
                description="Does not start? manual download 👉"
                type="info"
                action={
                  <Space direction="vertical">
                    <Button onClick={onAboutParameters} icon={<QuestionOutlined />} size="small" type="ghost">
                      About Parameter
                    </Button>
                    <Button onClick={(e) => onDownload(e, props)} icon={<DownloadOutlined />} size="small" type="primary">
                      Manual download
                    </Button>
                  </Space>
                }
                style={{ margin: 'auto', width: '100%' }}
              />
              <Button onClick={onBack} icon={<LeftOutlined />}>
                Create New Ballot
              </Button>
            </Space>
          ]}
        />
      ) : null}
    </>
  )
}

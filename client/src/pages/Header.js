import React from 'react'
import { PageHeader, Menu } from 'antd'
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { SubMenu } = Menu

export const Header = (props) => {
  return (
    <div>
      <Menu theme="light" mode="horizontal">
        <Menu.Item key="/vote">
          <Link to="/Vote">
            <span role="img" aria-label="Vote">
              🗳️&nbsp;&nbsp;Vote
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/create" title="Create">
          <Link to="/Create">
            <span role="img" aria-label="Vote">
              ⚖️&nbsp;&nbsp;Create ballot
            </span>
          </Link>
        </Menu.Item>
        <SubMenu key="/count" title="📊&nbsp;&nbsp;Count">
          <Menu.Item key="count:1">
            <Link to="/Count/Creator">Ballot creator (owner)</Link>
          </Menu.Item>
          <Menu.Item key="count:2">
            <Link to="/Count/Voter">Participant (voter)</Link>
          </Menu.Item>
        </SubMenu>
        {/* <Menu.Item key="/settings">
          <Link to="/Settings">
            <span role="img" aria-label="Settings">
              ⚙️&nbsp;&nbsp;Seetings
            </span>
          </Link>
        </Menu.Item> */}
      </Menu>
      <PageHeader className="site-page-header" title={props.title} subTitle={props.subTitle} />
    </div>
  )
}

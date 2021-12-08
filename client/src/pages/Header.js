import React from 'react'
import { PageHeader, Menu } from 'antd'
import { Link } from 'react-router-dom'

export const Header = (props) => {
  return (
    <div>
      <Menu theme="light" mode="horizontal">
        <Menu.Item key="/vote">
          <Link to="/Vote">
            <span role="img" aria-label="Vote">
              Vote 🗳️
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/create">
          <Link to="/Create">
            <span role="img" aria-label="Vote">
              Create poll ⚖️
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/settings">
          <Link to="/Settings">
            <span role="img" aria-label="Settings">
              Seetings ⚙️
            </span>
          </Link>
        </Menu.Item>
      </Menu>
      <PageHeader className="site-page-header" title={props.title} subTitle="" />
    </div>
  )
}

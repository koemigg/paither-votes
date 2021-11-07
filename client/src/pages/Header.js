import React from "react";
import { PageHeader, Menu } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";

export const Header = (props) => {
  const history = useHistory();
  const hasBackIcon = props.backPageName !== "" ? <ArrowLeftOutlined /> : false;
  const backPagePath = "/" + props.backPageName;
  const handleClick = () => {
    history.push(backPagePath);
  };

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="/vote">
          <Link to="/Vote">
            Vote <span>🗳️</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/create">
          <Link to="/Create">
            Create poll <span>⚖️</span>
          </Link>
        </Menu.Item>
      </Menu>
      <PageHeader
        className="site-page-header"
        backIcon={hasBackIcon}
        onBack={handleClick}
        title={props.title}
        subTitle=""
      />
    </div>
  );
};

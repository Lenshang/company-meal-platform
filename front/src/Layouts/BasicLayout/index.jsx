import { createElement, useEffect, useState } from 'react';
import { DefaultFooter, ProLayout } from '@ant-design/pro-components';
import { theme, ConfigProvider, Button, FloatButton, Drawer, Card } from "antd";
import { Link, history } from 'ice';
import * as $Icon from '@ant-design/icons';
import { BulbOutlined, RobotOutlined } from '@ant-design/icons';
import Store from "@/store";
import HttpClient from '@/utils/HttpClient';
import { tranListToMenuTree } from '@/utils/CommonUtils';
import Chat from '@/components/Chat';
import "./index.css";
const { useModel } = Store;

const loopMenuItem = (menus, user) =>
    menus.map(({ icon, children, ...item }) => {
        let roleAuth = true;
        item.auth = (!item.auth) ? ["9999"] : item.auth.split(",");
        if (user.role_id && item.auth && item.auth instanceof Array) {
            if (item.auth.length) {
                roleAuth = item.auth.some((key) => (user.role_id + "") === (key + ""));//item.auth.some((key) => auth[key]);
            }
        }
        if (user.role === "admin" || roleAuth) {
            return ({
                ...item,
                icon: icon ? createElement($Icon[icon]) : null,
                children: children && loopMenuItem(children, user),
            });
        }
        return null;
    });
const logOut = () => {
    window.localStorage.removeItem("token");
    history.push("/user/login");
};
export default function BasicLayout({ children, location }) {
    const [userInfo, dispatchers] = useModel('user');
    const [menuItem, menuDispatchers] = useModel('menu');
    const [localset, localsetDispatchers] = useModel('localset');
    const { changeTheme } = localsetDispatchers;
    const { fetchUserProfile } = dispatchers;
    const [chatOpen, setChatOpen] = useState(false);
    useEffect(() => {
        HttpClient.beforeRequest = (req) => {
            if (req.headers === undefined || req.headers === null) {
                req.headers = {};
            }
            const token = window.localStorage.getItem('token');
            if (token !== undefined && token !== null) {
                req.headers["Authorization"] = 'Bearer ' + token;
            }
            return req;
        };

        HttpClient.beforeResponse = (resp) => {
            if (resp === undefined) {
                history.push('/user/feedback-server-error');
            }

            if (resp.status === 401) {
                history.push("/user/login");
            }
            return resp;
        }
        fetchUserProfile();
        menuDispatchers.fetch();
    }, []);
    return (
        <ConfigProvider
            theme={{
                // 1. 主题
                algorithm: localset.theme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
                // 2. 组合使用暗色算法与紧凑算法
                // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
                components: {
                    Button: {
                        colorLink: localset.theme === "dark" ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.85)",
                        colorLinkHover: localset.theme === "dark" ? "rgba(255, 0, 0, 0.85)" : "#69b1ff",
                        colorPrimary: localset.theme === "dark" ? "#dc0303" : "#1677ff",
                        colorPrimaryHover: localset.theme === "dark" ? "#d14343" : "#4096ff",
                        colorPrimaryActive: localset.theme === "dark" ? "#dc0303" : "#0958d9",
                        colorPrimaryBorder: localset.theme === "dark" ? "#d14343" : "#91caff",
                    },
                    FloatButton: {
                        colorPrimary: localset.theme === "dark" ? "#ffffff" : "#333333",
                        colorTextLightSolid: localset.theme === "dark" ? "#000000" : "#ffffff",
                        colorPrimaryHover: localset.theme === "dark" ? "#cccccc" : "#777777",
                    },
                    Card: {
                        colorBgContainer: localset.theme === "dark" ? "#131313" : "#fbfbfb",
                        colorBorderSecondary: localset.theme === "dark" ? "#999999" : "#999999",
                    }
                }
            }}>
            <ProLayout
                token={{
                    sider: {
                        "colorBgMenuItemSelected": localset.theme === "dark" ? "" : "#e6f4ff",
                        "colorTextMenuSelected": localset.theme === "dark" ? "#ffffff" : "#1677ff",
                    }
                }}
                title="Meal Platform"
                style={{
                    minHeight: '100vh',
                }}
                location={{
                    pathname: location.pathname,
                }}
                layout='mix'
                defaultCollapsed={true}
                breakpoint={false}
                menuDataRender={() => loopMenuItem(tranListToMenuTree(menuItem.item), userInfo)}
                menuItemRender={(item, defaultDom) => {
                    if (!item.path) {
                        return defaultDom;
                    }
                    return <Link to={item.path}>{defaultDom}</Link>;
                }}
                headerRender={() => {
                    return (
                        <div style={{ display: "flex", marginLeft: 10, alignItems: "center" }}>
                            <img src="./mar.7th.jpg"
                                style={{ width: "30px", height: "30px", marginRight: "10px" }} />
                            <span style={{ fontSize: "22px" }}>Meal Platform</span>
                            <div style={{ flex: 1, textAlign: "right", marginRight: 30 }}>
                                <Button type="link" onClick={() => {
                                    if (localset.theme === "dark") {
                                        changeTheme("defult");
                                    }
                                    else {
                                        changeTheme("dark");
                                    }
                                }}><BulbOutlined /></Button>
                                <Button type="link" onClick={logOut}>登出</Button>
                            </div>
                        </div>)
                }}
                footerRender={() => (
                    <DefaultFooter
                        links={[
                            {
                                key: 'git',
                                title: '项目GIT',
                                href: 'https://github.com/Lenshang/company-meal-platform',
                            },
                            {
                                key: 'ls',
                                title: '开发者GIT',
                                href: 'https://github.com/Lenshang',
                            },
                        ]}
                        copyright="2024 CHEN"
                    />
                )}
            >
                <div style={{ minHeight: '60vh', padding: 0 }}>
                    {children}
                    <FloatButton type='primary' shape="square" icon={<RobotOutlined />} description="AI" onClick={() => setChatOpen(true)} />
                    <Chat width={600} onClose={() => { setChatOpen(false) }} open={chatOpen} />
                </div>
            </ProLayout>
        </ConfigProvider>
    );
}

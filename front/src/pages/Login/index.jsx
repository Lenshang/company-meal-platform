import {
    AlipayOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoOutlined,
    UserOutlined,
    WeiboOutlined,
} from '@ant-design/icons';
import {
    LoginFormPage,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';
import { Button, Divider, Space, Tabs, message, theme } from 'antd';
import { useState } from 'react';
import HttpClient from '@/utils/HttpClient';
import { history } from "ice";

const iconStyles = {
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};

const Page = () => {
    const [loginType, setLoginType] = useState('account');
    const { token } = theme.useToken();
    const handleSubmit = async (values) => {
        if (loginType === "phone") {
            message.error("暂不支持！请联系管理员！");
        }

        let resp = await HttpClient.oauth2("/api/auth/token", values.username, values.password);
        if (resp.status === 200) {
            window.localStorage.setItem("token", resp.data.access_token);
            message.success('登录成功');
            history.push("/");
        }
        else {
            message.success(`登录失败! (${resp.data.detail})`);
        }
    };
    return (
        <div
            style={{
                backgroundColor: 'white',
                height: '100vh',
            }}
        >
            <LoginFormPage
                backgroundImageUrl="./login-bg.png"
                logo="./mar.7th.jpg"
                backgroundVideoUrl="./login-bg.mp4"
                title="Meal Platform"
                containerStyle={{
                    backgroundColor: 'rgba(0, 0, 0,0.65)',
                    backdropFilter: 'blur(4px)',
                }}
                subTitle="企业订餐系统"
                onFinish={handleSubmit}
                // activityConfig={{
                //     style: {
                //         boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
                //         color: token.colorTextHeading,
                //         borderRadius: 8,
                //         backgroundColor: 'rgba(255,255,255,0.25)',
                //         backdropFilter: 'blur(4px)',
                //     },
                //     title: '活动标题，可配置图片',
                //     subTitle: '活动介绍说明文字',
                //     action: (
                //         <Button
                //             size="large"
                //             style={{
                //                 borderRadius: 20,
                //                 background: token.colorBgElevated,
                //                 color: token.colorPrimary,
                //                 width: 120,
                //             }}
                //         >
                //             去看看
                //         </Button>
                //     ),
                // }}
                actions={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Divider plain>
                            <span
                                style={{
                                    color: token.colorTextPlaceholder,
                                    fontWeight: 'normal',
                                    fontSize: 14,
                                }}
                            >
                                其他登录方式
                            </span>
                        </Divider>
                        <Space align="center" size={24}>
                            {/* <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid ' + token.colorPrimaryBorder,
                                    borderRadius: '50%',
                                }}
                            >
                                <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid ' + token.colorPrimaryBorder,
                                    borderRadius: '50%',
                                }}
                            >
                                <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    height: 40,
                                    width: 40,
                                    border: '1px solid ' + token.colorPrimaryBorder,
                                    borderRadius: '50%',
                                }}
                            >
                                <WeiboOutlined style={{ ...iconStyles, color: '#1890ff' }} />
                            </div> */}
                        </Space>
                    </div>
                }
            >
                <Tabs
                    centered
                    activeKey={loginType}
                    onChange={(activeKey) => setLoginType(activeKey)}
                >
                    <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
                    <Tabs.TabPane key={'phone'} tab={'手机号登录'} />
                </Tabs>
                {loginType === 'account' && (
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <UserOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            placeholder={'请输入用户名'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            placeholder={'请输入密码'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                    </>
                )}
                {loginType === 'phone' && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <MobileOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            name="mobile"
                            placeholder={'手机号'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入手机号！',
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '手机号格式错误！',
                                },
                            ]}
                        />
                        <ProFormCaptcha
                            fieldProps={{
                                size: 'large',
                                prefix: (
                                    <LockOutlined
                                        style={{
                                            color: token.colorText,
                                        }}
                                        className={'prefixIcon'}
                                    />
                                ),
                            }}
                            captchaProps={{
                                size: 'large',
                            }}
                            placeholder={'请输入验证码'}
                            captchaTextRender={(timing, count) => {
                                if (timing) {
                                    return `${count} ${'获取验证码'}`;
                                }
                                return '获取验证码';
                            }}
                            name="captcha"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码！',
                                },
                            ]}
                            onGetCaptcha={async () => {
                                //message.success('获取验证码成功！验证码为：1234');
                                message.error("暂不支持！请联系管理员！");
                            }}
                        />
                    </>
                )}
                <div
                    style={{
                        marginBlockEnd: 24,
                    }}
                >
                    <ProFormCheckbox noStyle name="autoLogin">
                        自动登录
                    </ProFormCheckbox>
                    <a
                        style={{
                            float: 'right',
                        }}
                    >
                        忘记密码
                    </a>
                </div>
            </LoginFormPage>
        </div>
    );
};

export default () => {
    return (
        <ProConfigProvider dark>
            <Page />
        </ProConfigProvider>
    );
};
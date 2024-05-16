import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Table, Select, Dropdown, Space, Modal, message } from 'antd';
import { DownOutlined, ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components"
import { useAntdTable } from 'ahooks';
import { UserStatusMapper } from '@/utils/Mapper';
import HttpClient from '@/utils/HttpClient';
import CardPanel from '@/components/CardPanel';
import AddModal from "./components/add";
function SystemUser() {
    const [editVisible, setEditVisible] = useState(false);
    const [editData, setEditData] = useState({});
    const [form] = Form.useForm();
    const {
        tableProps,
        search,
        error,
        refresh
    } = useAntdTable(async ({
        current,
        pageSize
    }, formData) => {
        let query = `skip=${(current - 1) * pageSize}&limit=${pageSize}`;
        if (formData["name"] !== null && formData["name"] !== undefined) {
            query += `&name=${formData["name"]}`;
        }
        if (formData["mobile"] !== null && formData["mobile"] !== undefined) {
            query += `&mobile=${formData["mobile"]}`;
        }

        let response = await HttpClient.get(`/api/system/user-list?${query}`);
        if (response.status !== 200) {
            return [];
        }

        let resp_data = response.data;
        let _data = resp_data.data;
        return {
            total: resp_data.count,
            list: _data
        };
    }, {
        defaultPageSize: 10,
        form
    });
    const { submit, reset } = search;

    const changeUserStatus = (item, status_id) => {
        Modal.confirm({
            title: status_id === 10 ? "禁用账户" : "启用账户",
            icon: <ExclamationCircleFilled />,
            content: `确认要${status_id === 10 ? "禁用" : "启用"}此账户吗?`,
            async onOk() {
                item.status = status_id === 10 ? 99 : 10;
                await submitEditPage(item);
                await refresh();
            },
            async onCancel() {
                console.log('Cancel');
            },
        });
    };

    const onEditPageVisibalChange = (visible) => {
        setEditVisible(visible);
        if (!visible) {
            refresh();
        }
    };

    const showEditPage = (data = null, edit = false) => {
        data["edit"] = edit;
        if (data != null) {
            setEditData(data);
        }
        else {
            setEditData({});
        }
        setEditVisible(true);
    };

    const submitEditPage = async (values) => {
        let url = "/api/system/update-user";
        let isAdd = false;
        if (values["id"] === undefined) {
            url = "/api/system/create-user";
            isAdd = true;
        }
        let resp = await HttpClient.put(url, values);

        if (resp.status !== 200) {
            // Notification.error({
            //     title: isAdd ? "添加失败!" : "更新失败!",
            //     content: JSON.stringify(resp.data.detail)
            // });
            message.error((isAdd ? "添加失败!" : "更新失败!") + resp.data.detail)
            return false;
        }
        else {
            // Notification.success({
            //     title: isAdd ? "添加成功!" : "更新成功!"
            // });
            message.success(isAdd ? "添加成功!" : "更新成功!");
            return true;
        }
    };

    const columns = [
        {
            title: '用户名',
            dataIndex: "username",
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (v, i, r) => { return UserStatusMapper[v]; }
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            dataIndex: 'status',
            width: 100,
            render: (v, r, i) => <Dropdown
                menu={{
                    items: [{
                        key: '1',
                        label: '修改',
                        onClick: () => { showEditPage(r, true); }
                    }, {
                        key: "2",
                        label: v === 10 ? '禁用' : '启用',
                        onClick: () => { changeUserStatus(r, v); }
                    }],
                }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        操作
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>,
        },
    ];

    const SearchForm = (
        <div>
            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="用户名查询" name="name">
                            <Input placeholder="name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="手机号查询" name="mobile">
                            <Input placeholder="mobile" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} justify="end">
                    <Button type="primary" onClick={submit}>
                        查询
                    </Button>
                    <Button onClick={reset} style={{ marginLeft: 16 }}>
                        重置
                    </Button>
                </Row>
            </Form>
        </div>
    );
    return (
        <PageContainer
            header={{
                breadcrumb: { items: [{ title: '系统' }, { title: '用户管理' }] },
            }}>
            <CardPanel>
                {SearchForm}
            </CardPanel>
            <CardPanel
                style={{ marginTop: "10px" }}
                title={
                    <div style={{ display: "flex" }}>
                        <div>用户列表</div>
                        <div style={{ flex: 1, textAlign: "right" }}><Button type='primary' onClick={() => { showEditPage({}, false); }}><PlusOutlined />新增</Button></div>
                    </div>}
            >
                <Table columns={columns} rowKey="username" {...tableProps} scroll={{ x: 600 }} />
            </CardPanel>
            {/* 弹出式表单 */}
            <AddModal
                visible={editVisible}
                onVisibleChange={onEditPageVisibalChange}
                dataSource={editData}
                onSubmit={submitEditPage} />
        </PageContainer>
    );
}
export default SystemUser;
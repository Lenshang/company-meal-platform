import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Input, Row, Table, Select, Dropdown, Space, Modal, message } from 'antd';
import { DownOutlined, ExclamationCircleFilled, PlusOutlined, RedoOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components"
import { useAntdTable } from 'ahooks';
import { UserStatusMapper } from '@/utils/Mapper';
import HttpClient from '@/utils/HttpClient';
import CardPanel from '@/components/CardPanel';
import AddModal from "./components/add";
import { TaskStatusMap } from "@/utils/Mapper";
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
        if (formData["status"] !== null && formData["status"] !== undefined) {
            query += `&status=${formData["status"]}`;
        }
        // if (formData["mobile"] !== null && formData["mobile"] !== undefined) {
        //     query += `&mobile=${formData["mobile"]}`;
        // }

        let response = await HttpClient.get(`/api/submit/query?${query}`);
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

    // const changeUserStatus = (item, status_id) => {
    //     Modal.confirm({
    //         title: status_id === 10 ? "禁用账户" : "启用账户",
    //         icon: <ExclamationCircleFilled />,
    //         content: `确认要${status_id === 10 ? "禁用" : "启用"}此账户吗?`,
    //         async onOk() {
    //             item.status = status_id === 10 ? 99 : 10;
    //             await submitEditPage(item);
    //             await refresh();
    //         },
    //         async onCancel() {
    //             console.log('Cancel');
    //         },
    //     });
    // };

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
        // console.log(values);
        // return false;
        let url = "/api/submit/update";
        let resp = await HttpClient.post(url, values);

        if (resp.status !== 200) {
            // Notification.error({
            //     title: isAdd ? "添加失败!" : "更新失败!",
            //     content: JSON.stringify(resp.data.detail)
            // });
            message.error("任务添加失败!" + resp.data.detail)
            return false;
        }
        else {
            // Notification.success({
            //     title: isAdd ? "添加成功!" : "更新成功!"
            // });
            message.success("任务添加成功!");
            return true;
        }
    };

    const columns = [
        {
            title: 'id',
            dataIndex: "id",
            width: 60,
        },
        {
            title: 'Git',
            dataIndex: 'git',
            width: 300,
        },
        {
            title: 'Git Tag',
            dataIndex: 'git_tag',
            width: 160,
        },
        {
            title: '麦昆镜像Tag',
            dataIndex: 'reactive_calc_tag',
            width: 160,
        },
        {
            title: 'ClickHouse表名',
            dataIndex: 'table_name',
            width: 160,
        },
        {
            title: '是否存储TickFactor',
            dataIndex: 'storage_tick_factor',
            render: (v, i, r) => v == 1 ? '是' : '否',
            width: 160,
        },
        {
            title: '容器ID',
            dataIndex: 'docker_container_id',
            width: 160,
        },
        {
            title: '错误消息',
            dataIndex: 'error_msg',
            width: 300,
        },
        {
            title: '状态',
            fixed: 'right',
            dataIndex: 'status',
            width: 100,
            render: (v, i, r) => { return TaskStatusMap[v]; }
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            dataIndex: 'status',
            width: 60,
            render: (v, r, i) => <Dropdown
                menu={{
                    items: [{
                        key: '1',
                        label: '查看日志',
                        onClick: () => { }
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
                        <Form.Item label="状态" name="status">
                            <Select>
                                <Select.Option value="-99">全部</Select.Option>
                                <Select.Option value="0">Init</Select.Option>
                                <Select.Option value="1">容器待启动</Select.Option>
                                <Select.Option value="2">容器运行中</Select.Option>
                                <Select.Option value="3">运行完毕待评测</Select.Option>
                                <Select.Option value="4">评测中</Select.Option>
                                <Select.Option value="5">评测完毕</Select.Option>
                                <Select.Option value="-1">任务失败</Select.Option>
                                <Select.Option value="-2">手动取消</Select.Option>
                            </Select>
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
                breadcrumb: { items: [{ title: '因子提交' }, { title: '因子提交' }] },
            }}>
            <CardPanel>
                {SearchForm}
            </CardPanel>
            <CardPanel
                style={{ marginTop: "10px" }}
                title={
                    <div style={{ display: "flex" }}>
                        <div>提交记录</div>
                        <div style={{ flex: 1, textAlign: "right" }}>
                            <Button type='primary' onClick={() => { showEditPage({}, false); }}><PlusOutlined />新增</Button>
                            <Button type="link" shape="circle" onClick={refresh}>
                                <RedoOutlined />
                            </Button>
                        </div>
                    </div>}
            >
                <Table columns={columns} rowKey="username" {...tableProps} scroll={{ x: 2400 }} />
            </CardPanel>
            {/* 弹出式表单 */}
            <AddModal
                visible={editVisible}
                onVisibleChange={onEditPageVisibalChange}
                onSubmit={submitEditPage} />
        </PageContainer>
    );
}
export default SystemUser;
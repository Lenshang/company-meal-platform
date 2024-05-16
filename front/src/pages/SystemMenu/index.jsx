import React, { useState, useEffect } from 'react';
import { deepCopy, tranListToMenuTree } from '@/utils/CommonUtils';
import { Tree } from 'antd';
import HttpClient from '@/utils/HttpClient';
import Store from "@/store";
import Store from "@/store";
import styles from './index.module.css';

const { Cell } = ResponsiveGrid;
const FormItem = Form.Item;
const { useModel } = Store;

function SystemMenu() {
    const field = Field.useField([]);
    const [menuItem, dispatchers] = useModel('menu');
    const [selectData, setSelectData] = useState({});
    const [editLoading, setEditLoading] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [roleData, setRoleData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        // (async () => {
        //     await dispatchers.fetch();
        // })();
        (async () => {
            let response = await HttpClient.get(`/api/system/role-list`);
            if (response.status !== 200) {
                Notification.error({
                    title: "获得角色信息失败",
                    content: response.data.detail
                });
                return [];
            }
            let resp_data = response.data;
            setRoleData(resp_data.map((item) => {
                return { value: item.id, label: item.name + `(${item.description})` };
            }));
        })();
    }, []);

    const onSelect = (selectedKeys, extra) => {
        let _data = {};
        if (selectedKeys.length !== 0) {
            let _id = parseInt(selectedKeys[0], 10);
            _data = menuItem.item.filter(x => x.id === _id)[0];
            if (!_data) {
                _data = {
                    name: "",
                    path: "",
                    icon: "",
                    auth: "",
                    id: _id
                };
            }
            else {
                _data = deepCopy(_data);
            }
            _data.auth = _data.auth.length > 0 ? _data.auth.split(",").map(i => parseInt(i, 10)) : [];
        }

        setSelectData(_data);
        field.setValues(_data);
    };

    const onDrop = async (info) => {
        if (!info.dragNode) {
            return;
        }
        const dragKey = info.dragNode.props.eventKey;//拖动的节点KEY
        const dropKey = info.node.props.eventKey;//放下的节点KEY
        const { dropPosition } = info;//放下时的位置 0=该节点下 -1该节点之前 1该节点之后

        //找出改变位置后的所有同级节点
        let _id = parseInt(dropKey, 10);
        let dropData = menuItem.item.filter(x => x.id === _id)[0];
        let pid = -1;
        let dragData = deepCopy(menuItem.item.filter(x => x.id === parseInt(dragKey, 10))[0]);
        if (dropPosition === 0) {
            pid = _id;
            let r = [];
            let levelData = menuItem.item.filter(x => x.parent_id === pid);
            let last_index = 0;
            for (let index in levelData) {
                let _item = deepCopy(levelData[index]);
                _item.priority = index;
                r.push(_item);
                last_index = index;
            }
            dragData.priority = last_index + 1;
            dragData.parent_id = pid;
            r.push(dragData);
            let response = await HttpClient.put("/api/menu/update-priority", r);
        }
        else {
            pid = dropData.parent_id;
            let r = [];
            let levelData = menuItem.item.filter(x => x.parent_id === pid);
            let index = 0;
            for (let item of levelData) {
                let _item = deepCopy(item);
                if (_item.id === dragData.id) {
                    //Nothing to do.....
                }
                else if (_item.id === _id && dropPosition === -1) {
                    dragData.priority = index;
                    dragData.parent_id = pid;
                    r.push(dragData);
                    index += 1;
                    _item.priority = index;
                    r.push(_item);
                }
                else if (_item.id === _id && dropPosition === 1) {
                    _item.priority = index;
                    r.push(_item);
                    index += 1;
                    dragData.priority = index;
                    dragData.parent_id = pid;
                    r.push(dragData);
                }
                else {
                    _item.priority = index;
                    r.push(_item);
                }
                index += 1;
            }
            console.log(r);
            let response = await HttpClient.put("/api/menu/update-priority", r);
        }

        await dispatchers.fetch();
    };

    const onEditPageVisibalChange = (visible) => {
        setEditVisible(visible);
        if (!visible) {
            dispatchers.fetch();
        }
    };

    const submitEditPage = async (values) => {
        setEditLoading(true);
        if (values.auth != undefined) {
            values.auth = values.auth.join(",");
        }
        else {
            values.auth = ""
        }
        let url = "/api/menu/add";
        values.parent_id = selectData.id;
        let resp = await HttpClient.put(url, values);

        setEditLoading(false);
        if (resp.status !== 200) {
            Notification.error({
                title: "添加失败!",
                content: JSON.stringify(resp.data.detail)
            });
            return false;
        }
        else {
            Notification.success({
                title: "添加成功!"
            });
            return true;
        }
    };

    const submitUpdate = async () => {
        const {
            errors
        } = await field.validatePromise();

        if (errors && Object.keys(errors).length > 0) {
            return;
        }
        setLoading(true);
        let url = "/api/menu/update";
        let values = field.getValues();
        if (values.auth != undefined) {
            values.auth = values.auth.join(",");
        }
        else {
            values.auth = ""
        }
        let resp = await HttpClient.put(url, values);
        if (resp.status !== 200) {
            Notification.error({
                title: "修改失败!",
                content: JSON.stringify(resp.data.detail)
            });
        }
        else {
            Notification.success({
                title: "修改成功!"
            });
        }
        setLoading(false);
    };
    return (
        <Tree
            className="draggable-tree"
            defaultExpandedKeys={expandedKeys}
            draggable
            blockNode
            onDragEnter={onDragEnter}
            onDrop={onDrop}
            treeData={gData}
        />
    );
}
import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, List, Avatar, Space, Button, Drawer } from "antd";
import HttpClient from '@/utils/HttpClient';
function Chat(props) {
    const { onClose, open, ...others } = props;
    const [inputValue, setInputValue] = useState("");
    const [msgList, setMsgList] = useState([])
    const [isTyping, setIsTyping] = useState(false);
    const [chatSession, setChatSession] = useState("");
    const avatarMap = {
        "YOU": <Avatar style={{ backgroundColor: 'rgb(238, 78, 59)' }}>YOU</Avatar>,
        "AI": <Avatar style={{ backgroundColor: 'rgb(59, 78, 244)' }}>AI</Avatar>,
    }
    const scrollChatToEnd = () => {
        let chatscroll = document.querySelector("#chatlist");
        if ([null, undefined, NaN, ""].indexOf(chatscroll) < 0) {
            chatscroll.scrollTop = chatscroll.scrollHeight;
        }
    }
    const send = async () => {
        console.log('发送' + inputValue);

        setInputValue("");
        setIsTyping(true);

        let params = {
            "user_input": inputValue,
            "history": [],
            "session": chatSession,
            "user_name": "admin"
        }
        let _i = 0;
        while (_i < msgList.length) {
            params["history"].push([
                msgList[_i].msg,
                msgList[_i + 1].msg
            ]);
            _i += 2
        }
        setMsgList(prev => [...prev, {
            name: "YOU",
            msg: inputValue
        }, {
            name: "AI",
            msg: "正在输入...",
            typing: true
        }]);
        setTimeout(() => { scrollChatToEnd(); }, 100);
        let url = "/api/news/send?";
        let response = await HttpClient.put(url, params)
        if (response.status === 200) {
            if (response.data.session) {
                setChatSession(response.data.session)
            }
            setMsgList(prev => [...prev.slice(0, prev.length - 1), {
                name: "AI",
                msg: response.data.msg
            }]);
        }
        else {
            setMsgList(prev => [...prev.slice(0, prev.length - 1), {
                name: "AI",
                msg: "请求失败，请联系管理员"
            }]);
        }
        setTimeout(() => { scrollChatToEnd(); }, 100);
        setIsTyping(false);

    }

    const clearmsg = () => {
        setMsgList([]);
        setChatSession("");
    }
    return (
        <Drawer
            title="AI助手"
            width={600}
            onClose={onClose}
            open={open}
            extra={
                <Button onClick={clearmsg} type='text'>清空</Button>
            }>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
                <Card style={{ padding: 0, "flex": 1, overflow: "auto" }} id="chatlist">
                    <List
                        style={{ width: "100%", height: "100%" }}
                        dataSource={msgList}
                        renderItem={(item, index) => (
                            <List.Item key={index}>
                                <List.Item.Meta
                                    avatar={avatarMap[item.name]}
                                    title={item.name}
                                    description={<div dangerouslySetInnerHTML={{ __html: item.msg }}></div>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
                <Space.Compact style={{ width: '100%', marginTop: 15 }}>
                    <Input.TextArea
                        // style={{ width: "100%", marginTop: 10 }}
                        allowClear
                        placeholder='Please Enter something'
                        value={inputValue}
                        onChange={v => {
                            setInputValue(v.target.value);
                        }}
                        onKeyUp={e => {
                            if (isTyping) return;
                            if (e.key != "Enter") return;
                            send();
                        }} />
                    <Button type="primary" style={{ height: "100%" }}>发送</Button>
                </Space.Compact>
            </div>
        </Drawer>
    );
}

export default Chat;

let GenderMapper = {
    0: "保密",
    1: "男",
    2: "女"
}

let UserStatusMapper = {
    10: "正常",
    99: "禁用"
}

let TaskStatusMap = {
    0: "任务创建",
    1: "容器待启动",
    2: "容器运行中",
    3: "运行完毕待评测",
    4: "评测中",
    5: "评测完毕",
    "-1": "任务出错",
    "-2": "手动取消"
}
export { GenderMapper, UserStatusMapper, TaskStatusMap }
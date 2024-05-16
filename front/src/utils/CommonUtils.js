/**
 * Async 异步休眠
 * @param {*} mSeconds 
 * @returns 
 */
export function sleep(mSeconds) {
    return new Promise((resolve, reject) => {
        setInterval(() => {
            resolve();
        }, mSeconds);
    });
}

export function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "y+": date.getFullYear().toString(),        // 年
        "M+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}

export function intdateFormat(fmt, int_date) {
    let _date_str = String(int_date);
    let _year = _date_str.substring(0, 4);
    let _month = _date_str.substring(4, 6);
    let _day = _date_str.substring(6, 8);
    _date_str = _year + "-" + _month + "-" + _day;
    return dateFormat(fmt, new Date(_date_str));
}

export function strToNumDate(datestr) {
    return dateFormat("yyyyMMdd", new Date(datestr));
}

export function deepCopy(item) {
    return JSON.parse(JSON.stringify(item));
}

export function tranListToMenuTree(list) {
    list = deepCopy(list);
    // 最终要产出的树状数据的数组
    const treeList = [];
    // 所有项都使用对象存储起来
    const map = {};

    // 建立一个映射关系：通过id快速找到对应的元素
    list.forEach(item => {
        if (!item.children) {
            item.children = [];
        }
        map[item.id] = item;
    });

    list.forEach(item => {
        // 对于每一个元素来说，先找它的上级
        //    如果能找到，说明它有上级，则要把它添加到上级的children中去
        //    如果找不到，说明它没有上级，直接添加到 treeList
        item.label = item.name;
        item.key = item.id + "";
        const parent = map[item.parent_id];
        // 如果存在上级则表示item不是最顶层的数据
        if (parent) {
            parent.children.push(item);
        } else {
            // 如果不存在上级 则是顶层数据,直接添加
            treeList.push(item);
        }
    });
    // 返回出去
    return treeList;
}

export function tranListToSideMenu(list) {
    list = deepCopy(list);
    // 最终要产出的树状数据的数组
    const treeList = [];
    // 所有项都使用对象存储起来
    const map = {};

    // 建立一个映射关系：通过id快速找到对应的元素
    list.forEach(item => {
        if (!item.children) {
            item.children = [];
        }
        map[item.id] = item;
    });

    list.forEach(item => {
        // 对于每一个元素来说，先找它的上级
        //    如果能找到，说明它有上级，则要把它添加到上级的children中去
        //    如果找不到，说明它没有上级，直接添加到 treeList
        item.label = item.name;
        item.key = item.id + "";
        const parent = map[item.parent_id];
        // 如果存在上级则表示item不是最顶层的数据
        if (parent) {
            parent.children.push(item);
        } else {
            // 如果不存在上级 则是顶层数据,直接添加
            treeList.push(item);
        }
    });
    // 返回出去
    return treeList;
}

/**
 * 转换金额显示，保留指定位数以及千分位添加逗号
 * @param {*} money 
 * @param {*} precision 
 * @param {*} splitDesc 
 * @returns 
 */
export function formatMoney(money, precision = 2, splitDesc = ',') {
    if (money === "" || money === null || money === undefined) {
        money = 0;
    }
    precision = +precision; // 这里为了处理precision传入null  +null=0
    const str = money.toFixed(precision);
    const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, '$1' + splitDesc);
}

/**
 * 数组去重
 * @param {*} arr 
 * @returns 
 */
export function arrayTrim(arr) {
    return Array.from(new Set(arr));
}

export const exportCSV = async (mainList, mainTitle, mainTitleForKey, filename) => {
    const mainStr = [];
    mainStr.push(mainTitle.join(',') + '\n'); // 把表格名称拼接进去
    for (let i = 0; i < mainList.length; i++) {
        const temp = [];
        for (let j = 0; j < mainTitleForKey.length; j++) {
            const strItem = '"' + mainList[i][mainTitleForKey[j]] + '"';
            temp.push(strItem + '');
        }
        mainStr.push(temp.join(',') + '\n');
    }
    const merged = mainStr.join('');
    const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(merged);
    const link = document.createElement('a'); //通过创建a标签实现
    link.href = uri;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
};
export function isNull(value) {
    return value === null || value === undefined || value === "";
}

export function isNullOrEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }
    if (value.toString().trim() === "") {
        return true;
    }
    return false;
}

export const toFixed = (v, p) => {
    try {
        return v.toFixed(p);
    }
    catch {
        return v;
    }
};

export function ObjectSortByKey(objs) {
    let r = {};
    for (let key of Object.keys(objs).sort()) {
        r[key] = objs[key];
    }
    return r;
}


// 计算反色, ilighten - 减弱对比度(-1 ~ -15)
// 示例: oppositeColor("#000000", -4); 返回: #bbbbbb
function oppositeColor(a, ilighten) {
    a = a.replace('#', '');
    //var max16 = 15;
    var max16 = Math.floor(15 + (ilighten || 0));
    if (max16 < 0 || max16 > 15) max16 = 15;

    var c16, c10, b = [];

    for (var i = 0; i < a.length; i++) {
        c16 = parseInt(a.charAt(i), 16);    // to 16进制
        c10 = parseInt(max16 - c16, 10);    // 10进制计算
        if (c10 < 0) c10 = Math.abs(c10);
        b.push(c10.toString(16));           // to 16进制
    }
    return '#' + b.join('');
}
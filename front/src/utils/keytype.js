let raw_key = { 'PERSON': '人物', 'LOCATION': '地点', 'ORGANIZATION': '组织', 'DATE': '日期', 'DURATION': '时长', 'TIME': '时间', 'PERCENT': '百分比', 'MONEY': '金钱', 'FREQUENCY': '频率', 'INTEGER': '整数', 'FRACTION': '分数', 'DECIMAL': '小数', 'ORDINAL': '序数', 'RATE': '比率', 'AGE': '年龄', 'WEIGHT': '重量', 'LENGTH': '长度', 'TEMPERATURE': '温度', 'ANGLE': '角度', 'AREA': '面积', 'CAPACITY': '容积', 'SPEED': '速度', 'ACCELERATION': '加速度', 'MEASURE': '测度', 'EMAIL': '电子邮箱', 'PHONE': '电话', 'FAX': '传真', 'TELEX': '电传', 'WWW': '网址', 'POSTALCODE': '邮编' }



let key_colormap = (() => {
    let _colors = [
        // "#060",
        // "#600",
        // "#006",
        // "#660",
        // "#066"

        // "AliceBlue", "AntiqueWhite", "Aqua",
        // "Aquamarine", "Azure", "Beige",
        // "Bisque", "BlanchedAlmond", "BlueViolet",
        // "Brown", "BurlyWood", "CadetBlue",
        // "Chartreuse", "Chocolate", "Coral",
        // "CornflowerBlue", "Cornsilk", "Crimson",
        // "Cyan", "DarkBlue", "DarkCyan",
        // "DarkGoldenRod", "DarkGray", "DarkGrey",
        // "DarkKhaki", "DarkMagenta", "DarkOliveGreen",
        // "Darkorange", "DarkOrchid", "DarkRed",
        // "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue",
        "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise",
        "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey",
        "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Gainsboro",
        "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey",
        "GreenYellow", "HoneyDew", "HotPink",
        "IndianRed", "Indigo", "Ivory",
        "Khaki", "Lavender", "LavenderBlush",
        "LawnGreen", "LemonChiffon", "LightBlue",
        "LightCoral", "LightCyan", "LightGoldenRodYellow",
        "LightGray", "LightGrey", "LightGreen", "LightPink",
        "LightSalmon", "LightSeaGreen", "LightSkyBlue",
        "LightSlateGray", "LightSlateGrey", "LightSteelBlue",
        "LightYellow", "LimeGreen", "Linen",
        "Magenta", "MediumAquaMarine", "MediumBlue",
        // "MediumOrchid", "MediumPurple", "MediumSeaGreen",
        // "MediumSlateBlue", "MediumSpringGreen",
        // "MediumTurquoise", "MediumVioletRed", "MidnightBlue",
        // "MintCream", "MistyRose", "Moccasin",
        // "NavajoWhite", "OldLace", "OliveDrab",
        // "Orange", "OrangeRed", "Orchid", "PaleGoldenRod",
        // "PaleGreen", "PaleTurquoise", "PaleVioletRed",
        // "PapayaWhip", "PeachPuff", "Peru", "Pink",
        // "Plum", "PowderBlue", "Purple",
        // "RebeccaPurple", "RosyBrown", "RoyalBlue",
        // "SaddleBrown", "Salmon", "SandyBrown",
        // "SeaGreen", "SeaShell", "Sienna", "Silver",
        // "SkyBlue", "SlateBlue", "SlateGray",
        // "SlateGrey", "Snow", "SpringGreen",
        // "SteelBlue", "Tan", "Teal",
        // "Thistle", "Tomato", "Turquoise",
        // "Violet", "Wheat", "WhiteSmoke",
        // "YellowGreen"
        // "black", "silver", "gray", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua"
    ];
    let all_keys = Object.keys(raw_key);
    let r = {};
    for (let index in all_keys) {
        let k = all_keys[index];
        r[k] = _colors[index % _colors.length]
    }
    return r;
})()

let key_colormap2 = (() => {
    let _colors = [
        "black", "silver", "gray", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua"
    ];
    let all_keys = Object.keys(raw_key);
    let r = {};
    for (let index in all_keys) {
        let k = all_keys[index];
        r[k] = _colors[index % _colors.length]
    }
    return r;
})()

export { key_colormap, key_colormap2, raw_key }
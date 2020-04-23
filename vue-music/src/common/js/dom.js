export function getData (el, name, val) {
    let data = 'data-';
    // 传了val说明是要把data-属性值设为val,否则是获取
    if(val) {
        return el.setAttribute(data + name, val)
    } else {
        return el.getAttribute(data + name)
    }
}

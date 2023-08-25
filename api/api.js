import request from "./request"
export function login(data) {
    return request({
        url: "miniApp/api/wmsuser/login",
        method: 'POST',
        data
    });
}

export function getAddressList(data) {
    return request({
        url: "api/address/likeList",
        method: 'GET',
        data
    });
}

export function addAddress(data) {
    return request({
        url: "api/address/add",
        method: 'POST',
        data
    });
}
export function editAddress(data) {
    return request({
        url: "api/address/edit",
        method: 'POST',
        data
    });
}

export function deleteAddress(id) {
    return request({
        url: "api/address/remove/"+id,
        method: 'POST'
    });
}

export function getAddressDetail(id) {
    return request({
        url: "api/address/" + id,
        method: 'GET'
    });
}

export function getCategoryList(data) {
    return request({
        url: "miniApp/api/commodity/getCategoryList",
        method: 'GET',
        data
    });
}

export function getCommodity(data) {
    return request({
        url: "miniApp/api/commodity/getCommodity",
        method: 'GET',
        data
    });
}
export function getCommodityDetail(data) {
    return request({
        url: "miniApp/api/commodity/commodityDetail",
        method: 'GET',
        data
    });
}
export function getPurchaseDetails(data) {
    return request({
        url: "miniApp/api/commodity/purchaseDetails",
        method: 'GET',
        data
    });
}


export function getTaxFee(data) {
    return request({
        url: "app/order/miniAppTaxFee",
        method: 'POST',
        data
    });
}
export function addMiniOrder(data) {
    return request({
        url: "app/order/addMiniOrder",
        method: 'POST',
        data
    });
}
export function getOrderList(data) {
    return request({
        url: "app/order/miniAppOrder/list",
        method: 'GET',
        data
    });
}

export function getOrderDetail(id) {
    return request({
        url: "api/businessOrder/" + id,
        method: 'GET',
    });
}
export function getSizeDetails(data) {
    return request({
        url: "miniApp/api/commodity/size",
        method: 'GET',
        data
    });
}

export function getDefectList(data) {
    return request({
        url: "miniApp/api/commodity/defect/list",
        method: 'GET',
        data
    });
}
export function getServiceMoney() {
    return request({
        url: "miniApp/api/wmsuser/getServiceMoney",
        method: 'GET'
    });
}

export function getServiceMonerysLogList(data) {
    return request({
        url: "miniApp/api/wmsuser/selServiceMonerysLogList",
        method: 'GET',
        data
    });
}

export function getShopList(data) {
    return request({
        url: "miniApp/api/wmsuser/selBindBusUserShopRefList",
        method: 'GET',
        data
    });
}
export function changeShop(data) {
    return request({
        url: "miniApp/api/wmsuser/switchShop",
        method: 'GET',
        data
    });
}

export function setUserInfo(data) {
    return request({
        url: "system/api/wmsuser/edit",
        method: 'PUT',
        data
    });
}
export function selUserInfo() {
    return request({
        url: "system/api/wmsuser/details",
        method: 'GET'
    });
}

export function getAliossModel(data) {
    return request({
        url: "wms/alioss",
        method: 'GET',
        data
    });
}
export function getPayInfo(data) {
    return request({
        url: "app/order/pay",
        method: 'POST',
        data
    });
}

export function getBuyServiceInfo(data) {
    return request({
        url: "miniApp/api/wmsuser/rechargeServiceMoney",
        method: 'POST',
        data
    });
}
export function cancelOrder(data) {
    return request({
        url: "api/businessOrder",
        method: 'PUT',
        data
    });
}

export function getLogistics(data) {
    return request({
        url: "system/api/logistics/all/" +data,
        method: 'GET'
    });
}

export function getProvince() {
    return request({
        url: "api/address/provincelist",
        method: 'POST'
    });
}
export function getCity(data) {
    return request({
        url: "api/address/sysCitylist",
        method: 'POST',
        data
    });
}
export function getArea(data) {
    return request({
        url: "api/address/sysArealist",
        method: 'POST',
        data
    });
}

// 462463917906336
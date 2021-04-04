import { axios } from '@/utils/request'

export function selectCompany() {
    return axios({
        url: '/estate/selectCompany',
        method: 'get'
    })
}

export function insertEstate(params) {
    return axios({
        url: '/estate/insertEstate',
        method: 'post',
        data: params
    })
}

export function selectBuilding(params) {
    return axios({
        url: '/estate/selectBuilding',
        method: 'post',
        data: params
    })
}

export function updateBuildings(params) {
    return axios({
        url: '/estate/updateBuilding',
        method: 'post',
        data: params
    })
}

export function selectUnit(params) {
    return axios({
        url: '/estate/selectUnit',
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function updateUnit(params) {
    return axios({
        url: '/estate/updateUnit',
        method: 'post',
        data: params
    })
}

export function insertctCell(params) {
    return axios({
        url: '/estate/insertCell',
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function updateCell(params) {
    return axios({
        url: '/estate/updateCell',
        method: 'post',
        data: params
    })
}

export function selectBuildingName(params) {
    return axios({
        url: '/estate/selectBuildingName',
        method: 'post',
        data: params
    })
}

export function selectUnitName(params) {
    return axios({
        url: '/estate/selectUnitName',
        method: 'post',
        data: params
    })
}

export function selectCell(params) {
    return axios({
        url: '/estate/selectCell',
        method: 'post',
        data: params
    })
}

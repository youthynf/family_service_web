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

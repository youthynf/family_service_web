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

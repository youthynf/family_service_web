const oneStep = {
    state: {
        buildingNumber: ''
    },
    mutations: {
        // 这里只能是同步的
        SET_TITLE(state, payload) {
            console.log(payload)
            state.buildingNumber = payload.buildingNumber
            state.estateCode = payload.estateCode
        }
    },
    actions: {

    },
    getters: {

    }
}
export default oneStep

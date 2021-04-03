const twoStep = {
    state: {
        unitMessage: []
    },
    mutations: {
        SET_TITLE(state, payload) {
            console.log(payload)
            state.unitMessage = payload.unitMessage
        }
    },
    actions: {

    },
    getters: {

    }
}
export default twoStep

const threeStep = {
    state: {
        cellMessage: [],
        estateCode: ''
    },
    mutations: {
        SET_TITLE(state, payload) {
            console.log(payload)
            state.cellMessage = payload.cellMessage
            state.estateCode = payload.estateCode
        }
    },
    actions: {

    },
    getter: {

    }
}
export default threeStep

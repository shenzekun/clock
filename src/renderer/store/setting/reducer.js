import * as setting from './acitonType';

const initData = {
    breakTime: 0,
    workTime: 111,
    wavPath: ''
}

export default (state = initData, action = {}) => {
    switch (action.type) {
        case setting.SELECT_WORK_TIME:
            return {
                ...state,
                ...{workTime: action.workTime}
            }
        case setting.SELECT_BREAK_TIME:
            return {
                ...state,
                ...{breakTime: action.breakTime}
            }
        default:
            return state;
    }
}

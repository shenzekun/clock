import * as setting from './acitonType';

export const setBreakTime = time => {
    return {
        type: setting.SELECT_BREAK_TIME,
        breakTime: time
    }
}

export const setWorkTime = time => {
    return {
        type: setting.SELECT_WORK_TIME,
        workTime: time
    }
}

import http from "./http.js"

const getMyLeave = async function(hrId) {
    let data = {
        "hrid": hrId,
    }
    try {
        const response = await http.post("/hr/veiwMyLeave", data)
        if (response.status == 200) {
            const data = response.data;
            if (data.success) {
                return getNecessaryFromLeave(data.response.allCarrierRecord)
            }
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const getNecessaryFromLeave = function(ret) {
    let result = []
    ret.forEach(item => {
        let temp = {
            "id":item.LAid,
            "leaveFrom":item.leaveDateFrom,
            "leaveTo":item.leaveDateTo,
            "fromHalf":item.leaveDateFrom_halfDayLeave,
            "toHalf":item.leaveDateTo_halfDayLeave,
            "status":item.status,
            "reason":item.leaveReason,
            "leaveType": item.leaveType,
            "lastUpdateTimeStamp": item.lastUpdateTimeStamp,
            "hrId": item.LAhrid ? item.LAhrid : 0
        }
        result.push(temp)
    })
    return result
}

const applyLeave = async function(hrId, data) {
    let jsonData = {
        "hrid": 1,
        "leaveType": data.leaveType,
        "leaveDateFrom": data.leaveDateFrom,
        "leaveDateFrom_halfDayLeave": data.fromHalf ? 1 : 0,
        "leaveDateTo": data.leaveDateTo,
        "leaveDateTo_halfDayLeave": data.toHalf ? 1 : 0,
        "leaveReason": data.leaveReason
    }
    try {
        const response = await http.post("/hr/leaveapply", jsonData)
        return (response.status == 200)
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const modifyLeave = async function(id, data) {
    let jsonData = {
        "id": id,
        "leaveType": data.leaveType,
        "leaveDateFrom": data.leaveDateFrom,
        "leaveDateFrom_halfDayLeave": data.fromHalf ? 1 : 0,
        "leaveDateTo": data.leaveDateTo,
        "leaveDateTo_halfDayLeave": data.toHalf ? 1 : 0,
        "leaveReason": data.leaveReason
    }
    try {
        const response = await http.post("/hr/leavemodify", jsonData)
        return (response.status == 200)
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const cancelLeaveByMe = async function(id, reason, lastTime) {
    let jsonData = {
        "action": "leave-cancelled-by-requestor",
        "cancelling_leave_application_id": id,
        "reason_for_cancellation": reason,
        "lastUpdateTimeStamp": lastTime
    }
    try {
        const response = await http.post("/hr/cancelLeavebyMe", jsonData)
        return (response.status == 200)
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const approveLeaveByHR = async function(hrId, id, lastTime, balance) {
    let jsonData = {
        "approving_hr_id": hrId,
        "approving_leave_application_id": id,
        "lastUpdateTimeStamp": lastTime,
        "reduceBalance": balance ? balance : 0
    }
    console.log("approve hr", jsonData)
    try {
        const response = await http.post("/hr/approveLeavebyHR", jsonData)
        return (response.status == 200)
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const cancelLeaveByHR = async function(hrId, id, lastTime) {
    let jsonData = {
        "cancelling_hr_id": hrId,
        "cancelling_leave_application_id": id,
        "lastUpdateTimeStamp": lastTime
    }
    try {
        const response = await http.post("/hr/cancelLeavebyHR", jsonData)
        return (response.status == 200)
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const getIndividualBalance = async function(date, hrId) {
    let jsonData = {
        "action":"getIndividualBalance",
        "asOnDate": date,
        "hrid": hrId
    }
    console.log("balance", jsonData)
    try {
        const response = await http.post("/hr/hrTxn", jsonData)
        if (response.status == 200) {
            const data = response.data;
            if (data.success) {
                return data.response.allCarrierRecord.indi_balance
            }
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const getAllLeave = async function() {
    try {
        const response = await http.post("/hr/listAllLeaveApplications")
        if (response.status == 200) {
            const data = response.data;
            if (data.success) {
                return getNecessaryFromLeave(data.response.allCarrierRecord)
            }
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

export default {
    getMyLeave,
    applyLeave,
    modifyLeave,
    cancelLeaveByMe,
    approveLeaveByHR,
    cancelLeaveByHR,
    getIndividualBalance,
    getAllLeave
}

import http from "./http.js";

const getToday = function() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today =  yyyy + '-' + mm + '-' + dd;

    return today
}

const add1 = async function(today, taskId, supervisor, data) {
    const jsonData = {
        "effortdate": today,
        "estimate_MP_taskL1id": taskId,
        "workSupervisor_hrid": supervisor,
        "workPerformedBy_hrid": data.id,
        "L1AdditionalTotHrsToday": data.hr,
        "L1AdditionalTotMinsToday": data.min,
        "L1AdditionalPctToday": data.pct,
        "L1TotPctMarkToday": data.totalPct
    }

    console.log("jsonData", jsonData)
    try {
        const response = await http.post("/effort/duL1AddOne", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.response
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const add2 = async function(today, taskId, supervisor, data) {
    const jsonData = {
        "effortdate": today,
        "estimate_MP_taskL2id": taskId,
        "workSupervisor_hrid": supervisor,
        "workPerformedBy_hrid": data.id,
        "L2AdditionalTotHrsToday": data.hr,
        "L2AdditionalTotMinsToday": data.min,
        "L2AdditionalPctToday": data.pct,
        "L2TotPctMarkToday": data.totalPct
    }

    try {
        const response = await http.post("/effort/duL2AddOne", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.response
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const add3 = async function(today, taskId, supervisor, data) {
    const jsonData = {
        "effortdate": today,
        "estimate_MP_taskL3id": taskId,
        "workSupervisor_hrid": supervisor,
        "workPerformedBy_hrid": data.id,
        "L3AdditionalTotHrsToday": data.hr,
        "L3AdditionalTotMinsToday": data.min,
        "L3AdditionalPctToday": data.pct,
        "L3TotPctMarkToday": data.totalPct
    }

    try {
        const response = await http.post("/effort/duL3AddOne", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.response
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const add4 = async function(today, taskId, supervisor, data) {
    const jsonData = {
        "effortdate": today,
        "estimate_MP_taskL4id": taskId,
        "workSupervisor_hrid": supervisor,
        "workPerformedBy_hrid": data.id,
        "L4AdditionalTotHrsToday": data.hr,
        "L4AdditionalTotMinsToday": data.min,
        "L4AdditionalPctToday": data.pct,
        "L4TotPctMarkToday": data.totalPct
    }

    try {
        const response = await http.post("/effort/duL4AddOne", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.response
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const getUpdate1 = async function(hrId, date) {
    const jsonData = {
        "effortdate": date ? date : getToday(),
        "dataUpdated_hrid": hrId
    }

    try {
        const response = await http.post("/effort/L1getUpdatedRecordsByMe", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.response.allCarrierRecord
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const getUpdate2 = async function(hrId, date) {
    const jsonData = {
        "effortdate": date ? date : getToday(),
        "dataUpdated_hrid": hrId
    }

    try {
        const response = await http.post("/effort/L2getUpdatedRecordsByMe", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.response.allCarrierRecord
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const getUpdate3 = async function(hrId, date) {
    const jsonData = {
        "effortdate": date ? date : getToday(),
        "dataUpdated_hrid": hrId
    }

    try {
        const response = await http.post("/effort/L3getUpdatedRecordsByMe", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.response.allCarrierRecord
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const getUpdate4 = async function(hrId, date) {
    const jsonData = {
        "effortdate": date ? date : getToday(),
        "dataUpdated_hrid": hrId
    }

    try {
        const response = await http.post("/effort/L4getUpdatedRecordsByMe", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.response.allCarrierRecord
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const remove1 = async function(id) {
    const jsonData = {
        "removing_DUL1_id": id
    }

    try {
        const response = await http.post("/effort/L1removeOneEntry", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.success
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const remove2 = async function(id) {
    const jsonData = {
        "removing_DUL2_id": id
    }

    try {
        const response = await http.post("/effort/L2removeOneEntry", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.success
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const remove3 = async function(id) {
    const jsonData = {
        "removing_DUL3_id": id
    }

    try {
        const response = await http.post("/effort/L3removeOneEntry", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.success
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const remove4 = async function(id) {
    const jsonData = {
        "removing_DUL4_id": id
    }

    try {
        const response = await http.post("/effort/L4removeOneEntry", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.success
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

export default {
    add1,
    add2,
    add3,
    add4,
    getUpdate1,
    getUpdate2,
    getUpdate3,
    getUpdate4,
    remove1,
    remove2,
    remove3,
    remove4,
    getToday
}

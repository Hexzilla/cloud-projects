import http from "./http.js";

const getToday = function() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today =  yyyy + '-' + mm + '-' + dd;

    return today
}

const add1 = async function(data) {
    const jsonData = {
        "effortdate": getToday(),
        "estimate_MP_taskL1id": data.id,
        "workSupervisor_hrid": data.supervisor,
        "workPerformedBy_hrid": data.performer,
        "L1AdditionalTotHrsToday": data.hr,
        "L1AdditionalTotMinsToday": data.min,
        "L1AdditionalPctToday": data.pct,
        "L1TotPctMarkToday": data.totalPct
    }

    try {
        const response = await http.post("/effort/duL1AddOne", jsonData)
        if (response.status == 200) {
            return true
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const add2 = async function(data) {
    const jsonData = {
        "effortdate": getToday(),
        "estimate_MP_taskL2id": data.id,
        "workSupervisor_hrid": data.supervisor,
        "workPerformedBy_hrid": data.performer,
        "L2AdditionalTotHrsToday": data.hr,
        "L2AdditionalTotMinsToday": data.min,
        "L2AdditionalPctToday": data.pct,
        "L2TotPctMarkToday": data.totalPct
    }

    try {
        const response = await http.post("/effort/duL2AddOne", jsonData)
        if (response.status == 200) {
            return true
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const add3 = async function(data) {
    const jsonData = {
        "effortdate": getToday(),
        "estimate_MP_taskL3id": data.id,
        "workSupervisor_hrid": data.supervisor,
        "workPerformedBy_hrid": data.performer,
        "L3AdditionalTotHrsToday": data.hr,
        "L3AdditionalTotMinsToday": data.min,
        "L3AdditionalPctToday": data.pct,
        "L3TotPctMarkToday": data.totalPct
    }

    try {
        const response = await http.post("/effort/duL3AddOne", jsonData)
        if (response.status == 200) {
            return true
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const add4 = async function(data) {
    const jsonData = {
        "effortdate": getToday(),
        "estimate_MP_taskL4id": data.id,
        "workSupervisor_hrid": data.supervisor,
        "workPerformedBy_hrid": data.performer,
        "L4AdditionalTotHrsToday": data.hr,
        "L4AdditionalTotMinsToday": data.min,
        "L4AdditionalPctToday": data.pct,
        "L4TotPctMarkToday": data.totalPct
    }

    try {
        const response = await http.post("/effort/duL4AddOne", jsonData)
        if (response.status == 200) {
            return true
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const update1 = async function() {
    const jsonData = {
        "effortdate": getToday(),
        "dataUpdated_hrid": 1
    }

    try {
        const response = await http.post("/effort/L1getUpdatedRecordsByMe", jsonData)
        if (response.status == 200) {
            return true
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const update2 = async function() {
    const jsonData = {
        "effortdate": getToday(),
        "dataUpdated_hrid": 1
    }

    try {
        const response = await http.post("/effort/L2getUpdatedRecordsByMe", jsonData)
        if (response.status == 200) {
            return true
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const update3 = async function() {
    const jsonData = {
        "effortdate": getToday(),
        "dataUpdated_hrid": 1
    }

    try {
        const response = await http.post("/effort/L3getUpdatedRecordsByMe", jsonData)
        if (response.status == 200) {
            return true
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const update4 = async function() {
    const jsonData = {
        "effortdate": getToday(),
        "dataUpdated_hrid": 1
    }

    try {
        const response = await http.post("/effort/L4getUpdatedRecordsByMe", jsonData)
        if (response.status == 200) {
            return true
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const remove1 = async function(id) {
    const jsonData = {
        "removing_DUL1_id": id
    }

    try {
        const response = await http.post("/effort/L1removeOneEntry", jsonData)
        if (response.status == 200) {
            return true
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
            return true
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
            return true
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
            return true
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
    update1,
    update2,
    update3,
    update4,
    remove1,
    remove2,
    remove3,
    remove4,
    getToday
}

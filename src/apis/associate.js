import http from "./http.js";

const findAll = async function () {
    let associates = []
    try {
        const response = await http.post("/hr/hrFindAll")
        if (response.status == 200) {
            const data = response.data;
            if (data.success) {
                associates = data.response.allCarrierRecord
            }
        }
    }
    catch (error) {
        console.log(error)
    }

    if (associates && associates.length > 0) {
        for (let i in associates) {
            let e = associates[i]
            let info = await findOne(e.id)
            e.info = info
            e.initialDesignation = info[0].designations[0] && info[0].designations[0].designationid && info[0].designations[0].designationid
            e.designation = info[0].designations[0] && info[0].designations[0].designationid && info[0].designations[0].designationid
            e.designationDate = info[0].designations[0] && info[0].designations[0].effectivefromdate && info[0].designations[0].effectivefromdate
            e.initialDesignationDate = info[0].designations[0] && info[0].designations[0].effectivefromdate && info[0].designations[0].effectivefromdate
        }
    }
    
    return associates
}

const getAssociates = async function () {
    let associates = []
    try {
        const response = await http.post("/hr/hrFindAll")
        if (response.status == 200) {
            const data = response.data;
            if (data.success) {
                associates = data.response.allCarrierRecord
            }
        }
    }
    catch (error) {
        console.log(error)
    }

    return associates
}

const findOne = async function(id) {
    let data = {
        id: id
    }
    try {
        const response = await http.post("/hr/hrFindOne", data)
        if (response.status == 200) {
            const data = response.data;
            if (data.success) {
                return data.response.allCarrierRecord
            }
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const add = async function(person) {
    console.log("add person", person)
    let data
    if (person.assocationStatus == 'toBeJoined') {
        data = {
            assocationType: person.assocationType,
            assocationStatus: person.assocationStatus,
            JoinDateForResourcePlanning: person.JoinDateForResourcePlanning,
            holidaycalid: person.holidaycalid,
            personid: person.personid
        }
    } else {
        data = person
    }
    try {
        const response = await http.post("/hr/hrAddOne", data)
        if (response.status == 200) {
            const data = response.data
            if (person.assocationStatus == 'toBeJoined' || person.assocationStatus == 'seperated') {
                console.log("add no design")
                return true
            } else {
                const ret = await addDesignation(data.response.data.insertId, person.designationDate, person.designation, 0)
                return ret
            }
        }
    }
    catch (error) {
        console.log(error)
        return false
    }
}

const update = async function(person) {
    console.log("update person", person)

    let data
    if (person.assocationStatus == 'toBeJoined') {
        data = {
            assocationType: person.assocationType,
            assocationStatus: person.assocationStatus,
            JoinDateForResourcePlanning: person.JoinDateForResourcePlanning,
            holidaycalid: person.holidaycalid,
            personid: person.personid
        }
    } else {
        data = person
    }
    try {
        const response = await http.post("/hr/hrUpdateOne", data)
        if (response.status == 200) {
            if (person.assocationStatus == 'toBeJoined' || person.assocationStatus == 'seperated' || person.designationDate == person.initialDesignationDate) {
                console.log("update no design")
                return true
            } else {
                const ret = await addDesignation(person.id, person.designationDate, person.designation, person.initialDesignation ? person.initialDesignation : 0)
                return ret
            }
        }
    }
    catch (error) {
        console.log(error)
        return false
    }
}

const roleAssign = async function(hrId ,data) {
    console.log("hrId", hrId)
    console.log("data", data)
    let roleAction = []
    data.forEach(item => {
        item.data.recordType != "noAction" && roleAction.push(item.data)
    })
    let jsonData = {
        "hrid": hrId,
        "roleAction": roleAction
    }
    try {
        const response = await http.post("/hr/hrRolesAssign", jsonData)
        if (response.status == 200) {
            const data = response.data
            return data.success
        }
            
    }
    catch (error) {
        console.log(error)
        return false
    }
}

const getRoleWithData = function (roles) {
    let store = []
    roles.forEach(item=> store.push(
        {
            "id":item.id, 
            "name":item.name,
            "data": {
                "effectivefromdate": null,    
                "effectivetodate": null,
                "recordType": "noAction",
                "rolesid": item.id
            },
        }
    ))
    return store
}

const addDesignation = async function(hrId, date, designationId, hrDesignationId) {
    let jsonData = {
        "hrid": hrId,
        "effectivefromdate": date,
        "designationid": designationId,
        "closingdesignation_hrDesignationid": hrDesignationId
    }
    console.log("---------add designation", jsonData)
    try {
        const response = await http.post("/hr/hrAddNewDesignation", jsonData)
        console.log("designation response", response)
        return (response.status == 200);
    }
    catch (error) {
        console.log(error)
        return false
    }
}

const getCurrentDate = function () {
    const date = new Date()
    return (1900 + date.getYear()) + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

export default {
    findAll,
    findOne,
    add,
    update,
    getRoleWithData,
    roleAssign,
    addDesignation,
    getAssociates
}

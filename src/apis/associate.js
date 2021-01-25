import http from "./http.js";

const findAll = async function() {
    try {
        const response = await http.post("/hr/hrFindAll")
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
    try {
        const response = await http.post("/hr/hrAddOne", person)
        if (response.status == 200) {
            const data = response.data;
            console.log("api.addCountry", data.response)
            if (data.success) {
                return data.response
            }
        }
    }
    catch (error) {
        console.log(error)
        return false
    }
}

const update = async function(person) {
    try {
        const response = await http.post("/hr/hrUpdateOne", person)
        return (response.status == 200);
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
    console.log("jsonData", jsonData)
    try {
        const response = await http.post("/hr/hrRolesAssign", jsonData)
        return (response.status == 200);
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

export default {
    findAll,
    findOne,
    add,
    update,
    getRoleWithData,
    roleAssign
}

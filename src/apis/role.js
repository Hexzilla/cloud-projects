import http from "./http.js";

const findAll = async function() {
    try {
        const response = await http.post("/common/roleFindAll")
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

const add = async function(item) {
    try {
        const response = await http.post("/common/roleAddOne", item)
        if (response.status == 200) {
            const data = response.data;
            console.log("destination.add", data.response)
            if (data.success) {
                return data.response
            }
        }
    }
    catch (error) {
        console.log(error)
        return null
    }
    return null
}

const update = async function(item) {
    try {
        const response = await http.post("/common/roleUpdateOne", item)
        return (response.status == 200);
    }
    catch (error) {
        console.log(error)
        return false
    }
}

const findAllRoles = async function() {
    try {
        const response = await http.post("/common/roleRoleTypes")
        if (response.status == 200) {
            const data = response.data;
            if (data.success) {
                return data.response.allCarrierRecord.roleTypes
            }
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

export default {
    findAll,
    add,
    update,
    findAllRoles
}

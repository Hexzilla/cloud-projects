import http from "./http.js";

const findAll = async function() {
    try {
        const response = await http.post("/hr/personFindAll")
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
    try {
        const response = await http.post("/hr/personAddOne", person)
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
        const response = await http.post("/hr/personUpdateOne", person)
        return (response.status == 200);
    }
    catch (error) {
        console.log(error)
        return false
    }
}

export default {
    findAll,
    add,
    update,
}

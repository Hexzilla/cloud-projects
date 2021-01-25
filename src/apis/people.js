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

const findOne = async function(id) {
    let data = {
        "id": id
    }
    try {
        const response = await http.post("/hr/personFindOne", data)
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

const updateLocalAddress = async function(hrId, data) {
    let addressId = data.id
    if (addressId == 0) addressId = 1000 + hrId
    let jsonData = {  
        "hrid": hrId,
        "addressid": addressId,
        "localAddress":
        {
            "addressLine1": data.addressLine1,
            "addressLine2": data.addressLine2,
            "addressLine3": data.addressLine3,
            "addressLine4": data.addressLine4,
            "countryid": data.countryid,
            "zipcode": data.zipcode,
            "state_province": data.state_province
        }   
    }
    console.log('update data', jsonData)
    try {
        const response = await http.post("/hr/personUpdateLocalAddress", jsonData)
        console.log("response", response)
        return (response.status == 200);
    }
    catch (error) {
        console.log(error)
        return false
    }
}

const updatePermanentAddress = async function(hrId, data) {
    let addressId = data.id
    if (addressId == 0) addressId = 2000 + hrId
    let jsonData = { 
        "hrid": hrId,
        "addressid": addressId,
        "permanentAddress":
        {
            "addressLine1": data.addressLine1,
            "addressLine2": data.addressLine2,
            "addressLine3": data.addressLine3,
            "addressLine4": data.addressLine4,
            "countryid": data.countryid,
            "zipcode": data.zipcode,
            "state_province": data.state_province
        }   
    }
    console.log('update data', jsonData)
    try {
        const response = await http.post("/hr/personUpdatePermanentAddress", jsonData)
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
    findOne,
    updatePermanentAddress,
    updateLocalAddress
}

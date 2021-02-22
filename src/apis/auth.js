import http from "./http.js";

const login = async function (code, password) {
    let jsonData = {
        "code": code,
        "pwd": password
    }
    try {
        const response = await http.post("/auth/loginCheck", jsonData)

        if (response.status == 200 && response.statusText == "OK") {
            return response.data.token
        }
    }
    catch (error) {
        console.log(error)
    }
    return false
}

const getOwnId = async function () {
    try {
        const response = await http.post("/hr/getMyHRid")

        if (response.status == 200) {
            return response.data.hrid
        }
    }
    catch (error) {
        console.log(error)
    }
    return null
}

const getInfo = async function () {
    try {
        const response = await http.post("/common/getEnvDefaultValues")

        if (response.status == 200) {
            return response.data.response
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const getPrevilage = async function () {
    const jsonData = {
        "pmAdmin": getOwnId()
    }
    try {
        const response = await http.post("/common/getMyMenu", jsonData)
        if (response.status == 200) {
            return response.data.response.allCarrierRecord
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const getLocalprevilage = function () {
    const prev = localStorage.getItem('previlage')
    return JSON.parse(prev)
}

const getRole = function () {
    let result = {'view': false, 'add': false, 'edit': false, 'delete': false}
    const previlage = getLocalprevilage()
    const menuId = localStorage.getItem('menuId')
    const own = previlage.find(e => e.menuid == menuId)
    own && own.privileges.length > 0 && own.privileges.forEach(e => {
        if (e.priv == 'add') {
            result.add = e.allowed == 'yes' ? true : false
        } else if (e.priv == 'edit') {
            result.edit = e.allowed == 'yes' ? true : false
        } else if (e.priv == 'view') {
            result.view = e.allowed == 'yes' ? true : false
        } else if (e.priv == 'delete') {
            result.delete = e.allowed == 'yes' ? true : false
        }
    })
    return result
}

export default {
    login,
    getOwnId,
    getPrevilage,
    getLocalprevilage,
    getRole,
    getInfo
}

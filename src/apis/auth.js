import http from "./http.js";

// {
//     "code":"AD00014",
//     "pwd":"BrL$MMm("
// }
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

export default {
    login,
}

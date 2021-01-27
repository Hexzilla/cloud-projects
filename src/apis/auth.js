import http from "./http.js";
//saneesh@uae.com
const login = async function (email, password) {
    let jsonData = {
        "email": email,
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

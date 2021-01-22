import http from "./http.js";

const resetKeys = function(items, index) {
    let tasks = []
    for (const key in items) {
        const data = items[key]

        let tazk = Object.assign({}, data, { ikey: index, children: [], userAction: "nochange" })
        index++
        
        if (data.hasOwnProperty("children")) {
            const ret = resetKeys(data.children, index)
            tazk["children"] = ret.tasks
            index = ret.index
        }

        tasks.push(tazk)
    }        
    return {tasks, index};
}

const findAll = async function() {
    try {
        const response = await http.post("/taskCat/findAllTaskAndSubTasksF2")
        if (response.status == 200) {
            const data = response.data;
            if (data.success) {
                let items = data.response.allCarrierRecord.TaskCategory
                let {tasks, index} = resetKeys(items, 1)
                return tasks
            }
        }
    }
    catch (error) {
        console.log(error)
    }
    return []
}

const update = async function(tasks) {
    try {
        const postData = {
            saveThisRecord: {
                TaskCategory: tasks
            }
        }
        const data = JSON.stringify(postData)
        //console.log(data)
        const response = await http.post("/taskCat/updateAllTaskAndSubTasksF2", data)
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
    findAll,
    update,
}
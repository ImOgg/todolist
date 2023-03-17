let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", e => {
    e.preventDefault();// 使用這個方法讓表單不要送
    // 取得輸入的資料
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

    // 防止輸入框沒有輸入資料而產生資料
    if (todoText === "") {
        alert("請輸入您的代辦事項");
        return;
    }

    // 加入輸入的資料到畫面
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + "/" + todoDate;
    todo.appendChild(text);
    todo.appendChild(time);

    // 勾勾
    let completebutton = document.createElement("button");
    completebutton.classList.add("complete");
    completebutton.innerHTML = '<i class="fa-solid fa-check"></i>';

    // 完成後出現的效果
    completebutton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    });

    // 垃圾桶
    let trashbutton = document.createElement("button");
    trashbutton.classList.add("trash");
    trashbutton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    // 刪除整個todo
    trashbutton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;

        // 當我的移除動畫結束的時候 在html的項目也跟著移除
        todoItem.addEventListener("animationend", () => {
            // 移除localstorge
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            todoItem.remove();
        })
        todoItem.style.animation = "scaleDown 1s forwards";

    });

    // 放入勾勾跟垃圾桶
    todo.appendChild(completebutton);
    todo.appendChild(trashbutton);

    todo.style.animation = "scaleUp 1s forwards";

    // 製作物件
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    };

    // 儲存資料
    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    }
    else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    form.children[0].value = "";//清除輸入框的內容
    // form.children[1].value = "";//清除輸入框的內容
    // form.children[2].value = "";//清除輸入框的內容
    section.appendChild(todo);
});
loadData();
function loadData() {

    let myList = localStorage.getItem("list");

    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach(element => {
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = element.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = element.todoMonth + "/" + element.todoDate;
            todo.appendChild(text);
            todo.appendChild(time);

            // 勾勾
            let completebutton = document.createElement("button");
            completebutton.classList.add("complete");
            completebutton.innerHTML = '<i class="fa-solid fa-check"></i>';
            // 完成後出現的效果
            completebutton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done");
            });

            // 垃圾桶
            let trashbutton = document.createElement("button");
            trashbutton.classList.add("trash");
            trashbutton.innerHTML = '<i class="fa-solid fa-trash"></i>';

            // 刪除整個todo
            trashbutton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;

                // 當我的移除動畫結束的時候 在html的項目也跟著移除
                todoItem.addEventListener("animationend", () => {
                    // 移除localstorge
                    let text = todoItem.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach((item, index) => {
                        if (item.todoText == text) {
                            myListArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(myListArray));
                        }
                    })
                    todoItem.remove();
                })
                todoItem.style.animation = "scaleDown 1s forwards";

            });
            todo.appendChild(completebutton);
            todo.appendChild(trashbutton);
            section.appendChild(todo);
        });
    }
}

function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;
    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        }
        else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        }
        else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if (Number(arr1[i].todoMonth) > Number(arr2[j].todoDate)) {
                result.push(arr2[j]);
                j++;
            }
            else {
                result.push(arr1[i]);
                i++;
            }
        }
    }
    // 把arr1 arr2所有東西都丟進去
    while (i < arr1.length) {
        result.push(arr1[i])
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j])
        j++;
    }
    return result;
}

function mergesort(arr) {
    if (arr.length === 1) {
        return arr;
    }
    else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergesort(right), mergesort(left));
    }
}


// 檢驗演算法是否正常
// console.log(mergesort(JSON.parse(localStorage.getItem("list"))));


let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    // 排列資料
    let sortedArray = mergesort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    // 移除資料

    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }
    // 載入資料
    loadData();
})
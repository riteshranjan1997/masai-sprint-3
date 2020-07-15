window.addEventListener("load", add)

function add() {
    var submit = document.getElementById("form")
    submit.addEventListener("submit", auth)
}

var auth_customer_arr = [
    {
        user: "ritesh@gmail.com",
        admin: "adminritesh@abc.com",
        pass: "12345"
    },
    {
        user: "ram@gmail.com",
        admin: "adminram@abc.com",
        pass: "5500"
    },
    {
        user: "ravi",
        pass: "87898"
    },
    {
        user: "qwerty",
        pass: "55500"
    },
]


var current_user = ""

function auth(elem) {
    elem.preventDefault()
    console.log(elem.target)
    var user = document.getElementById("log").value
    var pass = document.getElementById("pass").value
    for (var i = 0; i < auth_customer_arr.length; i++) {
        var x = auth_customer_arr[i]
        if (user == x.user && pass == x.pass) {
            current_user = x.user
            localStorage.setItem("user", x.user)
            window.location.replace("index.html")
        }  
    }
}

function track() {
    var data = localStorage.getItem("record")

    arr = JSON.parse(data) || []
    var log = {
        user: current_user,
        time: Date.now()
    }
    arr.push(log)

    var str = JSON.stringify(arr)

    localStorage.setItem("record", str)

window.addEventListener("load", add)

function add() {

    var out = document.getElementById("log_out")
    out.addEventListener("click", log_out)

    var country_search = document.getElementById("search_country")
    country_search.addEventListener("click", search_by_country)

    var all_search = document.getElementById("search_all_country")
    all_search.addEventListener("click", search_all_country)

    var all_search = document.getElementById("search_all_country_list")
    all_search.addEventListener("click", search_all_country_list)

    var ul = document.querySelector("#pagination")
    ul.addEventListener("click",handlePageChange)

    var more = document.getElementById("more_info")
    more.addEventListener("click", more_Details)

}

function log_out() {
    window.location.replace("login.html")
}

// for pagination
var activePage = 1
var totalPage = 1
var totalItem = 1
var perPage = 10
var current_array 
var type
var country_data


function search_by_country() {
    event.preventDefault()
    var country = document.getElementById("country_input").value
    
    var slug = casechange(country)

    var xhr = new XMLHttpRequest()

    xhr.open("GET", "https://api.covid19api.com/dayone/country/" + slug)


    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')

    xhr.send()

    xhr.onload = function () {
        if(this.status == 200){
        var data = JSON.parse(this.response)

        country_data = data

        render_Country_search(data[data.length-1])
        
        

        }

        else{
            var show = document.getElementById("country_input")
            show.value = "Invalid Input"
            show.setAttribute("class" ,"form-control mr-sm-2 text-danger")

            setTimeout(function(){
                show.value = ""
            show.setAttribute("class" ,"form-control mr-sm-2")
            },2000)
        }
    }
}

// required for slug
function casechange(input){
    var case_change_output = ""
    for ( var i = 0; i < input.length; i++){
        case_change_output += getlowercase(input[i])
    }
    return (case_change_output)
}


function getlowercase (char){
    var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var lower = "abcdefghijklmnopqrstuvwxyz"
    for(var i = 0 ; i < upper.length; i++ ){
        if (char === upper[i]){
            return (lower[i])
        }
    }
    return(char)
}


function search_all_country() {

    event.preventDefault()

    var xhr = new XMLHttpRequest()

    xhr.open("GET", "https://api.covid19api.com/summary")


    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')

    xhr.send()

    xhr.onload = function () {
        if (this.status == 200) {

            var data = JSON.parse(this.response)
            
            type =  "search_all_country"
            
            current_array = data.Countries

            //console.log(current_array)

            totalItem = current_array.length
            totalPage = Math.ceil(totalItem/perPage)
            activePage = 1
            renderDom(type)
            createTBody(type,activePage)
            createPagination()

        }

        else { alert("Something Went wrong") }

    }

}

function search_all_country_list() {

    event.preventDefault()

    var xhr = new XMLHttpRequest()

    xhr.open("GET", "https://api.covid19api.com/countries")


    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')

    xhr.send()

    xhr.onload = function () {

        if (this.status == 200) {

            var list = JSON.parse(this.response)
            
            type = "search_all_country_list"

            current_array = list

            totalItem = current_array.length
            totalPage = Math.ceil(totalItem/perPage)
            activePage = 1

            renderDom(type)
            createTBody(type,activePage)
            createPagination()

        }

        else { alert("Something Went wrong") }
    }

}





function handlePageChange() {
    if (!event.target.name) {
        return
    }
    var value = Number(event.target.name)
    activePage = activePage + value
    if (activePage < 1) {
        activePage = 1
    }
    if (activePage > totalPage) {
        activePage = totalPage
    }
    
    createTBody(type,activePage)
    createPagination()

}

function createPagination() {

    var ul = document.querySelector("#pagination")
    ul.innerHTML = ""
    var fragment = document.createDocumentFragment()
    var prev = createPageButton("previous", activePage === 1 ? true : false, false, -1)
    fragment.append(prev)

    for (var i = 1; i <= totalPage; i++) {
        var page = createPageButton(i, false, activePage === i ? true : false, i - activePage)
        fragment.append(page)
    }

    if (activePage !== totalPage) {
        var next = createPageButton("Next", false, false, 1)
        fragment.append(next)
    }

    ul.append(fragment)
}

function createPageButton(text, isDisabled, isActive, name) {

    var cls;
    var pageItem = document.createElement("li")
    cls = isDisabled ? "page-item disabled" : isActive ? "page-item active" : "page-item"
    pageItem.setAttribute("class", cls)

    var pagelink = document.createElement("a")
    pagelink.setAttribute("class", "page-link")
    pagelink.textContent = text
    pagelink.name = name
    pageItem.append(pagelink)

    return (pageItem)
}




function renderDom(type) {

    var clear = document.getElementById("contry_display")
    clear.style.display = "none"

    var target = document.querySelector("#display")
    target.innerHTML = ""
    var table = document.createElement("table")
    table.setAttribute("class", "table")
    var thead = document.createElement("thead")
    thead.setAttribute("class", "thead-dark")
    var thead_tr = document.createElement("tr")
    var thead_th_text
    if(type == "search_all_country" ){
        thead_th_text = ["SrNo","Country","CountryCode","Total Confirmed Cases","Total Deaths","Total Recovered"]
    }
    else if (type == "search_all_country_list"){
       thead_th_text = ["SrNo","Country Name","Country Code"]
    }

    for (var i = 0; i < thead_th_text.length; i++) {
        var th = document.createElement("th")
        th.setAttribute("scope", "col")
        th.textContent = thead_th_text[i]
        thead_tr.append(th)
    }
    thead.append(thead_tr)
    table.append(thead)
    target.append(table)

}

function createTBody(type,start) {
    var clear = document.getElementById("tableBody") || 0
    if (clear != 0) {
        clear.remove()
    }
    var target = document.querySelector(".table")
    var tbody = document.createElement("tbody")
    tbody.setAttribute("id", "tableBody")

    var x
    var end
    if (start == 1) {
        x = 0
        end = 10
    }
    else {
        x = (start * 10) - 10
        end = start * 10
    }

    if (activePage == totalPage) {
        end = current_array.length
    }
    console.log(x, end)
    for (var i = x; i < end; i++) {
        console.log(current_array[i])
        var tbody_tr = document.createElement("tr")
        var th1 = document.createElement("th")
        th1.textContent =  current_array.indexOf(current_array[i])+1
        tbody_tr.append(th1)

        if(type == "search_all_country" ){

            for (var key in current_array[i]) {
                console.log(current_array[i])
                if(key != "Slug" && key != "NewConfirmed" && key != "NewDeaths" && key != "NewRecovered" &&  key != "Date" && key != "Premium"){
                var th = document.createElement("th")
                th.textContent = current_array[i][key]
                tbody_tr.append(th)
                }
            }
            
        }
        else if (type == "search_all_country_list"){

            for (var key in current_array[i]) {
                if(key != "Slug"){
                var th = document.createElement("th")
                th.textContent = current_array[i][key]
                tbody_tr.append(th)
                }
            }
           
        }

        tbody.append(tbody_tr)
    }
    target.append(tbody)
}


function render_Country_search(data){


    var target = document.getElementById("contry_display")
    target.style.display = "block"
    
    var country = document.getElementById("country_name")
    country.textContent = data.Country

    var date = document.getElementById("date")
    var day = data.Date.split("T")
    date.textContent = day[0]

    var total = document.getElementById("total_case")
    total.textContent = data.Confirmed

    var active = document.getElementById("active_case")
    active.textContent = data.Active

    var death = document.getElementById("total_deaths")
    death.textContent = data.Deaths

    var recovery = document.getElementById("total_recovered")
    recovery.textContent = data.Recovered
}

function more_Details(){

}
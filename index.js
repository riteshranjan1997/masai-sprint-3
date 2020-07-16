window.addEventListener("load", add)

function add() {
    summary()
    var out = document.getElementById("log_out")
    out.addEventListener("click", log_out)
}

function log_out() {
    window.location.replace("login.html")
}


function summary() {

    var total = document.getElementById("total_case")
    var active = document.getElementById("active_case")
    var death = document.getElementById("total_deaths")
    var recovery = document.getElementById("total_recovered")
    var country = document.getElementById("total_country")

    var total_today = document.getElementById("total_case_today")
    var active_today = document.getElementById("active_case_today")
    var death_today = document.getElementById("total_deaths_today")
    var recovery_today = document.getElementById("total_recovered_today")
    var country_today = document.getElementById("total_country_today")

    var date = document.getElementById("date")


    var xhr = new XMLHttpRequest()

    xhr.open("GET", "https://api.covid19api.com/summary")

    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')

    xhr.send()

    xhr.onload = function () {
        var data = JSON.parse(this.response)


        total_today.textContent = data.Global.NewConfirmed
        total.textContent = data.Global.TotalConfirmed

        //active_today = 
        active.textContent = Number(data.Global.TotalConfirmed) - Number(data.Global.TotalRecovered)
        
        recovery_today.textContent = data.Global.NewRecovered
        recovery.textContent = data.Global.TotalRecovered
        
        death.textContent = data.Global.NewDeaths
        death_today.textContent = data.Global.TotalDeaths
        

        country.textContent = data.Countries.length

        date.textContent = data.Date
    }

}
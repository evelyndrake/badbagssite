console.log("Loading admin cards...");
// fetch /cards
var bagData = [];
$.getJSON("/cards", function(data) {
    for (var i in data) {
        bagData.push(data[i]);
    }
    // replace strings
    for (var x = bagData.length - 1; x > -1; x--) {
        if ((bagData[x].length > 6) && (bagData[x][7] != "")) {
            if ((bagData[x][7] + "").toLowerCase().includes("tranq")) {
                bagData[x][7] = bagData[x][7].replace(/tranq/g, "xylazine")
            }
            if ((bagData[x][7] + "").toLowerCase().includes("fent")) {
                bagData[x][7] = bagData[x][7].replace(/fent/g, "fentanyl")
            }
            if ((bagData[x][7] + "").toLowerCase().includes("tranq")) {
                bagData[x][7] = bagData[x][7].replace(/Tranq/g, "xylazine")
            }
            if ((bagData[x][7] + "").toLowerCase().includes("fent")) {
                bagData[x][7] = bagData[x][7].replace(/Fent/g, "fentanyl")
            }
        }
    }
    var table = document.getElementById("spreadsheet");
    drawElements();

    function drawElements() {
        table.innerHTML = "<thead><tr><th scope=\"col\">Date</th><th scope=\"col\">Name</th><th scope=\"col\">Location</th><th scope=\"col\">Times Reported</th><th scope=\"col\">Info</th></tr></thead>";
        for (var x = bagData.length - 1; x > -1; x--) {
            
            var tbody = table.appendChild(document.createElement("tbody"));
            var new_row = tbody.appendChild(document.createElement("tr"));
            var th = new_row.appendChild(document.createElement("th"));
            th.scope = "row";
            th.innerHTML = bagData[x][0];
            var td = new_row.appendChild(document.createElement("td"));
            if (bagData[x][2] != "") {
                td.innerHTML = bagData[x][2]
            } else {
                td.innerHTML = "No name specified"
            }
            if (bagData[x][3] != "") {
                td.innerHTML += " (" + bagData[x][3] + ")";
            }
            td = new_row.appendChild(document.createElement("td"));
            if (bagData[x][4] != "") {
                td.innerHTML = bagData[x][4]
            } else {
                td.innerHTML = "No location specified"
            }
            td = new_row.appendChild(document.createElement("td"));
            if (bagData[x].length > 7 && bagData[x][8] != "") {
                td.innerHTML = bagData[x][8]
            } else {
                td.innerHTML = "No information specified"
            }
            td = new_row.appendChild(document.createElement("td"));
            if (bagData[x].length > 6 && bagData[x][7] != "") {
                td.innerHTML = bagData[x][7]
            } else {
                td.innerHTML = "No information specified"
            }
            // fentanyl badges
            if (bagData[x].length > 5 && bagData[x][6] != "") {
                var badge = td.appendChild(document.createElement("span"));
                if ((bagData[x][6] + "").toLowerCase() === "yes") {
                    badge.className = "badge rounded-pill bg-danger";
                    badge.innerHTML = "Contains Fentanyl";
                } else if ((bagData[x][6] + "").toLowerCase() === "no") {
                    badge.className = "badge rounded-pill bg-success";
                    badge.innerHTML = "Fentanyl Negative";
                }
            }
            // xylazine badges
            if (bagData[x].length > 4 && bagData[x][5] != "") {
                var badge = td.appendChild(document.createElement("span"));
                if ((bagData[x][5] + "").toLowerCase() === "yes") {
                    badge.className = "badge rounded-pill bg-danger";
                    badge.innerHTML = "Contains Xylazine";
                } else if ((bagData[x][5] + "").toLowerCase() === "no") {
                    badge.className = "badge rounded-pill bg-success";
                    badge.innerHTML = "Xylazine Negative";
                }
            }
            // UNC badges
            if (bagData[x].length > 6 && bagData[x][7] != "") {
                if ((bagData[x][7] + "").toLowerCase().includes("unc lab")) {
                    var badge = td.appendChild(document.createElement("span"));
                    badge.className = "badge rounded-pill bg-info";
                    badge.innerHTML = "Lab Tested";
                }
            }

        }
    }
});
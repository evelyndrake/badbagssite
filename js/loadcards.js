console.log("Loading cards...");
// fetch /cards
var bagData = [];
var bagDataNormal = [];
var bagDataAlpha = [];
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
            if ((bagData[x][7] + "").toLowerCase().includes("tranq")) {
                bagData[x][7] = bagData[x][7].replace(/Tranq/g, "xylazine")
            }
        }
    }

    for (var x = bagData.length - 1; x > -1; x--) {
        for (var y = bagData.length - 1; y > -1; y--) {
            if ((bagData[x][2] !== "") && (x !== y) && (bagData[x][2].toUpperCase() == bagData[y][2].toUpperCase())) {
                bagData[x][8] = 1;
                bagData[y][8] = 1;
            }
        }
    }
    bagDataNormal = [...bagData];
        bagDataAlpha = [...bagData];
        bagDataAlpha.sort(function(a, b) {
            var textB = a[2].toUpperCase();
            var textA = b[2].toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    var deck = document.getElementById("deck");
    var table = document.getElementById("spreadsheet");
    var toggle = document.getElementById("spreadsheetToggle");
    var toggle2 = document.getElementById("alphaToggle");
    var filterButton = document.getElementById("filterButton");
    var locationField = document.getElementById("locationField");

    var fentanylFilterText = "";
    var xylazineFilterText = "";
    drawElements();

    // when the user clicks on the toggle switches, redraw the cards

    toggle.addEventListener("click", function() {
        drawElements();
    });
    toggle2.addEventListener("click", function() {
        drawElements();
    });
    filterButton.addEventListener("click", function() {
        drawElements();
    });

    $("#fentanylFilter a").on('click', function(e) {
        e.preventDefault(); // cancel the link behaviour
        fentanylFilterText = $(this).text();
        $("#fentanylButton").text(fentanylFilterText);
    });

    $("#xylazineFilter a").on('click', function(e) {
        e.preventDefault(); // cancel the link behaviour
        xylazineFilterText = $(this).text();
        $("#xylazineButton").text(xylazineFilterText);
    });

    function drawElements() {
        var numOfBags = 1000;
        deck.innerHTML = "";
        if (toggle2.checked) {
            bagData = [...bagDataAlpha];
        } else {
            bagData = [...bagDataNormal];
        }
        if (toggle.checked) {
            table.innerHTML = "<thead><tr><th scope=\"col\">Date</th><th scope=\"col\">Name</th><th scope=\"col\">Location</th><th scope=\"col\">Info</th></tr></thead>";
        }
        
        
        for (var x = bagData.length - 1; x > -1; x--) {
            var today = new Date();

            // EXCLUDE UNC LABS
            if (bagData[x].length > 6 && bagData[x][7] != "") {
                if ((bagData[x][7] + "").toLowerCase().includes("unc lab")) {
                    continue;
                }
            }
            var date = new Date(bagData[x][0]);
            console.log(today);
            var sixmonthsago = today;
            sixmonthsago.setMonth(today.getMonth() - 6);
            console.log(sixmonthsago);
            if (date <= sixmonthsago) {
                continue;
            }
            
            
            // filters
            if (nameField.value != "") {
                if (!((bagData[x][2] + " " + bagData[x][3]).toLowerCase().includes(nameField.value.toLowerCase()))) {
                    continue;
                }
            }
            if (locationField.value != "") {
                if (!(bagData[x][4].toLowerCase().includes(locationField.value.toLowerCase()))) {
                    continue;
                }
            }
            if (fentanylFilterText != "" || fentanylFilterText != "Any") {
                if (fentanylFilterText === "Fentanyl Positive") {
                    if (bagData[x].length > 5 && bagData[x][6] != "") {}
                    if (!((bagData[x][6] + "").toLowerCase() === "yes")) {
                        continue;
                    }
                }
                if (fentanylFilterText === "Fentanyl Negative") {
                    if (bagData[x].length > 5 && bagData[x][6] != "") {}
                    if (!((bagData[x][6] + "").toLowerCase() === "no")) {
                        continue;
                    }
                }
            }
            if (xylazineFilterText != "" || xylazineFilterText != "Any") {
                if (xylazineFilterText === "Xylazine Positive") {
                    if (bagData[x].length > 4 && bagData[x][5] != "") {}
                    if (!((bagData[x][5] + "").toLowerCase() === "yes")) {
                        continue;
                    }
                }
                if (xylazineFilterText === "Xylazine Negative") {
                    if (bagData[x].length > 4 && bagData[x][5] != "") {}
                    if (!((bagData[x][5] + "").toLowerCase() === "no")) {
                        continue;
                    }
                }
            }
            numOfBags--;
            if (numOfBags == 0) break;

            if (toggle.checked) { // SPREADSHEET VIEW


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
                // duplicate badges
                if (bagData[x].length > 7 && bagData[x][8] != "") {
                    if (bagData[x][8] === 1) {
                        var badge = td.appendChild(document.createElement("span"));
                        badge.className = "badge rounded-pill bg-warning";
                        badge.innerHTML = "Duplicate";
                    }
                }


            } else { // CARD VIEW
                table.innerHTML = "";
                var new_card = document.createElement("div");
                new_card.className = "card";
                var div = new_card.appendChild(document.createElement("div"));
                div.className = "card-body";
                var h4 = div.appendChild(document.createElement("h4"));
                h4.className = "card-title";
                if (bagData[x][2] != "") {
                    h4.innerHTML = bagData[x][2]
                } else {
                    h4.innerHTML = "No name specified"
                }
                if (bagData[x][3] != "") {
                    h4.innerHTML += " (" + bagData[x][3] + ")";
                }
                var subtitle = div.appendChild(document.createElement("p"));
                subtitle.className = "card-subtitle mb-2 text-muted";
                if (bagData[x][4] != "") {
                    subtitle.innerHTML = bagData[x][4]
                } else {
                    subtitle.innerHTML = "No location specified"
                }
                // fentanyl badges
                if (bagData[x].length > 5 && bagData[x][6] != "") {
                    var badge = div.appendChild(document.createElement("span"));
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
                    var badge = div.appendChild(document.createElement("span"));
                    if ((bagData[x][5] + "").toLowerCase() === "yes") {
                        badge.className = "badge rounded-pill bg-danger";
                        badge.innerHTML = "Contains Xylazine";
                    } else if ((bagData[x][5] + "").toLowerCase() === "no") {
                        badge.className = "badge rounded-pill bg-success";
                        badge.innerHTML = "Xylazine Negative";
                    }
                }
                // duplicate badges
                if (bagData[x].length > 7 && bagData[x][8] != "") {
                    if (bagData[x][8] === 1) {
                        var badge = div.appendChild(document.createElement("span"));
                        badge.className = "badge rounded-pill bg-warning";
                        badge.innerHTML = "Duplicate";
                    }
                }

                var p = div.appendChild(document.createElement("p"));
                p.className = "card-text";
                if (bagData[x].length > 6 && bagData[x][7] != "") {
                    p.innerHTML = bagData[x][7]
                } else {
                    p.innerHTML = "No information specified"
                }

                var footer = new_card.appendChild(document.createElement("div"));
                footer.className = "card-footer";
                footer.innerHTML = bagData[x][0];
                deck.appendChild(new_card);
                table.innerHTML += "</tbody>";
            }

        }
    }
});
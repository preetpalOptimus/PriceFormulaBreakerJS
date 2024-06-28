const tableContentOld = [
    {
        header: "", keyName: "number", styles: "font-weight: 600;"
    },
    {
        header: "Description", keyName: "description", styles: "font-weight: 600;"
    },
    {
        header: "Stem Purchase Price", keyName: "purchasePrice", currency: "£"
    },
    {
        header: "Freight Absolute Cost", keyName: "freightAbsoluteCost", total: 0, total2: 0, currency: "£", styles: "border-left: 3px solid red;"
    },
    {
        header: "Freight Variable Cost", keyName: "freightVariableCostValue", total: 0, total2: 0, currency: "£"
    },
    {
        header: "Volumetric Weight", keyName: "volPerKiloTotal", total: 0
    },
    {
        header: "Rate Per Charge", keyName: "ratePerCharge", average: 0
    },
    {
        header: "Air Freight Total", keyName: "freightTotal", total: 0, total2: 0, currency: "£", styles: "border-left: 3px solid red;"
    },
    {
        header: "Supplier Total = Total Purchase Price", keyName: "supplierTotalValue", total: 0, total2: 0, currency: "£"
    },
    {
        header: "Air Freight Cost", keyName: "airFreightCost", total: 0, visible: false
    },
    {
        header: "dutyPercentage", keyName: "dutyPercentage", total: 0, visible: false
    },
    {
        header: "DEF/PEACH Absolute", keyName: "defPeachAbsolute", total: 0, currency: "£", visible: true
    },
    {
        header: "Clearance Cost", keyName: "clearanceCost", total: 0, currency: "£", visible: true
    },
    {
        header: "Inland Transport Cost", keyName: "inlandTransportCost", total: 0, currency: "£", visible: true
    },
    {
        header: "Transflor Cost", keyName: "transflorCost", total: 0, currency: "£", styles: "border-right: 3px solid red;", visible: true
    },
    {
        header: "*AM", keyName: "section6", visible: true
    },
    {
        header: "Total Revenue", keyName: "totalVar", total: 0, currency: "£", styles: "background-color: lightblue; font-weight: 600", visible: true
    },
    {
        header: "Florisoft Total Revenue", keyName: "florisoftTotalVar", total: 0, currency: "£", styles: "background-color: lightblue; font-weight: 600", visible: true
    },
    {
        header: "Shipment No", keyName: "shipmentNo", visible: true
    },
    {
        header: "No of boxes ordered", keyName: "noOfBoxesOrdered", total: 0, styles: "font-weight: 600;"
    },
    {
        header: "No of boxes recieved", keyName: "noOfBoxesRecieved", total: 0, styles: "font-weight: 600;"
    },
    {
        header: "Box Content", keyName: "boxContent"
    },
    {
        header: "Stems Left To Sell", keyName: "stemsLeftToSell", total: 0
    },
    {
        header: "Credited Stems", keyName: "creditedStems", total: 0
    },
    {
        header: "Volume", keyName: "volume"
    },
    {
        header: "Total Stems Recieved", keyName: "totalStems", total: 0
    },
    {
        header: "Supplier", keyName: "supplier", total: 0
    },
    {
        header: "Total Purchase Price (USD: 0.833)", keyName: "totalPurchasePrice", total: 0, total2: 0, currency: "£"
    },
    {
        header: "Absolute", keyName: "absoluteCost", total: 0, visible: false
    }
]

function displayResults(code, tableContentOld) {
    const tableContainer = document.getElementById('table-container');
    const tableContent = JSON.parse(JSON.stringify(tableContentOld))
    tableContainer.textContent = "";
    try {
        const results = new Function(code)();
        // Calculate for total number of boxes
        const calculateTotal = results.map((line, index) => {
            line.noOfBoxesRecieved = +line.noOfBoxesOrdered != line.noOfBoxesRecieved ? ((Math.abs(+line.creditedStems) + line.stemsLeftToSell) / +line.boxContent) + +line.noOfBoxesRecieved : +line.noOfBoxesRecieved 

            line.number = index + 1;

            const supplierTotalVar = ((+line.supplierTotal * line.dutyPercentage) * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            const freightTotalVar = ((+line.freightTotal * line.dutyPercentage) * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            const totalPurchasePriceVar = (line.purchasePrice * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(2);

            //line.airFreightCost = (+line.airFreightCost - line.purchasePrice).toFixed(3);
            //line.purchasePrice = (line.purchasePrice  * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            //line.airFreightCost = (((+line.freightAbsolute + +line.supplierTotal) * +line.dutyPercentage) *  (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)

            line.freightAbsoluteCost = ((+line.freightAbsoluteCost * line.freightCurrency) * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3);
            line.freightVariableCostValue = ((+line.freightVariableCost * line.freightCurrency) * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)

            // Below is divided by freightCurrency to calcuate rate using dollars
            const ratePerChargeVar = ((line.freightVariableCostValue / line.freightCurrency) / (+line.volPerKilo * +line.noOfBoxesRecieved))
            line.ratePerCharge = ratePerChargeVar === +ratePerChargeVar ? ratePerChargeVar.toFixed(2) : 0

            const volPerKiloTotalVar = (+line.volPerKilo * +line.noOfBoxesRecieved)
            line.volPerKiloTotal = volPerKiloTotalVar != 0 ? volPerKiloTotalVar.toFixed(3) : volPerKiloTotalVar 
            line.freightTotal = freightTotalVar
            line.supplierTotalValue = supplierTotalVar

            line.clearanceCost = (+line.clearanceCost * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.defPeachAbsolute = (+line.defPeachAbsolute * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.inlandTransportCost = (+line.inlandTransportCost * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)


            line.totalVar = (+line.total * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3);

            line.florisoftTotalVar = (+line.florisoftTotal * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)

            line.transflorCost = (+line.transflorCost * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.totalStems = +line.noOfBoxesRecieved * +line.boxContent
            line.totalPurchasePrice = `${totalPurchasePriceVar}`

            //line.absoluteCost = (((0.001 + (2.3 / line.volume)) * 0.943) * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)

            return line
        })
        console.log(results)

        const calculateTotalNew = JSON.parse(JSON.stringify(results))

        const newResults = calculateTotalNew.map(line => {
            line.totalPurchasePrice = `£${(line.totalPurchasePrice * line.supplierCurrency).toFixed(3)} \n\n $${line.totalPurchasePrice}`
            line.supplierTotalValue = `£${line.supplierTotalValue} \n\n $${(line.supplierTotalValue / line.supplierCurrency).toFixed(3) }`
            line.freightTotal = `£${line.freightTotal} \n\n $${(line.freightTotal / line.freightCurrency).toFixed(3) }`
            line.freightAbsoluteCost = `£${line.freightAbsoluteCost} \n\n $${(line.freightAbsoluteCost / line.freightCurrency).toFixed(3) }`
            line.freightVariableCostValue = `£${line.freightVariableCostValue} \n\n $${(line.freightVariableCostValue / line.freightCurrency).toFixed(3) }`
            return line
        })

        tableContainer.appendChild(createTable(newResults, tableContent));

        
    } catch (error) {
        tableContainer.textContent = `Error: ${error.message}`;
    }

    // Once table created, hide all hidden columns
    tableContent.forEach((cont, ind) => {
        if (cont.hasOwnProperty("visible")) {
            if (!cont.visible) {
                show_hide_column(ind, cont.visible)
            }
        }
    })
}

function createTable(data, tableContent) {
    const table = document.createElement('table');
    table.id = "resultTable"
    table.border = '1';

    // Create table header row
    const header = table.createTHead();
    const footer = table.createTFoot();
    const headerRow = header.insertRow(0);
    const footerrRow = footer.insertRow(0);

    // Displays headers for each column
    tableContent.forEach((cont, index) => {
        const cell = headerRow.insertCell(index);
        cell.outerHTML = `<th class='column${index}'>${cont.header}</th>`;
    });

    // Calculates the total for each column
    tableContent.forEach(content => {
        data.forEach(row => {
            const rowVal = "" +  row[content.keyName]
            if (rowVal.includes("\n")) {
                const vals = rowVal.split("\n\n");
                let num = vals[0].trim().replace(/[^a-zA-Z0-9. ]/g, "");
                let num2 = vals[1].trim().replace(/[^a-zA-Z0-9. ]/g, "");
                content.total += +num
                content.total2 += +num2
            } else {
            content.total += +row[content.keyName]
            }
        })
        content.total = +(content.total ? content.total : 0).toFixed(2)
    })

    // Displays the average for each column
    tableContent.forEach(content => {
        if (content.hasOwnProperty("average")) {
            let total = 0
            let counter = 0
            data.forEach(row => {
                total += +row[content.keyName]
                counter += (+row[content.keyName] != 0 ? 1 : 0)
            })
            content.average = (total / counter) != 0 ? (total / counter).toFixed(2) : 0
        }
    })

    // Displays the total for each column
    tableContent.forEach((cont, index) => {
        const cell = footerrRow.insertCell(index);
        const currency = cont.hasOwnProperty("currency") ? cont.currency : "";
        const val1 = cont.total > 0 ? currency + cont.total : cont.hasOwnProperty("average") ? cont.average : ""
        const val2 = cont.hasOwnProperty('total2') ? ' \n\n $' + cont.total2.toFixed(2) : ''
        cell.outerHTML = `<th class='column${index}'> <span>${val1}</span> <span>${val2}</span> </th>`;
    });

    // Create table body and populate with data
    const tbody = table.createTBody();
    data.forEach((item, index) => {
        const row = tbody.insertRow();

        tableContent.forEach((column, index) => {
            let cellValue = item[column.keyName]

            // Finds associated table content 
            const tableCont = tableContent.filter(cont => {
                if (cont.keyName === column.keyName) {
                    return cont;
                }
            });

            // Adds currency symbol infront of cell value
            if (tableCont && tableCont.length > 0) {
                if (tableCont[0].hasOwnProperty("currency") && !tableCont[0].hasOwnProperty("total2")) {
                    cellValue = tableCont[0].currency + cellValue;
                }
            }

            // Creates individual table cell
            const cell = row.insertCell(index);
            cell.textContent = cellValue;
            cell.classList.add(`column${index}`);


            // Add CSS styles to the cell if the column has style prop
            if (column.hasOwnProperty("styles")) {
                cell.style.cssText = column.styles;
            }

            // Make column color green or red if the values matches
            highlight_same_columns(["florisoftTotalVar", "totalVar"], column.keyName, cell, item);
            highlight_same_columns(["noOfBoxesOrdered", "noOfBoxesRecieved"], column.keyName, cell, item);

            // Add title tag to relevant cells using content
            if (["freightTotal", "freightAbsoluteCost"].includes(column.keyName)) {
                cell.title = `${item.currency[0].type} : ${item.currency[0].value}`
            }
            if (column.keyName === "freightVariableCostValue") {
                cell.title = `${item.currency[0].type} : ${item.currency[0].value}`
            }
            if (column.keyName === "supplierTotalValue") {
                cell.title = `${item.currency[1].type} : ${item.currency[1].value}`
            }
            if (column.keyName === "volPerKiloTotal") {
                cell.title = `VolPerKilo : ${item.volPerKilo}`
            }
            if (column.keyName === "florisoftTotalVar") {
                cell.title = `PricePerStem : ${item.florisoftTotal}`
            }
            if (column.keyName === "totalVar") {
                cell.title = `PricePerStem : ${item.total}`
            }
        });
    })

    return table;
}


function highlight_same_columns(keysArray, columnKeyname, cell, item) {
    if (keysArray.includes(columnKeyname)) {
        if ((+item[keysArray[0]] === +item[keysArray[1]])) {
            cell.style.color = "green";
        } else {
            cell.style.color = "red";
        }
    }
}

function show_hide_column(col_no, do_show) {
    const columnCells = document.getElementsByClassName(`column${col_no}`);
    Array.from(columnCells).forEach(cell => {
        cell.style.display = do_show ? "block" : "none";
    })
}


function processInputsAndGenerateCode() {
    //try {

        const textReplacements = [
            ["PRIJS", "prijs"],
            ["bestelPartij.Fustcode", "fustCode"],
            ["bestelPartij.Volume", "volume"],
            ["bestelPartij.InhFust", "inhust"],
            ["(double)", ""]
        ]

        let mainVariables =`const name = #name;
                            const prijs = #price;
                            const volume = #volume;
                            const inhust = #boxCont;
                            const fustCode = #fustCode;
                            const florCal = #florCal;
                            const shipmentNo = #shipmentNo;
                            const fustaantal = #noOfBoxesOrdered;
                            const noOfBoxesRecieved = #noOfBoxesRecieved;
                            const stemsLeftToSell = #stemsLeftToSell;
                            const stemsNotRecieved = #stemsNotRecieved;
                            const volPerKilo = #volPerKilo;
                            const supplier = #supplier;
                            const creditedStems = #creditedStems;`

        let mainObject = `let costBreakdown = {
                                description: name,
                                purchasePrice: prijs,
                                freightTotal: section8,
                                supplierTotal: section7,
                                freightAbsoluteCost: section11,
                                freightVariableCost: section12,
                                airFreightCost: section1,
                                dutyPercentage: section9,
                                defPeachAbsolute: section2,
                                clearanceCost: section3,
                                inlandTransportCost: section4,
                                transflorCost: section5,
                                section6: section6,
                                total: ((section1 + section2 + section3 + section4 + section5) * section6).toFixed(3),
                                florisoftTotal: florCal,
                                shipmentNo: shipmentNo,
                                noOfBoxesOrdered: fustaantal,
                                noOfBoxesRecieved: noOfBoxesRecieved,
                                boxContent: inhust,
                                stemsLeftToSell: stemsLeftToSell,
                                stemsNotRecieved: stemsNotRecieved,
                                volume: volume,
                                freightCurrency : freightCurr,
                                supplierCurrency: supplierCurr,
                                currency: currency,
                                volPerKilo: volPerKilo,
                                supplier: supplier,
                                creditedStems: creditedStems
                            };
                            costBreakdowns.push(costBreakdown)`

        const input1 = document.getElementById('input1');
        const input2 = document.getElementById('input2');
        const input3 = document.getElementById('input3');
        const input4 = document.getElementById('input4');


        if (input1.value.replace(/\s/g, "") == "" || input2.value.replace(/\s/g, "") == "" || input3.value.replace(/\s/g, "") == "" || input4.value.replace(/\s/g, "") == "") {
            alert("Please fill in all the empty input fields");
            return false
        }

        const currencyCodeInput = input1.value.trim()
        const generalCodeInput = input2.value.trim()
        const formulaCodeInput = input3.value.trim()
        const flowerTableInput = input4.value.trim()
        
        const currencyCodeLines = parseData(currencyCodeInput);
        const generalCodeLines = parseData(generalCodeInput);
        const formulaCodeLines = parseData(formulaCodeInput);
        const orderLines = handleOrderInput(flowerTableInput);


        let allFunctions = "";
        let allFunctionNames = "";

        // Replace main varibale values
        orderLines.forEach((orderLine, index) => {
            let orderVariables = mainVariables;
            let result = createCSharpCodeSection(orderLine.formula, 0);

            let newFinalString = result.finalString
            let result2 = createCSharpCodeSection(result.firstSection, true, result.maxCounter)
            let firstSection = result2.finalString;

            let result3 = createCSharpCodeSection(result2.secondSection, true, result2.maxCounter, true);
            let freightSection = result3.finalString;

            let currencyVars = findCurrencyCodesInFirstSection(firstSection)

            const currency = []

            textReplacements.forEach(variable => {
                newFinalString = newFinalString.replaceAll(variable[0], variable[1])
                firstSection = firstSection.replaceAll(variable[0], variable[1])
                freightSection = freightSection.replaceAll(variable[0], variable[1])
            })
            
            for (const [key, value] of Object.entries(orderLine)) {
                orderVariables = orderVariables.replace("#" + (key.trim()), value)
            }
            // Replace general codes
            generalCodeLines.forEach(generalCode => {
                newFinalString = newFinalString.replaceAll("|" + (generalCode[0].trim()) + "|", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])
                firstSection = firstSection.replaceAll("|" + (generalCode[0].trim()) + "|", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])
                freightSection = freightSection.replaceAll("|" + (generalCode[0].trim()) + "|", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])

                currencyVars.forEach((vars, index) => {
                    if  (vars.includes("|" + (generalCode[0].trim()) + "|")) {
                        currencyVars[index] =  (vars.replaceAll("|" + (generalCode[0].trim()) + "|", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2]))
                        currency.push({ type: generalCode[1], value: generalCode[2] })
                    }
                })
            })

            // Replace currency codes
            currencyCodeLines.forEach(generalCode => {
                newFinalString = newFinalString.replaceAll("$" + (generalCode[0].trim()) + "$", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : (generalCode[2]/100))
                firstSection = firstSection.replaceAll("$" + (generalCode[0].trim()) + "$", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : (generalCode[2] / 100))
                freightSection = freightSection.replaceAll("$" + (generalCode[0].trim()) + "$", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : (generalCode[2] / 100))

                currencyVars.forEach((vars, index) => {
                    if (vars.includes("$" + (generalCode[0].trim()) + "$")) {
                        currencyVars[index] = (vars.replaceAll("$" + (generalCode[0].trim()) + "$", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : (generalCode[2] / 100)))
                        currency.push({ type: generalCode[1], value: generalCode[2] })
                    }
                })
            })

            // Replace formula codes
            formulaCodeLines.forEach(generalCode => {
                newFinalString = newFinalString.replaceAll("#" + (generalCode[0].trim()) + "#", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])
                firstSection = firstSection.replaceAll("#" + (generalCode[0].trim()) + "#", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])
                freightSection = freightSection.replaceAll("#" + (generalCode[0].trim()) + "#", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])
            })

            orderVariables += `const supplierCurr = ${+currencyVars[0]};`
            orderVariables += `const freightCurr = ${+currencyVars[1]};`
            orderVariables += `const currency = ${JSON.stringify(currency)};`

            let functionName = `section${index}() `
            allFunctions += `function ${functionName}
                    {
                                                ${orderVariables + newFinalString + firstSection + freightSection + mainObject}
                    }`

            allFunctionNames += functionName + "; "
        })


        // Example processing of inputs to generate JS code
        // Replace this with your actual logic
        const generatedCode = `
        const costBreakdowns = [];
        ${allFunctionNames}
        return costBreakdowns;

        ${allFunctions}

        `;
        console.log(generatedCode)

        return generatedCode;
}


//#region Utils

function findCurrencyCodesInFirstSection(firstSection) {
    const splits = firstSection.split(";");
    
    splits.length = 2;

    const results = [];

    splits.forEach(split => {
        const indexes = findLastAndSecondLastIndexOfCloseParenthesis(split);
        const currencyVar = split.substring(indexes.secondLastIndex+2, indexes.lastIndex)
        results.push(currencyVar);
    })

    return results;
}

function findLastAndSecondLastIndexOfCloseParenthesis(str) {
    let lastIndex = -1;
    let secondLastIndex = -1;

    // Iterate through the string from the end to the start
    for (let i = str.length - 1; i >= 0; i--) {
        if (str[i] === ')') {
            if (lastIndex === -1) {
                lastIndex = i; // First occurrence from the end
            } else {
                secondLastIndex = i; // Second occurrence from the end
                break; // We found both, so we can stop
            }
        }
    }

    return { lastIndex, secondLastIndex };
}

let firstPair;

function parseData(dataString) {
    const dataArray = dataString.split('\n').map(line => line.split('\t'));
    return dataArray;
}

function findClosingParentheses(str) {
    const stack = [];
    const pairs = [];

    for (let i = 0; i < str.length; i++) {
        if (str[i] === '(') {
            stack.push(i);
        } else if (str[i] === ')') {
            if (stack.length === 0) {
                throw new Error("No matching opening parenthesis found for closing parenthesis at index " + i);
            }
            const openingIndex = stack.pop();
            pairs.push([openingIndex, i])
        }
    }

    if (stack.length !== 0) {
        throw new Error("No matching closing parenthesis found for opening parenthesis at index " + stack.pop());
    }

    return pairs;
}

function findRealSectionsOpenClose(str, second, thirdNeeded) {
    let parenthesisPairs = findClosingParentheses(str);
    let sortedPairs = parenthesisPairs.sort((a, b) => a[0] - b[0]);
    let newStr;

    const firstPairs = sortedPairs[0][1];
    const lastPairs = sortedPairs[sortedPairs.length-1][0];

    if (!second && (lastPairs > firstPairs)) {
        newStr = "(" + str + ")*1";
        parenthesisPairs = findClosingParentheses(newStr);
        sortedPairs = parenthesisPairs.sort((a, b) => a[0] - b[0]);
    } else {
        newStr = str;
    }

    let realPairs = [];
    
    if (second) {


        if (sortedPairs[35] && !thirdNeeded) {
            realPairs.push(sortedPairs[2]);
            realPairs.push(sortedPairs[27]);
            realPairs.push(sortedPairs[35])
        } else {
            realPairs.push(sortedPairs[2]);
            realPairs.push(sortedPairs[4]);
        }

        return [realPairs, newStr]
    }

    let current = sortedPairs[1][1]
    firstPair = sortedPairs[0]
    realPairs.push(sortedPairs[1])
    sortedPairs.forEach((pair, index) => {
        if (index !== 0 && pair[0] > current) {
            realPairs.push(pair);
            current = pair[1]
        }
    })

    const r1 = realPairs.pop()
    const r2 = realPairs.pop()

    realPairs.push([r2[0], r1[1]])
    //console.log(realPairs)
    return [realPairs, newStr];
}

function createCSharpCodeSection(str, second, prevCounter, thirdNeeded) {

    const results = findRealSectionsOpenClose(str, second, thirdNeeded)
    const realPairs = results[0];
    const newStr = results[1];

    let result = {
        finalString: "",
        firstSection: "",
        secondSection: "",
        maxCounter: 0
    }

    let counter = 0;

    if (second) {
        counter = prevCounter+1;
    }
    realPairs.forEach((realPair, index) => {
        counter += 1
        let section = " const section" + counter + " = " + newStr.substring(realPair[0], realPair[1]) + "); "
        result.finalString += section;

        if (index === 0) {
            result.firstSection = section;
        }
        if (index === 1) {
            result.secondSection = section;
        }
    })
    if (!second) {
        let lastSection = newStr.substring(firstPair[1] + 1, newStr.length);
        lastSection = lastSection.replace("*", "")
        result.finalString += " const section" + (counter + 1) + " = " + lastSection + "; ";
    }
        result.maxCounter = counter;
    return result;
}

function handleOrderInput(input) {
    const splitIntoArray = (input) => {
        const lines = input.split('\t');
        return lines
    }

    const result = splitIntoArray(input);
    const allOrders = []
    let counter = 0
    const splitIndex = [];
    result.forEach((each) => {
        if (each.startsWith("\n")) {
            splitIndex.push(counter)
        }
        counter++
    })
    splitIndex.push(result.length)

    splitIndex.forEach((index, i) => {
        let newResult = Array.from(result)
        let orderLine = newResult.slice(i === 0 ? 0 : splitIndex[i - 1], index)
        newResult = Array.from(result)
        allOrders.push(orderLine)
    })
    const final = allOrders.map(line => {
        return {
            name: `"${line[0].trim().replace("\n", "")}"`,
            price: line[1].trim(),
            boxCont: line[2].trim(),
            volume: line[3].trim(),
            fustCode: `"${line[4].trim()}"`,
            florCal: line[5].trim(),
            shipmentNo: `"${line[6].trim()}"`,
            formula: line[7].trim().split("\n").join(""),
            noOfBoxesOrdered: line[8].trim(),
            noOfBoxesRecieved: line[9].trim(),
            stemsLeftToSell: line[10] === "" ? 0 : line[10] ? line[10] : 0,
            stemsNotRecieved: line[11] === "" ? 0 : line[11] ? line[11] : 0,
            volPerKilo: line[12] === "" ? 0 : line[12] ? line[12] : 0,
            supplier: `"${line[13].trim()}"`,
            creditedStems: line[14] === "" ? 0 : line[14] ? line[14] : 0
        }
    })

    return final
}
//#endregion


//#startregion
const checkboxesContent = [
    {
        id: "chkCurrencyCode",
        targetInput: document.getElementById("input1"),
        targetInputDefaultValue: `1	USD	94.34
2	GBP	100
4	USD	94.34
15	EUR	89.286
16	EUSD	86.6
99	USD	83.333`
    },
    {
        id: "chkGeneralCode",
        targetInput: document.getElementById("input2"),
        targetInputDefaultValue: `3	USD to GBP	0.943
4	GBP to GBP	1.000
5	EUR to GBP	0.892
6	Wreath/Capiro USD to GBP	0.833
7	USD to EUR	1.000
8	Transflor - FB	6.500
9	Transflor - HB	4.650
10	Transflor - QB	3.550
11	Transflor - 5B	3.550
12	Transflor - 8B	3.550
13	Transflor -Morrisons Alstro	2.000
14	Transflor - Capiro	2.750
15	Freight ECU	3.150
16	Freight COL	2.300
17	Peak Freight - ECU	3.950
18	Peak Freight - COL	2.700
19	Peak Freight - Ken	3.900
20	Inland Transport Ecu - FB	3.500
21	Inland Transport Ecu - HB	3.500
22	Inland Transport Ecu - QB	3.500
23	Inland Transport Col - FB	2.600
24	Inland Transport Col - HB	2.600
25	Inland Transport Col - QB	2.600
26	AM	1.010
27	Inland Transport Ken - FB	3.500
28	Inland Transport Ken - HB	1.750
29	Inland Transport Ken - QB	1.750
30	Freight Absolute - Ecu	0.005
31	Freight Absolute - Col	0.001
32	Freight Absolute - Ken	0.001
33	Duty Percentage	1.000
34	DEF/PEACH Absolute - Ecu	0.002
35	DEF/PEACH Absolute - Col	0.001
36	DEF/PEACH Absolute - Ken	0.003
37	Clearance Absolute - Ecu	0.002
38	Clearance Absolute - Col	0.002
39	Clearance Absolute - Ken	0.014
40	Clearance Per Kilo - Ecu	0.220
41	Clearance Per Kilo - Col	0.220
42	Clearance Per Kilo - Ken	0.220
43	Inland Transport Per Kilo - Ecu	0.001
44	Inland Transport Per Kilo - Col	0.050
45	Inland Transport Per Kilo - Ken
46	USD Rate for Wreaths & Capiro	0.833
47	Freight COL - Morrisons	2.100
48	Transflor Capiro -HB	3.500
49	Inland Capiro - HB	1.300
50	Inland Caprio - QB	1.300`
    },
    {
        id: "chkFormulaCode",
        targetInput: document.getElementById("input3"),
        targetInputDefaultValue: `1	Supplier - absolute		
2	Supplier - per full box		
3	Supplier - per half box		
4	Supplier - per quarter box		
5	Supplier - per fifth box		
6	Supplier - per eighth box		
7	Supplier - percentage		
8	Freight - absolute	0.002	
9	Freight - per kilo	2.100	
10	Duty - percentage	1.000	
11	DEF/PEA - absolute		
12	Clearance - absolute	0.001	
13	Clearance - per kilo	0.200	
14	Transport (INLD) - per kilo		
15	Transport (INLD) - per full box	1.650	
16	Transport (INLD) - per half box	0.825	
17	Transport (INLD) - per quarter box	0.420	
18	Transport (INLD) - per fifth box	0.420	
19	Transport (INLD) - per eighth box	0.420	
20	Transport (CUST) - per full box		
21	Transport (CUST) - per half box		
22	Transport (CUST) - per quarter box		
23	Transport (CUST) - per fifth box		
24	Transport (CUST) - per eighth box`
    }
]

function fillInputs() {
    checkboxesContent.forEach(checkbox => {
        const chk = document.getElementById(checkbox.id);
        if (chk.checked) {
            checkbox.targetInput.value = checkbox.targetInputDefaultValue
        } else {
            checkbox.targetInput.value = ""
        }
    })
}
//#endregion


function init() {
    document.addEventListener("DOMContentLoaded", () => {
        const btnRun = document.getElementById("btnRun");

        fillInputs()

        btnRun.addEventListener("click", () => {

            const generatedCode = processInputsAndGenerateCode();

            if (!generatedCode) {
                return
            } else {
                displayResults(generatedCode, tableContentOld);
            }
        });
    })

}

init();



//const inputString = ` ((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) : 
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) : 
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) : 
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*$4$)
//+
//((((double)#8#)+(((double)#9#)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*$4$))*((double)#10#))

// +
//((double)#11#) +


//(((double)#12#) + (((double)#13#)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) 

//+
//((((double)#14#)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)#15#) : 
//   (bestelPartij.Fustcode == "HB" ? ((double)#16#) : 
//   (bestelPartij.Fustcode == "QB" ? ((double)#17#) : 
//   (bestelPartij.Fustcode == "5B" ? ((double)#18#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#19#) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))
   
//   +
//(bestelPartij.Fustcode == "FB" ? ((double)#20#) : 
//   (bestelPartij.Fustcode == "HB" ? ((double)#21#) : 
//   (bestelPartij.Fustcode == "QB" ? ((double)#22#) : 
//   (bestelPartij.Fustcode == "5B" ? ((double)#23#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#24#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)
//   console.log(total)
//`

//const input1 = document.getElementById('input1');
//const input2 = document.getElementById('input2');
//const input3 = document.getElementById('input3');

//input1.value = `1	USD	94.34
//2	GBP	100
//4	USD	94.34
//15	EUR	89.286
//16	EUSD	86.6
//99	USD	83.333
//`

//input2.value = `3	USD to GBP	0.943
//4	GBP to GBP	1.000
//5	EUR to GBP	0.892
//6	Wreath/Capiro USD to GBP	0.833
//7	USD to EUR	1.000
//8	Transflor - FB	6.500
//9	Transflor - HB	4.650
//10	Transflor - QB	3.550
//11	Transflor - 5B	3.550
//12	Transflor - 8B	3.550
//13	Transflor -Morrisons Alstro	2.000
//14	Transflor - Capiro	2.750
//15	Freight ECU	3.150
//16	Freight COL	2.300
//17	Peak Freight - ECU	3.950
//18	Peak Freight - COL	2.700
//19	Peak Freight - Ken	3.900
//20	Inland Transport Ecu - FB	3.500
//21	Inland Transport Ecu - HB	3.500
//22	Inland Transport Ecu - QB	3.500
//23	Inland Transport Col - FB	2.600
//24	Inland Transport Col - HB	2.600
//25	Inland Transport Col - QB	2.600
//26	AM	1.010
//27	Inland Transport Ken - FB	3.500
//28	Inland Transport Ken - HB	1.750
//29	Inland Transport Ken - QB	1.750
//30	Freight Absolute - Ecu	0.005
//31	Freight Absolute - Col	0.001
//32	Freight Absolute - Ken	0.001
//33	Duty Percentage	1.000
//34	DEF/PEACH Absolute - Ecu	0.002
//35	DEF/PEACH Absolute - Col	0.001
//36	DEF/PEACH Absolute - Ken	0.003
//37	Clearance Absolute - Ecu	0.002
//38	Clearance Absolute - Col	0.002
//39	Clearance Absolute - Ken	0.014
//40	Clearance Per Kilo - Ecu	0.220
//41	Clearance Per Kilo - Col	0.220
//42	Clearance Per Kilo - Ken	0.220
//43	Inland Transport Per Kilo - Ecu	0.001
//44	Inland Transport Per Kilo - Col	0.050
//45	Inland Transport Per Kilo - Ken
//46	USD Rate for Wreaths & Capiro	0.833
//47	Freight COL - Morrisons	2.100
//48	Transflor Capiro -HB	3.500
//49	Inland Capiro - HB	1.300
//50	Inland Caprio - QB	1.300`

//input3.value = `1	Supplier - absolute
//2	Supplier - per full box
//3	Supplier - per half box
//4	Supplier - per quarter box
//5	Supplier - per fifth box
//6	Supplier - per eighth box
//7	Supplier - percentage
//8	Freight - absolute	0.005
//9	Freight - per kilo	2.85
//10	Duty - percentage	1
//11	DEF/PEA - absolute	0.002
//12	Clearance - absolute	0.002
//13	Clearance - per kilo	0.215
//14	Transport (INLD) - per kilo	0.001
//15	Transport (INLD) - per full box	7.5
//16	Transport (INLD) - per half box	3.75
//17	Transport (INLD) - per quarter box	1.875
//18	Transport (INLD) - per fifth box	1.125
//19	Transport (INLD) - per eighth box	1.125
//20	Transport (CUST) - per full box	6.25
//21	Transport (CUST) - per half box	4.65
//22	Transport (CUST) - per quarter box	3.55
//23	Transport (CUST) - per fifth box	3.55
//24	Transport (CUST) - per eighth box	3.55`


//let newFinalString = inputString.replace(" ", "");

//newFinalString = `const prijs = 0.13;
//                            const volume = 36.585;
//                            const inhust = 300;
//                            const fustCode = "QB";
//                            const florCal = 0.187;
//                            const shipmentNo = "01430564472";
//                            const fustaantal = 7;
//                            const noOfBoxesRecieved = 7;
//                            const stemsLeftToSell = 0;
//                            const stemsNotRecieved = 0;
//                            let total =` + newFinalString

//const currencyCodeInput = input1.value.trim()
//const generalCodeInput = input2.value.trim()
//const formulaCodeInput = input3.value.trim()
//const flowerTableInput = input4.value.trim()

//const currencyCodeLines = parseData(currencyCodeInput);
//const generalCodeLines = parseData(generalCodeInput);
//const formulaCodeLines = parseData(formulaCodeInput);
//const textReplacements = [
//    ["PRIJS", "prijs"],
//    ["bestelPartij.Fustcode", "fustCode"],
//    ["bestelPartij.Volume", "volume"],
//    ["bestelPartij.InhFust", "inhust"],
//    ["(double)", ""]
//]

//textReplacements.forEach(variable => {
//    newFinalString = newFinalString.replaceAll(variable[0], variable[1])
//})

//// Replace general codes
//generalCodeLines.forEach(generalCode => {
//    newFinalString = newFinalString.replaceAll("|" + (generalCode[0].trim()) + "|", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])
//})

//// Replace currency codes
//currencyCodeLines.forEach(generalCode => {
//    newFinalString = newFinalString.replaceAll("$" + (generalCode[0].trim()) + "$", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : (generalCode[2] / 100))
//})

//// Replace formula codes
//formulaCodeLines.forEach(generalCode => {
//    newFinalString = newFinalString.replaceAll("#" + (generalCode[0].trim()) + "#", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])
//})

//console.log(newFinalString)

//const results = new Function(newFinalString)();

//console.log(results)
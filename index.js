function displayResults(code) {
        const tableContainer = document.getElementById('table-container');
    try {
        const results = new Function(code)();

        console.log(results)
        // Calculate for total number of boxes
        const calculateTotal = results.map(line => {
            line.noOfBoxesRecieved = line.stemsLeftToSell > 0 ? ((line.stemsLeftToSell + line.stemsNotRecieved) / line.boxContent) + line.noOfBoxesRecieved : line.noOfBoxesRecieved;

            line.airFreightCost = (+line.airFreightCost - line.purchasePrice).toFixed(3);

            //line.purchasePrice = (line.purchasePrice  * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.airFreightCost = (+line.airFreightCost * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.clearanceCost = (+line.clearanceCost * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.defPeachAbsolute = (+line.defPeachAbsolute * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.inlandTransportCost = (+line.inlandTransportCost * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.total = (+line.total * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.florisoftTotal = (+line.florisoftTotal * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.transflorCost = (+line.transflorCost * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(3)
            line.totalStems = +line.noOfBoxesRecieved * +line.boxContent
            line.totalPurchasePrice = (line.purchasePrice * (+line.noOfBoxesRecieved * +line.boxContent)).toFixed(2)

            return line
        })

        tableContainer.appendChild(createTable(calculateTotal));
    } catch (error) {
        tableContainer.textContent = `Error: ${error.message}`;
    }
}

function createTable(data) {
    const table = document.createElement('table');
    table.border = '1';

    // Create table header row
    const header = table.createTHead();
    const footer = table.createTFoot();
    const headerRow = header.insertRow(0);
    const footerrRow = footer.insertRow(0);

    const tableContent = [
        {
            header: "Description", keyName: "description"
        },
        {
            header: "Stem Purchase Price", keyName: "purchasePrice"
        },
        {
            header: "Air Freight Cost", keyName: "airFreightCost", total: 0
        },
        {
            header: "DEF/PEACH Absolute", keyName: "defPeachAbsolute", total: 0
        },
        {
            header: "Clearance Cost", keyName: "clearanceCost", total: 0
        },
        {
            header: "Inland Transport Cost", keyName: "inlandTransportCost", total: 0
        },
        {
            header: "Transflor Cost", keyName: "transflorCost", total: 0
        },
        {
            header: "*AM", keyName: "section6"
        },
        {
            header: "Total Revenue", keyName: "total", total: 0
        },
        {
            header: "Florisoft Total Revenue", keyName: "florisoftTotal", total: 0
        },
        {
            header: "Shipment No", keyName: "shipmentNo"
        },
        {
            header: "No of boxes ordered", keyName: "noOfBoxesOrdered", total: 0
        },
        {
            header: "No of boxes recieved", keyName: "noOfBoxesRecieved", total: 0
        },
        {
            header: "Box Content", keyName: "boxContent"
        },
        {
            header: "Stems Left To Sell", keyName: "stemsLeftToSell"
        },
        {
            header: "Stems not recieved", keyName: "stemsNotRecieved"
        },
        {
            header: "Total Stems Recieved", keyName: "totalStems", total: 0
        },
        {
            header: "Total Purchase Price", keyName: "totalPurchasePrice", total: 0
        }
    ]
    

    tableContent.forEach((cont, index) => {
        const cell = headerRow.insertCell(index);
        cell.outerHTML = `<th>${cont.header}</th>`;
    });

    tableContent.forEach(content => {
        if (content.hasOwnProperty("total")) {
            data.forEach(row => {
                content.total += +row[content.keyName]
            })
            content.total = (content.total).toFixed(2)
        }
    })

    tableContent.forEach((cont, index) => {
        const cell = footerrRow.insertCell(index);
        cell.outerHTML = `<th>${cont.total ? cont.total : ''}</th>`;
    });

    // Create table body and populate with data
    const tbody = table.createTBody();

    data.forEach((item, index) => {
        const row = tbody.insertRow();
        Object.values(item).forEach((value, index) => {
            const cell = row.insertCell(index);
            cell.textContent = value;

            if (index === 2) {
                cell.classList.add('column2');
            }

            if (index === 6) {
                cell.classList.add('column6');
            }

            if (index === 8) {
                cell.classList.add('column7');
            }
            if (index === 9) {
                cell.classList.add('column8');
            }
        });
    });

    return table;
}


function processInputsAndGenerateCode() {
    try {

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
                            const stemsNotRecieved = #stemsNotRecieved;`

        let mainObject = `let costBreakdown = {
                                description: name,
                                purchasePrice: prijs,
                                airFreightCost: section1.toFixed(3),
                                defPeachAbsolute: section2.toFixed(3),
                                clearanceCost: section3.toFixed(3),
                                inlandTransportCost: section4.toFixed(3),
                                transflorCost: section5.toFixed(3),
                                section6: section6,
                                total: ((section1 + section2 + section3 + section4 + section5) * section6).toFixed(3),
                                florisoftTotal: florCal,
                                shipmentNo: shipmentNo,
                                noOfBoxesOrdered: fustaantal,
                                noOfBoxesRecieved: noOfBoxesRecieved,
                                boxContent: inhust,
                                stemsLeftToSell: stemsLeftToSell,
                                stemsNotRecieved: stemsNotRecieved
                            };
                            costBreakdowns.push(costBreakdown)`

        const input1 = document.getElementById('input1');
        const input2 = document.getElementById('input2');
        const input3 = document.getElementById('input3');
        const input4 = document.getElementById('input4');

        if (input4.value.replace(/\s/g, "") == "") {
            alert("Please fill in order line and price formula field.");
            return
        }

        input1.value = `1	USD	94.34
2	GBP	100
4	USD	94.34
15	EUR	89.286
16	EUSD	86.6
99	USD	83.333
`

        input2.value = `3	USD to GBP	0.943
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

        input3.value = `1	Supplier - absolute
2	Supplier - per full box
3	Supplier - per half box
4	Supplier - per quarter box
5	Supplier - per fifth box
6	Supplier - per eighth box
7	Supplier - percentage
8	Freight - absolute	0.005
9	Freight - per kilo	2.85
10	Duty - percentage	1
11	DEF/PEA - absolute	0.002
12	Clearance - absolute	0.002
13	Clearance - per kilo	0.215
14	Transport (INLD) - per kilo	0.001
15	Transport (INLD) - per full box	7.5
16	Transport (INLD) - per half box	3.75
17	Transport (INLD) - per quarter box	1.875
18	Transport (INLD) - per fifth box	1.125
19	Transport (INLD) - per eighth box	1.125
20	Transport (CUST) - per full box	6.25
21	Transport (CUST) - per half box	4.65
22	Transport (CUST) - per quarter box	3.55
23	Transport (CUST) - per fifth box	3.55
24	Transport (CUST) - per eighth box	3.55`


//        input4.value = `Chrysant Cremon Andrea Purple	0.21	110	15.714	HB	0.378	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Cremon Magnum White	0.21	110	15.714	HB	0.378	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Cremon Magnum Yellow	0.21	110	15.714	HB	0.378	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Cremon Petrushka Pink	0.21	110	15.714	HB	0.378	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spider Marcela Lavender	0.21	110	15.714	HB	0.378	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spider Quartz Green	0.21	110	15.714	HB	0.378	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spider Tiana Dark Lavender	0.21	110	15.714	HB	0.378	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spider Top Spin White	0.21	110	15.714	HB	0.378	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Button Mont Blanc White	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Button Olive Green	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Button Paintball Sunny Yellow	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Cushion Bonita White	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Cushion Dorito Orange	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Cushion Pascua Purple	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Cushion Petrushka Pink	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Daisy Alma White	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Daisy Amethest Dark Bicolour	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Daisy Kintaro Pink	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Daisy Memphis Purple	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Daisy Mia Red	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Daisy Multisol Yellow	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
//Chrysant Spray Zembla Sunny Yellow	0.145	110	15.714	HB	0.324	01430564483	(((((PRIJS + ((double)#1#) +
//(bestelPartij.Fustcode == "FB" ? ((double)#2#) :
//   (bestelPartij.Fustcode == "HB" ? ((double)#3#) :
//   (bestelPartij.Fustcode == "QB" ? ((double)#4#) :
//   (bestelPartij.Fustcode == "5B" ? ((double)#5#) :
//   (bestelPartij.Fustcode == "8B" ? ((double)#6#) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust) + (PRIJS *((double)#7#)))*|6|)
//+
//((((double)|31|)+(((double)|16|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))*|3|))*((double)|33|)) +
//((double)|35|) +
//(((double)|38|) + (((double)|41|)/((bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume)))) +
//((((double)|43|)/(bestelPartij.Volume == 0 ? 1 : bestelPartij.Volume))+
//(((bestelPartij.Fustcode == "FB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "QB" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|49|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|49|) :
//   ((double)100))))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust)))+
//(bestelPartij.Fustcode == "FB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "HB" ? ((double)|48|) :    (bestelPartij.Fustcode == "QB" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "5B" ? ((double)|48|) :
//   (bestelPartij.Fustcode == "8B" ? ((double)|48|) :
//   ((double)100)))))) /(bestelPartij.InhFust == 0 ? 1 : bestelPartij.InhFust))*|26|
        //`

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
            let newFinalString = createCSharpCodeSection(orderLine.formula);

            textReplacements.forEach(variable => {
                newFinalString = newFinalString.replaceAll(variable[0], variable[1])
            })
            
            for (const [key, value] of Object.entries(orderLine)) {
                orderVariables = orderVariables.replace("#" + (key.trim()), value)
            }
            // Replace general codes
            generalCodeLines.forEach(generalCode => {
                newFinalString = newFinalString.replaceAll("|" + (generalCode[0].trim()) + "|", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])
            })

            // Replace currency codes
            currencyCodeLines.forEach(generalCode => {
                newFinalString = newFinalString.replaceAll("$" + (generalCode[0].trim()) + "$", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : (generalCode[2]/100))
            })

            // Replace formula codes
            formulaCodeLines.forEach(generalCode => {
                newFinalString = newFinalString.replaceAll("#" + (generalCode[0].trim()) + "#", (generalCode[2] === undefined ? '' : generalCode[2]) === '' ? 0 : generalCode[2])
            })

            let functionName = `section${index}() `
            allFunctions += `function ${functionName}
                    {
                                                ${orderVariables + newFinalString + mainObject}
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

        displayResults(generatedCode);

    } catch (error) {
        console.log("Error: ", error.toString())
    }
}


//#region Utils

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

function findRealSectionsOpenClose(str) {
    const parenthesisPairs = findClosingParentheses(str);
    let sortedPairs = parenthesisPairs.sort((a, b) => a[0] - b[0]);
    let realPairs = [];
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

    return realPairs;
}

function createCSharpCodeSection(str) {
    const realPairs = findRealSectionsOpenClose(str)

    let counter = 0;
    let finalString = "";
    realPairs.forEach((realPair, index) => {
        counter += 1
        finalString += " const section" + counter + " = " + str.substring(realPair[0], realPair[1]) + "); "
    })

    let lastSection = str.substring(firstPair[1] + 1, str.length);
    lastSection = lastSection.replace("*", "")
    finalString += " const section" + (counter + 1) + " = " + lastSection + "; "

    return finalString;
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
            stemsLeftToSell: line[10] === "" ? 0 : line[10],
            stemsNotRecieved: line[11] === "" ? 0 : line[11],
        }
    })

    return final
}
//#endregion
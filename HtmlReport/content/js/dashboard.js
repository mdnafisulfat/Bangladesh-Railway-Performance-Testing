/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.12453113278319, "KoPercent": 1.8754688672168043};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.36039188243526943, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7630208333333334, 500, 1500, "https://railspaapi.shohoz.com/v1.0/web/handshake"], "isController": false}, {"data": [0.10333333333333333, 500, 1500, "https://eticket.railway.gov.bd/"], "isController": false}, {"data": [0.78125, 500, 1500, "https://www.google-analytics.com/g/collect?v=2&tid=G-Y4CW6X15DG&gtm=45je49n0v871010812za200&_p=1727283901149&gcd=13l3l3l3l1l1&npa=0&dma=0&tag_exp=0&cid=1072665985.1727271841&ul=en-us&sr=1536x864&uaa=x86&uab=64&uafvl=Google%2520Chrome%3B129.0.6668.59%7CNot%253DA%253FBrand%3B8.0.0.0%7CChromium%3B129.0.6668.59&uamb=0&uam=&uap=Windows&uapv=15.0.0&uaw=0&are=1&frm=0&pscdl=noapi&_s=2&dl=https%3A%2F%2Feticket.railway.gov.bd%2F&dt=Home%20%7C%20Bangladesh%20Railway%20E-ticketing%20Service&sid=1727283520&sct=2&seg=1&en=page_view&_ee=1&ep.cookieFlags=SameSite%3DNone%3B%20Secure&_et=108&tfd=7180"], "isController": false}, {"data": [0.0, 500, 1500, "https://eticket.railway.gov.bd/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://eticket.railway.gov.bd/-6"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.546875, 500, 1500, "https://eticket.railway.gov.bd/-1"], "isController": false}, {"data": [0.005208333333333333, 500, 1500, "https://eticket.railway.gov.bd/-2"], "isController": false}, {"data": [0.5572916666666666, 500, 1500, "https://eticket.railway.gov.bd/assets/i18n/common/en.json"], "isController": false}, {"data": [0.28125, 500, 1500, "https://eticket.railway.gov.bd/-3"], "isController": false}, {"data": [0.052083333333333336, 500, 1500, "https://eticket.railway.gov.bd/-4"], "isController": false}, {"data": [0.984375, 500, 1500, "https://www.google-analytics.com/j/collect?v=1&_v=j101&a=1584902185&t=pageview&_s=1&dl=https%3A%2F%2Feticket.railway.gov.bd%2F&ul=en-us&de=UTF-8&dt=Home%20%7C%20Bangladesh%20Railway%20E-ticketing%20Service&sd=24-bit&sr=1536x864&vp=1519x695&je=0&_u=QACAAUABAAAAACAAI~&jid=1734629181&gjid=153431648&cid=1072665985.1727271841&tid=UA-232151598-2&_gid=590159869.1727271847&_r=1&gtm=457e49n0z8871010812za200zb871010812&gcd=13l3l3l3l1l1&dma=0&tag_exp=0&jsscut=1&z=359719417"], "isController": false}, {"data": [0.3543307086614173, 500, 1500, "https://eticket.railway.gov.bd/-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 25, 1.8754688672168043, 31505.6166541635, 70, 470387, 1863.0, 106657.0, 127237.5, 251905.4400000002, 0.5325402890898755, 135.5138110377614, 0.5423445498216809], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://railspaapi.shohoz.com/v1.0/web/handshake", 192, 0, 0.0, 601.2031249999999, 79, 7546, 256.0, 1552.000000000001, 2063.9999999999995, 5711.109999999987, 0.07971074961732613, 0.022262963272026634, 0.08788421515425898], "isController": false}, {"data": ["https://eticket.railway.gov.bd/", 150, 24, 16.0, 87983.36666666671, 207, 470387, 96630.0, 176114.2, 251404.79999999996, 394961.57000000135, 0.05996004262759297, 66.28893052544784, 0.18299875275616329], "isController": false}, {"data": ["https://www.google-analytics.com/g/collect?v=2&tid=G-Y4CW6X15DG&gtm=45je49n0v871010812za200&_p=1727283901149&gcd=13l3l3l3l1l1&npa=0&dma=0&tag_exp=0&cid=1072665985.1727271841&ul=en-us&sr=1536x864&uaa=x86&uab=64&uafvl=Google%2520Chrome%3B129.0.6668.59%7CNot%253DA%253FBrand%3B8.0.0.0%7CChromium%3B129.0.6668.59&uamb=0&uam=&uap=Windows&uapv=15.0.0&uaw=0&are=1&frm=0&pscdl=noapi&_s=2&dl=https%3A%2F%2Feticket.railway.gov.bd%2F&dt=Home%20%7C%20Bangladesh%20Railway%20E-ticketing%20Service&sid=1727283520&sct=2&seg=1&en=page_view&_ee=1&ep.cookieFlags=SameSite%3DNone%3B%20Secure&_et=108&tfd=7180", 96, 0, 0.0, 675.6979166666669, 247, 5062, 415.5, 1311.7999999999993, 1977.6999999999941, 5062.0, 0.03984680563516846, 0.014319945775138666, 0.04074180224611463], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-5", 96, 1, 1.0416666666666667, 100117.21875000003, 4566, 312947, 92236.5, 144828.5, 177821.0999999999, 312947.0, 0.041413940967878315, 34.519328662761104, 0.027014861700085418], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-6", 96, 0, 0.0, 87365.3020833333, 4300, 292904, 82361.5, 126292.9, 144306.0999999998, 292904.0, 0.04150703392897368, 25.50777478629282, 0.02723899101588898], "isController": false}, {"data": ["Test", 96, 1, 1.0416666666666667, 139449.82291666663, 83584, 471786, 114944.0, 234121.0, 298087.54999999993, 471786.0, 0.038569133363626176, 69.52146553064499, 0.3535994323557665], "isController": true}, {"data": ["https://eticket.railway.gov.bd/-1", 96, 0, 0.0, 2118.958333333333, 70, 43129, 739.0, 3506.7, 12987.049999999992, 43129.0, 0.04275698842933539, 0.06150492573868265, 0.027516460327082055], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-2", 96, 0, 0.0, 65803.03125, 705, 470180, 41441.0, 126129.49999999993, 189826.84999999957, 470180.0, 0.03859658010177436, 8.714685636885788, 0.02544208161005634], "isController": false}, {"data": ["https://eticket.railway.gov.bd/assets/i18n/common/en.json", 96, 0, 0.0, 1345.6979166666665, 167, 10191, 702.5, 3595.7, 5294.849999999997, 10191.0, 0.039728949243784284, 3.095987003667479, 0.020252452641850972], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-3", 96, 0, 0.0, 4102.812500000002, 123, 118962, 1628.5, 6748.699999999996, 12729.899999999972, 118962.0, 0.04275434156977909, 0.16416999126208145, 0.028182793515235244], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-4", 96, 0, 0.0, 26500.65624999998, 137, 213876, 8258.0, 98403.79999999994, 123514.89999999988, 213876.0, 0.042757140776549844, 1.4310280553651527, 0.028268148736058832], "isController": false}, {"data": ["https://www.google-analytics.com/j/collect?v=1&_v=j101&a=1584902185&t=pageview&_s=1&dl=https%3A%2F%2Feticket.railway.gov.bd%2F&ul=en-us&de=UTF-8&dt=Home%20%7C%20Bangladesh%20Railway%20E-ticketing%20Service&sd=24-bit&sr=1536x864&vp=1519x695&je=0&_u=QACAAUABAAAAACAAI~&jid=1734629181&gjid=153431648&cid=1072665985.1727271841&tid=UA-232151598-2&_gid=590159869.1727271847&_r=1&gtm=457e49n0z8871010812za200zb871010812&gcd=13l3l3l3l1l1&dma=0&tag_exp=0&jsscut=1&z=359719417", 96, 0, 0.0, 183.60416666666663, 73, 1338, 142.5, 330.6999999999997, 476.74999999999994, 1338.0, 0.039910583663184604, 0.017149078917774636, 0.034570984091059326], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-0", 127, 0, 0.0, 7996.889763779526, 204, 227926, 1838.0, 13041.6, 32323.59999999999, 198773.79999999987, 0.056210334646235614, 0.5982777708098846, 0.03557060239332097], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 23, 92.0, 1.7254313578394598], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 1, 4.0, 0.07501875468867217], "isController": false}, {"data": ["Assertion failed", 1, 4.0, 0.07501875468867217], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 25, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 23, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 1, "Assertion failed", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://eticket.railway.gov.bd/", 150, 24, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 23, "Assertion failed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-5", 96, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

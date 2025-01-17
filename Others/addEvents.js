var chart;
var chartData = [];
var newPanel;
var stockPanel;

function generateChartData(arr) {

    for (var i = 0; i <= arr[0].length - 1; i++) {
        var newDate = new Date(arr[0][i]['Trade_Date']);
        newDate.setHours(0, 0, 0, 0);
        var open = arr[0][i]['Open'];
        var close = arr[0][i]['Close'];
        var low = arr[0][i]['Low'];
        var high = arr[0][i]['High'];
        var volume = arr[0][i]['Volume'];


        chartData[i] = ({
            date: newDate,
            value: close,
            volume: volume
        });
    }
}

    var chart;

    function createStockChart() {
        chart = new AmCharts.AmStockChart();
        chart.pathToImages = "../amcharts/images/";

        // DATASETS //////////////////////////////////////////
        var dataSet = new AmCharts.DataSet();
        dataSet.color = "#b0de09";
        dataSet.fieldMappings = [{
                fromField: "value",
                toField: "value"
            }, {
                fromField: "volume",
                toField: "volume"
            }];
        dataSet.dataProvider = chartData;
        dataSet.categoryField = "date";

        // set data sets to the chart
        chart.dataSets = [dataSet];

        // PANELS ///////////////////////////////////////////
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = false;
        stockPanel1.title = "Value";
        stockPanel1.percentHeight = 70;

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "value";
        stockPanel1.addStockGraph(graph1);

        // create stock legend
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.valueTextRegular = " ";
        stockLegend1.markerType = "none";
        stockPanel1.stockLegend = stockLegend1;


        // second stock panel
        var stockPanel2 = new AmCharts.StockPanel();
        stockPanel2.title = "Volume";
        stockPanel2.percentHeight = 30;
        var graph2 = new AmCharts.StockGraph();
        graph2.valueField = "volume";
        graph2.type = "column";
        graph2.fillAlphas = 1;
        stockPanel2.addStockGraph(graph2);

        // create stock legend
        var stockLegend2 = new AmCharts.StockLegend();
        stockLegend2.valueTextRegular = " ";
        stockLegend2.markerType = "none";
        stockPanel2.stockLegend = stockLegend2;

        // set panels to the chart
        chart.panels = [stockPanel1, stockPanel2];


        // OTHER SETTINGS ////////////////////////////////////
        var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
        scrollbarSettings.graph = graph1;
        chart.chartScrollbarSettings = scrollbarSettings;

        var cursorSettings = new AmCharts.ChartCursorSettings();
        cursorSettings.valueBalloonsEnabled = true;
        cursorSettings.graphBulletSize = 1;
        chart.chartCursorSettings = cursorSettings;


        // PERIOD SELECTOR ///////////////////////////////////
        var periodSelector = new AmCharts.PeriodSelector();
        periodSelector.periods = [{
                period: "DD",
                count: 10,
                label: "10 days"
            }, {
                period: "MM",
                count: 1,
                label: "1 month"
            }, {
                period: "YYYY",
                count: 1,
                label: "1 year"
            }, {
                period: "YTD",
                label: "YTD"
            }, {
                period: "MAX",
                label: "MAX"
            }];
        chart.periodSelector = periodSelector;


        var panelsSettings = new AmCharts.PanelsSettings();
        panelsSettings.usePrefixes = true;
        chart.panelsSettings = panelsSettings;


        // EVENTS
        var e0 = {
            date: new Date(2015, 01, 20),
            type: "sign",
            backgroundColor: "#85CDE6",
            graph: graph1,
            text: "S",
            description: "This is description of an event"
        };
        var e1 = {
            date: new Date(2010, 10, 19),
            type: "flag",
            backgroundColor: "#FFFFFF",
            backgroundAlpha: 0.5,
            graph: graph1,
            text: "F",
            description: "Some longer\ntext can also\n be added"
        };
        var e2 = {
            date: new Date(2010, 11, 10),
            showOnAxis: true,
            backgroundColor: "#85CDE6",
            type: "pin",
            text: "X",
            graph: graph1,
            description: "This is description of an event"
        };
        var e3 = {
            date: new Date(2010, 11, 26),
            showOnAxis: true,
            backgroundColor: "#85CDE6",
            type: "pin",
            text: "Z",
            graph: graph1,
            description: "This is description of an event"
        };
        var e4 = {
            date: new Date(2011, 0, 3),
            type: "sign",
            backgroundColor: "#85CDE6",
            graph: graph1,
            text: "U",
            description: "This is description of an event"
        };
        var e5 = {
            date: new Date(2011, 1, 6),
            type: "sign",
            graph: graph1,
            text: "D",
            description: "This is description of an event"
        };
        var e6 = {
            date: new Date(2011, 3, 5),
            type: "sign",
            graph: graph1,
            text: "L",
            description: "This is description of an event"
        };
        var e7 = {
            date: new Date(2011, 3, 5),
            type: "sign",
            graph: graph1,
            text: "R",
            description: "This is description of an event"
        };
        var e8 = {
            date: new Date(2011, 5, 15),
            type: "arrowUp",
            backgroundColor: "#00CC00",
            graph: graph1,
            description: "This is description of an event"
        };
        var e9 = {
            date: new Date(2011, 6, 25),
            type: "arrowDown",
            backgroundColor: "#CC0000",
            graph: graph1,
            description: "This is description of an event"
        };
        var e10 = {
            date: new Date(2011, 8, 1),
            type: "text",
            graph: graph1,
            text: "Longer text can\nalso be displayed",
            description: "This is description of an event"
        };

        dataSet.stockEvents = [e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10];

        chart.write('chartdiv');
}
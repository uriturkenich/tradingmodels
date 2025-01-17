AmCharts.AmStockChart = AmCharts.Class({construct: function (a) {
        this.type = "stock";
        this.cname = "AmStockChart";
        this.version = "3.12.0";
        this.theme = a;
        this.createEvents("zoomed", "rollOverStockEvent", "rollOutStockEvent", "clickStockEvent", "panelRemoved", "dataUpdated", "init", "rendered", "drawn");
        this.colors = "#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(" ");
        this.firstDayOfWeek = 1;
        this.glueToTheEnd = !1;
        this.dataSetCounter = -1;
        this.zoomOutOnDataSetChange =
                !1;
        this.panels = [];
        this.dataSets = [];
        this.chartCursors = [];
        this.comparedDataSets = [];
        this.classNamePrefix = "amcharts";
        this.categoryAxesSettings = new AmCharts.CategoryAxesSettings(a);
        this.valueAxesSettings = new AmCharts.ValueAxesSettings(a);
        this.panelsSettings = new AmCharts.PanelsSettings(a);
        this.chartScrollbarSettings = new AmCharts.ChartScrollbarSettings(a);
        this.chartCursorSettings = new AmCharts.ChartCursorSettings(a);
        this.stockEventsSettings = new AmCharts.StockEventsSettings(a);
        this.legendSettings = new AmCharts.LegendSettings(a);
        this.balloon = new AmCharts.AmBalloon(a);
        this.previousEndDate = new Date(0);
        this.previousStartDate = new Date(0);
        this.dataSetCount = this.graphCount = 0;
        this.chartCreated = !1;
        this.extendToFullPeriod = !0;
        AmCharts.applyTheme(this, a, this.cname)
    }, write: function (a) {
        var b = this.theme;
        this.initHC || (AmCharts.callInitHandler(this), this.initHC = !0);
        AmCharts.applyLang(this.language, this);
        var c = this.exportConfig;
        c && AmCharts.AmExport && !this.AmExport && (this.AmExport = new AmCharts.AmExport(this, c));
        this.amExport && AmCharts.AmExport &&
                (this.AmExport = AmCharts.extend(this.amExport, new AmCharts.AmExport(this), !0));
        this.AmExport && this.AmExport.init();
        this.chartRendered = !1;
        a = "object" != typeof a ? document.getElementById(a) : a;
        this.zoomOutOnDataSetChange && (this.endDate = this.startDate = void 0);
        this.categoryAxesSettings = AmCharts.processObject(this.categoryAxesSettings, AmCharts.CategoryAxesSettings, b);
        this.valueAxesSettings = AmCharts.processObject(this.valueAxesSettings, AmCharts.ValueAxesSettings, b);
        this.chartCursorSettings = AmCharts.processObject(this.chartCursorSettings,
                AmCharts.ChartCursorSettings, b);
        this.chartScrollbarSettings = AmCharts.processObject(this.chartScrollbarSettings, AmCharts.ChartScrollbarSettings, b);
        this.legendSettings = AmCharts.processObject(this.legendSettings, AmCharts.LegendSettings, b);
        this.panelsSettings = AmCharts.processObject(this.panelsSettings, AmCharts.PanelsSettings, b);
        this.stockEventsSettings = AmCharts.processObject(this.stockEventsSettings, AmCharts.StockEventsSettings, b);
        this.dataSetSelector && (this.dataSetSelector = AmCharts.processObject(this.dataSetSelector,
                AmCharts.DataSetSelector, b));
        this.periodSelector && (this.periodSelector = AmCharts.processObject(this.periodSelector, AmCharts.PeriodSelector, b));
        a.innerHTML = "";
        this.div = a;
        this.measure();
        this.createLayout();
        this.updateDataSets();
        this.addDataSetSelector();
        this.addPeriodSelector();
        this.addPanels();
        this.updatePanels();
        this.addChartScrollbar();
        this.updateData();
        this.skipDefault || this.setDefaultPeriod()
    }, setDefaultPeriod: function (a) {
        var b = this.periodSelector;
        b && (this.animationPlayed = !1, b.setDefaultPeriod(a))
    },
    validateSize: function () {
        var a, b = this.panels;
        this.measurePanels();
        for (a = 0; a < b.length; a++)
            panel = b[a], panel.invalidateSize()
    }, updateDataSets: function () {
        var a = this.mainDataSet, b = this.dataSets, c;
        for (c = 0; c < b.length; c++) {
            var d = b[c], d = AmCharts.processObject(d, AmCharts.DataSet);
            b[c] = d;
            d.id || (this.dataSetCount++, d.id = "ds" + this.dataSetCount);
            void 0 === d.color && (d.color = this.colors.length - 1 > c ? this.colors[c] : AmCharts.randomColor())
        }
        !a && AmCharts.ifArray(b) && (this.mainDataSet = this.dataSets[0])
    }, updateEvents: function (a) {
        AmCharts.ifArray(a.stockEvents) &&
                AmCharts.parseEvents(a, this.panels, this.stockEventsSettings, this.firstDayOfWeek, this, this.dataDateFormat)
    }, getLastDate: function (a) {
        var b = this.dataDateFormat;
        a = a instanceof Date ? new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds()) : b ? AmCharts.stringToDate(a, b) : new Date(a);
        return new Date(AmCharts.changeDate(a, this.categoryAxesSettings.minPeriod, 1, !0).getTime() - 1)
    }, getFirstDate: function (a) {
        var b = this.dataDateFormat;
        a = a instanceof Date ? new Date(a.getFullYear(),
                a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds()) : b ? AmCharts.stringToDate(a, b) : new Date(a);
        return new Date(AmCharts.resetDateToMin(a, this.categoryAxesSettings.minPeriod, 1, this.firstDayOfWeek))
    }, updateData: function () {
        var a = this.mainDataSet;
        if (a) {
            var b = this.categoryAxesSettings;
            -1 == AmCharts.getItemIndex(b.minPeriod, b.groupToPeriods) && b.groupToPeriods.unshift(b.minPeriod);
            var c = a.dataProvider;
            if (AmCharts.ifArray(c)) {
                var d = a.categoryField;
                this.firstDate = this.getFirstDate(c[0][d]);
                this.lastDate = this.getLastDate(c[c.length - 1][d]);
                this.periodSelector && this.periodSelector.setRanges(this.firstDate, this.lastDate);
                a.dataParsed || (AmCharts.parseStockData(a, b.minPeriod, b.groupToPeriods, this.firstDayOfWeek, this.dataDateFormat), a.dataParsed = !0);
                this.updateComparingData();
                this.updateEvents(a)
            } else
                this.lastDate = this.firstDate = void 0;
            this.glueToTheEnd && this.startDate && this.endDate && this.lastDate && (AmCharts.getPeriodDuration(b.minPeriod), this.startDate = new Date(this.startDate.getTime() +
                    (this.lastDate.getTime() - this.endDate.getTime())), this.endDate = this.lastDate, this.updateScrollbar = !0);
            this.updatePanelsWithNewData()
        }
        a = {type: "dataUpdated", chart: this};
        this.fire(a.type, a)
    }, updateComparingData: function () {
        var a = this.comparedDataSets, b = this.categoryAxesSettings, c;
        for (c = 0; c < a.length; c++) {
            var d = a[c];
            d.dataParsed || (AmCharts.parseStockData(d, b.minPeriod, b.groupToPeriods, this.firstDayOfWeek, this.dataDateFormat), d.dataParsed = !0);
            this.updateEvents(d)
        }
    }, createLayout: function () {
        var a = this.div,
                b, c, d = this.classNamePrefix, e = document.createElement("div");
        e.style.position = "relative";
        this.containerDiv = e;
        e.className = d + "-stock-div";
        a.appendChild(e);
        if (a = this.periodSelector)
            b = a.position;
        if (a = this.dataSetSelector)
            c = a.position;
        if ("left" == b || "left" == c)
            a = document.createElement("div"), a.className = d + "-left-div", a.style.cssFloat = "left", a.style.styleFloat = "left", a.style.width = "0px", a.style.position = "absolute", e.appendChild(a), this.leftContainer = a;
        if ("right" == b || "right" == c)
            b = document.createElement("div"),
                    b.className = d + "-right-div", b.style.cssFloat = "right", b.style.styleFloat = "right", b.style.width = "0px", e.appendChild(b), this.rightContainer = b;
        b = document.createElement("div");
        b.className = d + "-center-div";
        e.appendChild(b);
        this.centerContainer = b;
        e = document.createElement("div");
        e.className = d + "-panels-div";
        b.appendChild(e);
        this.panelsContainer = e
    }, addPanels: function () {
        this.measurePanels();
        for (var a = this.panels, b = 0; b < a.length; b++) {
            var c = a[b], c = AmCharts.processObject(c, AmCharts.StockPanel, this.theme);
            a[b] = c;
            this.addStockPanel(c,
                    b)
        }
        this.panelsAdded = !0
    }, measurePanels: function () {
        this.measure();
        var a = this.chartScrollbarSettings, b = this.divRealHeight, c = this.panelsSettings.panelSpacing;
        a.enabled && (b -= a.height);
        (a = this.periodSelector) && !a.vertical && (a = a.offsetHeight, b -= a + c);
        (a = this.dataSetSelector) && !a.vertical && (a = a.offsetHeight, b -= a + c);
        a = this.panels;
        0 < b && (this.panelsContainer.style.height = b + "px");
        this.chartCursors = [];
        var d = 0, e, k;
        for (e = 0; e < a.length; e++) {
            k = a[e];
            var h = k.percentHeight;
            isNaN(h) && (h = 100 / a.length, k.percentHeight = h);
            d += h
        }
        this.panelsHeight = Math.max(b - c * (a.length - 1), 0);
        for (e = 0; e < a.length; e++)
            k = a[e], k.percentHeight = k.percentHeight / d * 100, k.panelBox && (k.panelBox.style.height = Math.round(k.percentHeight * this.panelsHeight / 100) + "px")
    }, addStockPanel: function (a, b) {
        var c = this.panelsSettings, d = document.createElement("div");
        0 < b && !this.panels[b - 1].showCategoryAxis && (d.style.marginTop = c.panelSpacing + "px");
        a.panelBox = d;
        a.stockChart = this;
        a.id || (a.id = "stockPanel" + b);
        d.className = "amChartsPanel " + this.classNamePrefix + "-stock-panel-div " +
                this.classNamePrefix + "-stock-panel-div-" + a.id;
        a.pathToImages = this.pathToImages;
        d.style.height = Math.round(a.percentHeight * this.panelsHeight / 100) + "px";
        d.style.width = "100%";
        this.panelsContainer.appendChild(d);
        0 < c.backgroundAlpha && (d.style.backgroundColor = c.backgroundColor);
        if (d = a.stockLegend)
            d.container = void 0, d.title = a.title, d.marginLeft = c.marginLeft, d.marginRight = c.marginRight, d.verticalGap = 3, d.position = "top", AmCharts.copyProperties(this.legendSettings, d), a.addLegend(d, d.divId);
        a.zoomOutText = "";
        this.addCursor(a)
    },
    enableCursors: function (a) {
        var b = this.chartCursors, c;
        for (c = 0; c < b.length; c++)
            b[c].enabled = a
    }, updatePanels: function () {
        var a = this.panels, b;
        for (b = 0; b < a.length; b++)
            this.updatePanel(a[b]);
        this.mainDataSet && this.updateGraphs();
        this.currentPeriod = void 0
    }, updatePanel: function (a) {
        a.seriesIdField = "amCategoryIdField";
        a.dataProvider = [];
        a.chartData = [];
        a.graphs = [];
        var b = a.categoryAxis, c = this.categoryAxesSettings;
        AmCharts.copyProperties(this.panelsSettings, a);
        AmCharts.copyProperties(c, b);
        b.parseDates = !0;
        a.addClassNames =
                this.addClassNames;
        a.zoomOutOnDataUpdate = !1;
        a.mouseWheelScrollEnabled = this.mouseWheelScrollEnabled;
        a.dataDateFormat = this.dataDateFormat;
        a.language = this.language;
        a.showCategoryAxis ? "top" == b.position ? a.marginTop = c.axisHeight : a.marginBottom = c.axisHeight : (a.categoryAxis.labelsEnabled = !1, a.chartCursor && (a.chartCursor.categoryBalloonEnabled = !1));
        var c = a.valueAxes, d = c.length, e;
        0 === d && (e = new AmCharts.ValueAxis(this.theme), a.addValueAxis(e));
        b = new AmCharts.AmBalloon(this.theme);
        AmCharts.copyProperties(this.balloon,
                b);
        a.balloon = b;
        c = a.valueAxes;
        d = c.length;
        for (b = 0; b < d; b++)
            e = c[b], AmCharts.copyProperties(this.valueAxesSettings, e);
        a.listenersAdded = !1;
        a.write(a.panelBox)
    }, zoom: function (a, b) {
        this.zoomChart(a, b)
    }, zoomOut: function () {
        this.zoomChart(this.firstDate, this.lastDate)
    }, updatePanelsWithNewData: function () {
        var a = this.mainDataSet, b = this.scrollbarChart;
        if (a) {
            var c = this.panels;
            this.currentPeriod = void 0;
            var d;
            for (d = 0; d < c.length; d++) {
                var e = c[d];
                e.categoryField = a.categoryField;
                0 === a.dataProvider.length && (e.dataProvider =
                []);
                e.scrollbarChart = b
            }
            b && (c = this.categoryAxesSettings, d = c.minPeriod, b.categoryField = a.categoryField, 0 < a.dataProvider.length ? (e = this.chartScrollbarSettings.usePeriod, b.dataProvider = e ? a.agregatedDataProviders[e] : a.agregatedDataProviders[d]) : b.dataProvider = [], e = b.categoryAxis, e.minPeriod = d, e.firstDayOfWeek = this.firstDayOfWeek, e.equalSpacing = c.equalSpacing, e.axisAlpha = 0, e.markPeriodChange = c.markPeriodChange, b.bbsetr = !0, b.validateData(), c = this.panelsSettings, b.maxSelectedTime = c.maxSelectedTime, b.minSelectedTime =
                    c.minSelectedTime);
            0 < a.dataProvider.length && this.zoomChart(this.startDate, this.endDate)
        }
        this.panelDataInvalidated = !1
    }, addChartScrollbar: function () {
        var a = this.chartScrollbarSettings, b = this.scrollbarChart;
        b && (b.clear(), b.destroy());
        if (a.enabled) {
            var c = this.panelsSettings, d = this.categoryAxesSettings, b = new AmCharts.AmSerialChart(this.theme);
            b.language = this.language;
            b.pathToImages = this.pathToImages;
            b.autoMargins = !1;
            this.scrollbarChart = b;
            b.id = "scrollbarChart";
            b.scrollbarOnly = !0;
            b.zoomOutText = "";
            b.marginLeft =
                    c.marginLeft;
            b.marginRight = c.marginRight;
            b.marginTop = 0;
            b.marginBottom = 0;
            var c = d.dateFormats, e = b.categoryAxis;
            e.boldPeriodBeginning = d.boldPeriodBeginning;
            c && (e.dateFormats = d.dateFormats);
            e.labelsEnabled = !1;
            e.parseDates = !0;
            d = a.graph;
            if (AmCharts.isString(d)) {
                c = this.panels;
                for (e = 0; e < c.length; e++) {
                    var k = AmCharts.getObjById(c[e].stockGraphs, a.graph);
                    k && (d = k)
                }
                a.graph = d
            }
            var h;
            d && (h = new AmCharts.AmGraph(this.theme), h.valueField = d.valueField, h.periodValue = d.periodValue, h.type = d.type, h.connect = d.connect, h.minDistance =
                    a.minDistance, b.addGraph(h));
            d = new AmCharts.ChartScrollbar(this.theme);
            b.addChartScrollbar(d);
            AmCharts.copyProperties(a, d);
            d.scrollbarHeight = a.height;
            d.graph = h;
            this.listenTo(d, "zoomed", this.handleScrollbarZoom);
            h = document.createElement("div");
            h.className = this.classNamePrefix + "-scrollbar-chart-div";
            h.style.height = a.height + "px";
            d = this.periodSelectorContainer;
            c = this.periodSelector;
            e = this.centerContainer;
            "bottom" == a.position ? c ? "bottom" == c.position ? e.insertBefore(h, d) : e.appendChild(h) : e.appendChild(h) :
                    c ? "top" == c.position ? e.insertBefore(h, d.nextSibling) : e.insertBefore(h, e.firstChild) : e.insertBefore(h, e.firstChild);
            b.write(h)
        }
    }, handleScrollbarZoom: function (a) {
        if (this.skipScrollbarEvent)
            this.skipScrollbarEvent = !1;
        else {
            var b = a.endDate, c = {};
            c.startDate = a.startDate;
            c.endDate = b;
            this.updateScrollbar = !1;
            this.handleZoom(c)
        }
    }, addPeriodSelector: function () {
        var a = this.periodSelector;
        if (a) {
            var b = this.categoryAxesSettings.minPeriod;
            a.minDuration = AmCharts.getPeriodDuration(b);
            a.minPeriod = b;
            a.chart = this;
            var c = this.dataSetSelector,
                    d, b = this.dssContainer;
            c && (d = c.position);
            var c = this.panelsSettings.panelSpacing, e = document.createElement("div");
            this.periodSelectorContainer = e;
            var k = this.leftContainer, h = this.rightContainer, f = this.centerContainer, g = this.panelsContainer, l = a.width + 2 * c + "px";
            switch (a.position) {
                case "left":
                    k.style.width = a.width + "px";
                    k.appendChild(e);
                    f.style.paddingLeft = l;
                    break;
                case "right":
                    f.style.marginRight = l;
                    h.appendChild(e);
                    h.style.width = a.width + "px";
                    break;
                case "top":
                    g.style.clear = "both";
                    f.insertBefore(e, g);
                    e.style.paddingBottom =
                            c + "px";
                    e.style.overflow = "hidden";
                    break;
                case "bottom":
                    e.style.marginTop = c + "px", "bottom" == d ? f.insertBefore(e, b) : f.appendChild(e)
            }
            this.listenTo(a, "changed", this.handlePeriodSelectorZoom);
            a.write(e)
        }
    }, addDataSetSelector: function () {
        var a = this.dataSetSelector;
        if (a) {
            a.chart = this;
            a.dataProvider = this.dataSets;
            var b = a.position, c = this.panelsSettings.panelSpacing, d = document.createElement("div");
            this.dssContainer = d;
            var e = this.leftContainer, k = this.rightContainer, h = this.centerContainer, f = this.panelsContainer, c =
                    a.width + 2 * c + "px";
            switch (b) {
                case "left":
                    e.style.width = a.width + "px";
                    e.appendChild(d);
                    h.style.paddingLeft = c;
                    break;
                case "right":
                    h.style.marginRight = c;
                    k.appendChild(d);
                    k.style.width = a.width + "px";
                    break;
                case "top":
                    f.style.clear = "both";
                    h.insertBefore(d, f);
                    d.style.overflow = "hidden";
                    break;
                case "bottom":
                    h.appendChild(d)
            }
            a.write(d)
        }
    }, handlePeriodSelectorZoom: function (a) {
        var b = this.scrollbarChart;
        b && (b.updateScrollbar = !0);
        a.predefinedPeriod ? (this.predefinedStart = a.startDate, this.predefinedEnd = a.endDate) : this.predefinedEnd =
                this.predefinedStart = null;
        this.zoomChart(a.startDate, a.endDate)
    }, addCursor: function (a) {
        var b = this.chartCursorSettings;
        if (b.enabled) {
            var c = new AmCharts.ChartCursor(this.theme);
            AmCharts.copyProperties(b, c);
            a.chartCursor && AmCharts.copyProperties(a.chartCursor, c);
            a.removeChartCursor();
            a.addChartCursor(c);
            this.listenTo(c, "changed", this.handleCursorChange);
            this.listenTo(c, "onHideCursor", this.hideChartCursor);
            this.listenTo(c, "zoomed", this.handleCursorZoom);
            this.chartCursors.push(c)
        }
    }, hideChartCursor: function () {
        var a =
                this.chartCursors, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.hideCursor(!1);
            (c = c.chart) && c.updateLegendValues()
        }
    }, handleCursorZoom: function (a) {
        var b = this.scrollbarChart;
        b && (b.updateScrollbar = !0);
        var b = {}, c;
        if (this.categoryAxesSettings.equalSpacing) {
            var d = this.mainDataSet.categoryField, e = this.mainDataSet.agregatedDataProviders[this.currentPeriod];
            c = new Date(e[a.start][d]);
            a = new Date(e[a.end][d])
        } else
            c = new Date(a.start), a = new Date(a.end);
        b.startDate = c;
        b.endDate = a;
        this.handleZoom(b)
    }, handleZoom: function (a) {
        this.zoomChart(a.startDate,
                a.endDate)
    }, zoomChart: function (a, b) {
        var c = new Date(a), d = this, e = d.firstDate, k = d.lastDate, h = d.currentPeriod, f = d.categoryAxesSettings, g = f.minPeriod, l = d.panelsSettings, n = d.periodSelector, p = d.panels, r = d.comparedGraphs, w = d.scrollbarChart, x = d.firstDayOfWeek;
        if (e && k) {
            a || (a = e);
            b || (b = k);
            if (h) {
                var m = AmCharts.extractPeriod(h);
                a.getTime() == b.getTime() && m != g && (b = AmCharts.changeDate(b, m.period, m.count), b.setTime(b.getTime() - 1))
            }
            a.getTime() < e.getTime() && (a = e);
            a.getTime() > k.getTime() && (a = k);
            b.getTime() < e.getTime() &&
                    (b = e);
            b.getTime() > k.getTime() && (b = k);
            m = AmCharts.getItemIndex(g, f.groupToPeriods);
            f = h;
            h = d.choosePeriod(m, a, b);
            d.currentPeriod = h;
            var m = AmCharts.extractPeriod(h), z = AmCharts.getPeriodDuration(m.period, m.count);
            AmCharts.getPeriodDuration(g);
            1 > b.getTime() - a.getTime() && (a = new Date(b.getTime() - 1));
            g = AmCharts.newDate(a);
            d.extendToFullPeriod && (g.getTime() - e.getTime() < .1 * z && (g = AmCharts.resetDateToMin(a, m.period, m.count, x)), k.getTime() - b.getTime() < .1 * z && (b = AmCharts.resetDateToMin(k, m.period, m.count, x), b = AmCharts.changeDate(b,
                    m.period, m.count, !0)));
            for (e = 0; e < p.length; e++)
                k = p[e], k.chartCursor && k.chartCursor.panning && (g = c);
            for (e = 0; e < p.length; e++) {
                k = p[e];
                if (h != f) {
                    for (c = 0; c < r.length; c++)
                        z = r[c].graph, z.dataProvider = z.dataSet.agregatedDataProviders[h];
                    c = k.categoryAxis;
                    c.firstDayOfWeek = x;
                    c.minPeriod = h;
                    k.dataProvider = d.mainDataSet.agregatedDataProviders[h];
                    if (c = k.chartCursor)
                        c.categoryBalloonDateFormat = d.chartCursorSettings.categoryBalloonDateFormat(m.period), k.showCategoryAxis || (c.categoryBalloonEnabled = !1);
                    k.startTime = g.getTime();
                    k.endTime = b.getTime();
                    k.validateData(!0)
                }
                c = !1;
                k.chartCursor && k.chartCursor.panning && (c = !0);
                c || (k.startTime = void 0, k.endTime = void 0, k.zoomToDates(g, b));
                0 < l.startDuration && d.animationPlayed && !c ? (k.startDuration = 0, k.animateAgain()) : 0 < l.startDuration && !c && k.animateAgain()
            }
            d.animationPlayed = !0;
            AmCharts.extractPeriod(h);
            l = new Date(b);
            w && d.updateScrollbar && (w.zoomToDates(a, l), d.skipScrollbarEvent = !0, setTimeout(function () {
                d.resetSkip.call(d)
            }, 100));
            d.updateScrollbar = !0;
            d.startDate = a;
            d.endDate = b;
            n && n.zoom(a,
                    b);
            if (a.getTime() != d.previousStartDate.getTime() || b.getTime() != d.previousEndDate.getTime())
                n = {type: "zoomed"}, n.startDate = a, n.endDate = b, n.chart = d, n.period = h, d.fire(n.type, n), d.previousStartDate = new Date(a), d.previousEndDate = new Date(b)
        }
        d.eventsHidden && d.showHideEvents(!1);
        d.chartCreated || (h = "init", d.fire(h, {type: h, chart: d}));
        d.chartRendered || (h = "rendered", d.fire(h, {type: h, chart: d}), d.chartRendered = !0);
        h = "drawn";
        d.fire(h, {type: h, chart: d});
        d.chartCreated = !0;
        d.animationPlayed = !0
    }, resetSkip: function () {
        this.skipScrollbarEvent =
                !1
    }, updateGraphs: function () {
        this.getSelections();
        if (0 < this.dataSets.length) {
            var a = this.panels;
            this.comparedGraphs = [];
            var b;
            for (b = 0; b < a.length; b++) {
                var c = a[b], d = c.valueAxes, e;
                for (e = 0; e < d.length; e++) {
                    var k = d[e];
                    k.prevLog && (k.logarithmic = k.prevLog);
                    k.recalculateToPercents = "always" == c.recalculateToPercents ? !0 : !1
                }
                d = this.mainDataSet;
                e = this.comparedDataSets;
                k = c.stockGraphs;
                c.graphs = [];
                var h;
                for (h = 0; h < k.length; h++) {
                    var f = k[h], f = AmCharts.processObject(f, AmCharts.StockGraph, this.theme);
                    k[h] = f;
                    if (!f.title ||
                            f.resetTitleOnDataSetChange)
                        f.title = d.title, f.resetTitleOnDataSetChange = !0;
                    f.useDataSetColors && (f.lineColor = d.color, f.fillColors = void 0, f.bulletColor = void 0);
                    var g = !1, l = d.fieldMappings, n;
                    for (n = 0; n < l.length; n++) {
                        var p = l[n], r = f.valueField;
                        r && p.toField == r && (g = !0);
                        (r = f.openField) && p.toField == r && (g = !0);
                        (r = f.closeField) && p.toField == r && (g = !0);
                        (r = f.lowField) && p.toField == r && (g = !0)
                    }
                    c.addGraph(f);
                    g || (f.visibleInLegend = !1);
                    r = !1;
                    "always" == c.recalculateToPercents && (r = !0);
                    var w = c.stockLegend, x, m, z, A;
                    w && (w = AmCharts.processObject(w,
                            AmCharts.StockLegend, this.theme), c.stockLegend = w, x = w.valueTextComparing, m = w.valueTextRegular, z = w.periodValueTextComparing, A = w.periodValueTextRegular);
                    if (f.comparable) {
                        var y = e.length;
                        if (f.valueAxis) {
                            0 < y && f.valueAxis.logarithmic && "never" != c.recalculateToPercents && (f.valueAxis.logarithmic = !1, f.valueAxis.prevLog = !0);
                            0 < y && "whenComparing" == c.recalculateToPercents && (f.valueAxis.recalculateToPercents = !0);
                            w && f.valueAxis && !0 === f.valueAxis.recalculateToPercents && (r = !0);
                            var C;
                            for (C = 0; C < y; C++) {
                                var B = e[C], t = f.comparedGraphs[B.id];
                                t || (t = new AmCharts.AmGraph(this.theme), t.id = "comparedGraph" + C + "_" + h + B.id);
                                t.periodValue = f.periodValue;
                                t.dataSet = B;
                                t.behindColumns = f.behindColumns;
                                f.comparedGraphs[B.id] = t;
                                t.seriesIdField = "amCategoryIdField";
                                t.connect = f.connect;
                                var u = f.compareField;
                                u || (u = f.valueField);
                                g = !1;
                                l = B.fieldMappings;
                                for (n = 0; n < l.length; n++)
                                    p = l[n], p.toField == u && (g = !0);
                                if (g) {
                                    t.valueField = u;
                                    t.title = B.title;
                                    t.lineColor = B.color;
                                    f.compareGraphLineColor && (t.lineColor = f.compareGraphLineColor);
                                    f.compareGraphType && (t.type = f.compareGraphType);
                                    g = f.compareGraphLineThickness;
                                    isNaN(g) || (t.lineThickness = g);
                                    g = f.compareGraphDashLength;
                                    isNaN(g) || (t.dashLength = g);
                                    g = f.compareGraphLineAlpha;
                                    isNaN(g) || (t.lineAlpha = g);
                                    g = f.compareGraphCornerRadiusTop;
                                    isNaN(g) || (t.cornerRadiusTop = g);
                                    g = f.compareGraphCornerRadiusBottom;
                                    isNaN(g) || (t.cornerRadiusBottom = g);
                                    g = f.compareGraphBalloonColor;
                                    isNaN(g) || (t.balloonColor = g);
                                    g = f.compareGraphBulletColor;
                                    isNaN(g) || (t.bulletColor = g);
                                    if (g = f.compareGraphFillColors)
                                        t.fillColors = g;
                                    if (g = f.compareGraphNegativeFillColors)
                                        t.negativeFillColors =
                                                g;
                                    if (g = f.compareGraphFillAlphas)
                                        t.fillAlphas = g;
                                    if (g = f.compareGraphNegativeFillAlphas)
                                        t.negativeFillAlphas = g;
                                    if (g = f.compareGraphBullet)
                                        t.bullet = g;
                                    if (g = f.compareGraphNumberFormatter)
                                        t.numberFormatter = g;
                                    g = f.compareGraphPrecision;
                                    isNaN(g) || (t.precision = g);
                                    if (g = f.compareGraphBalloonText)
                                        t.balloonText = g;
                                    g = f.compareGraphBulletSize;
                                    isNaN(g) || (t.bulletSize = g);
                                    g = f.compareGraphBulletAlpha;
                                    isNaN(g) || (t.bulletAlpha = g);
                                    g = f.compareGraphBulletBorderAlpha;
                                    isNaN(g) || (t.bulletBorderAlpha = g);
                                    if (g = f.compareGraphBulletBorderColor)
                                        t.bulletBorderColor =
                                                g;
                                    g = f.compareGraphBulletBorderThickness;
                                    isNaN(g) || (t.bulletBorderThickness = g);
                                    t.visibleInLegend = f.compareGraphVisibleInLegend;
                                    t.balloonFunction = f.compareGraphBalloonFunction;
                                    t.hideBulletsCount = f.hideBulletsCount;
                                    t.valueAxis = f.valueAxis;
                                    w && (r && x ? (t.legendValueText = x, t.legendPeriodValueText = z) : (m && (t.legendValueText = m), t.legendPeriodValueText = A));
                                    c.showComparedOnTop ? c.graphs.push(t) : c.graphs.unshift(t);
                                    this.comparedGraphs.push({graph: t, dataSet: B})
                                }
                            }
                        }
                    }
                    w && (r && x ? (f.legendValueText = x, f.legendPeriodValueText =
                            z) : (m && (f.legendValueText = m), f.legendPeriodValueText = A))
                }
            }
        }
    }, choosePeriod: function (a, b, c) {
        var d = this.categoryAxesSettings, e = d.groupToPeriods, k = e[a], e = e[a + 1], h = AmCharts.extractPeriod(k), h = AmCharts.getPeriodDuration(h.period, h.count), f = b.getTime(), g = c.getTime(), d = d.maxSeries;
        return(g - f) / h > d && 0 < d && e ? this.choosePeriod(a + 1, b, c) : k
    }, handleCursorChange: function (a) {
        var b = a.target, c = a.position, d = a.zooming;
        a = a.index;
        var e = this.chartCursors, k;
        for (k = 0; k < e.length; k++) {
            var h = e[k];
            h != b && c && (h.isZooming(d), h.previousMousePosition =
                    NaN, h.forceShow = !0, h.initialMouse = b.initialMouse, h.selectionPosX = b.selectionPosX, h.setPosition(c, !1, a))
        }
    }, getSelections: function () {
        var a = [], b = this.dataSets, c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            d.compared && a.push(d)
        }
        this.comparedDataSets = a;
        b = this.panels;
        for (c = 0; c < b.length; c++)
            d = b[c], "never" != d.recalculateToPercents && 0 < a.length ? d.hideDrawingIcons(!0) : d.drawingIconsEnabled && d.hideDrawingIcons(!1)
    }, addPanel: function (a) {
        this.panels.push(a);
        AmCharts.removeChart(a);
        AmCharts.addChart(a)
    }, addPanelAt: function (a,
            b) {
        this.panels.splice(b, 0, a);
        AmCharts.removeChart(a);
        AmCharts.addChart(a)
    }, removePanel: function (a) {
        var b = this.panels, c;
        for (c = b.length - 1; 0 <= c; c--)
            if (b[c] == a) {
                var d = {type: "panelRemoved", panel: a, chart: this};
                this.fire(d.type, d);
                b.splice(c, 1);
                a.destroy();
                a.clear()
            }
    }, validateData: function () {
        this.resetDataParsed();
        this.updateDataSets();
        this.mainDataSet.compared = !1;
        this.updateGraphs();
        this.updateData();
        var a = this.dataSetSelector;
        a && a.write(a.div)
    }, resetDataParsed: function () {
        var a = this.dataSets, b;
        for (b = 0; b <
                a.length; b++)
            a[b].dataParsed = !1
    }, validateNow: function () {
        this.skipDefault = !0;
        this.chartRendered = !1;
        this.clear(!0);
        this.write(this.div)
    }, hideStockEvents: function () {
        this.showHideEvents(!1);
        this.eventsHidden = !0
    }, showStockEvents: function () {
        this.showHideEvents(!0);
        this.eventsHidden = !1
    }, showHideEvents: function (a) {
        var b = this.panels, c;
        for (c = 0; c < b.length; c++) {
            var d = b[c].graphs, e;
            for (e = 0; e < d.length; e++) {
                var k = d[e];
                !0 === a ? k.showCustomBullets(!0) : k.hideCustomBullets(!0)
            }
        }
    }, invalidateSize: function () {
        var a = this;
        clearTimeout(a.validateTO);
        var b = setTimeout(function () {
            a.validateNow()
        }, 5);
        a.validateTO = b
    }, measure: function () {
        var a = this.div, b = a.offsetWidth, c = a.offsetHeight;
        a.clientHeight && (b = a.clientWidth, c = a.clientHeight);
        this.divRealWidth = b;
        this.divRealHeight = c
    }, clear: function (a) {
        var b = this.panels, c;
        if (b)
            for (c = 0; c < b.length; c++) {
                var d = b[c];
                a || (d.cleanChart(), d.destroy());
                d.clear(a)
            }
        (b = this.scrollbarChart) && b.clear();
        if (b = this.div)
            b.innerHTML = "";
        a || (this.div = null, AmCharts.deleteObject(this))
    }});
AmCharts.StockEvent = AmCharts.Class({construct: function () {
    }});
AmCharts.DataSet = AmCharts.Class({construct: function () {
        this.cname = "DataSet";
        this.fieldMappings = [];
        this.dataProvider = [];
        this.agregatedDataProviders = [];
        this.stockEvents = [];
        this.compared = !1;
        this.showInCompare = this.showInSelect = !0
    }});
AmCharts.PeriodSelector = AmCharts.Class({construct: function (a) {
        this.cname = "PeriodSelector";
        this.theme = a;
        this.createEvents("changed");
        this.inputFieldsEnabled = !0;
        this.position = "bottom";
        this.width = 180;
        this.fromText = "From: ";
        this.toText = "to: ";
        this.periodsText = "Zoom: ";
        this.periods = [];
        this.inputFieldWidth = 100;
        this.dateFormat = "DD-MM-YYYY";
        this.hideOutOfScopePeriods = !0;
        AmCharts.applyTheme(this, a, this.cname)
    }, zoom: function (a, b) {
        var c = this.chart;
        this.inputFieldsEnabled && (this.startDateField.value = AmCharts.formatDate(a,
                this.dateFormat, c), this.endDateField.value = AmCharts.formatDate(b, this.dateFormat, c));
        this.markButtonAsSelected()
    }, write: function (a) {
        var b = this, c = b.chart.classNamePrefix;
        a.className = "amChartsPeriodSelector " + c + "-period-selector-div";
        var d = b.width, e = b.position;
        b.width = void 0;
        b.position = void 0;
        AmCharts.applyStyles(a.style, b);
        b.width = d;
        b.position = e;
        b.div = a;
        a.innerHTML = "";
        d = b.theme;
        e = b.position;
        e = "top" == e || "bottom" == e ? !1 : !0;
        b.vertical = e;
        var k = 0, h = 0;
        if (b.inputFieldsEnabled) {
            var f = document.createElement("div");
            a.appendChild(f);
            var g = document.createTextNode(AmCharts.lang.fromText || b.fromText);
            f.appendChild(g);
            e ? AmCharts.addBr(f) : (f.style.styleFloat = "left", f.style.display = "inline");
            var l = document.createElement("input");
            l.className = "amChartsInputField " + c + "-start-date-input";
            d && AmCharts.applyStyles(l.style, d.PeriodInputField);
            l.style.textAlign = "center";
            l.onblur = function (a) {
                b.handleCalChange(a)
            };
            AmCharts.isNN && l.addEventListener("keypress", function (a) {
                b.handleCalendarChange.call(b, a)
            }, !0);
            AmCharts.isIE && l.attachEvent("onkeypress",
                    function (a) {
                        b.handleCalendarChange.call(b, a)
                    });
            f.appendChild(l);
            b.startDateField = l;
            if (e)
                g = b.width - 6 + "px", AmCharts.addBr(f);
            else {
                var g = b.inputFieldWidth + "px", n = document.createTextNode(" ");
                f.appendChild(n)
            }
            l.style.width = g;
            l = document.createTextNode(AmCharts.lang.toText || b.toText);
            f.appendChild(l);
            e && AmCharts.addBr(f);
            l = document.createElement("input");
            l.className = "amChartsInputField " + c + "-end-date-input";
            d && AmCharts.applyStyles(l.style, d.PeriodInputField);
            l.style.textAlign = "center";
            l.onblur = function () {
                b.handleCalChange()
            };
            AmCharts.isNN && l.addEventListener("keypress", function (a) {
                b.handleCalendarChange.call(b, a)
            }, !0);
            AmCharts.isIE && l.attachEvent("onkeypress", function (a) {
                b.handleCalendarChange.call(b, a)
            });
            f.appendChild(l);
            b.endDateField = l;
            e ? AmCharts.addBr(f) : k = l.offsetHeight + 2;
            g && (l.style.width = g)
        }
        f = b.periods;
        if (AmCharts.ifArray(f)) {
            g = document.createElement("div");
            e || (g.style.cssFloat = "right", g.style.styleFloat = "right", g.style.display = "inline");
            a.appendChild(g);
            e && AmCharts.addBr(g);
            a = document.createTextNode(AmCharts.lang.periodsText ||
                    b.periodsText);
            g.appendChild(a);
            b.periodContainer = g;
            var p;
            for (a = 0; a < f.length; a++)
                l = f[a], p = document.createElement("input"), p.type = "button", p.value = l.label, p.period = l.period, p.count = l.count, p.periodObj = l, p.className = "amChartsButton " + c + "-period-input", d && AmCharts.applyStyles(p.style, d.PeriodButton), e && (p.style.width = b.width - 1 + "px"), p.style.boxSizing = "border-box", g.appendChild(p), b.addEventListeners(p), l.button = p;
            !e && p && (h = p.offsetHeight);
            b.offsetHeight = Math.max(k, h)
        }
    }, addEventListeners: function (a) {
        var b =
                this;
        AmCharts.isNN && a.addEventListener("click", function (a) {
            b.handlePeriodChange.call(b, a)
        }, !0);
        AmCharts.isIE && a.attachEvent("onclick", function (a) {
            b.handlePeriodChange.call(b, a)
        })
    }, getPeriodDates: function () {
        var a = this.periods, b;
        for (b = 0; b < a.length; b++)
            this.selectPeriodButton(a[b], !0)
    }, handleCalendarChange: function (a) {
        13 == a.keyCode && this.handleCalChange(a)
    }, handleCalChange: function (a) {
        var b = this.dateFormat, c = AmCharts.stringToDate(this.startDateField.value, b), b = this.chart.getLastDate(AmCharts.stringToDate(this.endDateField.value,
                b));
        try {
            this.startDateField.blur(), this.endDateField.blur()
        } catch (d) {
        }
        if (c && b) {
            var e = {type: "changed"};
            e.startDate = c;
            e.endDate = b;
            e.chart = this.chart;
            e.event = a;
            this.fire(e.type, e)
        }
    }, handlePeriodChange: function (a) {
        this.selectPeriodButton((a.srcElement ? a.srcElement : a.target).periodObj, !1, a)
    }, setRanges: function (a, b) {
        this.firstDate = a;
        this.lastDate = b;
        this.getPeriodDates()
    }, selectPeriodButton: function (a, b, c) {
        var d = a.button, e = d.count, k = d.period, h = this.chart, f, g, l = this.firstDate, n = this.lastDate, p, r = this.theme;
        l && n && ("MAX" == k ? (f = l, g = n) : "YTD" == k ? (f = new Date, f.setMonth(0, 1), f.setHours(0, 0, 0, 0), 0 === e && f.setDate(f.getDate() - 1), g = this.lastDate) : "YYYY" == k || "MM" == k ? this.selectFromStart ? (f = l, g = new Date(l), g.setMonth(g.getMonth() + e)) : (f = new Date(n), AmCharts.changeDate(f, k, e, !1), f.setDate(f.getDate() - 1), g = n) : (p = AmCharts.getPeriodDuration(k, e), this.selectFromStart ? (f = l, g = new Date(l.getTime() + p - 1)) : (f = new Date(n.getTime() - p + 1), g = n)), a.startTime = f.getTime(), this.hideOutOfScopePeriods && (b && a.startTime < l.getTime() ? d.style.display =
                "none" : d.style.display = "inline"), f.getTime() > n.getTime() && (p = AmCharts.getPeriodDuration("DD", 1), f = new Date(n.getTime() - p)), f.getTime() < l.getTime() && (f = l), "YTD" == k && (a.startTime = f.getTime()), a.endTime = g.getTime(), b || (this.skipMark = !0, this.unselectButtons(), d.className = "amChartsButtonSelected " + h.classNamePrefix + "-period-input-selected", r && AmCharts.applyStyles(d.style, r.PeriodButtonSelected), a = {type: "changed"}, a.startDate = f, a.endDate = g, a.predefinedPeriod = k, a.chart = this.chart, a.count = e, a.event = c, this.fire(a.type,
                a)))
    }, markButtonAsSelected: function () {
        if (!this.skipMark) {
            var a = this.chart, b = this.periods, c = a.startDate.getTime(), d = a.endDate.getTime(), e = this.lastDate.getTime();
            d > e && (d = e);
            e = this.theme;
            this.unselectButtons();
            var k;
            for (k = b.length - 1; 0 <= k; k--) {
                var h = b[k], f = h.button;
                h.startTime && h.endTime && c == h.startTime && d == h.endTime && (this.unselectButtons(), f.className = "amChartsButtonSelected " + a.classNamePrefix + "-period-input-selected", e && AmCharts.applyStyles(f.style, e.PeriodButtonSelected))
            }
        }
        this.skipMark = !1
    }, unselectButtons: function () {
        var a =
                this.chart, b = this.periods, c, d = this.theme;
        for (c = b.length - 1; 0 <= c; c--) {
            var e = b[c].button;
            e.className = "amChartsButton " + a.classNamePrefix + "-period-input";
            d && AmCharts.applyStyles(e.style, d.PeriodButton)
        }
    }, setDefaultPeriod: function () {
        var a = this.periods, b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.selected && this.selectPeriodButton(c)
        }
    }});
AmCharts.StockGraph = AmCharts.Class({inherits: AmCharts.AmGraph, construct: function (a) {
        AmCharts.StockGraph.base.construct.call(this, a);
        this.cname = "StockGraph";
        this.useDataSetColors = !0;
        this.periodValue = "Close";
        this.compareGraphType = "line";
        this.compareGraphVisibleInLegend = !0;
        this.comparable = this.resetTitleOnDataSetChange = !1;
        this.comparedGraphs = {};
        this.showEventsOnComparedGraphs = !1;
        AmCharts.applyTheme(this, a, this.cname)
    }});
AmCharts.StockPanel = AmCharts.Class({inherits: AmCharts.AmSerialChart, construct: function (a) {
        AmCharts.StockPanel.base.construct.call(this, a);
        this.cname = "StockPanel";
        this.theme = a;
        this.showCategoryAxis = this.showComparedOnTop = !0;
        this.recalculateToPercents = "whenComparing";
        this.panelHeaderPaddingBottom = this.panelHeaderPaddingLeft = this.panelHeaderPaddingRight = this.panelHeaderPaddingTop = 0;
        this.trendLineAlpha = 1;
        this.trendLineColor = "#00CC00";
        this.trendLineColorHover = "#CC0000";
        this.trendLineThickness = 2;
        this.trendLineDashLength =
                0;
        this.stockGraphs = [];
        this.drawingIconsEnabled = !1;
        this.iconSize = 18;
        this.autoMargins = this.allowTurningOff = this.eraseAll = this.erasingEnabled = this.drawingEnabled = !1;
        AmCharts.applyTheme(this, a, this.cname)
    }, initChart: function (a) {
        AmCharts.StockPanel.base.initChart.call(this, a);
        this.drawingIconsEnabled && this.createDrawIcons();
        (a = this.chartCursor) && this.listenTo(a, "draw", this.handleDraw)
    }, addStockGraph: function (a) {
        this.stockGraphs.push(a);
        return a
    }, handleCursorZoom: function (a) {
        this.chartCursor && this.chartCursor.pan &&
                AmCharts.StockPanel.base.handleCursorZoom.call(this, a)
    }, removeStockGraph: function (a) {
        var b = this.stockGraphs, c;
        for (c = b.length - 1; 0 <= c; c--)
            b[c] == a && b.splice(c, 1)
    }, createDrawIcons: function () {
        var a = this, b = a.iconSize, c = a.container, d = a.pathToImages, e = a.realWidth - 2 * b - 1 - a.marginRight, k = AmCharts.rect(c, b, b, "#000", .005), h = AmCharts.rect(c, b, b, "#000", .005);
        h.translate(b + 1, 0);
        var f = c.image(d + "pencilIcon.gif", 0, 0, b, b);
        AmCharts.setCN(a, f, "pencil");
        a.pencilButton = f;
        h.setAttr("cursor", "pointer");
        k.setAttr("cursor",
                "pointer");
        k.mouseup(function () {
            a.handlePencilClick()
        });
        var g = c.image(d + "pencilIconH.gif", 0, 0, b, b);
        AmCharts.setCN(a, g, "pencil-pushed");
        a.pencilButtonPushed = g;
        a.drawingEnabled || g.hide();
        var l = c.image(d + "eraserIcon.gif", b + 1, 0, b, b);
        AmCharts.setCN(a, l, "eraser");
        a.eraserButton = l;
        h.mouseup(function () {
            a.handleEraserClick()
        });
        k.touchend && (k.touchend(function () {
            a.handlePencilClick()
        }), h.touchend(function () {
            a.handleEraserClick()
        }));
        b = c.image(d + "eraserIconH.gif", b + 1, 0, b, b);
        AmCharts.setCN(a, b, "eraser-pushed");
        a.eraserButtonPushed = b;
        a.erasingEnabled || b.hide();
        c = c.set([f, g, l, b, k, h]);
        AmCharts.setCN(a, c, "drawing-tools");
        c.translate(e, 1);
        this.hideIcons && c.hide()
    }, handlePencilClick: function () {
        var a = !this.drawingEnabled;
        this.disableDrawing(!a);
        this.erasingEnabled = !1;
        var b = this.eraserButtonPushed;
        b && b.hide();
        b = this.pencilButtonPushed;
        a ? b && b.show() : (b && b.hide(), this.setMouseCursor("auto"))
    }, disableDrawing: function (a) {
        this.drawingEnabled = !a;
        var b = this.chartCursor;
        this.stockChart.enableCursors(a);
        b && b.enableDrawing(!a)
    },
    handleEraserClick: function () {
        this.disableDrawing(!0);
        var a = this.pencilButtonPushed;
        a && a.hide();
        a = this.eraserButtonPushed;
        if (this.eraseAll) {
            var a = this.trendLines, b;
            for (b = a.length - 1; 0 <= b; b--) {
                var c = a[b];
                c.isProtected || this.removeTrendLine(c)
            }
            this.validateNow()
        } else
            (this.erasingEnabled = b = !this.erasingEnabled) ? (a && a.show(), this.setTrendColorHover(this.trendLineColorHover), this.setMouseCursor("auto")) : (a && a.hide(), this.setTrendColorHover())
    }, setTrendColorHover: function (a) {
        var b = this.trendLines, c;
        for (c =
                b.length - 1; 0 <= c; c--) {
            var d = b[c];
            d.isProtected || (d.rollOverColor = a)
        }
    }, handleDraw: function (a) {
        var b = this.drawOnAxis;
        AmCharts.isString(b) && (b = this.getValueAxisById(b));
        b || (b = this.valueAxes[0]);
        this.drawOnAxis = b;
        var c = this.categoryAxis, d = a.initialX, e = a.finalX, k = a.initialY;
        a = a.finalY;
        var h = new AmCharts.TrendLine(this.theme);
        h.initialDate = c.coordinateToDate(d);
        h.finalDate = c.coordinateToDate(e);
        h.initialValue = b.coordinateToValue(k);
        h.finalValue = b.coordinateToValue(a);
        h.lineAlpha = this.trendLineAlpha;
        h.lineColor =
                this.trendLineColor;
        h.lineThickness = this.trendLineThickness;
        h.dashLength = this.trendLineDashLength;
        h.valueAxis = b;
        h.categoryAxis = c;
        this.addTrendLine(h);
        this.listenTo(h, "click", this.handleTrendClick);
        this.validateNow()
    }, hideDrawingIcons: function (a) {
        (this.hideIcons = a) && this.disableDrawing(a)
    }, handleTrendClick: function (a) {
        this.erasingEnabled && (a = a.trendLine, this.eraseAll || a.isProtected || this.removeTrendLine(a), this.validateNow())
    }, handleWheelReal: function (a, b) {
        var c = this.scrollbarChart;
        if (!this.wheelBusy &&
                c) {
            var d = 1;
            b && (d = -1);
            var c = c.chartScrollbar, e = this.categoryAxis.minDuration();
            0 > a ? (d = this.startTime + d * e, e = this.endTime + 1 * e) : (d = this.startTime - d * e, e = this.endTime - 1 * e);
            d < this.firstTime && (d = this.firstTime);
            e > this.lastTime && (e = this.lastTime);
            d < e && c.timeZoom(d, e, !0)
        }
    }});
AmCharts.CategoryAxesSettings = AmCharts.Class({construct: function (a) {
        this.cname = "CategoryAxesSettings";
        this.minPeriod = "DD";
        this.equalSpacing = !1;
        this.axisHeight = 28;
        this.tickLength = this.axisAlpha = 0;
        this.gridCount = 10;
        this.maxSeries = 150;
        this.groupToPeriods = "ss 10ss 30ss mm 10mm 30mm hh DD WW MM YYYY".split(" ");
        this.markPeriodChange = this.autoGridCount = !0;
        AmCharts.applyTheme(this, a, this.cname)
    }});
AmCharts.ChartCursorSettings = AmCharts.Class({construct: function (a) {
        this.cname = "ChartCursorSettings";
        this.enabled = !0;
        this.bulletsEnabled = this.valueBalloonsEnabled = !1;
        this.categoryBalloonDateFormats = [{period: "YYYY", format: "YYYY"}, {period: "MM", format: "MMM, YYYY"}, {period: "WW", format: "MMM DD, YYYY"}, {period: "DD", format: "MMM DD, YYYY"}, {period: "hh", format: "JJ:NN"}, {period: "mm", format: "JJ:NN"}, {period: "ss", format: "JJ:NN:SS"}, {period: "fff", format: "JJ:NN:SS"}];
        AmCharts.applyTheme(this, a, this.cname)
    }, categoryBalloonDateFormat: function (a) {
        var b =
                this.categoryBalloonDateFormats, c, d;
        for (d = 0; d < b.length; d++)
            b[d].period == a && (c = b[d].format);
        return c
    }});
AmCharts.ChartScrollbarSettings = AmCharts.Class({construct: function (a) {
        this.cname = "ChartScrollbarSettings";
        this.height = 40;
        this.enabled = !0;
        this.color = "#FFFFFF";
        this.updateOnReleaseOnly = this.autoGridCount = !0;
        this.hideResizeGrips = !1;
        this.position = "bottom";
        this.minDistance = 1;
        AmCharts.applyTheme(this, a, this.cname)
    }});
AmCharts.LegendSettings = AmCharts.Class({construct: function (a) {
        this.cname = "LegendSettings";
        this.marginBottom = this.marginTop = 0;
        this.usePositiveNegativeOnPercentsOnly = !0;
        this.positiveValueColor = "#00CC00";
        this.negativeValueColor = "#CC0000";
        this.autoMargins = this.equalWidths = this.textClickEnabled = !1;
        AmCharts.applyTheme(this, a, this.cname)
    }});
AmCharts.PanelsSettings = AmCharts.Class({construct: function (a) {
        this.cname = "PanelsSettings";
        this.marginBottom = this.marginTop = this.marginRight = this.marginLeft = 0;
        this.backgroundColor = "#FFFFFF";
        this.backgroundAlpha = 0;
        this.panelSpacing = 8;
        this.panEventsEnabled = !0;
        this.creditsPosition = "top-right";
        AmCharts.applyTheme(this, a, this.cname)
    }});
AmCharts.StockEventsSettings = AmCharts.Class({construct: function (a) {
        this.cname = "StockEventsSettings";
        this.type = "sign";
        this.backgroundAlpha = 1;
        this.backgroundColor = "#DADADA";
        this.borderAlpha = 1;
        this.borderColor = "#888888";
        this.balloonColor = this.rollOverColor = "#CC0000";
        AmCharts.applyTheme(this, a, this.cname)
    }});
AmCharts.ValueAxesSettings = AmCharts.Class({construct: function (a) {
        this.cname = "ValueAxesSettings";
        this.tickLength = 0;
        this.showFirstLabel = this.autoGridCount = this.inside = !0;
        this.showLastLabel = !1;
        this.axisAlpha = 0;
        AmCharts.applyTheme(this, a, this.cname)
    }});
AmCharts.getItemIndex = function (a, b) {
    var c = -1, d;
    for (d = 0; d < b.length; d++)
        a == b[d] && (c = d);
    return c
};
AmCharts.addBr = function (a) {
    a.appendChild(document.createElement("br"))
};
AmCharts.applyStyles = function (a, b) {
    if (b && a)
        for (var c in a) {
            var d = c, e = b[d];
            if (void 0 !== e)
                try {
                    a[d] = e
                } catch (k) {
                }
        }
};
AmCharts.parseStockData = function (a, b, c, d, e) {
    (new Date).getTime();
    var k = {}, h = a.dataProvider, f = a.categoryField;
    if (f) {
        var g = AmCharts.getItemIndex(b, c), l = c.length, n, p = h.length, r, w = {};
        for (n = g; n < l; n++)
            r = c[n], k[r] = [];
        var x = {}, m = a.fieldMappings, z = m.length;
        for (n = 0; n < p; n++) {
            var A = h[n], y = A[f], y = y instanceof Date ? AmCharts.newDate(y, b) : e ? AmCharts.stringToDate(y, e) : new Date(y), C = y.getTime(), B = {};
            for (r = 0; r < z; r++)
                B[m[r].toField] = A[m[r].fromField];
            var t;
            for (t = g; t < l; t++) {
                r = c[t];
                var u = AmCharts.extractPeriod(r), D = u.period,
                        F = u.count, v, q;
                if (t == g || C >= w[r] || !w[r]) {
                    x[r] = {};
                    x[r].amCategoryIdField = String(AmCharts.resetDateToMin(y, D, F, d).getTime());
                    var E;
                    for (E = 0; E < z; E++)
                        u = m[E].toField, v = x[r], q = Number(B[u]), v[u + "Count"] = 0, v[u + "Sum"] = 0, isNaN(q) || (v[u + "Open"] = q, v[u + "Sum"] = q, v[u + "High"] = q, v[u + "Low"] = q, v[u + "Close"] = q, v[u + "Count"] = 1, v[u + "Average"] = q);
                    v.dataContext = A;
                    k[r].push(x[r]);
                    t > g && (u = AmCharts.newDate(y, b), u = AmCharts.changeDate(u, D, F, !0), u = AmCharts.resetDateToMin(u, D, F, d), w[r] = u.getTime());
                    if (t == g)
                        for (var G in A)
                            A.hasOwnProperty(G) &&
                                    (x[r][G] = A[G]);
                    x[r][f] = AmCharts.newDate(y, b)
                } else
                    for (D = 0; D < z; D++)
                        u = m[D].toField, v = x[r], n == p - 1 && (v[f] = AmCharts.newDate(y, b)), q = Number(B[u]), isNaN(q) || (isNaN(v[u + "Low"]) && (v[u + "Low"] = q), q < v[u + "Low"] && (v[u + "Low"] = q), isNaN(v[u + "High"]) && (v[u + "High"] = q), q > v[u + "High"] && (v[u + "High"] = q), v[u + "Close"] = q, F = AmCharts.getDecimals(v[u + "Sum"]), E = AmCharts.getDecimals(q), v[u + "Sum"] += q, v[u + "Sum"] = AmCharts.roundTo(v[u + "Sum"], Math.max(F, E)), v[u + "Count"]++, v[u + "Average"] = v[u + "Sum"] / v[u + "Count"])
            }
        }
    }
    a.agregatedDataProviders =
    k
};
AmCharts.parseEvents = function (a, b, c, d, e, k) {
    var h = a.stockEvents, f = a.agregatedDataProviders, g = b.length, l, n, p, r, w, x, m, z;
    for (l = 0; l < g; l++) {
        x = b[l];
        w = x.graphs;
        p = w.length;
        var A;
        for (n = 0; n < p; n++)
            r = w[n], r.customBulletField = "amCustomBullet" + r.id + "_" + x.id, r.bulletConfigField = "amCustomBulletConfig" + r.id + "_" + x.id;
        for (var y = 0; y < h.length; y++)
            if (m = h[y], A = m.graph, AmCharts.isString(A) && (A = AmCharts.getObjById(w, A)))
                m.graph = A
    }
    for (var C in f)
        if (f.hasOwnProperty(C)) {
            A = f[C];
            var B = AmCharts.extractPeriod(C), t = A.length, u;
            for (u =
                    0; u < t; u++) {
                var D = A[u];
                l = D[a.categoryField];
                z = l instanceof Date;
                k && !z && (l = AmCharts.stringToDate(l, k));
                var F = l.getTime();
                w = B.period;
                var y = B.count, v;
                v = "fff" == w ? l.getTime() + 1 : AmCharts.resetDateToMin(AmCharts.changeDate(new Date(l), B.period, B.count), w, y, d).getTime();
                for (l = 0; l < g; l++)
                    for (x = b[l], w = x.graphs, p = w.length, n = 0; n < p; n++) {
                        r = w[n];
                        var q = {};
                        q.eventDispatcher = e;
                        q.eventObjects = [];
                        q.letters = [];
                        q.descriptions = [];
                        q.shapes = [];
                        q.backgroundColors = [];
                        q.backgroundAlphas = [];
                        q.borderColors = [];
                        q.borderAlphas = [];
                        q.colors = [];
                        q.rollOverColors = [];
                        q.showOnAxis = [];
                        q.values = [];
                        q.showAts = [];
                        for (y = 0; y < h.length; y++) {
                            m = h[y];
                            z = m.date instanceof Date;
                            k && !z && (m.date = AmCharts.stringToDate(m.date, k));
                            z = m.date.getTime();
                            var E = !1;
                            m.graph && (m.graph.showEventsOnComparedGraphs && m.graph.comparedGraphs[a.id] && (E = !0), (r == m.graph || E) && z >= F && z < v && (q.eventObjects.push(m), q.letters.push(m.text), q.descriptions.push(m.description), m.type ? q.shapes.push(m.type) : q.shapes.push(c.type), void 0 !== m.backgroundColor ? q.backgroundColors.push(m.backgroundColor) :
                                    q.backgroundColors.push(c.backgroundColor), isNaN(m.backgroundAlpha) ? q.backgroundAlphas.push(c.backgroundAlpha) : q.backgroundAlphas.push(m.backgroundAlpha), isNaN(m.borderAlpha) ? q.borderAlphas.push(c.borderAlpha) : q.borderAlphas.push(m.borderAlpha), void 0 !== m.borderColor ? q.borderColors.push(m.borderColor) : q.borderColors.push(c.borderColor), void 0 !== m.rollOverColor ? q.rollOverColors.push(m.rollOverColor) : q.rollOverColors.push(c.rollOverColor), void 0 !== m.showAt ? q.showAts.push(m.showAt) : q.showAts.push(c.showAt),
                                    q.colors.push(m.color), q.values.push(m.value), !m.panel && m.graph && (m.panel = m.graph.chart), q.showOnAxis.push(m.showOnAxis), q.date = new Date(m.date)));
                            0 < q.shapes.length && (m = "amCustomBullet" + r.id + "_" + x.id, z = "amCustomBulletConfig" + r.id + "_" + x.id, D[m] = AmCharts.StackedBullet, D[z] = q)
                        }
                    }
            }
        }
};
AmCharts.StockLegend = AmCharts.Class({inherits: AmCharts.AmLegend, construct: function (a) {
        AmCharts.StockLegend.base.construct.call(this, a);
        this.cname = "StockLegend";
        this.valueTextComparing = "[[percents.value]]%";
        this.valueTextRegular = "[[value]]";
        AmCharts.applyTheme(this, a, this.cname)
    }, drawLegend: function () {
        var a = this;
        AmCharts.StockLegend.base.drawLegend.call(a);
        var b = a.chart;
        if (b.allowTurningOff) {
            var c = a.container, d = c.image(b.pathToImages + "xIcon.gif", b.realWidth - 17, 3, 17, 17), b = c.image(b.pathToImages + "xIconH.gif",
                    b.realWidth - 17, 3, 17, 17);
            b.hide();
            a.xButtonHover = b;
            d.mouseup(function () {
                a.handleXClick()
            }).mouseover(function () {
                a.handleXOver()
            });
            b.mouseup(function () {
                a.handleXClick()
            }).mouseout(function () {
                a.handleXOut()
            })
        }
    }, handleXOver: function () {
        this.xButtonHover.show()
    }, handleXOut: function () {
        this.xButtonHover.hide()
    }, handleXClick: function () {
        var a = this.chart, b = a.stockChart;
        b.removePanel(a);
        b.validateNow()
    }});
AmCharts.DataSetSelector = AmCharts.Class({construct: function (a) {
        this.cname = "DataSetSelector";
        this.theme = a;
        this.createEvents("dataSetSelected", "dataSetCompared", "dataSetUncompared");
        this.position = "left";
        this.selectText = "Select:";
        this.comboBoxSelectText = "Select...";
        this.compareText = "Compare to:";
        this.width = 180;
        this.dataProvider = [];
        this.listHeight = 150;
        this.listCheckBoxSize = 14;
        this.rollOverBackgroundColor = "#b2e1ff";
        this.selectedBackgroundColor = "#7fceff";
        AmCharts.applyTheme(this, a, this.cname)
    }, write: function (a) {
        var b =
                this, c, d = b.theme, e = b.chart;
        a.className = "amChartsDataSetSelector " + e.classNamePrefix + "-data-set-selector-div";
        var k = b.width;
        c = b.position;
        b.width = void 0;
        b.position = void 0;
        AmCharts.applyStyles(a.style, b);
        b.div = a;
        b.width = k;
        b.position = c;
        a.innerHTML = "";
        var k = b.position, h;
        h = "top" == k || "bottom" == k ? !1 : !0;
        b.vertical = h;
        var f;
        h && (f = b.width + "px");
        var k = b.dataProvider, g, l;
        if (1 < b.countDataSets("showInSelect")) {
            c = document.createTextNode(AmCharts.lang.selectText || b.selectText);
            a.appendChild(c);
            h && AmCharts.addBr(a);
            var n = document.createElement("select");
            f && (n.style.width = f);
            b.selectCB = n;
            d && AmCharts.applyStyles(n.style, d.DataSetSelect);
            n.className = e.classNamePrefix + "-data-set-select";
            a.appendChild(n);
            AmCharts.isNN && n.addEventListener("change", function (a) {
                b.handleDataSetChange.call(b, a)
            }, !0);
            AmCharts.isIE && n.attachEvent("onchange", function (a) {
                b.handleDataSetChange.call(b, a)
            });
            for (c = 0; c < k.length; c++)
                if (g = k[c], !0 === g.showInSelect) {
                    l = document.createElement("option");
                    l.className = e.classNamePrefix + "-data-set-select-option";
                    l.text = g.title;
                    l.value = c;
                    g == b.chart.mainDataSet && (l.selected = !0);
                    try {
                        n.add(l, null)
                    } catch (p) {
                        n.add(l)
                    }
                }
            b.offsetHeight = n.offsetHeight
        }
        if (0 < b.countDataSets("showInCompare") && 1 < k.length)
            if (h ? (AmCharts.addBr(a), AmCharts.addBr(a)) : (c = document.createTextNode(" "), a.appendChild(c)), c = document.createTextNode(AmCharts.lang.compareText || b.compareText), a.appendChild(c), l = b.listCheckBoxSize, h) {
                AmCharts.addBr(a);
                f = document.createElement("div");
                a.appendChild(f);
                f.className = "amChartsCompareList " + e.classNamePrefix +
                        "-compare-div";
                d && AmCharts.applyStyles(f.style, d.DataSetCompareList);
                f.style.overflow = "auto";
                f.style.overflowX = "hidden";
                f.style.width = b.width - 2 + "px";
                f.style.maxHeight = b.listHeight + "px";
                for (c = 0; c < k.length; c++)
                    g = k[c], !0 === g.showInCompare && g != b.chart.mainDataSet && (d = document.createElement("div"), d.style.padding = "4px", d.style.position = "relative", d.name = "amCBContainer", d.className = e.classNamePrefix + "-compare-item-div", d.dataSet = g, d.style.height = l + "px", g.compared && (d.style.backgroundColor = b.selectedBackgroundColor),
                            f.appendChild(d), h = document.createElement("div"), h.style.width = l + "px", h.style.height = l + "px", h.style.position = "absolute", h.style.backgroundColor = g.color, d.appendChild(h), h = document.createElement("div"), h.style.width = "100%", h.style.position = "absolute", h.style.left = l + 10 + "px", d.appendChild(h), g = document.createTextNode(g.title), h.style.whiteSpace = "nowrap", h.style.cursor = "default", h.appendChild(g), b.addEventListeners(d));
                AmCharts.addBr(a);
                AmCharts.addBr(a)
            } else {
                e = document.createElement("select");
                b.compareCB =
                        e;
                f && (e.style.width = f);
                a.appendChild(e);
                AmCharts.isNN && e.addEventListener("change", function (a) {
                    b.handleCBSelect.call(b, a)
                }, !0);
                AmCharts.isIE && e.attachEvent("onchange", function (a) {
                    b.handleCBSelect.call(b, a)
                });
                l = document.createElement("option");
                l.text = AmCharts.lang.comboBoxSelectText || b.comboBoxSelectText;
                try {
                    e.add(l, null)
                } catch (r) {
                    e.add(l)
                }
                for (c = 0; c < k.length; c++)
                    if (g = k[c], !0 === g.showInCompare && g != b.chart.mainDataSet) {
                        l = document.createElement("option");
                        l.text = g.title;
                        l.value = c;
                        g.compared && (l.selected =
                                !0);
                        try {
                            e.add(l, null)
                        } catch (w) {
                            e.add(l)
                        }
                    }
                b.offsetHeight = e.offsetHeight
            }
    }, addEventListeners: function (a) {
        var b = this;
        AmCharts.isNN && (a.addEventListener("mouseover", function (a) {
            b.handleRollOver.call(b, a)
        }, !0), a.addEventListener("mouseout", function (a) {
            b.handleRollOut.call(b, a)
        }, !0), a.addEventListener("click", function (a) {
            b.handleClick.call(b, a)
        }, !0));
        AmCharts.isIE && (a.attachEvent("onmouseout", function (a) {
            b.handleRollOut.call(b, a)
        }), a.attachEvent("onmouseover", function (a) {
            b.handleRollOver.call(b, a)
        }), a.attachEvent("onclick",
                function (a) {
                    b.handleClick.call(b, a)
                }))
    }, handleDataSetChange: function () {
        var a = this.selectCB, a = this.dataProvider[a.options[a.selectedIndex].value], b = this.chart;
        b.mainDataSet = a;
        b.zoomOutOnDataSetChange && (b.startDate = void 0, b.endDate = void 0);
        b.validateData();
        a = {type: "dataSetSelected", dataSet: a, chart: this.chart};
        this.fire(a.type, a)
    }, handleRollOver: function (a) {
        a = this.getRealDiv(a);
        a.dataSet.compared || (a.style.backgroundColor = this.rollOverBackgroundColor)
    }, handleRollOut: function (a) {
        a = this.getRealDiv(a);
        a.dataSet.compared || (a.style.removeProperty && a.style.removeProperty("background-color"), a.style.removeAttribute && a.style.removeAttribute("backgroundColor"))
    }, handleCBSelect: function (a) {
        var b = this.compareCB, c = this.dataProvider, d, e;
        for (d = 0; d < c.length; d++)
            e = c[d], e.compared && (a = {type: "dataSetUncompared", dataSet: e}), e.compared = !1;
        c = b.selectedIndex;
        0 < c && (e = this.dataProvider[b.options[c].value], e.compared || (a = {type: "dataSetCompared", dataSet: e}), e.compared = !0);
        b = this.chart;
        b.validateData();
        a.chart = b;
        this.fire(a.type,
                a)
    }, handleClick: function (a) {
        a = this.getRealDiv(a).dataSet;
        !0 === a.compared ? (a.compared = !1, a = {type: "dataSetUncompared", dataSet: a}) : (a.compared = !0, a = {type: "dataSetCompared", dataSet: a});
        var b = this.chart;
        b.validateData();
        a.chart = b;
        this.fire(a.type, a)
    }, getRealDiv: function (a) {
        a || (a = window.event);
        a = a.currentTarget ? a.currentTarget : a.srcElement;
        "amCBContainer" == a.parentNode.name && (a = a.parentNode);
        return a
    }, countDataSets: function (a) {
        var b = this.dataProvider, c = 0, d;
        for (d = 0; d < b.length; d++)
            !0 === b[d][a] && c++;
        return c
    }});
AmCharts.StackedBullet = AmCharts.Class({construct: function () {
        this.fontSize = 11;
        this.stackDown = !1;
        this.mastHeight = 8;
        this.shapes = [];
        this.backgroundColors = [];
        this.backgroundAlphas = [];
        this.borderAlphas = [];
        this.borderColors = [];
        this.colors = [];
        this.rollOverColors = [];
        this.showOnAxiss = [];
        this.values = [];
        this.showAts = [];
        this.textColor = "#000000";
        this.nextY = 0;
        this.size = 16
    }, parseConfig: function () {
        var a = this.bulletConfig;
        this.eventObjects = a.eventObjects;
        this.letters = a.letters;
        this.shapes = a.shapes;
        this.backgroundColors =
                a.backgroundColors;
        this.backgroundAlphas = a.backgroundAlphas;
        this.borderColors = a.borderColors;
        this.borderAlphas = a.borderAlphas;
        this.colors = a.colors;
        this.rollOverColors = a.rollOverColors;
        this.date = a.date;
        this.showOnAxiss = a.showOnAxis;
        this.axisCoordinate = a.minCoord;
        this.showAts = a.showAts;
        this.values = a.values
    }, write: function (a) {
        this.parseConfig();
        this.container = a;
        this.bullets = [];
        if (this.graph) {
            var b = this.graph.fontSize;
            b && (this.fontSize = b)
        }
        b = this.letters.length;
        (this.mastHeight + 2 * (this.fontSize / 2 + 2)) *
                b > this.availableSpace && (this.stackDown = !0);
        this.set = a.set();
        a = 0;
        var c;
        for (c = 0; c < b; c++)
            this.shape = this.shapes[c], this.backgroundColor = this.backgroundColors[c], this.backgroundAlpha = this.backgroundAlphas[c], this.borderAlpha = this.borderAlphas[c], this.borderColor = this.borderColors[c], this.rollOverColor = this.rollOverColors[c], this.showOnAxis = this.showOnAxiss[c], this.color = this.colors[c], this.value = this.values[c], this.showAt = this.showAts[c], this.addLetter(this.letters[c], a, c), this.showOnAxis || a++
    }, addLetter: function (a,
            b, c) {
        var d = this.container;
        b = d.set();
        var e = -1, k = this.stackDown, h = this.graph.valueAxis;
        this.showOnAxis && (this.stackDown = h.reversed ? !0 : !1);
        this.stackDown && (e = 1);
        var f = 0, g = 0, l = 0, n, p = this.fontSize, r = this.mastHeight, w = this.shape, x = this.textColor;
        void 0 !== this.color && (x = this.color);
        void 0 === a && (a = "");
        a = AmCharts.fixBrakes(a);
        a = AmCharts.text(d, a, x, this.chart.fontFamily, this.fontSize);
        a.node.style.pointerEvents = "none";
        d = a.getBBox();
        this.labelWidth = x = d.width;
        this.labelHeight = d.height;
        var m, d = 0;
        switch (w) {
            case "sign":
                m =
                        this.drawSign(b);
                f = r + 4 + p / 2;
                d = r + p + 4;
                1 == e && (f -= 4);
                break;
            case "flag":
                m = this.drawFlag(b);
                g = x / 2 + 3;
                f = r + 4 + p / 2;
                d = r + p + 4;
                1 == e && (f -= 4);
                break;
            case "pin":
                m = this.drawPin(b);
                f = 6 + p / 2;
                d = p + 8;
                break;
            case "triangleUp":
                m = this.drawTriangleUp(b);
                f = -p - 1;
                d = p + 4;
                e = -1;
                break;
            case "triangleDown":
                m = this.drawTriangleDown(b);
                f = p + 1;
                d = p + 4;
                e = -1;
                break;
            case "triangleLeft":
                m = this.drawTriangleLeft(b);
                g = p;
                d = p + 4;
                e = -1;
                break;
            case "triangleRight":
                m = this.drawTriangleRight(b);
                g = -p;
                e = -1;
                d = p + 4;
                break;
            case "arrowUp":
                m = this.drawArrowUp(b);
                a.hide();
                break;
            case "arrowDown":
                m = this.drawArrowDown(b);
                a.hide();
                d = p + 4;
                break;
            case "text":
                e = -1;
                m = this.drawTextBackground(b, a);
                f = this.labelHeight + 3;
                d = p + 10;
                break;
            case "round":
                m = this.drawCircle(b)
        }
        this.bullets[c] = m;
        this.showOnAxis ? (n = isNaN(this.nextAxisY) ? this.axisCoordinate : this.nextY, l = f * e, this.nextAxisY = n + e * d) : this.value ? (n = this.value, h.recalculateToPercents && (n = n / h.recBaseValue * 100 - 100), n = h.getCoordinate(n) - this.bulletY, l = f * e) : this.showAt ? (m = this.graphDataItem.values, h.recalculateToPercents && (m = this.graphDataItem.percents),
                m && (n = h.getCoordinate(m[this.showAt]) - this.bulletY, l = f * e)) : (n = this.nextY, l = f * e);
        a.translate(g, l);
        b.push(a);
        b.translate(0, n);
        this.addEventListeners(b, c);
        this.nextY = n + e * d;
        this.stackDown = k
    }, addEventListeners: function (a, b) {
        var c = this;
        a.click(function () {
            c.handleClick(b)
        }).mouseover(function () {
            c.handleMouseOver(b)
        }).touchend(function () {
            c.handleMouseOver(b, !0)
        }).mouseout(function () {
            c.handleMouseOut(b)
        })
    }, drawPin: function (a) {
        var b = -1;
        this.stackDown && (b = 1);
        var c = this.fontSize + 4;
        return this.drawRealPolygon(a,
                [0, c / 2, c / 2, -c / 2, -c / 2, 0], [0, b * c / 4, b * (c + c / 4), b * (c + c / 4), b * c / 4, 0])
    }, drawSign: function (a) {
        var b = -1;
        this.stackDown && (b = 1);
        var c = this.mastHeight * b, d = this.fontSize / 2 + 2, e = AmCharts.line(this.container, [0, 0], [0, c], this.borderColor, this.borderAlpha, 1), k = AmCharts.circle(this.container, d, this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        k.translate(0, c + d * b);
        a.push(e);
        a.push(k);
        this.set.push(a);
        return k
    }, drawFlag: function (a) {
        var b = -1;
        this.stackDown && (b = 1);
        var c = this.fontSize + 4, d = this.labelWidth +
                6, e = this.mastHeight, b = 1 == b ? b * e : b * e - c, e = AmCharts.line(this.container, [0, 0], [0, b], this.borderColor, this.borderAlpha, 1), c = AmCharts.polygon(this.container, [0, d, d, 0], [0, 0, c, c], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        c.translate(0, b);
        a.push(e);
        a.push(c);
        this.set.push(a);
        return c
    }, drawTriangleUp: function (a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, b / 2, -b / 2, 0], [0, b, b, 0])
    }, drawArrowUp: function (a) {
        var b = this.size, c = b / 2, d = b / 4;
        return this.drawRealPolygon(a,
                [0, c, d, d, -d, -d, -c, 0], [0, c, c, b, b, c, c, 0])
    }, drawArrowDown: function (a) {
        var b = this.size, c = b / 2, d = b / 4;
        return this.drawRealPolygon(a, [0, c, d, d, -d, -d, -c, 0], [0, -c, -c, -b, -b, -c, -c, 0])
    }, drawTriangleDown: function (a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, b / 2, -b / 2, 0], [0, -b, -b, 0])
    }, drawTriangleLeft: function (a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, b, b, 0], [0, -b / 2, b / 2])
    }, drawTriangleRight: function (a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, -b, -b, 0], [0, -b / 2, b / 2, 0])
    }, drawRealPolygon: function (a,
            b, c) {
        b = AmCharts.polygon(this.container, b, c, this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        a.push(b);
        this.set.push(a);
        return b
    }, drawCircle: function (a) {
        shape = AmCharts.circle(this.container, this.fontSize / 2, this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        a.push(shape);
        this.set.push(a);
        return shape
    }, drawTextBackground: function (a, b) {
        var c = b.getBBox(), d = -c.width / 2 - 5, e = c.width / 2 + 5, c = -c.height - 12;
        return this.drawRealPolygon(a, [d, -5, 0, 5, e, e, d, d],
                [-5, -5, 0, -5, -5, c, c, -5])
    }, handleMouseOver: function (a, b) {
        b || this.bullets[a].attr({fill: this.rollOverColors[a]});
        var c = this.eventObjects[a], d = {type: "rollOverStockEvent", eventObject: c, graph: this.graph, date: this.date}, e = this.bulletConfig.eventDispatcher;
        d.chart = e;
        e.fire(d.type, d);
        c.url && this.bullets[a].setAttr("cursor", "pointer");
        this.chart.showBalloon(AmCharts.fixNewLines(c.description), e.stockEventsSettings.balloonColor, !0)
    }, handleClick: function (a) {
        a = this.eventObjects[a];
        var b = {type: "clickStockEvent",
            eventObject: a, graph: this.graph, date: this.date}, c = this.bulletConfig.eventDispatcher;
        b.chart = c;
        c.fire(b.type, b);
        b = a.urlTarget;
        b || (b = c.stockEventsSettings.urlTarget);
        AmCharts.getURL(a.url, b)
    }, handleMouseOut: function (a) {
        this.bullets[a].attr({fill: this.backgroundColors[a]});
        a = {type: "rollOutStockEvent", eventObject: this.eventObjects[a], graph: this.graph, date: this.date};
        var b = this.bulletConfig.eventDispatcher;
        a.chart = b;
        b.fire(a.type, a)
    }});
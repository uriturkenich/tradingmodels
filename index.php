<!DOCTYPE html>
<html lang="en" class="is-not-authenticated is-not-pro is-not-trial">
    <head>
        <meta charset="utf-8" />
        <title>FlowCharts: Free Stock Charts Online. </title>

        <meta name="description" content="TradingModels offer a platform for testing and publishing technical analysis investment models" />
        <meta name="application-name" content="TradingModels" />

        <link href="static/css/site.94606a8fe4a6.css" rel="stylesheet" type="text/css" />

        <script type="text/javascript" src="jquery-1.8.0.min.js"></script>
        <script type="text/javascript">
            $(function () {
                $(".search").keyup(function ()
                {
                    var searchid = $(this).val();
                    var dataString = 'search=' + searchid;
                    if (searchid != '')
                    {
                        $.ajax({
                            type: "POST",
                            url: "search-symbol.php",
                            data: dataString,
                            cache: false,
                            success: function (html)
                            {
                                $("#result").html(html).show();
                            }
                        });
                    }
                    return false;
                });

                jQuery("#result").live("click", function (e) {
                    var $clicked = $(e.target);
                    var $name = $clicked.find('.name').html();
                    var decoded = $("<div/>").html($name).text();
                    if (decoded === "") {decoded = $("<div/>").html(e.target.innerHTML).text();}
                    $('#searchid').val(decoded);
                });
                jQuery(document).live("click", function (e) {
                    var $clicked = $(e.target);
                    if (!$clicked.hasClass("search")) {
                        jQuery("#result").fadeOut();
                    }
                    if ($clicked.hasClass("LaunchChart")) {
                        window.location.href = "Chart.php?stock-symbol=" + $('#searchid').val();
                    }
                });
                $('#searchid').click(function () {
                    jQuery("#result").fadeIn();
                });
            });
        </script>
    </head>

    <body class="search-page index-page">
    
    
    <div class="tv-main">
        <div class="tv-header">
            <div class="header-menu-wrap tv-layout-width  ideas-header" >
                <!-- Search -->
                <div class="header-search logged-user-menu">
                    <input type="text" placeholder="Chart or Quote, eg. &lsquo;AAPL&rsquo;" data-default-symbol="AAPL, D">
                    <span></span><br><br><br>

                </div>
            </div>
            <div class="index-learnmore-header">
                <br><br>
                <h2 data-i18n="network-where-active-traders">Test Charts!</h2>
                <p data-i18n="the-best-on-the-web-stock">New platform for testing technical analysis models.</p>
                
                <div class="symbol-input">
                    <input type="text" class="search" id="searchid" placeholder="eg. &ldquo;AAPL, D&rdquo;" data-default-symbol="AAPL, D" />
                    <span class="LaunchChart">Launch Chart</span>
                </div>
                
                <div id="result"  style="  position:relative;left:0px;top:-45px;width:392px;height:47px;margin:45px auto 0 "></div>
                
                <br><br><br>
            </div>

            <div id="market-summary" style = "z-index: -1;">
                <div class="tv-layout-width clearfix" style = "z-index: -1;">
                    <div id="market-summary-wrapper" style = "z-index: -1;">
                        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
                    </div>
                </div>
            </div>

        </div>
    </div>
</body>
</html>
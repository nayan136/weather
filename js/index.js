$(function(){
    const appId = "&APPID=f51a975befa5e9b8ac61c31e25aee96a";
    // use celcius
    const cels = "&units=metric";
    // tempertaure array
    var temp_min=[], temp_max=[], time=[];
    var list = [];
    var city;
    var searchCity = 'guwahati';
    loadData();
    var citySearch = $('#city_submit').on('click',function () {
        searchCity = $('#city_name').val().toLowerCase();
        loadData();
    });

    function clearData(){
        temp_min=[];
        temp_max=[];
        time=[];
        list = [];
    }
    //console.log(searchCity);
    //Call 5 day / 3 hour forecast data
    function loadData(){
        $.ajax({
            url: 'http://api.openweathermap.org/data/2.5/forecast?q='+searchCity+cels+appId,
            type: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
            success: function(result){
                console.log(result);
                clearData();
                city = result['city']['name'];
                if(result['cod'] === '200'){
                    list = $.merge([],result['list']);
                    $.each(list,function(key,val){
                        temp_min.push(val['main']['temp_min']);
                        temp_max.push(val['main']['temp_max']);
                        time.push(val['dt_txt']);
                    });
                    // console.log(typeof temp_min[0]);
                     console.log(temp_max[temp_max.length-1]);
                }else{
                    alert("error");
                }
                // chart start
                google.charts.load('current', {'packages':['corechart', 'bar']});
                google.charts.setOnLoadCallback(drawStuff);
            }
        });
    }

    function drawStuff() {
        var size = list.length;
        //var button = document.getElementById('change-chart');
        var chartDiv = document.getElementById('chart_div');

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Time');
        data.addColumn('number', 'Max Temp');
        // data.addColumn('number', 'Min Temp');
        var rows = [];
        for(var i=6; i>=1; i--){
            var arr = [];
            arr = [time[size-i], temp_max[size-i]];
            rows.push(arr);
        }
        //console.log(rows);
        data.addRows(rows);
        // data.addRows([
        //     [time[size-6], temp_max[size-6]],
        //     [time[size-5], temp_max[size-5]],
        //     [time[size-4], temp_max[size-4]],
        //     [time[size-3], temp_max[size-3]],
        //     [time[size-2], temp_max[size-2]],
        //     [time[size-1], temp_max[size-1]]
        // ]);

        // var materialOptions = {
        //     width: 900,
        //     chart: {
        //         title: 'Temperature of city ',
        //         subtitle: ''
        //     },
        //     series: {
        //         0: { axis: 'temp' }, // Bind series 0 to an axis named 'distance'.
        //         1: { axis: 'time' } // Bind series 1 to an axis named 'brightness'.
        //     },
        //     axes: {
        //         y: {
        //             temp: {label: 'parsecs'}, // Left y-axis.
        //             time: {side: 'right', label: 'apparent magnitude'} // Right y-axis.
        //         }
        //     }
        // };

        var classicOptions = {
            width: 900,
            series: {
                0: {targetAxisIndex: 0},
                1: {targetAxisIndex: 1}
            },
            title: 'Temperature of the city '+city,
            vAxes: {
                // Adds titles to each axis.
                0: {title: 'C'},
                1: {title: ''}
            }
        };

        // function drawMaterialChart() {
        //     var materialChart = new google.charts.Bar(chartDiv);
        //     materialChart.draw(data, google.charts.Bar.convertOptions(materialOptions));
        //     button.innerText = 'Change to Classic';
        //     button.onclick = drawClassicChart;
        // }

        function drawClassicChart() {
            var classicChart = new google.visualization.ColumnChart(chartDiv);
            classicChart.draw(data, classicOptions);
            // button.innerText = 'Change to Material';
            //button.onclick = drawMaterialChart;
        }

        drawClassicChart();
    }

    // chart end
});
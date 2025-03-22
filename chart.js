// Load the Google Charts package
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(initChart);

function initChart() {
    // Load the CSV data using XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'APU0000709112.csv', true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                processData(xhr.responseText);
            } else {
                handleError('Failed to load data. Please make sure the CSV file is in the correct location.');
            }
        }
    };

    xhr.onerror = function() {
        handleError('Network error occurred while loading the data.');
    };

    try {
        xhr.send();
    } catch(e) {
        handleError('Error sending request: ' + e.message);
    }
}

function processData(csvData) {
    try {
        // Create the data table
        const data = new google.visualization.DataTable();
        data.addColumn('date', 'Date');
        data.addColumn('number', 'Price (USD)');

        // Process the CSV data
        const rows = csvData.split('\n');
        console.log('Total rows in CSV:', rows.length);

        // Skip header row and process each data row
        rows.slice(1).forEach((row, index) => {
            if (row.trim()) {
                const [dateStr, priceStr] = row.split(',');
                const price = parseFloat(priceStr);
                if (!isNaN(price)) {
                    data.addRow([new Date(dateStr), price]);
                }
            }
        });

        console.log('Processed rows:', data.getNumberOfRows());

        // Chart options
        const options = {
            title: 'Average Price: Milk, Fresh, Whole, Fortified (Cost per Gallon/3.8 Liters) in U.S. City Average',
            curveType: 'function',
            legend: { position: 'bottom' },
            hAxis: {
                title: 'Date',
                format: 'yyyy',
                gridlines: { count: 10 },
                viewWindow: {
                    min: new Date('1995-01-01'),
                    max: new Date('2025-12-31')
                }
            },
            vAxis: {
                title: 'Price (USD)',
                viewWindow: {
                    min: 0,
                    max: 5
                },
                gridlines: { count: 10 }
            },
            width: '100%',
            height: 500,
            chartArea: {
                width: '80%',
                height: '70%'
            },
            backgroundColor: '#ffffff',
            colors: ['#1a73e8']
        };

        // Draw the chart
        const chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        chart.draw(data, options);
        console.log('Chart drawn successfully');
    } catch(e) {
        handleError('Error processing data: ' + e.message);
    }
}

function handleError(message) {
    console.error(message);
    document.getElementById('curve_chart').innerHTML = 
        '<div style="color: red; padding: 20px; text-align: center;">' +
        '<p style="font-size: 18px; margin-bottom: 10px;">⚠️ Error</p>' +
        '<p>' + message + '</p>' +
        '<p style="font-size: 14px; margin-top: 10px;">Please check that:</p>' +
        '<ul style="text-align: left; display: inline-block;">' +
        '<li>The CSV file is named "APU0000709112.csv"</li>' +
        '<li>The file is in the same directory as this HTML file</li>' +
        '<li>You are running this through a web server (e.g., python -m http.server 8000)</li>' +
        '</ul>' +
        '</div>';
} 
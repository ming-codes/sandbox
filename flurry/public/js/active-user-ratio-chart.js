
(function() {
  $.ajax({
    dataType: 'json',
    url: $('#active-users')[0].src,
    success: function(json) {
      json.day.forEach(function(item) {
        if (!sync.merge[item['@date']]) {
          sync.merge[item['@date']] = {
            '@date': item['@date']
          };
        }

        sync.merge[item['@date']]['@active'] = item['@value'];
      });
      sync.increment();
    }
  });

  $.ajax({
    dataType: 'json',
    url: $('#total-users')[0].src,
    success: function(json) {
      json.day.forEach(function(item) {
        if (!sync.merge[item['@date']]) {
          sync.merge[item['@date']] = {
            '@date': item['@date']
          };
        }

        sync.merge[item['@date']]['@total'] = item['@value'];
      });
      sync.increment();
    }
  });

  // Load the Visualization API and the piechart package.
  google.load('visualization', '1.0', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.setOnLoadCallback(function() {
    sync.increment();
  });

  // Synchronize the multiple async calls
  var sync = {
    count: 0,
    target: 3,
    merge: {},
    increment: function() {
      this.count++;

      if (this.count === this.target) {
        this.run();
      }
    },
    run: function() {

      // Create the data table.
      var data = new google.visualization.DataTable();

      data.addColumn('date', 'Date');
      data.addColumn('number', 'Active');
      data.addColumn('number', 'Total');

      for (var key in this.merge) {
        var active = parseInt(this.merge[key]['@active'], 10);
        var total = parseInt(this.merge[key]['@total'], 10);
        var date = key.match(/(\d{4})-(\d{2})-(\d{2})/);

        date = new Date(
          parseInt(date[1], 10), 
          parseInt(date[2], 10) - 1, 
          parseInt(date[3], 10)
        );

        data.addRow([date, active, total]);
      }

      // Set chart options
      var options = {
        'title':'Chart',
        'width':400,
        'height':300,
        'vAxis': {
          minValue: 0
        }
      };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.AreaChart($('#chart-div')[0]);

      chart.draw(data, options);
    }
  };

})();


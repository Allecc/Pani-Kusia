/**
 * Created by Jan on 11.05.2017.
 */

$(function(){
    $.ajax({
        url: "/load",
        success: function (JSON) {
            for (var id = JSON.length-1; id >= 0; id--){
                var dane = "<div class='col-md-3 well'>" + "<h3 id='tytul'>" + JSON[id].title + "</h3>" + JSON[id].description + "<br />" + "<strong id='autor'>" + JSON[id].author + "</strong>" + "</div>";
                $("#tu").append(dane);
            }
        }
    });
});


$(document).ready(function () {


    //Getting Data from database
    function getAjax() {
        $.ajax({
            url: "http://localhost:8282/books",
            data: {},
            type: "GET",
            dataType: "json"
        }).done(function (result) {
            console.log(result[0].title);

            for (var i = 0; i < result.length; i++) {
                removeAllBlankOrNull(book);
                var book = result[i];
                removeAllBlankOrNull(book);
                var tr = $("<tr>").appendTo($('#books'));

                $("<td id='bookId'>").html(book.id).appendTo(tr);
                $("<td>").html(book.author).appendTo(tr);
                $("<td class = 'title myButton'></td>").html(book.title).appendTo(tr);
                $("<td>").html(book.type).appendTo(tr);

                var descriptionTr = $("<tr>").hide().appendTo($('#books'));
                $("<td colspan='4'></td>").html("Tu będzie opis książki").appendTo(descriptionTr);

            }

        }).fail(function (xhr, status, err) {
            console.log(err);
        });
    }

    getAjax();

//Description Row AJAX GET
    $("#books").on("click", "td.title", function () {
        var id = $(this).prev().prev().html();

        var descRow = $(this).parent().next();
        descRow.toggle();

        $.ajax({
            url: "http://localhost:8282/books/" + id,
            data: {},
            type: "GET",
            dataType: "json"
        }).done(function (result) {

            descRow.children().eq(0).html("Publisher: " + result.publisher + "                   ISBN:  " + result.isbn);

        }).fail(function (xhr, status, err) {
            console.log(err);
        });

    })

    //Submit Data
    $("#addBook").on("submit", function (event) {
        event.preventDefault();
        console.log("dodane");

        var form = $(this),
            url = form.attr("action"),
            type = form.attr("method"),
            data = {};

        form.find('[name]').each(function (index, value) {
            var input = $(this),
                name = input.attr('name'),
                value = input.val();

            data[name] = value;
        });


        // var existingBookIds = $("#bookId");
        //
        // existingBookIds.each(function (elem) {
        //     if (parseInt(elem) === parseInt(id)) {
        //         //form.find("input[name='id']").css("color", "red").text("This Book ID exists");
        //         form.append($("<div>Niepoprawne ID</div>"));
        //     } else {

        console.log(data);
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: url,
            data: JSON.stringify(data),
            type: type,
            dataType: "json"
        }).done(function (result) {
            console.log(result);

        }).fail(function (xhr, status, err) {
            console.log(err);
        });
        //
        //
        //
        //     }
        //
        // })

        getAjax();

        return false;
    })


    //Remove empty
    function removeAllBlankOrNull(JsonObj) {
        $.each(JsonObj, function(key, value) {
            if (value === "" || value === null) {
                delete JsonObj[key];
            } else if (typeof(value) === "object") {
                JsonObj[key] = removeAllBlankOrNull(value);
            }
        });
        return JsonObj;
    }

})
;
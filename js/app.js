$(document).ready(function () {

    var books = $("#books");

    //Getting Data from database
    function getAjax() {
        $.ajax({
            url: "http://localhost:8282/books",
            data: {},
            type: "GET",
            dataType: "json"
        }).done(function (result) {


            for (var i = 0; i < result.length; i++) {

                var book = result[i];

                var tr = $("<tr>").appendTo(books.find('tbody'));

                $("<td id='bookId'>").html(book.id).hide().appendTo(tr);
                $("<td>").html(book.author).appendTo(tr);
                $("<td class = 'title myButton'></td>").html(book.title).appendTo(tr);
                $("<td>").html(book.type).appendTo(tr);
                $("<td><a href='' class='link'>Delete</a></td>").appendTo(tr);

                var descriptionTr = $("<tr>").hide().appendTo(books);
                $("<td colspan='5'></td>").html("Tu będzie opis książki").appendTo(descriptionTr);

            }

        }).fail(function (xhr, status, err) {
            console.log(err);
        });
    }

    getAjax();

//Description Row AJAX GET
    books.on("click", "td.title", function () {
        var id = $(this).prev().prev().html();

        var descRow = $(this).parent().next();
        descRow.toggle();

        $.ajax({
            url: "http://localhost:8282/books/" + id,
            data: {},
            type: "GET",
            dataType: "json"
        }).done(function (result) {

            descRow.children().eq(0).html("ID: " + result.id + " Publisher: " + result.publisher + " ISBN:  " + result.isbn);

        }).fail(function (xhr, status, err) {
            console.log(err);
        });

    })

    //Submit Data
    $("#addBook").on("submit", function (event) {
        event.preventDefault();

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
            console.log("Book added to database");

        }).fail(function (xhr, status, err) {
            console.log(err);
        });

        //Clearing form after submission
        form.get(0).reset();

        reloadList();

        return false;
    });

    //Delete Book
    books.on("click", ".link", function (event) {
        event.preventDefault();

        var book = $(this).parent().parent().find("#bookId").text();


        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: "http://localhost:8282/books/" + book,
            data: {},
            type: "DELETE",
            dataType: "json"
        }).done(function (result) {
            console.log("Book deleted from database");

        }).fail(function (xhr, status, err) {
            console.log(err);
        });

        reloadList();

    })

    //Getting new list
    function reloadList() {
        $('#books tbody').empty();
        getAjax();
    };



});
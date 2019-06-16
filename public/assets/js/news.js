
// On ScrapButton click the / will update all articles
$(document).on("click", "#scrapeButton", function () {
    console.log("Clicked!")
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).then(function (data) {
        console.log(data)
        setTimeout(function () { window.location = "/" }, 1000)
    })
});


$(document).on("click", "#saveArticle", function () {
    console.log($(this).attr("data-id"))

    var thisId = $(this).attr("data-id")

    $.ajax({
        method: "POST",
        url: "/articleSaver/" + thisId,
        data: {
            // Values taken from the article
            headline: $(".headline").val(),
            title: $(".title").val(),
            summary: $(".summary").val(),
            link: $(".link").val(),
            image: $(".imageURL").val()
        }
    }).done(function () {
        windows.location = "/saved"
        console.log(date)
    });
})

// Note and its features are built and note modal pops up
$(document).on("click", "#saveNote", function () {
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
    })
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the #saveNote tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h5>" + data.title + "</h5>");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-primary'>Save Note</button>");
            $("#notes").append("<button data-id='" + data._id + "' id='deletenote' class='btn btn-danger'>Delete Note</button>");


            // If there's a note in the article
            if (data.note) {
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// note is saved into database
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
            $("#titleinput").val("");
            // $("#bodyinput").val("");
        });
});

// note is deleted from database
$(document).on("click", "#deletenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
            $("#titleinput").val("");
            $("#bodyinput").val("");
        });
});

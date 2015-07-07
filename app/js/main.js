"use strict";
$(document).ready(function () {

    //Initialization mobile button
    $('.button-collapse').sideNav();
    $('.slider').slider({
        indicators: true
    });


    $('.list-logo a').after("<div class='block-shadow'></div>");
    $('.list-logo li').hover(
        function () {
            $(this).children('div').animate({opacity: "hide"}, 250);
        },
        function () {
            $(this).children('div').animate({opacity: "show"}, 250);
        }
    );


    $('.footer-twit').first().css({'padding-top': '0'});
    $('.footer-twit').last().css({'border-bottom': 'none'});


    $('.footer-posts').first().css({'padding-top': '0'});
    $('.footer-posts').last().css({'border-bottom': 'none'});


    $('.trap').css({'display': 'none'});


    $('#form-messages').on('click', 'a[href=#closeMsg]', function () {
        $('#form-messages').empty();
    });


    var url = document.location.href;
    var pos = url.lastIndexOf("/");
    url = url.substr(pos + 1);


    $('nav ul>li').each(function (index, element) {
        if ($(element).hasClass('active')) {
            $(element).removeClass('active');
        }
        var link = $(element).children('a');

        if (url.length > 0) {
            if ($(link).attr('href') == url) {
                $(element).addClass('active');
            }
        } else {
            if (index == 0) {
                $(element).addClass('active');
            }
        }

    });


    /********* Contact form submission code *********/

    var form = $('#form-contact'); // Get the form
    var formMessages = $('#form-messages'); // Get the div to print the form messages


    // Set up an event listener for the contact form.
    $(form).on('submit', function (event) {
        // Stop the browser from submitting the form and refresh the page.
        event.preventDefault();

        // Serialize the form data.
        var formData = $(form).serializeArray();

        // Submit the form using AJAX.

        $.ajax({
            type: "POST",
            url: $(form).attr('action'),
            data: formData,
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.success) {

                    // if we receive a success message from the PHP
                    $(formMessages).html('<div class="alert-success z-depth-1">' +
                    '<a href="#closeMsg">' +
                    '<i class="fa fa-close"></i>' +
                    '</a><strong>SUCCESS!</strong>' +
                    '<br/>' + data.message + '</div>');

                    // Clear the form
                    $('#first-name').val('');
                    $('#first-name').removeClass('valid').next('label').removeClass('active');

                    $('#last-name').val('');
                    $('#last-name').removeClass('valid').next('label').removeClass('active');

                    $('#email').val('');
                    $('#email').removeClass('valid').next('label').removeClass('active');

                    $('#subject').val('');
                    $('#subject').removeClass('valid').next('label').removeClass('active');

                    $('#message').val('');
                    $('#message').removeClass('valid').next('label').removeClass('active');

                } else {
                    if (data.errors.message) {

                        // There was a problem sending the form
                        $(formMessages).html('<div class="alert-error z-depth-1">' +
                        '<a href="#closeMsg">' +
                        '<i class="fa fa-close"></i>' +
                        '</a><strong>ERROR!</strong>' +
                        '<br/>' + data.errors.message + '</div>');

                    } else {

                        // The form has validation errors
                        $(formMessages).html('<div class="alert-error z-depth-1">' +
                        '<a href="#closeMsg">' +
                        '<i class="fa fa-close"></i>' +
                        '</a><strong>ERROR!</strong>' +
                        '<br/></div>');

                        if (data.errors.contactFirstName) {
                            $(formMessages).children().append(data.errors.contactFirstName + "<br/>");
                        }

                        if (data.errors.contactLastName) {
                            $(formMessages).children().append(data.errors.contactLastName + "<br/>");
                        }

                        if (data.errors.contactEmail) {
                            $(formMessages).children().append(data.errors.contactEmail + "<br/>");
                        }

                        if (data.errors.contactSubject) {
                            $(formMessages).children().append(data.errors.contactSubject + "<br/>");
                        }

                        if (data.errors.contactMessage) {
                            $(formMessages).children().append(data.errors.contactMessage + "<br/>");
                        }
                    }
                }
            },
            error: function (jqXHR, status, errorThrown) {
                // If there is an error in submitting the form send out a message
                $(formMessages).html('<div class="alert-error z-depth-1">' +
                '<a href="#closeMsg">' +
                '<i class="fa fa-close"></i>' +
                '</a><strong>ERROR!</strong>' +
                '<br/>' +
                'We are sorry but there was an error in submitting the form!' +
                '<br/>' + errorThrown + '</div>');
            }
        });
    });


});
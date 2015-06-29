<?php

function clean($value = "")
{
    $value = trim($value);
    $value = stripslashes($value);
    $value = strip_tags($value);
    $value = htmlspecialchars($value);

    return $value;
}


function check_length($value = "", $min, $max)
{
    $result = (mb_strlen($value) < $min || mb_strlen($value) > $max);
    return !$result;
}

$answer = array();

if(strlen($_POST["name"])>0){
    $answer["errors"]["message"] = "you are a robot";
    echo json_encode($answer);
    die;
}




$firstName = $_POST['first-name'];
$lastName = $_POST['last-name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];


$firstName = clean($firstName);
$lastName = clean($lastName);
$email = clean($email);
$subject = clean($subject);
$message = clean($message);


if (!empty($firstName)) {
    if (!check_length($firstName, 1, 30)) {
        $answer["errors"]["contactFirstName"] = "Field 'First Name' more than 30 characters.";
    }
} else {
    $answer["errors"]["contactFirstName"] = "Field 'First Name' is empty";
}


if (!empty($lastName)) {
    if (!check_length($lastName, 1, 30)) {
        $answer["errors"]["contactLastName"] = "Field 'Last Name' more than 30 characters.";
    }
} else {
    $answer["errors"]["contactLastName"] = "Field 'Last Name' is empty";
}


if (!check_length($subject, 0, 100)) {
    $answer["errors"]["contactSubject"] = "Field 'Subject' more than 100 characters.";
}


if (!empty($email)) {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $answer["errors"]["contactEmail"] = "Field 'Email' is NOT a valid email address.";
    }
} else {
    $answer["errors"]["contactEmail"] = "Field 'Email' is empty";
}


if (!empty($message)) {
    if (!check_length($message, 1, 1000)) {
        $answer["errors"]["contactMessage"] = "Field 'Message' more than 1000 characters.";
    }
} else {
    $answer["errors"]["contactMessage"] = "Field 'Message' is empty";
}


if (!isset($answer["errors"])) {
    $to = 'yourmail@domen.com';


    $headers = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    $headers .= 'From:' . $email . "\r\n";


    if (mail($to, $subject, $message, $headers)) {
        $answer["success"] = "Message sent successfully";
        $answer["message"] = " Thank you for your email.";
    } else {
        $answer["errors"]["message"] = "mail is not sent";
    }

}


echo json_encode($answer);


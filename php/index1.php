<?php
// Connect to the database
$host = "localhost";
$user = "username";
$password = "password";
$dbname = "database_name";

$conn = mysqli_connect($host, $user, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Prepare and bind
$stmt = mysqli_prepare($conn, "INSERT INTO table_name (name) VALUES (?)");
mysqli_stmt_bind_param($stmt, "s", $name);

// Set parameters and execute
$name = "John";
mysqli_stmt_execute($stmt);

echo "New record created successfully";

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>

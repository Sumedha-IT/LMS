<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Credentials</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
            color: #555;
        }
        .credentials {
            margin: 20px 0;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            text-align: center;
            color: #999;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Sumedha!</h1>
        <p>Dear User,</p>
        <p>We are pleased to provide you with your login credentials:</p>
        <div class="credentials">
            <p><strong>For email:</strong> <span style="font-weight: bold;">{{ $email }}</span></p>
            <p><strong>Your password:</strong> <span style="font-weight: bold; color: #007BFF;">{{ $password }}</span></p>
        </div>
        <p>If you have any questions, feel free to <a href="mailto:{{ $supportMail }}">contact us</a>.</p>
        <p>Thank you for choosing Sumedha!</p>
        <div class="footer">
            <p>Best regards,<br>Sumedha Team</p>
        </div>
    </div>
</body>
</html>

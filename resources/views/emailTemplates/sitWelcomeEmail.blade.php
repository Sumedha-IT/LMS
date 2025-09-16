<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SIT Placements Platform</title>
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
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 15px;
        }
        .credentials {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #007BFF;
            border-radius: 4px;
        }
        .credentials p {
            margin: 8px 0;
        }
        .credentials strong {
            color: #333;
        }
        .contact-info {
            background-color: #e8f4fd;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .quote {
            font-style: italic;
            text-align: center;
            color: #666;
            margin: 20px 0;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        .footer {
            margin-top: 30px;
            font-size: 16px;
            text-align: center;
            color: #333;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 4px;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
        .login-button {
            display: inline-block;
            background-color: #007BFF;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to SIT Placements Platform</h1>
        
        <p>Dear <strong>{{ $student_name }}</strong>,</p>
        
        <p>We are excited to welcome you to the <strong>SIT Placements Platform</strong>, your dedicated space to explore career opportunities, access resources, and track your placement journey with us.</p>
        
        <p>Below are your login credentials to get started:</p>
        
        <div class="credentials">
            <p><strong>Username:</strong> {{ $login_email }}</p>
            <p><strong>Password:</strong> {{ $login_password }}</p>
            <p><strong>Login Link:</strong> <a href="{{ $login_url }}">{{ $login_url }}</a></p>
        </div>
        
        <p>We recommend logging in at the earliest to update your profile and explore the features available.</p>
        
        <div class="contact-info">
            <p>If you face any difficulty accessing your account, feel free to reach out to us at <a href="mailto:vamsi.a@sumedhait.com">vamsi.a@sumedhait.com</a> or call us at <strong>9100098487</strong>.</p>
        </div>
        
        <div class="quote">
            "Wishing you great success and endless opportunities ahead."
        </div>
        
        <div class="footer">
            <p><strong>Warm regards,</strong><br><strong>Team SIT</strong></p>
        </div>
    </div>
</body>
</html>

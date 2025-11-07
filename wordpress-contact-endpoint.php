<?php
/**
 * Custom Contact Form Endpoint for WordPress
 * 
 * Installation Instructions:
 * 1. Upload this file to your WordPress theme's functions.php OR
 * 2. Create a custom plugin with this code
 * 
 * This creates a REST API endpoint at:
 * https://yourdomain.com/wp-json/todaymedia/v1/contact
 */

// Add custom REST API endpoint for contact form
add_action('rest_api_init', function () {
    register_rest_route('todaymedia/v1', '/contact', array(
        'methods' => 'POST',
        'callback' => 'handle_contact_form_submission',
        'permission_callback' => '__return_true', // Allow public access
    ));
});

function handle_contact_form_submission($request) {
    // Get form data from request
    $params = $request->get_json_params();
    
    $name = sanitize_text_field($params['name'] ?? '');
    $email = sanitize_email($params['email'] ?? '');
    $phone = sanitize_text_field($params['phone'] ?? '');
    $subject = sanitize_text_field($params['subject'] ?? '');
    $message = sanitize_textarea_field($params['message'] ?? '');
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'الرجاء ملء جميع الحقول المطلوبة'
        ], 400);
    }
    
    // Validate email
    if (!is_email($email)) {
        return new WP_REST_Response([
            'success' => false,
            'message' => 'الرجاء إدخال بريد إلكتروني صحيح'
        ], 400);
    }
    
    // Prepare email
    $to = get_option('admin_email'); // Send to WordPress admin email
    $email_subject = 'رسالة جديدة من موقع اليوم ميديا: ' . $subject;
    
    $email_body = "تم استلام رسالة جديدة من نموذج الاتصال:\n\n";
    $email_body .= "الاسم: {$name}\n";
    $email_body .= "البريد الإلكتروني: {$email}\n";
    $email_body .= "رقم الهاتف: {$phone}\n";
    $email_body .= "الموضوع: {$subject}\n\n";
    $email_body .= "الرسالة:\n{$message}\n\n";
    $email_body .= "---\n";
    $email_body .= "تم الإرسال من: " . get_site_url();
    
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'From: ' . get_bloginfo('name') . ' <noreply@todaymedia.net>',
        'Reply-To: ' . $name . ' <' . $email . '>'
    );
    
    // Send email
    $sent = wp_mail($to, $email_subject, $email_body, $headers);
    
    if ($sent) {
        // Log the submission (optional)
        error_log("Contact form submitted by: {$name} ({$email})");
        
        return new WP_REST_Response([
            'success' => true,
            'message' => 'تم إرسال رسالتك بنجاح! سنتواصل معك في أقرب وقت.'
        ], 200);
    } else {
        error_log("Failed to send contact form email from: {$email}");
        
        return new WP_REST_Response([
            'success' => false,
            'message' => 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
        ], 500);
    }
}

// Optional: Add CORS headers if needed
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
}, 15);

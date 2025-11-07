<?php
/**
 * WordPress to Next.js Auto-Revalidation Webhook
 * 
 * INSTALLATION:
 * 1. Copy this ENTIRE file content
 * 2. Paste into your WordPress theme's functions.php file
 * 3. Update NEXTJS_URL and NEXTJS_SECRET below
 * 4. Save functions.php
 * 5. Test by visiting: yoursite.com/?test_nextjs_revalidation=1
 * 
 * This will automatically trigger Next.js revalidation when:
 * - Posts/Pages are created, updated, published, unpublished, or deleted
 * - Menus are updated or deleted
 * - Media files are uploaded, edited, or deleted
 */

// ===============================
// 🔧 CONFIGURATION - CHANGE THESE!
// ===============================
if (!defined('NEXTJS_URL')) {
    define('NEXTJS_URL', 'http://localhost:3000'); // Change to your Next.js URL (no trailing slash)
}
if (!defined('NEXTJS_SECRET')) {
    define('NEXTJS_SECRET', 'nxjs_8k2m9p4w7q5t3v6x'); // Must match REVALIDATE_SECRET in .env.local
}

// Enable WordPress debug logging to see webhook activity
if (!defined('WP_DEBUG_LOG')) {
    define('WP_DEBUG_LOG', true);
}

// ===============================
// 🪝 WordPress Hooks
// ===============================

// Post/Page create or edit
add_action('save_post', 'trigger_nextjs_revalidation', 10, 3);

// Post/Page publish/unpublish
add_action('transition_post_status', 'trigger_nextjs_revalidation_on_status_change', 10, 3);

// Post/Page delete
add_action('before_delete_post', 'trigger_nextjs_revalidation_on_delete');

// Menu update/delete
add_action('wp_update_nav_menu', 'trigger_nextjs_revalidation_on_menu_update');
add_action('wp_delete_nav_menu', 'trigger_nextjs_revalidation_on_menu_update');

// Media upload/edit/delete
add_action('add_attachment', 'trigger_nextjs_revalidation_on_media');
add_action('edit_attachment', 'trigger_nextjs_revalidation_on_media');
add_action('delete_attachment', 'trigger_nextjs_revalidation_on_media');

// ===============================
// 📝 Functions
// ===============================

/**
 * Trigger revalidation on post save
 */
function trigger_nextjs_revalidation($post_id, $post, $update) {
    // Skip autosaves and revisions
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    // Only trigger for published content
    if ($post->post_status !== 'publish') {
        return;
    }

    // Skip if not public post type
    $post_type_obj = get_post_type_object($post->post_type);
    if (!$post_type_obj || !$post_type_obj->public) {
        return;
    }

    send_revalidation_webhook($post_id, $post, $update ? 'update' : 'create');
}

/**
 * Trigger revalidation on status change (publish/unpublish)
 */
function trigger_nextjs_revalidation_on_status_change($new_status, $old_status, $post) {
    $post_type_obj = get_post_type_object($post->post_type);
    if (!$post_type_obj || !$post_type_obj->public) {
        return;
    }

    if ($new_status === 'publish' && $old_status !== 'publish') {
        send_revalidation_webhook($post->ID, $post, 'publish');
    } elseif ($old_status === 'publish' && $new_status !== 'publish') {
        send_revalidation_webhook($post->ID, $post, 'unpublish');
    }
}

/**
 * Trigger revalidation on post delete
 */
function trigger_nextjs_revalidation_on_delete($post_id) {
    $post = get_post($post_id);
    if (!$post) {
        return;
    }

    $post_type_obj = get_post_type_object($post->post_type);
    if (!$post_type_obj || !$post_type_obj->public) {
        return;
    }

    send_revalidation_webhook($post_id, $post, 'delete');
}

/**
 * Trigger revalidation on menu update/delete
 */
function trigger_nextjs_revalidation_on_menu_update($menu_id = null) {
    send_revalidation_webhook(0, (object)[
        'post_name' => 'menu',
        'post_type' => 'nav_menu'
    ], 'menu_update');
}

/**
 * Trigger revalidation on media upload/edit/delete
 */
function trigger_nextjs_revalidation_on_media($attachment_id) {
    $post = get_post($attachment_id);
    send_revalidation_webhook($attachment_id, $post, 'media_update');
}

/**
 * Send webhook to Next.js revalidation API
 */
function send_revalidation_webhook($post_id, $post, $action) {
    // Validate configuration (only check if NOT defaults)
    if (!defined('NEXTJS_URL')) {
        error_log('⚠️ NEXTJS_URL not defined in functions.php');
        return;
    }
    
    if (!defined('NEXTJS_SECRET')) {
        error_log('⚠️ NEXTJS_SECRET not defined in functions.php');
        return;
    }
    
    // Warn but continue if using defaults (allow localhost development)
    if (NEXTJS_URL === 'http://localhost:3000') {
        error_log('ℹ️ Using default NEXTJS_URL (localhost) - make sure Next.js is running');
    }
    
    if (NEXTJS_SECRET === 'your-secret-token') {
        error_log('ℹ️ Using default NEXTJS_SECRET - should change for production');
    }

    $webhook_url = NEXTJS_URL . '/api/revalidate';

    $body = [
        'action'    => $action,
        'post_type' => $post->post_type ?? 'unknown',
        'slug'      => $post->post_name ?? '',
        'post_id'   => $post_id,
    ];

    // Log webhook attempt for debugging
    error_log('🔔 Sending Next.js webhook: ' . wp_json_encode($body));

    $args = [
        'headers' => [
            'Content-Type' => 'application/json',
            'x-secret'     => NEXTJS_SECRET,
        ],
        'body'       => wp_json_encode($body),
        'timeout'    => 15,
        'blocking'   => true, // Changed to true for better debugging
        'sslverify'  => false, // Set to true in production with HTTPS
    ];

    $response = wp_remote_post($webhook_url, $args);

    // Log response for debugging
    if (is_wp_error($response)) {
        error_log('❌ Next.js webhook ERROR: ' . $response->get_error_message());
    } else {
        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);
        
        if ($response_code === 200) {
            error_log('✅ Next.js webhook SUCCESS: ' . $response_body);
        } else {
            error_log('⚠️ Next.js webhook responded with code ' . $response_code . ': ' . $response_body);
        }
    }
}

/**
 * Test function - Visit: yoursite.com/?test_nextjs_revalidation=1
 * (Only works for admin users)
 */
add_action('init', 'test_nextjs_revalidation');
function test_nextjs_revalidation() {
    if (isset($_GET['test_nextjs_revalidation']) && current_user_can('manage_options')) {
        echo '<h2>🔧 Next.js Webhook Configuration Test</h2>';
        echo '<hr>';
        
        // Check configuration
        echo '<h3>Configuration:</h3>';
        echo '<p><strong>NEXTJS_URL:</strong> ' . (defined('NEXTJS_URL') ? NEXTJS_URL : '❌ Not defined') . '</p>';
        echo '<p><strong>NEXTJS_SECRET:</strong> ' . (defined('NEXTJS_SECRET') ? '✅ Defined (' . strlen(NEXTJS_SECRET) . ' chars)' : '❌ Not defined') . '</p>';
        echo '<hr>';
        
        // Send test webhook
        echo '<h3>Sending Test Webhook...</h3>';
        $test_post = (object)[
            'ID'        => 999,
            'post_name' => 'test-post',
            'post_type' => 'post'
        ];
        
        // Call with blocking to see result
        $webhook_url = NEXTJS_URL . '/api/revalidate';
        $body = [
            'action'    => 'test',
            'post_type' => 'post',
            'slug'      => 'test-post',
            'post_id'   => 999,
        ];
        
        $args = [
            'headers' => [
                'Content-Type' => 'application/json',
                'x-secret'     => NEXTJS_SECRET,
            ],
            'body'       => wp_json_encode($body),
            'timeout'    => 15,
            'blocking'   => true,
            'sslverify'  => false,
        ];
        
        echo '<p>Target URL: <code>' . $webhook_url . '</code></p>';
        echo '<p>Payload: <code>' . wp_json_encode($body) . '</code></p>';
        echo '<hr>';
        
        $response = wp_remote_post($webhook_url, $args);
        
        if (is_wp_error($response)) {
            echo '<p style="color: red;">❌ <strong>ERROR:</strong> ' . $response->get_error_message() . '</p>';
            echo '<h4>Common Issues:</h4>';
            echo '<ul>';
            echo '<li>Is your Next.js server running?</li>';
            echo '<li>Is the URL correct? (http://localhost:3000 for local)</li>';
            echo '<li>Check your firewall settings</li>';
            echo '</ul>';
        } else {
            $response_code = wp_remote_retrieve_response_code($response);
            $response_body = wp_remote_retrieve_body($response);
            
            if ($response_code === 200) {
                echo '<p style="color: green;">✅ <strong>SUCCESS!</strong> Webhook received by Next.js</p>';
                echo '<p>Response: <code>' . htmlspecialchars($response_body) . '</code></p>';
                echo '<p>Now try editing/publishing a post in WordPress to see automatic revalidation!</p>';
            } else if ($response_code === 401) {
                echo '<p style="color: red;">❌ <strong>AUTHENTICATION ERROR (401)</strong></p>';
                echo '<p>The secret token doesn\'t match!</p>';
                echo '<p>WordPress NEXTJS_SECRET: <code>' . substr(NEXTJS_SECRET, 0, 5) . '...</code></p>';
                echo '<p>Make sure REVALIDATE_SECRET in .env.local matches exactly</p>';
            } else {
                echo '<p style="color: orange;">⚠️ <strong>Unexpected Response Code:</strong> ' . $response_code . '</p>';
                echo '<p>Response: <code>' . htmlspecialchars($response_body) . '</code></p>';
            }
        }
        
        echo '<hr>';
        echo '<h4>📋 Check WordPress Logs:</h4>';
        echo '<p>Location: <code>/wp-content/debug.log</code></p>';
        echo '<p>Look for lines starting with "🔔" or "✅" or "❌"</p>';
        
        wp_die();
    }
}

/**
 * Add admin notice to remind about configuration
 */
add_action('admin_notices', 'nextjs_webhook_configuration_notice');
function nextjs_webhook_configuration_notice() {
    // Only show if secret is still default
    if (!defined('NEXTJS_SECRET') || NEXTJS_SECRET === 'your-secret-token') {
        
        // Only show if not already dismissed
        $user_id = get_current_user_id();
        $dismissed = get_user_meta($user_id, 'nextjs_webhook_notice_dismissed', true);
        
        if ($dismissed) {
            return;
        }
        
        $test_url = admin_url('?test_nextjs_revalidation=1');
        $dismiss_url = add_query_arg('nextjs_dismiss_notice', '1');
        
        echo '<div class="notice notice-info is-dismissible">';
        echo '<p><strong>ℹ️ Next.js Webhook:</strong> Update <code>NEXTJS_SECRET</code> in functions.php to match your .env.local file</p>';
        echo '<p>Current: <code>define(\'NEXTJS_SECRET\', \'your-secret-token\');</code><br>';
        echo 'Example: <code>define(\'NEXTJS_SECRET\', \'abc123xyz\');</code></p>';
        echo '<p><a href="' . $test_url . '" class="button button-primary">Test Configuration</a> ';
        echo '<a href="' . $dismiss_url . '" class="button">Dismiss</a></p>';
        echo '</div>';
    }
}

// Handle dismiss
add_action('admin_init', 'nextjs_webhook_dismiss_notice');
function nextjs_webhook_dismiss_notice() {
    if (isset($_GET['nextjs_dismiss_notice'])) {
        $user_id = get_current_user_id();
        update_user_meta($user_id, 'nextjs_webhook_notice_dismissed', true);
        wp_redirect(remove_query_arg('nextjs_dismiss_notice'));
        exit;
    }
}

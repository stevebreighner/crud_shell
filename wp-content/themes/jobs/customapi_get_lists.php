<?php

// USER JOBS
function customapi_get_list(WP_REST_Request $request) {
  $search = sanitize_text_field($request->get_param('search'));
  
  $args = [
      'post_type'      => 'post', // change to 'job' if using a custom type
      'post_status'    => 'publish',
      'posts_per_page' => 100,
      'orderby'        => 'date',
      'order'          => 'DESC',
  ];

  if (!empty($search)) {
      $args['s'] = $search;
  }

  $query = new WP_Query($args);
  $results = [];

  foreach ($query->posts as $post) {
      $meta = get_post_meta($post->ID);

      $results[] = [
          'id'          => $post->ID,
          'title'       => get_the_title($post),
          'description' => apply_filters('the_content', $post->post_content),
          'date'        => get_the_date('', $post),
          'author'      => get_the_author_meta('display_name', $post->post_author),
          'meta'        => array_map(function($v) { return $v[0]; }, $meta), // flatten
      ];
  }

  return rest_ensure_response($results);
}


function customapi_get_list_detail(WP_REST_Request $request) {
  $post_id = intval($request->get_param('id'));

  if (!$post_id || get_post_status($post_id) !== 'publish') {
      return new WP_Error('not_found', 'Post not found', ['status' => 404]);
  }

  $post = get_post($post_id);
  $meta = get_post_meta($post_id);

  return [
      'id'          => $post->ID,
      'title'       => get_the_title($post),
      'description' => apply_filters('the_content', $post->post_content),
      'date'        => get_the_date('', $post),
      'author'      => get_the_author_meta('display_name', $post->post_author),
      'meta'        => array_map(function($v) { return $v[0]; }, $meta), // flatten
  ];
}

?>
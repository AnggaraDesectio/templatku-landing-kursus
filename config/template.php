<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-kursus".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-kursus'),

    'flavors' => array (
  'landing-kursus' => 
  array (
    'label' => 'KELAS PINTAR — Kursus Online',
    'brand_name' => 'KELAS PINTAR',
    'brand_tagline' => 'Upgrade skill, naik level karier',
    'brand_initials' => 'KP',
    'accent' => '#0e7490',
    'category' => 'pendidikan',
    'home' => 'landings.kursus',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/kursus',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];

<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/search' => [[['_route' => 'api_search', '_controller' => 'App\\Controller\\ApiController::search'], null, ['GET' => 0], null, false, false, null]],
        '/api/matches' => [[['_route' => 'api_matches', '_controller' => 'App\\Controller\\ApiController::matches'], null, ['GET' => 0], null, false, false, null]],
        '/inscription' => [[['_route' => 'inscription', '_controller' => 'App\\Controller\\AuthController::register'], null, ['POST' => 0], null, false, false, null]],
        '/profil' => [[['_route' => 'profil', '_controller' => 'App\\Controller\\AuthController::profile'], null, ['GET' => 0], null, false, false, null]],
        '/api/invitations' => [[['_route' => 'app_invitation_list', '_controller' => 'App\\Controller\\InvitationController::list'], null, ['GET' => 0], null, false, false, null]],
        '/api/match/compute' => [[['_route' => 'app_matching_compute', '_controller' => 'App\\Controller\\MatchingController::compute'], null, ['GET' => 0], null, false, false, null]],
        '/api/sessions' => [
            [['_route' => 'app_session_list', '_controller' => 'App\\Controller\\SessionController::list'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'app_session_create', '_controller' => 'App\\Controller\\SessionController::create'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/user' => [
            [['_route' => 'api_user_get', '_controller' => 'App\\Controller\\UserController::getProfile'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'api_user_update', '_controller' => 'App\\Controller\\UserController::updateProfile'], null, ['PUT' => 0], null, false, false, null],
        ],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/api/(?'
                    .'|invitations/([^/]++)/respond(*:43)'
                    .'|sessions/([^/]++)(?'
                        .'|(*:70)'
                        .'|/(?'
                            .'|join(*:85)'
                            .'|invite(*:98)'
                            .'|leave(*:110)'
                        .')'
                        .'|(*:119)'
                    .')'
                .')'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        43 => [[['_route' => 'app_invitation_respond', '_controller' => 'App\\Controller\\InvitationController::respond'], ['id'], ['POST' => 0], null, false, false, null]],
        70 => [[['_route' => 'app_session_detail', '_controller' => 'App\\Controller\\SessionController::detail'], ['id'], ['GET' => 0], null, false, true, null]],
        85 => [[['_route' => 'app_session_join', '_controller' => 'App\\Controller\\SessionController::join'], ['id'], ['POST' => 0], null, false, false, null]],
        98 => [[['_route' => 'app_session_invite', '_controller' => 'App\\Controller\\SessionController::invite'], ['id'], ['POST' => 0], null, false, false, null]],
        110 => [[['_route' => 'app_session_leave', '_controller' => 'App\\Controller\\SessionController::leave'], ['id'], ['POST' => 0], null, false, false, null]],
        119 => [
            [['_route' => 'app_session_delete', '_controller' => 'App\\Controller\\SessionController::delete'], ['id'], ['DELETE' => 0], null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];

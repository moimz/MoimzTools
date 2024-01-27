<?php
/**
 * 이 파일은 모임즈툴즈의 일부입니다. (https://www.moimz.tools)
 *
 * 모임즈툴즈 인스톨러 엠블럼 이미지를 가져온다/
 *
 * @file /installer/emblem.php
 * @author Arzz (arzz@arzz.com)
 * @license MIT License
 * @modified 2024. 1. 28.
 */
$package = isset($_GET['package']) == true ? $_GET['package'] : 'emblem';
$emblem = '../images/' . $package . '.png';

if (is_file($emblem) == true) {
    header('Content-Type: image/png');
    header('Content-Length: ' . filesize($emblem));
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 3600) . ' GMT');
    header('Cache-Control: max-age=3600');
    header('Pragma: public');

    readfile($emblem);
    exit();
} else {
    header('HTTP/1.1 404 Not Found');
}

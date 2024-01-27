<?php
/**
 * 이 파일은 모임즈툴즈의 일부입니다. (https://www.moimz.com)
 *
 * 모임즈툴즈 홈페이지 메인을 구성한다.
 *
 * @file /index.php
 * @author Arzz
 * @license MIT License
 * @version 2.0.0
 * @modified 2021. 7. 21.
 */
if (isset($_SERVER['HTTPS']) == false) {
    header('location:https://www.moimz.tools');
    exit();
}

if ($_SERVER['HTTP_HOST'] != 'www.moimz.tools') {
    header('location:https://www.moimz.tools');
    exit();
}
?>
<!DOCTYPE HTML>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width">
<title>MoimzTools</title>
<meta name="description" content="모임즈(Moimz.com)에서 제공하는 강력한 모임즈툴즈(MoimzTools)를 만나보세요.">
<meta name="robots" content="all">
<meta property="og:url" content="https://www.moimz.tools/">
<meta property="og:type" content="website">
<meta property="og:title" content="MoimzTools">
<meta property="og:description" content="모임즈(Moimz.com)에서 제공하는 강력한 모임즈툴즈(MoimzTools)를 만나보세요.">
<meta property="og:image" content="https://www.moimz.tools/images/preview.png?t=2021072118">
<meta property="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://www.moimz.tools/">
<link rel="stylesheet" href="./styles/style.css" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,700" rel="stylesheet" type="text/css">
<link href="https://cdn.jsdelivr.net/font-nanum/1.0/nanumbarungothic/nanumbarungothic.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
<link rel="apple-touch-icon" sizes="57x57" href="./images/emblem.png">
<link rel="apple-touch-icon" sizes="114x114" href="./images/emblem.png">
<link rel="apple-touch-icon" sizes="72x72" href="./images/emblem.png">
<link rel="apple-touch-icon" sizes="144x144" href="./images/emblem.png">
<link rel="shortcut icon" type="image/x-icon" href="./images/favicon.ico">
<script src="./scripts/script.js"></script>
</head>
<body>
	<header>
		<h1>MoimzTools<small> From moimz.com</small></h1>
		
		<button data-role="sites">
			FAMILY SITE <i class="fa fa-caret-down"></i>
			<ul data-role="familySite">
				<li><a href="https://www.moimz.com" target="_blank">모임즈</a></li>
				<li><a href="https://www.minitalk.io" target="_blank">미니톡</a></li>
				<li><a href="https://www.imodules.io" target="_blank">아이모듈</a></li>
				<li><a href="https://www.arzz.com" target="_blank">알쯔닷컴</a></li>
			</ul>
		</button>
	</header>
	
	<main>
		<section>
			<article>
				<h2>MoimzTools</h2>
				
				<ul>
					<li>
						<i data-role="icon" data-tool="iModules" data-url="https://www.imodules.io" data-title="iModules"></i>
						<h3>iModules</h3>
					</li>
					<li>
						<i data-role="icon" data-tool="minitalk" data-url="https://minitalk.moimz.tools/v7/example.php" data-title="Minitalk"></i>
						<h3>Minitalk</h3>
					</li>
				</ul>
				
				<h2>MoimzTools with 3rd party platform</h2>
				
				<ul>
					<li>
						<i data-role="icon" data-tool="gnuboard" data-url="https://g5.moimz.tools" data-title="GNUBOARD5"></i>
						<h3>GNUBOARD5</h3>
					</li>
					<li>
						<i data-role="icon" data-tool="xe" data-url="https://xe.moimz.tools" data-title="XpressEngine"></i>
						<h3>XpressEngine</h3>
					</li>
					<li>
						<i data-role="icon" data-tool="moodle" data-url="https://moodle.moimz.tools" data-title="Moodle"></i>
						<h3>Moodle</h3>
					</li>
				</ul>
			</article>
		</section>
	</main>
	
	<section id="PreviewWindow">
		<header>
			<i></i><h3></h3><button>CLOSE</button>
		</header>
		<main></main>
	</section>
	
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-239651-22"></script>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag('js', new Date());
	gtag('config', 'UA-239651-22');
	</script>
</body>
</html>

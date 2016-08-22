<?php

//setup
$numberEmployees = 50;
$numberCities = round($numberEmployees/4);
$numberIssues = 5000;
$numberClients = round($numberIssues/10);

//source data
$sourceNames = file(__DIR__.'/sources/names.txt');
$sourceSurnames = file(__DIR__.'/sources/surnames.txt');
$sourceText = file_get_contents(__DIR__.'/sources/loremipsum.txt');
$sourceCities = readCSV(__DIR__.'/sources/cities.csv');
$sourceParagraphs = file(__DIR__.'/sources/loremipsum.txt');
//
$usedCities = pickCities();
$allCustomers = genCustomers();
$allEmployees = genEmployees();
$allIssues = genIssues();
//


writeJSON(__DIR__.'/../app/data/cities.json', $usedCities);
writeCSV(__DIR__.'/../app/data/customers.csv', $allCustomers);
writeCSV(__DIR__.'/../app/data/employees.csv', $allEmployees);
writeJSON(__DIR__.'/../app/data/issues.json', $allIssues);


//functions
function genEmployees(){
	global $usedCities, $numberEmployees;
	$ret = [];

	for($x = 0; $x < $numberEmployees; $x++){
		$ava = "data/images/user".(rand(1,8)).".jpg";
		$city = $usedCities[rand(1, count($usedCities))];
		$ret[] = [
			"id" => $x+1,
			"name" => _genName(),
			"avatar" => $ava,
			"city" => $city["id"]
		];
	}
	return $ret;
}

function genCustomers(){
	global $numberClients;
	$ret = [];


	for($x = 0; $x < $numberClients; $x++){
		$monthsPayed = rand(0, 30);
		$terminatedNow = rand(0,1);
		$monthsNonPayed = $terminatedNow ? rand(0, 10) : 0;
		$month = 86400*30;

		$start = time() - $monthsNonPayed * $month - $monthsPayed * $month;
		$end = $terminatedNow ? time() - $monthsNonPayed * $month : 0;


		$name = _genName();
		$email = _genEmail($name);

		$ret[] = [
			"id" => $x+1,
			"name" => $name,
			"email" => $email,
			"supportStart" => $start,
			"supportEnd" => $end
		];
	}
	return $ret;
}

///
function _genName(){
	global $sourceNames, $sourceSurnames;

	$name = trim($sourceNames[rand(0, count($sourceNames)-1)]);
	$surname = trim($sourceSurnames[rand(0, count($sourceSurnames)-1)]);

	return "$name $surname";
}

function pickCities(){
	global $sourceCities, $numberCities;

	$ret = [];
	for($x = 0; $x < $numberCities; $x++){
		$entry = $sourceCities[rand(0, count($sourceCities)-1)];
		$ret[$x+1] = [
			"id" => $x+1,
			"country" => $entry[0],
			"name" => $entry[3],
			"lat" => $entry[1],
			"lon" => $entry[2]
		];
	}
	return $ret;
}

function genIssues(){
	global $numberIssues;

	$ret = [];
	for($x = 0; $x < $numberIssues; $x++){
		$ret[] = newIssue();
	}
	return $ret;
}


function newIssue(){
	global $allEmployees, $allCustomers;
	$startDiff = rand(0, 100000000);
	$status = rand(0,1) ? 'open' : 'closed';
	$end = $status == 'open' ? 0 : time() - ($startDiff - rand(500, $startDiff));


	$employee = $allEmployees[rand(0, count($allEmployees)-1)];;
	$customer = $allCustomers[rand(0, count($allCustomers)-1)];;
	return [
		'issueId' => rand(0, 1000000),
		'submissionTimestamp' => time() - $startDiff,
		'customerName' => $customer['name'],
		'customerEmail' => $customer['email'],
		'title' => _getRandTitle(),
		'description' => _getRandText(),
		'status' => $status,
		'closedTimestamp' => $end,
		'employeeName' => $employee['name'],
		'employeeId' => $employee['id']
	];
}

// file IO
function writeCSV($csvFile, $data, $keysFromFirstLine = true){
	$fp = fopen($csvFile, 'w');
	if($keysFromFirstLine && count($data)){
		$allKeys = array_keys($data[0]);
		fputcsv($fp, $allKeys,';');
	}
	foreach ($data as $fields) {
	    fputcsv($fp, $fields,';');
	}
	fclose($fp);
}

function readCSV($csvFile){
    $file_handle = fopen($csvFile, 'r');
    while (!feof($file_handle) ) {
        $line_of_text[] = fgetcsv($file_handle, 1024);
    }
    fclose($file_handle);
    return $line_of_text;
}

function writeJSON($jsonFile, $data){
	file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

///

function _genEmail($personName){
	$domain = 'example.com';
	return preg_replace('/[\s]+/','-',strtolower($personName)).'@'.$domain;
}

function _getRandP(){
	global $sourceParagraphs;
    $p = rand(0, count($sourceParagraphs)-1);
    return trim($sourceParagraphs[$p]);
}

function _getRandTitle($add = 0){
    $p = explode(' ', _getRandP());
    $l = rand(4+$add, 6+$add);
    return implode(' ', array_slice($p, 0, $l));
}

function _getRandText(){
	global $sourceParagraphs;
    $r = [];
    $pis = array_keys($sourceParagraphs);
    $rc = rand(4, 8);
    for($i =0; $i < $rc; $i++) {
        $t = rand(0, count($pis)-1);
        $r[] = $sourceParagraphs[$pis[$t]];
        unset($pis[$t]);
        $pis = array_values($pis);
    }

    return '<p>'.implode('</p><p>',$r).'</p>';
}

<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
include 'db.php';

$trend = $_GET['trend'] ?? '';
$data = [];

if ($trend === 'total_crimes_per_year') {
    $sql = "SELECT year AS label, 
                   SUM(rape + kidnapping_abduction + dowry_deaths + assault_on_women + assault_on_modesty + domestic_violence + women_trafficking) AS value
            FROM crime_stats
            GROUP BY year
            ORDER BY year";

    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

elseif ($trend === 'total_crimes_per_state') {
    $sql = "SELECT state AS label, 
                   SUM(rape + kidnapping_abduction + dowry_deaths + assault_on_women + assault_on_modesty + domestic_violence + women_trafficking) AS value
            FROM crime_stats
            GROUP BY state
            ORDER BY value DESC";

    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

elseif ($trend === 'specific_crime_trend') {
    $crimeType = $_GET['crimeType'] ?? '';
    $allowedCrimes = ['rape', 'kidnapping_abduction', 'dowry_deaths', 'assault_on_women', 'assault_on_modesty', 'domestic_violence', 'women_trafficking'];

    if (!in_array($crimeType, $allowedCrimes)) {
        echo json_encode(["error" => "Invalid crime type"]);
        exit;
    }

    $sql = "SELECT year AS label, SUM($crimeType) AS value
            FROM crime_stats
            GROUP BY year
            ORDER BY year";

    $result = $conn->query($sql);
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

elseif ($trend === 'state_crime_breakdown') {
    $state = $_GET['state'] ?? '';

    $sql = "
        SELECT 'rape' AS label, SUM(rape) AS value FROM crime_stats WHERE state = ? 
        UNION ALL
        SELECT 'kidnapping_abduction', SUM(kidnapping_abduction) FROM crime_stats WHERE state = ? 
        UNION ALL
        SELECT 'dowry_deaths', SUM(dowry_deaths) FROM crime_stats WHERE state = ?
        UNION ALL
        SELECT 'assault_on_women', SUM(assault_on_women) FROM crime_stats WHERE state = ?
        UNION ALL
        SELECT 'assault_on_modesty', SUM(assault_on_modesty) FROM crime_stats WHERE state = ?
        UNION ALL
        SELECT 'domestic_violence', SUM(domestic_violence) FROM crime_stats WHERE state = ?
        UNION ALL
        SELECT 'women_trafficking', SUM(women_trafficking) FROM crime_stats WHERE state = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $state, $state, $state, $state, $state, $state, $state);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

else {
    echo json_encode(["error" => "Invalid trend"]);
    exit;
}

echo json_encode($data);

USE crimes_data;

#total crimes per year trend
SELECT year,
	   SUM(state + rape + kidnapping_abduction + dowry_deaths + assault_on_women + assault_on_modesty + domestic_violence + women_trafficking) AS total_crimes
FROM crime_stats
GROUP BY year
ORDER BY year;

#total crimes per state trend
SELECT state,
	   SUM(rape + kidnapping_abduction + dowry_deaths + assault_on_women + assault_on_modesty + domestic_violence + women_trafficking) AS total_crimes
FROM crime_stats
GROUP BY state
ORDER BY total_crimes;

#Trend of a Specific Crime Type
#RAPE
SELECT state,
       SUM(rape) AS total_crimes_rape
FROM crime_stats
GROUP BY state
ORDER BY total_crimes_rape;

#kidnapping and abduction
SELECT state,
       SUM(kidnapping_abduction) AS total_crimes_K_A
FROM crime_stats
GROUP BY state
ORDER BY total_crimes_K_A;

#dowry deaths
SELECT state,
       SUM(dowry_deaths) AS total_crimes_dowry_deaths
FROM crime_stats
GROUP BY state
ORDER BY total_crimes_dowry_deaths;

#assault_on_women
SELECT state,
       SUM(assault_on_women) AS total_crimes_assault_on_women
FROM crime_stats
GROUP BY state
ORDER BY total_crimes_assault_on_women;

#assault_on_modesty
SELECT state,
       SUM(assault_on_modesty) AS total_crimes_assault_on_modesty
FROM crime_stats
GROUP BY state
ORDER BY total_crimes_assault_on_modesty;

#domestic_violence
SELECT state,
       SUM(domestic_violence) AS total_crimes_domestic_violence
FROM crime_stats
GROUP BY state
ORDER BY total_crimes_domestic_violence;

#women_trafficking
SELECT state,
       SUM(women_trafficking) AS total_crimes_women_trafficking
FROM crime_stats
GROUP BY state
ORDER BY total_crimes_women_trafficking;

# Crimes by Type in a Specific State
SELECT year, rape, kidnapping_abduction, dowry_deaths, assault_on_women, assault_on_modesty, domestic_violence, women_trafficking
FROM crime_stats
WHERE state = 'Uttar Pradesh'
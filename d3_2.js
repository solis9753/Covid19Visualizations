////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////
var screenWidth = $(window).width();

var margin = {left: 50, top: 10, right: 50, bottom: 10},
	width = Math.min(screenWidth, 800) - margin.left - margin.right,
	height = Math.min(screenWidth, 800) - margin.top - margin.bottom;
			
//var width = 1300, height = 1300;

var svg = d3.select("#chart").append("svg")
			.attr("width", (width + margin.left + margin.right))
			.attr("height", (height + margin.top + margin.bottom));
			
var wrapper = svg.append("g").attr("class", "chordWrapper")
			.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");;
			
var outerRadius = Math.min(width, height) / 2  - 200,
	innerRadius = outerRadius * 0.95,
	opacityDefault = 0.7; //default opacity of chords
	
////////////////////////////////////////////////////////////
////////////////////////// Data ////////////////////////////
////////////////////////////////////////////////////////////

var Names = ["HealthVerity", "hdm", "IQVIA-OpenClaims", "CU-AMC HDC", "VA-OMOP", "OptumEhr", "Optum SES", "IQVIAHospitalCDM", "", "prevalent type 2 diabetes mellitus", "prevalent tuberculosis", "prevalent autoimmune condition", "prevalent chronic obstructive pulmonary disease (copd) without asthma", "prevalent asthma without copd", "asthma/copd step 3", "prevalent pre-existing condition of covid risk factor", "eclampsia and pre-eclampsia", "fever", "cough", "myalgia", "malaise or fatigue", "dyspnea", "anosmia or hyposmia or dysgeusia", "persons with additional testing for sars-cov-2 (prior test >=1d before test)", "persons with additional testing for sars-cov-2 (prior test >=5d before test)", "bradycardia or heart block during hospitalization", "supraventricular arrythymia during hospitalization", "ventricular arrhythmia or cardiac arrest during hospitalization", "death", "stillbirth", "livebirth delivery", "livebirth preterm delivery", "livebirth post term delivery", "livebirth excluding preterm and post term delivery", "abortion", "dialysis during hospitalization", "persons with chest pain or angina", "angina during hospitalization", "persons with hepatic failure", "acute pancreatitis events", "total cardiovascular disease events", "gastrointestinal bleeding events", "cardiovascular-related mortality", "transient ischemic attack events", "stroke (ischemic or hemorrhagic) events", "suicide and suicidal ideation", "multi-system inflammatory syndrome (kawasaki disease or toxic shock syndrome)", "pregnant women", "flu-like symptom episodes", ""];


var matrix = [
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0.437, 0, 0.146, 0.214, 0.108, 0.089, 0.662, 0, 0.31, 0.28, 0.025, 0.119, 0.382, -0.011, 0.085, 0.038, 0.057, 0.13, -0.011, 0, 0, 0, 0, 0, 0, 0, 0.076, 0.285, 0.017, 0.013, -0.011, 0.17, 0.036, 0, 0.015, 0.055, -0.011, 0, -0.011, 0.607, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0.177, 0, 0.061, 0.122, -0.028, 0, 0.392, 0, -0.028, 0, 0, 0, 0, 0, 0, 0, -0.028, 0.055, -0.028, 0.199, 0, 0, 0, 0, 0, 0, 0, 0.055, -0.028, 0, 0, 0.072, 0, 0, 0, -0.028, -0.028, 0, 0, -0.028, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0.583, 0, 0.301, 0.261, 0.169, 0.087, 0.847, 0, 0.234, 0.277, 0.028, 0.127, 0.421, 0.002, 0.011, 0.009, 0.058, 0.102, 0.021, 0, 0, 0.001, 0, 0, 0.001, 0, 0.044, 0.594, 0.021, 0.021, 0.008, 0.214, 0.04, 0, 0.013, 0.056, 0.009, 0, 0.005, 0.646, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0.468, 0, 0.145, 0.244, 0.128, 0.099, 0.75, 0, 0.346, 0.413, 0.105, 0.192, 0.238, -0.029, 0.044, -0.029, 0.128, 0.183, 0.064, 0, 0, -0.029, 0, 0, -0.029, 0, 0.067, 0.317, -0.029, 0.032, -0.029, 0.218, 0.047, 0, -0.029, 0.044, -0.029, 0, -0.029, 0.66, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0.646, -0.003, 0.328, 0.533, 0.117, 0.197, 0.917, 0, 0.183, 0.235, 0.026, 0.142, 0.417, 0.006, 0.234, 0.184, 0.069, 0.171, 0.017, 0, 0, 0, 0, 0, 0, 0, 0.051, 0.613, 0.037, 0.019, 0.008, 0.242, 0.046, 0, 0.012, 0.045, 0.089, 0, 0, 0.632, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0.479, -0.001, 0.161, 0.32, 0.145, 0.163, 0.824, 0.002, 0.235, 0.279, 0.04, 0.142, 0.422, 0.004, 0.25, 0.102, 0.158, 0.222, 0.089, 0, 0, 0.003, -0.001, 0, 0.002, -0.001, 0.054, 0.377, 0.031, 0.039, 0.009, 0.308, 0.064, 0, 0.008, 0.063, 0.023, -0.001, 0.008, 0.623, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0.49, 0, 0.238, 0.294, 0.143, 0.116, 0.753, 0, 0.372, 0.445, 0.056, 0.178, 0.514, -0.011, -0.011, -0.011, 0.111, 0.147, 0.027, -0.011, 0, 0, 0, 0, 0, 0, 0.031, 0.492, 0.029, 0.022, -0.011, 0.225, 0.047, -0.011, 0.022, 0.045, 0.016, 0, -0.011, 0.777, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0.494, 0, 0.124, 0.269, 0.092, 0.01, 0.73, 0, 0.091, 0.088, 0.011, 0.07, 0.234, 0.001, 0.069, 0.053, 0.046, 0.086, 0.019, 0, 0, 0.001, 0, 0, 0.001, 0, 0.057, 0.283, 0.013, 0.015, 0.006, 0.172, 0.027, 0, 0.004, 0.019, 0.003, 0, 0.005, 0.39, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[0.437, 0.177, 0.583, 0.468, 0.646, 0.479, 0.49, 0.494, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0, 0, -0.003, -0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.146, 0.061, 0.301, 0.145, 0.328, 0.161, 0.238, 0.124, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.214, 0.122, 0.261, 0.244, 0.533, 0.32, 0.294, 0.269, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.108, -0.028, 0.169, 0.128, 0.117, 0.145, 0.143, 0.092, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.089, 0, 0.087, 0.099, 0.197, 0.163, 0.116, 0.01, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.662, 0.392, 0.847, 0.75, 0.917, 0.824, 0.753, 0.73, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0.002, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.31, -0.028, 0.234, 0.346, 0.183, 0.235, 0.372, 0.091, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.28, 0, 0.277, 0.413, 0.235, 0.279, 0.445, 0.088, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0.025, 0, 0.028, 0.105, 0.026, 0.04, 0.056, 0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.119, 0, 0.127, 0.192, 0.142, 0.142, 0.178, 0.07, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.382, 0, 0.421, 0.238, 0.417, 0.422, 0.514, 0.234, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[-0.011, 0, 0.002, -0.029, 0.006, 0.004, -0.011, 0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.085, 0, 0.011, 0.044, 0.234, 0.25, -0.011, 0.069, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.038, 0, 0.009, -0.029, 0.184, 0.102, -0.011, 0.053, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.057, -0.028, 0.058, 0.128, 0.069, 0.158, 0.111, 0.046, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.13, 0.055, 0.102, 0.183, 0.171, 0.222, 0.147, 0.086, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[-0.011, -0.028, 0.021, 0.064, 0.017, 0.089, 0.027, 0.019, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0.199, 0, 0, 0, 0, -0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0.001, -0.029, 0, 0.003, 0, 0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0, 0, 0, -0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0.001, -0.029, 0, 0.002, 0, 0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0, 0, 0, -0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.076, 0, 0.044, 0.067, 0.051, 0.054, 0.031, 0.057, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0.285, 0.055, 0.594, 0.317, 0.613, 0.377, 0.492, 0.283, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.017, -0.028, 0.021, -0.029, 0.037, 0.031, 0.029, 0.013, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0.013, 0, 0.021, 0.032, 0.019, 0.039, 0.022, 0.015, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[-0.011, 0, 0.008, -0.029, 0.008, 0.009, -0.011, 0.006, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0.17, 0.072, 0.214, 0.218, 0.242, 0.308, 0.225, 0.172, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0.036, 0, 0.04, 0.047, 0.046, 0.064, 0.047, 0.027, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, -0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0.015, 0, 0.013, -0.029, 0.012, 0.008, 0.022, 0.004, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0.055, -0.028, 0.056, 0.044, 0.045, 0.063, 0.045, 0.019, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[-0.011, -0.028, 0.009, -0.029, 0.089, 0.023, 0.016, 0.003, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, -0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[-0.011, 0, 0.005, -0.029, 0, 0.008, -0.011, 0.005, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0.607, -0.028, 0.646, 0.66, 0.632, 0.623, 0.777, 0.39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var chord = d3.layout.chord()
	.padding(.02)
	.sortSubgroups(d3.descending) //sort the chords inside an arc from high to low
	.sortChords(d3.descending) //which chord should be shown on top when chords cross. Now the biggest chord is at the bottom
	.matrix(matrix);

var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius);

var path = d3.svg.chord()
	.radius(innerRadius);
	
var fill = d3.scale.ordinal()
    .domain(d3.range(Names.length))
    .range(["#00A1DE", "#00A1DE", "#00A1DE", "#00A1DE", "#00A1DE", "#00A1DE", "#00A1DE", "#00A1DE", "#7e1900", "#801c01", "#811f02", "#822203", "#832504", "#852705", "#862a06", "#872d06", "#882f07", "#8a3108",  "#8b3409",   "#8c360a",  "#8d380b",   "#8e3b0c",  "#8f3d0c",   "#903f0d",  "#92410e",   "#93440f",  "#944610",   "#954811",  "#964a12",   "#974c13",  "#984e14",   "#995015",  "#9a5315",   "#9b5516",  "#9c5717",   "#9d5918",  "#9e5b19",   "#9f5d1a",  "#a05f1b",   "#a1611c",  "#a2631c",   "#a3651d",  "#a4671e",   "#a5691f",  "#a66b20",   "#a76d21",  "#a86f21",   "#a97122",  "#aa7323",   "#ab7524",  "#ac7725",   "#ad7926",  "#ae7c27",   "#af7e27",  "#b08028",   "#b18229",  "#b2842a"]);
//    .range(["#C4C4C4","#C4C4C4","#C4C4C4","#E0E0E0","#EDC951","#CC333F","#00A0B0","gold", "69b3a2", //"#E0E0E0"]);

//var fill = d3.scaleSequential(d3.interpolate("purple", "orange"))
//      .domain(d3.range(Names.length));
//      .interpolator(d3.interpolateRgb("purple", "orange"));
//      .domain([0,99]);
//    .interpolator(d3.interpolateViridis);  
//var fill = d3.scaleSequential(d3.interpolateDiscrete("purple", 10))
//    .interpolator(d3.interpolateDiscrete("purple", 10));
//   .domain(d3.range(Names.length));
//    .range(d3.range(Names.length));
//    .range(["purple", "orange"]);



////////////////////////////////////////////////////////////
//////////////////// Draw outer Arcs ///////////////////////
////////////////////////////////////////////////////////////

var g = wrapper.selectAll("g.group")
	.data(chord.groups)
	.enter().append("g")
	.attr("class", "group")
	.on("mouseover", mouseover)
  .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") })
;

g.append("path")
//.style("stroke", function(d) { return fill(d.index); })
//.style("fill", function(d) { return fill(d.index); })
	.style("stroke", function(d,i) { return (Names[i] === "" ? "none" : fill(d.index));})
  .style("fill", function(d,i) { return (Names[i] === "" ? "none" : fill(d.index));})
//.style("fill", function(d,i) { return (Names[i] === "" ? "none" : "#00A1DE"); })
//	.style("stroke", function(d) { return fill(d.index); })
//  .style("fill", function(d) { return fill(d.index); })
	.attr("d", arc)
	.on("mouseover", fade(.1))
  .on("mouseout", fade(1));
	

////////////////////////////////////////////////////////////
////////////////////// Append Names ////////////////////////
////////////////////////////////////////////////////////////

g.append("text")
	.each(function(d) { d.angle = ((d.startAngle + d.endAngle) / 2);})
	.attr("dy", ".35em")
	.attr("class", "titles")
	.attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.attr("transform", function(d,i) { 
		var c = arc.centroid(d);
		return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
		+ "translate(" + (innerRadius + 20) + ")"
		+ (d.angle > Math.PI ? "rotate(180)" : "")
	})
	.text(function(d,i) { return Names[i]; });

//+ "translate(" + (innerRadius + 55) + ")"

////////////////////////////////////////////////////////////
//////////////////// Draw inner chords /////////////////////
////////////////////////////////////////////////////////////
 
var chords = wrapper.selectAll("path.chord")
	.data(chord.chords)
	.enter().append("path")
	.attr("class", "chord")
	.style("stroke", "none")
	.style("fill", function(d, i) { return fill(d.target.index); })
	.style("opacity", function(d) { return (Names[d.source.index] === "" ? 0 : opacityDefault); }) 
	.attr("d", path)
//	.on("mouseover", mouseover);
	.on("mouseover", function (d) {
                  d3.select("#tooltip")
                    .style("visibility", "visible")
                    .html("Source: " + Names[d.source.index] + "<br>Target: " + Names[d.target.index])
                    .style("top", function () { return (d3.event.pageY - 100)+"px"})
                    .style("left", function () { return (d3.event.pageX - 100)+"px";})
                })
  .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });	
//       .on("mouseover", fade(.1))
//       .on("mouseout", fade(1));

////////////////////////////////////////////////////////////
///////////////////////// Tooltip //////////////////////////
////////////////////////////////////////////////////////////

//Arcs
g.append("title")	
	.text(function(d, i) {return d.value + " mean in " + Names[i];});
	
//Chords
chords.append("title")
	.text(function(d) {
		return [Math.round((d.source.value)* 100), "% of people in ", Names[d.source.index], " with ", Names[d.target.index]].join("");});
		
//		function chordTip (d) {
//            var p = d3.format(".1%"), q = d3.format(",.2r")
//            return "Chord Info:<br/>"
//              +  d.sname + " → " + d.tname
//              + ": " + p(d.svalue) + "<br/>"
//              + d.tname + " → " + d.sname
//              + ": " + p(d.tvalue) + "<br/>";
//          }
//
//    function groupTip (d) {
//            var p = d3.format(".1%"), q = d3.format(",.2r")
//            return "Group Info:<br/>"
//                + d.gname + " : " + p(d.gvalue) + "<br/>";
//            }
		
		function mouseover(d, i) {
           d3.select("#tooltip")
             .style("visibility", "visible")
             .html("Source: " + Names[d.source.index] + "<br>Target: " + Names[d.target.index])
             .style("top", function () { return (d3.event.pageY - 80)+"px"})
             .style("left", function () { return (d3.event.pageX - 130)+"px";})
		};
//
    function mouseover(d, i) {
      
//        chords.style("opacity", function(p) { return (d.source && Names[d.source.index] != i  ? 0 : opacityDefault); }) 

chords.classed("fade", function(p) { return (p.source.index != i && p.target.index != i)      
      
		    //console.log(`${d.source.index}`);
	//	    chords.classed("fade", function(p) {
	//	      return t
		      //p.source.index != i
		      //&& p.target.index != i;
	});
		}

//function fade() {
//    return function(d, i) {
//        svg.selectAll("chords.chord")
//        .filter(function(d) {
//            return d.source.index != i && d.target.index != i;
//        })
//        .transition()
//        .style("visibility", "hidden");
//    };
//}

function fade(opacity) {
   return function(g, i) {
     svg.selectAll("chords.chord")
         .filter(function(d) {
           return d.source.index != i && d.target.index != i;
         })
       .transition()
         .style("opacity", opacity);
   };
 }

//   chords.classed("fade", function(p) {
//             return ((p.source.index != i) && (p.target.index != i));
//           });
//          
  

		

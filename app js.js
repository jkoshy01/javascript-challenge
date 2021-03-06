// from data.js
var tableData = data;

// LEVEL 2: MULTIPLE SEARCH CATEGORIES

// Get a reference to the table body
var tbody = d3.select("tbody");

// Add the whole table of ufo sightings data when loading the page
tableData.forEach((ufo) => {
	var row = tbody.append("tr");
	Object.entries(ufo).forEach(([key, value]) => {
		var cell = row.append("td");
		cell.text(value);
	})
})

// Create arrays to store distinct countries, states, and shapes in abc order
var uniqueCountry = [... new Set(tableData.map(ufo => ufo.country))].sort();
console.log(uniqueCountry);

var uniqueState = [... new Set(tableData.map(ufo => ufo.state))].sort();
console.log(uniqueState);

var uniqueShape = [... new Set(tableData.map(ufo => ufo.shape))].sort();
console.log(uniqueShape);

// Dynamically add unique countries, states and shapes to corresponding dropdown menus
uniqueCountry.forEach((country) => {
	d3.select("#country").append("option").text(country);
})

uniqueState.forEach((state) => {
	d3.select("#state").append("option").text(state);
})

uniqueShape.forEach((shape) => {
	d3.select("#shape").append("option").text(shape);
})

// Select and Create event handlers for the form's inputs and dropdown selections
d3.selectAll(".form-control").on("change", updateFilters);

// Select and Create event handlers for the button Clear Filter
d3.select("#filter-btn").on("click", clear);

// Create filter object to keep track of all filters
var multifilters = {};

// Create a function to dynamically add a filter value each time user add any filter
function updateFilters() {

  // Save the element, value, and id of the filter that was changed
	// In an event, "this" refers to the html element that received the event.
  var inputElement = d3.select(this);
  var filterId = inputElement.attr("id");
  var inputValue = inputElement.property("value").toLowerCase();

  // If a filter value was entered then add that filterId and value
  // to the filters array. Otherwise, clear that filter from the filters object.
  if (inputValue) {
	  multifilters[filterId] = inputValue;
  }
  else {
    delete multifilters[filterId];
  }

  // Call function to apply all filters and rebuild the table
  filterTable();
}

function filterTable() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

	// Use the form's inputs and dropdown selections to filter the data by multiple attributes
	var results = tableData.filter(function(ufo) {
		for (var key in multifilters) {
			if (multifilters[key] === undefined || ufo[key] != multifilters[key])
				return false;
		}
		return true;
	})
	
	// Clear out current contents in the table
	tbody.html("");

	// Handle no matching results
	if (results.length === 0) {
		tbody.text(`No ufo sightings found.`);
	}
	else {
		results.forEach((ufo) => {
			var row = tbody.append("tr");
			Object.entries(ufo).forEach(([key, value]) => {
				var cell = row.append("td");
				cell.text(value);
			})
		})
	}
}

function clear() {
	multifilters = {};
	document.getElementById("filter-form").reset();
	filterTable();
}

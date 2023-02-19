//https://codepen.io/ZondaDesign/pen/xxVxZVR toggle layers
mapboxgl.accessToken = "pk.eyJ1Ijoic21hcHBlcjIzIiwiYSI6ImNsY3Z0anpmdTFjbzkzc3AxdGJ3czdlMHcifQ.xCtey68ox1yGBR3BnbsfLw";

google.charts.load("current", { packages: ["corechart"] });


let map = new mapboxgl.Map({
	container: 'cardiff_map',
	style: 'mapbox://styles/smapper23/cldpwdspu000801pmvb3hr4b9', //cardiff joined mono, with published background 0-15. 
//  style: "mapbox://styles/mapbox/light-v10",
	center:  [-3.212, 51.494],
	zoom: 10
});

// age colours
const age_colours = {a: "#ebffeb",  b: "#b8ebc2", c: "#95D5B2", d: "#85b8a8", e: "#70a39e", f: "#34A0A4", g: "#168AAD", h: "#1A759F", i: "#16517D", j: "#183d55"};
// health colours
const health_colours = {
a: "#ffffeb", b: "#ffeb8a", c: "#F8C471", d: "#FFAD33", e: "#F5B041", f: "#e99643", g: "#d4803e",h: "#B81702", i: "#8E0103", j: "#600305" 
};

const data_url =
  "https://api.mapbox.com/datasets/v1/smapper23/cldq3uqun0uns26pppf49mu53/features?access_token=pk.eyJ1Ijoic21hcHBlcjIzIiwiYSI6ImNsY3Z0anpmdTFjbzkzc3AxdGJ3czdlMHcifQ.xCtey68ox1yGBR3BnbsfLw"; //cardiff join wgs84 small nocrs tileset

map.addControl(new mapboxgl.NavigationControl());
const scalebar = new mapboxgl.ScaleControl({
  maxWidth:200, unit:"metric"});
map.addControl(scalebar)
//map.addControl(new mapboxgl.ScaleControl({position: 'bottom-right'}));


map.on('style.load', initLayers = () => {
	const percentage_groups = [
"<10 ", ">10 ", ">20 ", ">30 ", ">40 ",">50 ",">60 ", ">70 ", ">80 ", ">90"];
  //age
  const colors = ["#ebffeb",  "#b8ebc2", "#95D5B2", "#85b8a8", "#70a39e", "#34A0A4", "#168AAD", "#1A759F", "#16517D", "#183d55"];
  //health
  const colors_leg_2 = ["#ffffeb", "#ffeb8a", "#F8C471", "#FFAD33", "#F5B041", "#e99643", "#d4803e","#B81702","#8E0103","#600305"];
  
  const legend = document.getElementById("legend");
  const legend2 = document.getElementById("legend2")
  percentage_groups.forEach((perc_group, i) => {
    const color = colors[i];
    const key = document.createElement("div");
    //place holder
    if (i < 0 || i >= 6) {
      key.style.color = "white";
    }

    key.className = "legend-key";
    key.style.backgroundColor = color;
    key.innerHTML = `${perc_group}`;

    legend.appendChild(key);
    
    const color2 = colors_leg_2[i];
    const key2 = document.createElement("div");
    
    if (i < 0 || i >= 6) {
      key2.style.color = "white";
    }

    key2.className = "legend-key";
    key2.style.backgroundColor = color2;
    key2.innerHTML = `${perc_group}`;

    legend2.appendChild(key2);
  });
  
	map.addSource('datazone_info', {
		type: 'geojson', 
		data: data_url,   

	});
  //dzone fill, not used
  map.addLayer({
    id: "data_zones",
    source: { type: "geojson", data: data_url }, 
    type: "fill", //overwriting mapbox studio colour
    paint: {
      "fill-color": "white", "fill-opacity": "0", 
      "fill-outline-color": "black",
      //'line-width': ['interpolate', ['linear'], ['zoom'], 2, 1, 10, 2],
      //"line-width": 2
    }, 
    layout: {visibility: 'visible'}
  });
  //dzone area codes, to check, not used
  map.addLayer({
    id: "data_zone_info",
    source: {
      type: "geojson",
      data: data_url
    },
    type: "symbol",
    layout: {
      //shows area code
      "text-field": ["get", "area_code_3"], 
      visibility: "none"
    }
  });
  //ages0-15
  map.addLayer({
    id: "age_density_0_15",
    source: {
      type: "geojson",
      data: data_url
    },
    type: "fill",
    //filter: ['>=', "age_16_to_34_perc", true],
		paint: {
			'fill-color': [
				"step",
				['get', 'age_0_to_15_perc'], "#f5fff5", 0, 
"#ebffeb", 10,  "#b8ebc2",20, "#95D5B2", 30, "#85b8a8", 40, "#70a39e", 50, "#34A0A4", 60, "#168AAD", 70, "#1A759F", 80, "#16517D", 90, "#183d55"],
			'fill-opacity': 0.75, 
      "fill-outline-color": "black"
		},
 
    layout: {visibility: 'none'} //to hide it on load and turn it on when selected
    
  });
  //16-34
  map.addLayer({
    id: "age_density_16_34",
    source: {
      type: "geojson",
      data: data_url
    },
    type: "fill",
		paint: {
			'fill-color': [
				"step",
				['get', 'age_16_to_34_perc'], "#f5fff5", 0, 
"#ebffeb", 10,  "#b8ebc2",20, "#95D5B2", 30, "#85b8a8", 40, "#70a39e", 50, "#34A0A4", 60, "#168AAD", 70, "#1A759F", 80, "#16517D", 90, "#183d55"],
			'fill-opacity': 0.75, 
      "fill-outline-color": "black"
		},
 
    layout: {visibility: 'none'} //to hide it on load and turn it on when selected
    
  });  
//35-64  
  map.addLayer({
    id: "age_density_35_64",
    source: {
      type: "geojson",
      data: data_url
    },
    type: "fill",
		paint: {
			'fill-color': [
				"step",
				['get', 'age_35_to_64_perc'], "#f5fff5", 0, 
"#ebffeb", 10,  "#b8ebc2",20, "#95D5B2", 30, "#85b8a8", 40, "#70a39e", 50, "#34A0A4", 60, "#168AAD", 70, "#1A759F", 80, "#16517D", 90, "#183d55"],
			'fill-opacity': 0.75, 
      "fill-outline-color": "black"
		},
 
    layout: {visibility: 'none'} //to hide it on load and turn it on when selected
  });
  //65+
  map.addLayer({
    id: "age_density_65_plus",
    source: {
      type: "geojson",
      data: data_url
    },
    type: "fill",
		paint: {
			'fill-color': [
				"step",
				['get', 'age_65_plus_perc'], "#f5fff5", 0, 
"#ebffeb", 10,  "#b8ebc2",20, "#95D5B2", 30, "#85b8a8", 40, "#70a39e", 50, "#34A0A4", 60, "#168AAD", 70, "#1A759F", 80, "#16517D", 90, "#183d55"],
			'fill-opacity': 0.75, 
      "fill-outline-color": "black"
		},
    layout: {visibility: 'none'} //to hide it on load and turn it on when selected
  });
  //disability
  //limited little
  map.addLayer({
    id: "health_limited_little",
    source: {
      type: "geojson",
      data: data_url
    },
    type: "fill",
    paint: {
			'fill-color': [
				"step",
				['get', 'limited_little_perc'],
				"#f5fff5", 0, "#ffffeb", 10, "#ffeb8a", 20, "#F8C471", 30,  "#FFAD33", 40, "#F5B041", 50,  "#e99643", 60, "#d4803e", 70, "#B81702", 80, "#8E0103",90, "#600305"],
			'fill-opacity': 0.5, "fill-outline-color": "black"
		},
   layout: {visibility: 'none'} //to hide it on load and turn it on when selected
  });  
  //limited lots
  map.addLayer({
    id: "health_limited_lots",
    source: {
      type: "geojson",
      data: data_url
    },
    type: "fill",
		    paint: {
			'fill-color': [
				"step",
				['get', 'limited_lots_perc'],
				"#f5fff5", 0, "#ffffeb", 10, "#ffeb8a", 20, "#F8C471", 30,  "#FFAD33", 40, "#F5B041", 50,  "#e99643", 60, "#d4803e", 70, "#B81702", 80, "#8E0103",90, "#600305"],
			'fill-opacity': 0.5, "fill-outline-color": "black"
		},
   layout: {visibility: 'none'} //to hide it on load and turn it on when selected
  });
  //limited none
  map.addLayer({
    id: "health_limited_none",
    source: {
      type: "geojson",
      data: data_url
    },
    type: "fill",
		    paint: {
			'fill-color': [
				"step",
				['get', 'limited_none_perc'],
				"#f5fff5", 0, "#ffffeb", 10, "#ffeb8a", 20, "#F8C471", 30,  "#FFAD33", 40, "#F5B041", 50,  "#e99643", 60, "#d4803e", 70, "#B81702", 80, "#8E0103",90, "#600305"],
			'fill-opacity': 0.6, "fill-outline-color": "black"
		},
   layout: {visibility: 'none'} //to hide it on load and turn it on when selected
  });
  
	map.addSource("click-select", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  map.addLayer({
    id: "click-datazone", 
    type: "line",
    source: "click-select",
    layout: {},
    paint: {
      "line-color": "black",
      "line-dasharray": [5, 10],
      "line-width": 1.7
    }
  });
  
  //add source of another style. doesnt work. 
  map.addSource('health', {
			type: 'vector',
    url: 'smapper23.cldq3uqun0uns26pppf49mu53-8dfag'
			//url: 'mapbox://styles/smapper23/cldej312l008d01t7r2h3yipp'
		});
  map.addLayer({
    id:"health-layer", 
    source: "health",
    //'source-layer': 'long_term_health_all',
    		layout: {
			visibility: 'none'
		}, 
    type:fill,
    paint: {
      "fill-color": "red"
    }
  });

});
 


//written info
map.on("click", (event) => {
  const zone_info = map.queryRenderedFeatures(event.point, {
    layers: ["cardiff-join-wgs84-small-nocrs-ages-0-15"]
  }); //where it gets written info from
  
  
  document.getElementById("click-tool").innerHTML = zone_info.length
    ? `<h3> <u> ${zone_info[0].properties.area_name} </u> </h3> 
     
    <h4>Distribution of Ages </h4> 
    <p>Ages 0-15: <strong>${zone_info[0].properties.age_0_to_15_perc}</strong> %</p>
    <p>Ages 16-34: <strong>${zone_info[0].properties.age_16_to_34_perc}</strong> %</p>
    <p>Ages 35-64: <strong>${zone_info[0].properties.age_35_to_64_perc}</strong> %</p>
    <p>Ages 65+: <strong>${zone_info[0].properties.age_65_plus_perc}</strong> %</p>
    
    <h4>Limited by Disability </h4> 
    <p>Limited a Lot: <strong>${zone_info[0].properties.limited_lots_perc}</strong> %</p> 
    <p>Limited a Little: <strong>${zone_info[0].properties.limited_little_perc}</strong> %</p>
    <p>Not Limited: <strong>${zone_info[0].properties.limited_none_perc}</strong> %</p>
    
    `
    : `<br>
    <h5> Distribution of Age and Disability in Cardiff </h5>
      
      <br>
      <p>Click a <strong>Datazone</strong> to see Age and Disability Distribution.  
      <br>
      <br>
    Select an <strong>Age Group <u>OR</u> Disability Level</strong> from the right to understand the distribution in Cardiff 
    </p>
    `;
  

    map.getSource("click-select").setData({
    type: "FeatureCollection",
    features: zone_info.map(function (f) {
      return { type: "Feature", geometry: f.geometry };
    })
  });
  
  
  google.charts.setOnLoadCallback(drawChart1);
  function drawChart1() {
    var data = google.visualization.arrayToDataTable([
      [" ", "%"],
    ["Ages 0-15", parseFloat(zone_info[0].properties.age_0_to_15_perc)],
    ["Ages 16-34", parseFloat(zone_info[0].properties.age_16_to_34_perc)],
    ["Ages 35-64", parseFloat(zone_info[0].properties.age_35_to_64_perc)],
    ["Ages 65+", parseFloat(zone_info[0].properties.age_65_plus_perc)]
    ]);

    var options = {
      title: "Age Distribution in Datazone",
      titleTextStyle: {color: "000000", fontSize: 13},
      legend: "none",
      hAxis: {title: "Percentage (%)"},
      colors: ["#34a0a4"]
    };
    

    var age_chart = new google.visualization.BarChart(
      document.getElementById("age_Chart")
    );
    age_chart.draw(data, options);
  };
    
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable([
      [" ", "%"],
      ["Limited a Lot", parseFloat(zone_info[0].properties.limited_little_perc)],
      ["Limited a Little", parseFloat(zone_info[0].properties.limited_lots_perc)],
      ["Not Limited", parseFloat(zone_info[0].properties.limited_none_perc)]
    ]);

    var options = {
      title: "Disability in Datazone",
      titleTextStyle: {color: "000000", fontSize: 13},
      legend: "none",
      hAxis: {title: "Percentage (%)"},
      colors: ["#e99643"]
    };
    var dis_chart = new google.visualization.BarChart(
      document.getElementById("dis_Chart")
    );
    dis_chart.draw(data, options);
  }
});


radioLayer = (ids, name) => {
	const button = document.createElement('div');
	button.classList.add('button');
	
  const checkbox = document.createElement('div');
	checkbox.classList.add('checkbox');
	button.appendChild(checkbox);
	
	const label = document.createElement('p');
	label.innerHTML = name;
	button.appendChild(label);
  

	button.onclick = function (background_change) {
		background_change.preventDefault();
		background_change.stopPropagation();
		for (layers in ids) {
			let visibility = map.getLayoutProperty(ids[layers], 'visibility');
			if (visibility === 'visible') {
				map.setLayoutProperty(ids[layers], 'visibility', 'none');
				checkbox.classList.remove('checked');
				checkbox.removeAttribute('id');

        
			} else {
				map.setLayoutProperty(ids[layers], 'visibility', 'visible');
				checkbox.classList.add('checked');
				checkbox.id = 'active';
				
      }
		}
	};

    let layers = document.getElementById('age-layers');
    layers.appendChild(button);
}


radioLayer2 = (ids, name) => {
 
	const button2 = document.createElement('div');
	button2.classList.add('button2');
	
  const checkbox2 = document.createElement('div');
	checkbox2.classList.add('checkbox2');
	button2.appendChild(checkbox2);
	
	const label2 = document.createElement('p');
	label2.innerHTML = name;
	button2.appendChild(label2);
	
	button2.onclick = function (background_change2) {
		background_change2.preventDefault();
		background_change2.stopPropagation();
		for (layers2 in ids) {
			let visibility = map.getLayoutProperty(ids[layers2], 'visibility');
			if (visibility === 'visible') {
				map.setLayoutProperty(ids[layers2], 'visibility', 'none');
				checkbox2.classList.remove('checked2');
				checkbox2.removeAttribute('id');
        
			} else {
				map.setLayoutProperty(ids[layers2], 'visibility', 'visible');
				checkbox2.classList.add('checked2');
				checkbox2.id = 'active';

      }
		}
	};
    
    let layers2 = document.getElementById('health-layers');
    layers2.appendChild(button2);
 // const age_names = document.getElementsByClassName("age-layers");
  
}

checkRemover = () => {
	let idEqualsChecked = document.querySelectorAll('#active');
	let j;
	for (j = 0; j < idEqualsChecked.length; j++) {
		idEqualsChecked[j].classList.remove('checked');
	}
}

//radioLayer(['data_zones'], 'DatazoneBase');
//radioLayer(['data_zone_info'], 'DatazoneInfo');

radioLayer(['age_density_0_15'], 'Ages 0-15')
radioLayer(['age_density_16_34'], 'Ages 16-34')
radioLayer(['age_density_35_64'], 'Ages 35-64')
radioLayer(['age_density_65_plus'], 'Ages 65 Plus')


radioLayer2(['health_limited_lots'], 'Limited A Lot');
radioLayer2(['health_limited_little'], 'Limited A Little');
radioLayer2(['health_limited_none'], 'Not Limited');



map.getCanvas().style.cursor = 'pointer';
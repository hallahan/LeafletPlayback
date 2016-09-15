$(function() {
    // Setup leaflet map
    var map = new L.Map('map');

    var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');

    // Center map and default zoom level
    map.setView([44.562108, -123.265806], 14);

    // Adds the background layer to the map
    map.addLayer(basemapLayer);

    // =====================================================
    // =============== Playback ============================
    // =====================================================
    
    // Playback options
    var playbackOptions = {
        playControl: true,
        dateControl: true,
        sliderControl: true     
    };
	
	
	var playback;
	 
	//playback = new L.Playback(map, null, null, playbackOptions); 
	
	gpx_data = atob(
	"PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8Z3B4IHZlcnNpb249IjEuMCIgY3JlYXRvcj0iVmlraW5nIC0tIGh0dHA6Ly92aWtpbmcuc2YubmV0LyINCnhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiDQp4bWxucz0iaHR0cDovL3d3dy50b3BvZ3JhZml4LmNvbS9HUFgvMS8wIg0KeHNpOnNjaGVtYUxvY2F0aW9uPSJodHRwOi8vd3d3LnRvcG9ncmFmaXguY29tL0dQWC8xLzAgaHR0cDovL3d3dy50b3BvZ3JhZml4LmNvbS9HUFgvMS8wL2dweC54c2QiPg0KICA8bmFtZT5Qb2ludCBkZSBjaGVtaW5lbWVudCBkZSBsYSB0cmFjZTwvbmFtZT4NCiAgPGF1dGhvcj48L2F1dGhvcj4NCiAgPGRlc2M+PC9kZXNjPg0KICA8dGltZT4yMDE2LTA2LTI0VDA3OjI3OjExLjQ0NTMwM1o8L3RpbWU+DQogIDxrZXl3b3Jkcz48L2tleXdvcmRzPg0KPHRyaz4NCiAgPG5hbWU+Y2FyMTwvbmFtZT4NCiAgPGNtdD5jYXIxIHRyYWNrPC9jbXQ+DQogIDx0cmtzZWc+DQogIDx0cmtwdCBsYXQ9IjQ0LjU2MzU0MTMzNTk4NjQwNyIgbG9uPSItMTIzLjI3MDc4NzM3MzI1MDk1Ij4NCiAgICA8bmFtZT5zdGFydDwvbmFtZT4NCiAgICA8dGltZT4yMDEzLTA1LTI5VDAwOjEyOjE4WjwvdGltZT4NCiAgPC90cmtwdD4NCiAgPHRya3B0IGxhdD0iNDQuNTYyMjgyMTc4MzUwNDIyIiBsb249Ii0xMjMuMjY1ODc0ODA1OTMwMTgiPg0KICAgIDx0aW1lPjIwMTMtMDUtMjlUMDA6MTU6MjFaPC90aW1lPg0KICA8L3Rya3B0Pg0KICA8dHJrcHQgbGF0PSI0NC41NjIyMTE0Njk3NTEzNjEiIGxvbj0iLTEyMy4yNjU3NTAwODMyMTA5OSI+DQogICAgPHRpbWU+MjAxMy0wNS0yOVQwMDoxNToyNlo8L3RpbWU+DQogIDwvdHJrcHQ+DQogIDx0cmtwdCBsYXQ9IjQ0LjU2MjEwODI3MzI2MzM4NCIgbG9uPSItMTIzLjI2NTgwNjQwOTYwMDMiPg0KICAgIDx0aW1lPjIwMTMtMDUtMjlUMDA6MTU6MzJaPC90aW1lPg0KICA8L3Rya3B0Pg0KICA8dHJrcHQgbGF0PSI0NC41NjAzOTU5NDkyNjQ1MTciIGxvbj0iLTEyMy4yNjY2OTQyMjA3ODQyMyI+DQogICAgPHRpbWU+MjAxMy0wNS0yOVQwMDoxNzowMVo8L3RpbWU+DQogIDwvdHJrcHQ+DQogIDx0cmtwdCBsYXQ9IjQ0LjU2MDI0NzgzODUxNDg5NyIgbG9uPSItMTIzLjI2Njc5NDgwMzYyMjI5Ij4NCiAgICA8dGltZT4yMDEzLTA1LTI5VDAwOjE3OjEwWjwvdGltZT4NCiAgPC90cmtwdD4NCiAgPHRya3B0IGxhdD0iNDQuNTU5OTQ1ODgyNTI4Mzk2IiBsb249Ii0xMjMuMjY1NTYwOTg3NDc1NDQiPg0KICAgIDx0aW1lPjIwMTMtMDUtMjlUMDA6MTc6NTVaPC90aW1lPg0KICA8L3Rya3B0Pg0KICA8dHJrcHQgbGF0PSI0NC41NjE0NjMyOTEwNjYyMzIiIGxvbj0iLTEyMy4yNjQ3Nzc3ODI0NDMwOSI+DQogICAgPHRpbWU+MjAxMy0wNS0yOVQwMDoxOToxNVo8L3RpbWU+DQogIDwvdHJrcHQ+DQogIDx0cmtwdCBsYXQ9IjQ0LjU2Mjg4Nzc3MDA3NzU4NyIgbG9uPSItMTIzLjI2NDA1NTAyODYyMzU3Ij4NCiAgICA8dGltZT4yMDEzLTA1LTI5VDAwOjIwOjMwWjwvdGltZT4NCiAgPC90cmtwdD4NCiAgPC90cmtzZWc+DQo8L3Ryaz4NCjx0cms+DQogIDxuYW1lPmNhcjI8L25hbWU+DQogIDx0cmtzZWc+DQogIDx0cmtwdCBsYXQ9IjQ0LjU3MDA1OTU5OTU5MjczOSIgbG9uPSItMTIzLjI2MTU0MDY5MTQzODI0Ij4NCiAgICA8dGltZT4yMDEzLTA1LTI5VDAwOjEyOjMwWjwvdGltZT4NCiAgPC90cmtwdD4NCiAgPHRya3B0IGxhdD0iNDQuNTY3MTQxNzU1MzIyNzA5IiBsb249Ii0xMjMuMjYzMTY2MTEwMTAxMjciPg0KICAgIDx0aW1lPjIwMTMtMDUtMjlUMDA6MTM6MjJaPC90aW1lPg0KICA8L3Rya3B0Pg0KICA8dHJrcHQgbGF0PSI0NC41NjQyMzcxNDE1MjYwOTMiIGxvbj0iLTEyMy4yNjQ3Mzc4ODQ1ODM5OSI+DQogICAgPHRpbWU+MjAxMy0wNS0yOVQwMDoxNDoxM1o8L3RpbWU+DQogIDwvdHJrcHQ+DQogIDx0cmtwdCBsYXQ9IjQ0LjU2NDMwNDAyNTcxMTk1NSIgbG9uPSItMTIzLjI2NTczNDMyNTIzMzAzIj4NCiAgICA8dGltZT4yMDEzLTA1LTI5VDAwOjE0OjI1WjwvdGltZT4NCiAgPC90cmtwdD4NCiAgPHRya3B0IGxhdD0iNDQuNTYyNDc1MTkzMjc3NzQ5IiBsb249Ii0xMjMuMjY2Njg3ODUwNTM3ODIiPg0KICAgIDx0aW1lPjIwMTMtMDUtMjlUMDA6MTQ6NThaPC90aW1lPg0KICA8L3Rya3B0Pg0KICA8dHJrcHQgbGF0PSI0NC41NjE1MTM5MzQzNzEzNjkiIGxvbj0iLTEyMy4yNjcxNzA2NDgxNjA1Ij4NCiAgICA8dGltZT4yMDEzLTA1LTI5VDAwOjE1OjE1WjwvdGltZT4NCiAgPC90cmtwdD4NCiAgPHRya3B0IGxhdD0iNDQuNTYxMjIzNDUxNDE3OTAyIiBsb249Ii0xMjMuMjY2MTAzMTI4OTcyNTciPg0KICAgIDx0aW1lPjIwMTMtMDUtMjlUMDA6MTU6MjhaPC90aW1lPg0KICA8L3Rya3B0Pg0KICA8dHJrcHQgbGF0PSI0NC41NjA1NzM2ODE2NjYyNDEiIGxvbj0iLTEyMy4yNjM2Mjc0NTAwNTE4MyI+DQogICAgPHRpbWU+MjAxMy0wNS0yOVQwMDoxNjowMFo8L3RpbWU+DQogIDwvdHJrcHQ+DQogIDwvdHJrc2VnPg0KPC90cms+DQo8L2dweD4NCg=="
    );
	
	
			geoJsonData =  L.Playback.Util.ParseGPX(gpx_data);
		//playback.setData(geoJsonData);
		/* ^^^^^^^apparently, the time slider is not updated correctly after calling setData,
		while calling the next commented line here gives a correct slider. */
	 playback = new L.Playback(map, geoJsonData, null, playbackOptions); 
		


         
     
});

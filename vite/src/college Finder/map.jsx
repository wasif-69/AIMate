import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "./map.css";
import { useNavigate } from "react-router-dom";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export default function CountrySelector({counterieslist,setcounterieslist}) {
  
  const [hoveredCountry, setHoveredCountry] = useState("");
  const navigator=useNavigate();

  const handleSelect = (countryName) => {
    setcounterieslist((prev) =>
      prev.includes(countryName)
        ? prev.filter((c) => c !== countryName)
        : [...prev, countryName]
    );
  };

  const removeCountry = (name) => {
    setcounterieslist((prev) => prev.filter((c) => c !== name));
  };


  return (
    <div className="country-selector-wrapper">
      <h1 className="cs-title">🌍 Choose Your Preferred Countries</h1>

      {/* Map */}
      <div className="map-container">
        <ComposableMap>
          <ZoomableGroup
            zoom={1}
            minZoom={0.7}
            maxZoom={5}
            translateExtent={[[-1000, -500], [1000, 500]]}
          >
            <Geographies  geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">

              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties.name;
                  const isSelected = counterieslist.includes(name);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredCountry(name)}
                      onMouseLeave={() => setHoveredCountry("")}
                      onClick={() => handleSelect(name)}
                      data-tooltip-id="country-tooltip"
                      data-tooltip-content={name}
                      style={{
                        default: {
                          fill: isSelected ? "#7B1FA2" : "#E0E0E0",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "fill 0.3s ease, transform 0.3s ease",
                        },
                        hover: {
                          fill: "#2196F3",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#5E35B1",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip id="country-tooltip" place="top" />
      </div>

      {/* Selected countries */}
      <div className="selected-panel">
        <h3>Selected Countries ({counterieslist.length})</h3>
        <div className="chips-container">
          {counterieslist.length === 0 && (
            <p className="empty-text">No countries selected yet.</p>
          )}
          {counterieslist.map((country) => (
            <div key={country} className="country-chip">
              {country}
              <button
                className="remove-btn"
                onClick={() => removeCountry(country)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

# Project Plan: World Atlas Clock (Frontend-Only)

## Project Vision

Build an interactive, frontend-only web application that visualizes the world's current and simulated time on a live map. Users can explore any city, compare time zones, observe the Earth's day-night cycle, view seasonal and astronomical information, and simulate past or future dates—all through a smooth, responsive interface.

The application should feel like an interactive digital globe rather than a traditional world clock.

---

# Tech Stack

## Core

- React.js
- TypeScript (TSX)
- Vite
- Tailwind CSS
- DaisyUI

## Mapping

- MapLibre GL JS (preferred, open-source)
- OpenStreetMap vector tiles

## Utilities

- date-fns
- date-fns-tz
- Luxon (optional)
- SunCalc (sunrise, sunset, moon, solar position)
- Turf.js (optional for geospatial calculations)
- Framer Motion
- Zustand (state management)
- TanStack Query (optional for public API requests)

---

# Application Goals

The application should be:

- Highly interactive
- Smooth and animated
- Responsive
- Accessible
- Fast
- Entirely frontend
- No authentication
- No backend
- No database server

---

# Project Structure

```
src/

  components/
      Map/
      Clock/
      Sidebar/
      Search/
      Timeline/
      Weather/
      Panels/
      Layers/
      Controls/
      Modals/

  features/

      world-clock/

      astronomy/

      weather/

      timeline/

      cities/

      map/

  hooks/

  services/

  utils/

  data/

      cities.json

      countries.json

      timezone.json

  store/

  pages/

  assets/
```

---

# Main Layout

```
 -----------------------------------------------------
| Header                                              |
-------------------------------------------------------
| Sidebar |                                           |
|         |                                           |
| Search  |                                           |
|         |                                           |
|         |        Interactive World Map              |
|         |                                           |
|         |                                           |
|         |                                           |
-------------------------------------------------------
| Timeline Slider                         Personal Clock|
-------------------------------------------------------
```

---

# Core Features

## 1. Interactive World Map

The map is the centerpiece of the application.

Users can:

- Zoom
- Pan
- Rotate (optional)
- Switch map styles
- Toggle overlays
- Click cities
- Hover cities
- Select regions

Animations should feel fluid.

---

## 2. Live World Clock

Every city displays its current local time.

Automatically updates every second.

Supports:

- Time zones
- UTC offsets
- Daylight Saving Time

---

## 3. Personal Digital Clock

Fixed at the bottom-right corner.

Shows:

- Local time
- Date
- Time zone
- UTC offset

Clicking expands a panel with:

- Current location
- 12/24-hour toggle
- Seconds toggle
- Time format settings

---

## 4. City Information Popup

Hovering or clicking a city opens a beautiful floating card.

Shows:

- City
- Country
- Local time
- Date
- UTC offset
- Time zone
- Day/Night
- Season
- Sunrise
- Sunset
- Day length
- Moon phase

Animated using Framer Motion.

---

## 5. Day/Night Terminator

Render Earth's daylight boundary.

Updates:

- Every second
- Or when simulated time changes

The terminator should animate smoothly.

---

## 6. Time Zone Overlay

Optional overlay displaying:

- Time zone boundaries
- UTC labels
- GMT labels

Users can toggle it on/off.

---

## 7. Search

Instant search.

Search by:

- City
- Country
- Time zone

Autocomplete results.

Selecting a result:

- Zooms map
- Opens popup
- Highlights city

---

## 8. Favorites

Users can:

⭐ Save cities

⭐ Remove cities

⭐ Jump to favorites

Persist using Local Storage.

---

# Time Simulation

One of the application's flagship features.

Users choose:

- Date
- Time

Based on their own local time.

The application recalculates every city's local time.

Updates:

- Day/night line
- Seasons
- Sunrise
- Sunset
- Moon phase
- Local clocks

A timeline slider lets users:

- Drag backward
- Drag forward
- Animate time
- Jump to any date

---

# Earth Layers

Toggle:

Political Map

Physical Map

Satellite (if available)

Dark Theme

Night Lights

Terrain

Minimal

---

# Weather

Using a public weather API (client-side).

Hovering a city shows:

- Temperature
- Weather
- Humidity
- Wind
- Pressure

Optional weather overlays:

- Clouds
- Rain
- Temperature

---

# Astronomy

Using SunCalc.

Display:

- Sunrise
- Sunset
- Solar noon
- Day length
- Moonrise
- Moonset
- Moon phase
- Twilight periods

---

# Travel Planner

User selects:

Departure city

Destination

Departure date

Flight duration

Display:

Arrival time

Arrival date

Time difference

Season

Day/night

---

# Meeting Planner

Choose multiple cities.

Automatically visualize:

Working hours

Business overlap

Best meeting window

---

# Interactive Timeline

Timeline controls:

▶ Play

⏸ Pause

⏪ Rewind

⏩ Fast Forward

📅 Jump to Date

Dragging the slider updates the entire application in real time.

---

# Educational Layer

Optional explanations for:

Time zones

Earth's rotation

Seasons

DST

International Date Line

Leap years

---

# Map Interactions

Hover city

Click city

Double-click to zoom

Mouse wheel zoom

Drag map

Rotate map

Keyboard shortcuts

Smooth transitions

Animated markers

Animated popups

Animated timeline

Animated terminator

Animated weather layers

---

# UI Components

Header

Search Bar

Sidebar

Layer Selector

Timeline

Map Controls

City Popup

Weather Card

Clock Widget

Favorites Panel

Meeting Planner

Travel Planner

Settings Panel

---

# Themes

Light

Dark

Earth

Ocean

Midnight

Retro Atlas

Minimal

---

# Local Storage

Persist:

Theme

Favorites

Last map position

Timeline state

Clock preferences

Layer visibility

---

# Performance

Lazy load components

Memoized calculations

Efficient React rendering

Debounced search

Virtualized lists

Code splitting

GPU-accelerated animations

---

# Responsive Design

Desktop

Tablet

Mobile

Large monitors

---

# Accessibility

Keyboard navigation

Screen reader support

High contrast mode

Reduced motion mode

Colorblind-friendly palette

---

# Suggested Development Roadmap

## Milestone 1 — Foundation

- Set up Vite, React, TypeScript, Tailwind CSS, DaisyUI, and MapLibre GL JS.
- Display an interactive world map with zoom, pan, and basic controls.
- Load a static city dataset and render markers.
- Add a responsive application layout.

## Milestone 2 — Live Time

- Implement live clocks using browser time zone support.
- Add city information popups.
- Create the floating personal clock.
- Build search and favorites.

## Milestone 3 — Earth Visualization

- Render the animated day-night terminator.
- Add season calculations.
- Add map style switching and time zone overlays.

## Milestone 4 — Time Simulation

- Build the timeline and date/time picker.
- Synchronize the entire application with the selected simulated time.
- Animate the movement of the terminator and update all city data.

## Milestone 5 — Environmental Data

- Integrate weather and astronomy information.
- Add sunrise, sunset, moon phase, and twilight details.

## Milestone 6 — Productivity Features

- Implement the meeting planner and travel planner.
- Add comparison panels for multiple cities.

## Milestone 7 — Polish

- Improve animations with Framer Motion.
- Optimize performance.
- Refine accessibility.
- Add onboarding tips, settings, and theme customization.

---

# End Goal

Deliver a polished, frontend-only application that feels like a live, interactive Earth dashboard. Users should be able to explore the world, compare cities, visualize global time and daylight, simulate any point in time, and access weather and astronomical information—all through a fast, beautiful, and engaging interface built entirely with modern frontend technologies.

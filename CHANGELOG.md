# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-06-01

### Fixed

- Fixed the flickering issue of the drag placeholder by removing the dashed border when the section is not being hovered over.
- Fixed the zooming issue on iOS devices when typing in the input by changing the font size to 16px.
- Fixed scrolling issues on iOS when swiping up on a task.
- Fixed the background of sections going white when dragging tasks by using global CSS variables for colors instead of hardcoded values.

## [0.2.1] - 2026-04-23

### Added

- Added a unique identifier `uuid` library.
- Added bottom padding to the main container to improve the layout and spacing of the application.
- Added a changelog file.

### Fixed

- Unique identifiers now use the `uuid` library to ensure proper working of UUIDs.

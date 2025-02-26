# Custom Header Extension

A Firefox extension that allows you to add custom headers to HTTP requests for specific domains.

## Features

- Add custom headers for specific domains
- Remove headers when no longer needed
- Headers persist across browser sessions
- Easy-to-use popup interface

## Installation

1. Clone this repository or download the source code
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on" and select any file from the extension directory

## Usage

1. Click the extension icon in the Firefox toolbar
2. The popup will show the current domain and any existing headers
3. To add a header:
   - Enter the header name in the first input field
   - Enter the header value in the second input field
   - Click "Add"
4. To remove a header:
   - Click the "Remove" button next to the header you want to remove

## Permissions

This extension requires the following permissions:

- `storage`: To save your custom headers
- `webRequest` and `webRequestBlocking`: To modify request headers
- `tabs`: To get the current active tab's URL

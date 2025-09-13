# Pure Radial Menu

A modern, responsive radial menu system for RedM servers with job-specific functionality and customizable actions.

## Overview

Pure Radial Menu is a comprehensive UI solution that provides players with an intuitive circular menu interface. The menu features smooth animations, job-specific options, and a modular design that makes it easy to customize and extend.

## Features

### Core Features
- **Responsive Design**: Smooth animations and visual feedback
- **Job Integration**: Dynamic menu options based on player job
- **Modular Structure**: Easy to configure and extend
- **Visual Effects**: Custom wheel background with center logo
- **Multi-language Support**: Currently configured in Bulgarian

### Menu Categories
- **Contraband**: Trade illegal goods
- **Jobs**: Job-specific actions for police and medic roles
- **Emotes**: Comprehensive emote system with multiple categories
- **Character**: Character appearance management
- **Wagon**: Vehicle management and controls
- **Horse**: Horse interaction and control
- **Weapons**: Weapon maintenance and inspection

### Job-Specific Features

#### Police
- Gunpowder residue testing
- Emergency alert system
- Player search functionality
- Badge display and verification

#### Medic
- Player revival system
- Medical role-play actions (bandaging, CPR, etc.)
- Emergency alert system
- Comprehensive medical emotes

## Installation

1. Download the script and place it in your server's `resources` folder
2. Add `ensure pure-radialmenu` to your `server.cfg`
3. Configure the menu options in `html/config.js` to match your server's needs
4. Restart your server

## Configuration

### Basic Setup

The main configuration is located in `html/config.js`. You can modify:
- Menu segments and labels
- Icon paths
- Actions and commands
- Job-specific options

### Key Binding

Default key binding is **F6**. This can be modified in the client script (`client/client.lua`):

```lua
if IsControlJustPressed(0, 0x3C0A40F2) and not keyPressed then -- F6 key
```

### Custom Actions

Actions are defined using a namespace system:
- `command:actionName` - Executes a client command
- `client:eventName` - Triggers a client event
- `server:eventName` - Triggers a server event
- `pure-radialmenu:client:eventName` - Script-specific client events

## File Structure

```
pure-radialmenu/
├── client/
│   └── client.lua          # Main client logic and event handlers
├── config/
│   └── config.lua          # Server-side configuration (if needed)
├── html/
│   ├── index.html          # Main UI structure
│   ├── styles.css          # CSS styling
│   ├── menu.js             # Menu functionality and animations
│   ├── config.js           # Menu configuration and options
│   └── icons/              # Menu icons and graphics
├── fxmanifest.lua          # Resource manifest
└── README.md               # This file
```

## Dependencies

### Required
- **RSG-Core**: Core framework for player data and job management

### Compatible With
- `rsg-horses`: Horse management system
- `rsg-weapons`: Weapon system integration
- `rsg-medic`: Medical system
- `police`: Law enforcement system
- `rsg-appearance`: Character appearance system
- `rsg-contraband`: Contraband trading system

## Usage

### Opening the Menu
- Press **F6** to open the radial menu
- Release **F6** to close the menu and execute selected action
- Navigate by moving your mouse cursor over different segments

### Menu Navigation
- **Main Menu**: Starting point with all primary categories
- **Submenus**: Detailed options for each category
- **Back Button**: Return to previous menu level
- **Job Segments**: Automatically appear based on player's job

## Customization

### Adding New Menu Items

To add a new menu item, edit `html/config.js`:

```javascript
{
    label: "Your Label",
    icon: "./icons/menuicons/your_icon.png",
    hasSubmenu: false,
    action: "your:action:here"
}
```

### Adding Job-Specific Options

Add job segments in the `jobSegments` section:

```javascript
yourjob: [
    {
        label: "Job Action",
        icon: "./icons/menuicons/job_icon.png",
        action: "yourscript:client:action"
    }
]
```

### Custom Icons

Place custom icons in the `html/icons/` directory and reference them in the configuration.

## Events

### Client Events
- `pure-radialmenu:client:Menu` - Opens the radial menu
- `pure-radialmenu:client:SendLawmanEmergencyAlert` - Sends emergency alert for law enforcement

### Server Events
- Various job-specific server events based on configuration

## Troubleshooting

### Common Issues

1. **Menu not opening**: Check console for JavaScript errors and ensure F6 key binding is correct
2. **Missing icons**: Verify icon paths in config.js match actual file locations
3. **Job-specific options not showing**: Ensure RSG-Core is properly integrated and player job is set correctly

### Debug Mode

Enable debug mode by checking console logs in the client script. Debug messages show:
- Player job updates
- Menu selections and actions
- Key press events

## Performance Optimization

The script includes several optimizations:
- Pre-calculated mathematical values
- Cached DOM elements
- Efficient event handling
- Minimal resource usage during idle state

## Version Information

- **Current Version**: 3.4
- **Framework**: RedM/RSG-Core
- **Language**: Lua, JavaScript, HTML/CSS

## Support

For support and updates, please refer to the script documentation or contact the development team.

## License

This script is provided as-is for RedM server use. Modification and redistribution should follow appropriate licensing agreements.

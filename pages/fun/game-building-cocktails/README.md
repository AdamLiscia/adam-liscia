# Cocktail Training Game - Setup Guide

This document explains how to set up the cocktail training game for different restaurant groups.

## Overview

The cocktail training game is designed to help bartenders and staff learn and practice cocktail recipes specific to their restaurant or bar program. Each restaurant can have its own customized version with their specific cocktail recipes.

## How URLs Work

Each restaurant gets its own URL in the format:
```
adamliscia.com/fun/game-building-cocktails/[restaurant-name]
```

For example:
- Bedford Post Inn: `adamliscia.com/fun/game-building-cocktails/bpi` (or just `game-building-cocktails.html`)
- Fort Pond Bay: `adamliscia.com/fun/game-building-cocktails/fort-pond-bay`
- Applebees: `adamliscia.com/fun/game-building-cocktails/applebees`

## Setting Up for a New Restaurant

To set up the game for a new restaurant:

1. Create a JSON file named `[restaurant-name]-cocktail-specs.json` in the `game-building-cocktails` directory.
   - Example: `fort-pond-bay-cocktail-specs.json`
   - Use kebab-case (lowercase with hyphens) for the restaurant name in the filename

2. Format your JSON file based on the template (`restaurant-template-cocktail-specs.json`).

3. Add a link to your restaurant in the restaurant selector section of the main HTML file.

## JSON File Format

Your JSON file should follow this format:

```json
{
  "name": "Restaurant Name",
  "description": "Custom description for your restaurant's cocktail program",
  "logo": "optional-logo-path.png",
  "cocktails": [
    {
      "name": "Cocktail Name",
      "ingredients": [
        {
          "amount": "2 oz",
          "ingredient": "Spirit Name"
        },
        {
          "amount": "0.5 oz",
          "ingredient": "Modifier",
          "note": "Optional note"
        }
      ],
      "method": "Shake & Strain",
      "glassware": "Coupe",
      "ice": "None",
      "garnish": "Lemon Twist",
      "variations": ["Optional variation 1", "Optional variation 2"],
      "notes": "Optional notes about the cocktail",
      "isStarred": true,
      "isMenu": true,
      "isNonAlcoholic": false,
      "isFamily": false
    }
  ]
}
```

### Important Flags:

- `isStarred`: Set to `true` for signature or popular cocktails
- `isMenu`: Set to `true` if this is a current menu item
- `isNonAlcoholic`: Set to `true` for non-alcoholic cocktails
- `isFamily`: Set to `true` for cocktail families/templates

## Measurement Guidelines

For consistent gameplay, please use these measurement formats:

- Ounces: `0.25 oz`, `0.5 oz`, `0.75 oz`, `1 oz`, `1.5 oz`, `2 oz`, etc.
- Dashes: `1 dash`, `2 dashes`, etc.
- Top/Fill: `Top` or `Prime`
- Whole numbers for garnishes: `1`, `2`, `3`, etc.

## Need Help?

Contact Adam Liscia for assistance with setting up your restaurant's cocktail game. 
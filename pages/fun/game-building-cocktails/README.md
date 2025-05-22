# Cocktail Training Game - Setup Guide

This training tool was built by a bartender, for bartenders. It helps restaurant staff learn cocktail recipes faster through gamified training.

## Overview

The cocktail training game is a highly customizable training tool designed to help bartenders and staff learn and practice cocktail recipes specific to their restaurant or bar program. Each restaurant can have its own customized version with their specific cocktail recipes, helping to:

- Accelerate training for new staff
- Maintain recipe consistency across multiple locations
- Test knowledge and build confidence in a fun environment
- Reduce training costs and improve service quality

## How URLs Work

Each restaurant gets its own URL using a query parameter:
```
adamliscia.com/fun/game-building-cocktails/game-building-cocktails.html?restaurant=[restaurant-name]
```

For example:
- Training Tool Demo: `adamliscia.com/fun/game-building-cocktails/game-building-cocktails.html` (default)
- Bedford Post Inn: `adamliscia.com/fun/game-building-cocktails/game-building-cocktails.html?restaurant=bpi`
- Fort Pond Bay: `adamliscia.com/fun/game-building-cocktails/game-building-cocktails.html?restaurant=fort-pond-bay`
- Applebees: `adamliscia.com/fun/game-building-cocktails/game-building-cocktails.html?restaurant=applebees`

## Setting Up for a New Restaurant

To set up the game for a new restaurant:

1. Create a JSON file named `[restaurant-name]-cocktail-specs.json` in the `game-building-cocktails` directory.
   - Example: `fort-pond-bay-cocktail-specs.json`
   - Use kebab-case (lowercase with hyphens) for the restaurant name in the filename

2. Format your JSON file based on the template (`restaurant-template-cocktail-specs.json`).

3. Add a link to your restaurant in the restaurant selector section of the main HTML file.

## Adding a New Restaurant Link

When adding a new restaurant to the selector, use this format:

```html
<a href="./game-building-cocktails.html?restaurant=restaurant-name" class="bg-navy/10 hover:bg-navy/20 px-3 py-1 rounded-full text-sm transition-colors">
    Restaurant Name
</a>
```

Replace `restaurant-name` with your kebab-case restaurant name that matches your JSON filename.

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

## Benefits for Restaurant Groups

- **Standardized Training**: Ensure all locations and staff are learning the same exact specs
- **Cost Reduction**: Reduce training time and materials costs
- **Better Quality Control**: Improve consistency across all bars in your restaurant group
- **Staff Engagement**: Make training fun and memorable through gamification
- **Customized Experience**: Fully branded with your restaurant's name, logo, and cocktail program

## Need Help?

Contact Adam Liscia for assistance with setting up your restaurant's cocktail game. 
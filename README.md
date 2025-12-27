# Daily Note Status

I love daily notes, but I find I accidentally update the wrong note. When syncing the notes across devices, sometimes this means that my changes don't make it into my latest note. 

The Daily Note Status plugin adds an indicator icon anywhere to your note, indicating whether the file's name matches today's date.

It shows a check when the filename matches the current date.  
<img width="427" height="334" alt="image" src="https://github.com/user-attachments/assets/f80e6345-b903-4a0e-9285-e4b17d0f033c" />

And an indicator if not.  
<img width="413" height="311" alt="image" src="https://github.com/user-attachments/assets/65c93ac6-4ee3-49f0-a1eb-c8fc23ae1b71" />

## Usage

Use `{{dailystatus}}` in your notes to add the icon.

## Configuration

This plugin does not have any configuration options.

## Known issues

- Due to how the editor renders content, there are some cases where the indicator will not be accurate. Nesting the indicator within other elements, like a callout, will result in the indicator being incorrect.
- Icons and colours are not configurable, but I'd happliy accept a PR to change that!
- The logic for checking the date is simple, it just parses the filename as a date. If you have a more complex filename or directory structure, this plugin won't work. I'd also happily take PRs to change this!

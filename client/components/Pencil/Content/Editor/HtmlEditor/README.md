This editor is supposed to be shared. So no pencil / node related code in this component

#EDITING FEATURES
1. Keyboard:
    - Tab: indent
    - Shift-tab: outdent
    - Ctrl-V: paste html, paste image
        + If text contains only url, it's pasted as hyperlink
        + If there is image, the upload image dialog is displayed
        + If html then the html is cleaned up
    - Ctrl-shift-V: paste text only.             
        + Line breaks are ketp.
2. When paste from clipboard
    - Auto detect link on paste
    - Clean html
    

#REFERENCE EDITOR LIBRARY
1. https://draftjs.org/
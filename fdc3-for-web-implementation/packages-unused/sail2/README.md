

## Design Decisions

1.  We should support multiple app directories.
2.  Each user channel will be a HTML tab within the main browser tab.   
3.  User can name and colour the user channels, and move apps between them.
4.  This is the ONLY way to control the user channel (unless the app loads outside of the main browser tab)
5.  Message passing will happen server-side as opposed to client side as in the demo.  
6.  React will be used.
7.  User state will be held in a cookie, so there's no session persistence.

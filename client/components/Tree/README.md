#Plugins
1. Features are implemented as plugin. The idea (not now) is that the plugin can be add / remove 
or replace to change the implementation. For example, we can replace the RenderPlugin to have another way
to render Plugin
2. Plugin list:
  + RenderPlugin: render tree
  + DragDropPlugin: add startDrag, onDrag, endDrag, cancelDrag events to tree
  + ReorderNodePlugin: (requires DragDropPlugin). This plugin add features to reorder nodes by drap drop
  + NodeSelectionPlugin: click to select node, click on selected node to toggle it
  
#Data vs UI
- All UI handling (ex: className, id of element,... ) must be implemented ONLY in TreeNodeView.
  It's forbidden to use TreeNodeView.element;
- All Node structure are known by only TreeModel. Application which uses tree components can override getId() 
  getChildrenIds() to have a customized implementation
- All plugins uses RenderPlugin to render the nodes


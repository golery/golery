export class ActionSource {
    constructor(id, actions, actionListener) {
        this.id = id;
        this.actions = actions;
        this.actionListener = actionListener;
    }
}

export default class ToolbarController {
    constructor() {
        // Map key = sourceId, value=ActionSource
        this.actionSources = {};
        // Toolbar react component
        this.toolbar = null;
    }

    addSource(actionSource) {
        this.actionSources[actionSource.id] = actionSource;
    }

    getActions() {
        let actions = [];
        Object.keys(this.actionSources).forEach((sourceId) => {
            actions = actions.concat(this.actionSources[sourceId].actions);
        });
        console.log(actions);
        return actions;
    }

    fireAction(action) {
        let source = Object.values(this.actionSources).find((v) => v.actions.includes(action));
        if (source && source.actionListener) {
            console.log('Fire action', action);
            source.actionListener(action);
        }
    }
}